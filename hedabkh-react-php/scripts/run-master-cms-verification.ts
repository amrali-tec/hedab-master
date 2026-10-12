/**
 * Master CMS & Multi-Page Verification Test Suite
 * Validates Multi-Page Registry, Content Locking, 403 Permissions, and Isolated Draft/Publish Cycles.
 */

import { contentEngine } from '../src/services/contentEngine';

const TARGET_HOST = process.env.TEST_HOST || 'http://localhost:3000';

interface TestResult {
  id: string;
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const results: TestResult[] = [];

console.log('================================================================');
console.log('🏛️ RUNNING MASTER CMS & MULTI-PAGE ENTERPRISE VERIFICATION SUITE');
console.log(`Target Host: ${TARGET_HOST}`);
console.log('================================================================\n');

async function runMasterCmsVerification() {
  const superAdminHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer gulf_hills_admin_secret_token',
    'x-admin-role': 'super_admin',
    'Origin': TARGET_HOST,
  };

  const editorHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer gulf_hills_editor_secret_token',
    'x-admin-role': 'editor',
    'Origin': TARGET_HOST,
  };

  // ----------------------------------------------------
  // MCMS-01: Multi-Page Registry Completeness
  // ----------------------------------------------------
  try {
    const pages = contentEngine.getPages();
    const requiredPages = ['page-home', 'page-about', 'page-chairman', 'page-contact'];
    const allFound = requiredPages.every((id) => pages.some((p) => p.id === id));

    results.push({
      id: 'MCMS-01',
      name: 'Multi-Page Core Registry (Home, About, Chairman, Contact)',
      expected: 'All 4 core site pages registered with initial draft & published states',
      actual: `Pages Count: ${pages.length}, All 4 Core Found: ${allFound}`,
      passed: allFound && pages.length >= 4,
    });
  } catch (e: any) {
    results.push({
      id: 'MCMS-01',
      name: 'Multi-Page Core Registry',
      expected: 'All pages found',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // MCMS-02: Content Locking & Concurrency Protection
  // ----------------------------------------------------
  try {
    const pageId = 'page-about';
    // User 1 acquires lock
    const lock1 = contentEngine.acquireLock(pageId, 'user-editor-1', 'م. خالد الدوسري');
    // User 2 attempts to acquire lock while active
    const lock2 = contentEngine.acquireLock(pageId, 'user-editor-2', 'م. سلطان القحطاني');
    // User 1 releases lock
    const released = contentEngine.releaseLock(pageId, 'user-editor-1');

    const lockValid = lock1.acquired && !lock2.acquired && lock2.currentLock?.userName === 'م. خالد الدوسري' && released;

    results.push({
      id: 'MCMS-02',
      name: 'Content Locking & Optimistic Concurrency Conflict Detection',
      expected: 'Lock acquired by User 1, User 2 blocked with collision details, release successful',
      actual: `Lock1: ${lock1.acquired}, Lock2 Blocked: ${!lock2.acquired}, Released: ${released}`,
      passed: lockValid,
    });
  } catch (e: any) {
    results.push({
      id: 'MCMS-02',
      name: 'Content Locking & Concurrency Protection',
      expected: 'Lock protection active',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // MCMS-03: Multi-Role Authorization & 403 Forbidden Rejection
  // ----------------------------------------------------
  try {
    // 1. Editor user tries to publish (has design_manage, but lacks settings_manage/publish)
    const editorPublishRes = await fetch(`${TARGET_HOST}/api/admin/visual-cms`, {
      method: 'POST',
      headers: editorHeaders,
      body: JSON.stringify({
        action: 'publish',
        pageId: 'page-home',
      }),
    });

    const is403 = editorPublishRes.status === 403;

    // 2. Editor user CAN save draft (has design_manage)
    const editorDraftRes = await fetch(`${TARGET_HOST}/api/admin/visual-cms`, {
      method: 'POST',
      headers: editorHeaders,
      body: JSON.stringify({
        action: 'saveDraft',
        pageId: 'page-home',
        blocks: contentEngine.getDraftVersion('page-home').blocks,
      }),
    });

    const is200ForDraft = editorDraftRes.status === 200;

    results.push({
      id: 'MCMS-03',
      name: 'Granular RBAC: Editor saves draft (200) but Publish rejected with 403 Forbidden',
      expected: 'Draft Save: 200 OK, Publish Attempt: 403 Forbidden for editor role',
      actual: `Draft Status: ${editorDraftRes.status}, Publish Status: ${editorPublishRes.status}`,
      passed: is403 && is200ForDraft,
    });
  } catch (e: any) {
    results.push({
      id: 'MCMS-03',
      name: 'Granular RBAC',
      expected: 'HTTP 403 on publish',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // MCMS-04: Isolated About Page Draft & Atomic Publish
  // ----------------------------------------------------
  try {
    const pageId = 'page-about';
    const draftBefore = contentEngine.getDraftVersion(pageId);

    // Save draft
    const updatedDraft = contentEngine.saveDraft(pageId, draftBefore.blocks, 'تحديث مسودة عن الشركة');

    // Publish About Page with Super Admin
    const publishRes = await fetch(`${TARGET_HOST}/api/admin/visual-cms`, {
      method: 'POST',
      headers: superAdminHeaders,
      body: JSON.stringify({
        action: 'publish',
        pageId,
        note: 'اعتماد ونشر صفحة عن الشركة v2',
      }),
    });

    const publishData = await publishRes.json();
    const isSuccess = publishRes.status === 200 && publishData.success && publishData.publishedVersion?.pageId === pageId;

    results.push({
      id: 'MCMS-04',
      name: 'Isolated Multi-Page Draft & Atomic Publish (About Page)',
      expected: 'Draft saved and published to dedicated page-about version record',
      actual: `Status: ${publishRes.status}, Published Page: ${publishData.publishedVersion?.pageId} (v${publishData.publishedVersion?.versionNumber})`,
      passed: isSuccess,
    });
  } catch (e: any) {
    results.push({
      id: 'MCMS-04',
      name: 'Isolated Multi-Page Draft & Atomic Publish',
      expected: 'Success',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // MCMS-05: Contact & Chairman Pages Independent History
  // ----------------------------------------------------
  try {
    const chairmanDraft = contentEngine.getDraftVersion('page-chairman');
    const contactDraft = contentEngine.getDraftVersion('page-contact');

    const chairmanBlocksValid = Array.isArray(chairmanDraft.blocks) && chairmanDraft.blocks.length >= 3;
    const contactBlocksValid = Array.isArray(contactDraft.blocks) && contactDraft.blocks.length >= 4;

    results.push({
      id: 'MCMS-05',
      name: 'Independent Block Trees (Chairman & Contact Pages)',
      expected: 'Distinct block tree definitions with valid component configs',
      actual: `Chairman Blocks: ${chairmanDraft.blocks.length}, Contact Blocks: ${contactDraft.blocks.length}`,
      passed: chairmanBlocksValid && contactBlocksValid,
    });
  } catch (e: any) {
    results.push({
      id: 'MCMS-05',
      name: 'Independent Block Trees',
      expected: 'Distinct block trees',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // PRINT SUMMARY
  // ----------------------------------------------------
  console.log('----------------------------------------------------------------');
  console.log('📋 MASTER CMS VERIFICATION RESULTS:');
  console.log('----------------------------------------------------------------');

  let allPassed = true;
  results.forEach((r) => {
    const icon = r.passed ? '✅ PASS' : '❌ FAIL';
    if (!r.passed) allPassed = false;
    console.log(`${icon} [${r.id}] ${r.name}`);
    console.log(`   Expected: ${r.expected}`);
    console.log(`   Actual:   ${r.actual}\n`);
  });

  console.log('================================================================');
  if (allPassed) {
    console.log('🎉 ALL MASTER CMS & MULTI-PAGE VERIFICATION TESTS PASSED (100%)!');
  } else {
    console.error('❌ SOME MASTER CMS TESTS FAILED.');
  }
  console.log('================================================================');
}

runMasterCmsVerification();

export {};
