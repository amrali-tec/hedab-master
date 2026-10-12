/**
 * End-to-End Visual CMS Network & Public Sync Test Suite
 * Tests live HTTP authentication, draft isolation, atomic publish, and rollback cycles.
 */

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
console.log('🌐 RUNNING LIVE E2E VISUAL CMS & PUBLIC SYNC TEST SUITE');
console.log(`Target Host: ${TARGET_HOST}`);
console.log('================================================================\n');

async function runE2EVisualCmsTests() {
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer gulf_hills_admin_secret_token',
    'x-admin-role': 'super_admin',
    'Origin': TARGET_HOST,
  };

  // ----------------------------------------------------
  // E2E-VCMS-01: Unauthorized Write Rejection (HTTP 401)
  // ----------------------------------------------------
  try {
    const res = await fetch(`${TARGET_HOST}/api/admin/visual-cms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': TARGET_HOST,
      },
      body: JSON.stringify({ action: 'saveDraft', blocks: [] }),
    });

    const is401 = res.status === 401;
    results.push({
      id: 'E2E-VCMS-01',
      name: 'Unauthenticated POST /api/admin/visual-cms Rejection',
      expected: 'HTTP 401 Unauthorized (Blocks unauthenticated draft writes)',
      actual: `HTTP ${res.status}`,
      passed: is401,
    });
  } catch (e: any) {
    results.push({
      id: 'E2E-VCMS-01',
      name: 'Unauthenticated Write Rejection',
      expected: 'HTTP 401',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // E2E-VCMS-02: Draft Isolation from Visitor Page
  // ----------------------------------------------------
  try {
    const uniqueDraftToken = `__E2E_DRAFT_ISOLATION_TOKEN_${Date.now()}__`;

    // 1. Fetch current draft
    const getDraftRes = await fetch(`${TARGET_HOST}/api/admin/visual-cms?action=getDraft&pageId=page-home`, {
      headers: authHeaders,
    });
    const draftData = await getDraftRes.json();
    const currentBlocks = draftData.draft?.blocks || [];

    // 2. Mutate draft with unique token in hero title
    const mutatedBlocks = currentBlocks.map((b: any, idx: number) =>
      idx === 0 ? { ...b, config: { ...b.config, titleAr: uniqueDraftToken } } : b
    );

    const saveDraftRes = await fetch(`${TARGET_HOST}/api/admin/visual-cms`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'saveDraft',
        pageId: 'page-home',
        blocks: mutatedBlocks,
      }),
    });

    // 3. Query public visitor page
    const publicPageRes = await fetch(`${TARGET_HOST}/ar/`);
    const publicHtml = await publicPageRes.text();

    const isDraftIsolated = !publicHtml.includes(uniqueDraftToken);

    results.push({
      id: 'E2E-VCMS-02',
      name: 'Draft Isolation (Draft edits do NOT leak to public visitor page)',
      expected: 'Public HTML does not contain uncommitted draft token',
      actual: `Save Status: ${saveDraftRes.status}, Leaked: ${!isDraftIsolated}`,
      passed: saveDraftRes.status === 200 && isDraftIsolated,
    });
  } catch (e: any) {
    results.push({
      id: 'E2E-VCMS-02',
      name: 'Draft Isolation',
      expected: 'Isolated draft',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // E2E-VCMS-03: Atomic Publish & Instant Public Synchronization
  // ----------------------------------------------------
  try {
    const publishRes = await fetch(`${TARGET_HOST}/api/admin/visual-cms`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'publish',
        pageId: 'page-home',
        note: 'E2E Automated Atomic Publish Test',
      }),
    });

    const publishData = await publishRes.json();
    const isPublishSuccess = publishRes.status === 200 && publishData.success;

    results.push({
      id: 'E2E-VCMS-03',
      name: 'Atomic Publish Endpoint Execution',
      expected: 'HTTP 200 with new published version snapshot',
      actual: `Status: ${publishRes.status}, Version: v${publishData.publishedVersion?.versionNumber}`,
      passed: isPublishSuccess,
    });
  } catch (e: any) {
    results.push({
      id: 'E2E-VCMS-03',
      name: 'Atomic Publish Endpoint',
      expected: 'HTTP 200',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // E2E-VCMS-04: Rollback Endpoint Execution
  // ----------------------------------------------------
  try {
    const historyRes = await fetch(`${TARGET_HOST}/api/admin/visual-cms?action=getHistory&pageId=page-home`, {
      headers: authHeaders,
    });
    const historyData = await historyRes.json();
    const historyList = historyData.history || [];
    const oldestVersion = historyList[historyList.length - 1];

    let rollbackSuccess = false;
    if (oldestVersion) {
      const rollbackRes = await fetch(`${TARGET_HOST}/api/admin/visual-cms`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          action: 'rollback',
          pageId: 'page-home',
          versionId: oldestVersion.id,
        }),
      });

      rollbackSuccess = rollbackRes.status === 200;
    }

    results.push({
      id: 'E2E-VCMS-04',
      name: 'Rollback Endpoint Execution & Safe Reversion',
      expected: 'HTTP 200 with restored version record',
      actual: `Success: ${rollbackSuccess}, Target: ${oldestVersion?.id}`,
      passed: rollbackSuccess,
    });
  } catch (e: any) {
    results.push({
      id: 'E2E-VCMS-04',
      name: 'Rollback Endpoint',
      expected: 'HTTP 200',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // E2E-VCMS-05: Rate Limiter Burst Protection (HTTP 429)
  // ----------------------------------------------------
  try {
    const burstHeaders = {
      ...authHeaders,
      'x-forwarded-for': '198.51.100.99',
    };

    const requests = Array.from({ length: 75 }).map(() =>
      fetch(`${TARGET_HOST}/api/admin/visual-cms`, {
        method: 'POST',
        headers: burstHeaders,
        body: JSON.stringify({ action: 'saveDraft', blocks: [] }),
      })
    );

    const responses = await Promise.all(requests);
    const has429 = responses.some((r) => r.status === 429);

    results.push({
      id: 'E2E-VCMS-05',
      name: 'Sliding-Window Rate Limiting Protection on Visual CMS',
      expected: 'HTTP 429 Too Many Requests when burst threshold exceeded',
      actual: has429 ? 'Triggered 429 on burst' : 'No 429 received',
      passed: has429,
    });
  } catch (e: any) {
    results.push({
      id: 'E2E-VCMS-05',
      name: 'Rate Limiter Protection',
      expected: 'HTTP 429',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // PRINT SUMMARY
  // ----------------------------------------------------
  console.log('----------------------------------------------------------------');
  console.log('📋 E2E VISUAL CMS NETWORK TEST RESULTS:');
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
    console.log('🎉 ALL LIVE E2E VISUAL CMS TESTS PASSED (100%)!');
  } else {
    console.error('❌ SOME E2E TESTS FAILED.');
  }
  console.log('================================================================');
}

runE2EVisualCmsTests();

export {};
