import { NextRequest, NextResponse } from 'next/server';
import { validateServerSession } from '../../../../lib/serverAuth';
import { contentEngine } from '../../../../services/contentEngine';
import { serverStorage } from '../../../../services/serverStorage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'getPublic';
    const pageId = searchParams.get('pageId') || 'page-home';

    // 1. Public visitor access to published document
    if (action === 'getPublic') {
      const published = contentEngine.getPublishedVersion(pageId);
      return NextResponse.json({
        success: true,
        pageId,
        version: published,
      });
    }

    // 2. Protected actions (Pages list, draft & history, locks)
    const auth = validateServerSession(req, 'design_manage');
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: auth.status });
    }

    if (action === 'getPages') {
      const pages = contentEngine.getPages();
      return NextResponse.json({ success: true, pages });
    }

    if (action === 'getDraft') {
      const draft = contentEngine.getDraftVersion(pageId);
      return NextResponse.json({ success: true, pageId, draft });
    }

    if (action === 'getHistory') {
      const history = contentEngine.getPageHistory(pageId);
      return NextResponse.json({ success: true, pageId, history });
    }

    if (action === 'getLocks') {
      const locks = contentEngine.getLocks();
      return NextResponse.json({ success: true, locks });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse Body
    const body = await req.json().catch(() => ({}));
    const { action, pageId = 'page-home', blocks, note, versionId, userId, userName } = body;

    // Check permissions: publishing and rollback require 'settings_manage', draft editing requires 'design_manage'
    const requiredPerm = (action === 'publish' || action === 'rollback') ? 'settings_manage' : 'design_manage';
    const auth = validateServerSession(req, requiredPerm);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: auth.status });
    }

    const adminName = auth.user.name || 'مدير النظام';
    const adminId = auth.user.id || 'usr-1';

    switch (action) {
      case 'acquireLock': {
        const lockRes = contentEngine.acquireLock(pageId, userId || adminId, userName || adminName);
        return NextResponse.json({ success: lockRes.acquired, lock: lockRes.currentLock });
      }

      case 'releaseLock': {
        const released = contentEngine.releaseLock(pageId, userId || adminId);
        return NextResponse.json({ success: released });
      }

      case 'saveDraft': {
        if (!Array.isArray(blocks)) {
          return NextResponse.json({ success: false, error: 'Invalid blocks array' }, { status: 400 });
        }
        const updatedDraft = contentEngine.saveDraft(pageId, blocks, note || 'حفظ مسودة');
        
        // Synchronize to persistent server storage DB
        serverStorage.setItem(`cms_draft_${pageId}`, updatedDraft, adminName);

        return NextResponse.json({ success: true, pageId, draft: updatedDraft });
      }

      case 'submitForReview': {
        const reviewResult = contentEngine.submitForReview(pageId, note);
        serverStorage.setItem(`cms_review_${pageId}`, reviewResult.draftVersion, adminName);
        return NextResponse.json({ success: true, pageId, draftVersion: reviewResult.draftVersion });
      }

      case 'schedulePublish': {
        const { scheduledPublishAt } = body;
        if (!scheduledPublishAt) {
          return NextResponse.json({ success: false, error: 'Missing scheduledPublishAt timestamp' }, { status: 400 });
        }
        const scheduleResult = contentEngine.schedulePublish(pageId, scheduledPublishAt, note);
        return NextResponse.json({ success: true, pageId, page: scheduleResult.page });
      }

      case 'publish': {
        const publishResult = contentEngine.publishDraft(pageId, note);
        
        // Persistent atomic write
        serverStorage.setItem(`cms_published_${pageId}`, publishResult.publishedVersion, adminName);

        return NextResponse.json({ success: true, pageId, publishedVersion: publishResult.publishedVersion });
      }

      case 'rollback': {
        if (!versionId) {
          return NextResponse.json({ success: false, error: 'Missing versionId for rollback' }, { status: 400 });
        }
        const rollbackResult = contentEngine.rollbackToVersion(pageId, versionId);
        
        // Persistent sync
        serverStorage.setItem(`cms_published_${pageId}`, rollbackResult.restoredVersion, adminName);

        return NextResponse.json({ success: true, pageId, restoredVersion: rollbackResult.restoredVersion });
      }

      default:
        return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
