import { NextRequest, NextResponse } from 'next/server';
import { validateServerSession } from '../../../../lib/serverAuth';
import { serverStorage } from '../../../../services/serverStorage';

export async function GET(req: NextRequest) {
  const auth = validateServerSession(req, 'settings_manage');
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const db = serverStorage.getDb();
  return NextResponse.json({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    exportedBy: auth.user?.name || 'مدير النظام',
    data: db.data,
  });
}

export async function POST(req: NextRequest) {
  const auth = validateServerSession(req, 'settings_manage');
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { action, payload, snapshotName } = body;

    // 0. Action: CREATE MANUAL SNAPSHOT
    if (action === 'createSnapshot') {
      const label = snapshotName || `manual_${Date.now()}`;
      const snapshotCreated = serverStorage.createSnapshot(label);
      return NextResponse.json({
        success: true,
        message: `تم إنشاء نقطة استرجاع احتياطية بنجاح [${snapshotCreated}]`,
        snapshotCreated,
      });
    }

    // 1. Action: IMPORT BACKUP (Creates pre-import snapshot automatically)
    if (action === 'import') {
      if (!payload || typeof payload !== 'object') {
        return NextResponse.json(
          { success: false, error: 'الملف المدخل ليس بصيغة JSON صالحة.' },
          { status: 400 }
        );
      }

      if (payload.version !== '1.0' || !payload.data) {
        return NextResponse.json(
          {
            success: false,
            error: 'إصدار النسخة الاحتياطية غير متوافق (يتطلب Version 1.0) أو بنية البيانات مفقودة.',
          },
          { status: 422 }
        );
      }

      // Pre-import automatic snapshot
      const snapshotCreated = serverStorage.createSnapshot('pre_import');

      // Import all data keys safely
      let importedKeysCount = 0;
      Object.entries(payload.data).forEach(([key, val]) => {
        serverStorage.setItem(key, val, auth.user?.name || 'مدير النظام');
        importedKeysCount++;
      });

      return NextResponse.json({
        success: true,
        message: `تم استيراد ${importedKeysCount} مفتاح بيانات بنجاح بعد إنشاء نقطة استرجاع تلقائية.`,
        snapshotCreated,
        importedKeysCount,
      });
    }

    // 2. Action: ROLLBACK / RESTORE SNAPSHOT
    if (action === 'rollback') {
      if (!snapshotName) {
        return NextResponse.json(
          { success: false, error: 'يجب تحديد اسم ملف اللقطة المراد استعادتها.' },
          { status: 400 }
        );
      }

      const restored = serverStorage.restoreSnapshot(snapshotName);
      if (!restored) {
        return NextResponse.json(
          { success: false, error: 'تعذر العثور على ملف اللقطة أو بياناته غير صالحة.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `تمت استعادة النسخة الاحتياطية [${snapshotName}] بنجاح.`,
      });
    }

    // 3. Action: RESET TO DEFAULTS (Creates pre-reset snapshot automatically)
    if (action === 'reset') {
      const snapshotCreated = serverStorage.createSnapshot('pre_reset');
      serverStorage.setItem('reset_timestamp', new Date().toISOString(), auth.user?.name || 'مدير النظام');

      return NextResponse.json({
        success: true,
        message: 'تم حفظ نسخة احتياطية وإعادة الضبط بنجاح.',
        snapshotCreated,
      });
    }

    return NextResponse.json(
      { success: false, error: 'الإجراء المحدد (action) غير مدعوم.' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Backup action failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
