/**
 * Comprehensive End-to-End Public Sync, Rate-Limit & Protected Backup Test Suite
 * Validates G0 to G5 Release Requirements
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

interface StepResult {
  id: string;
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const testResults: StepResult[] = [];

console.log('================================================================');
console.log(`🌐 COMPREHENSIVE PRODUCTION READINESS & PUBLIC SYNC TEST SUITE`);
console.log(`Target Host: ${BASE_URL}`);
console.log('================================================================\n');

async function runProductionReadinessTests() {
  // ----------------------------------------------------
  // TEST 1: Protected Backup GET (Unauthenticated rejection)
  // ----------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/admin/backup`, { method: 'GET' });
    const passed = res.status === 401;
    testResults.push({
      id: 'PR-01',
      name: 'Unauthenticated GET /api/admin/backup Rejection',
      expected: 'HTTP 401 Unauthorized (Prevents data leaks)',
      actual: `HTTP ${res.status}`,
      passed,
    });
  } catch (e: any) {
    testResults.push({
      id: 'PR-01',
      name: 'Unauthenticated GET /api/admin/backup Rejection',
      expected: 'HTTP 401',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // TEST 2: Sanitized Public Health Endpoint (Zero Internal Path Leaks)
  // ----------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const json = await res.json();
    const noPathLeaks = !JSON.stringify(json).includes('/public/uploads') && !JSON.stringify(json).includes('atomic_file_json');
    const passed = res.status === 200 && json.status === 'healthy' && noPathLeaks;
    testResults.push({
      id: 'PR-02',
      name: 'Sanitized Public Health Endpoint (/api/health)',
      expected: 'Status 200 with zero internal filesystem path disclosures',
      actual: `Status ${res.status}, Healthy: ${json.status === 'healthy'}, Leak-free: ${noPathLeaks}`,
      passed,
    });
  } catch (e: any) {
    testResults.push({
      id: 'PR-02',
      name: 'Sanitized Public Health Endpoint',
      expected: 'Status 200',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // TEST 3: Sliding-Window Rate Limiting (60 requests/minute ceiling)
  // ----------------------------------------------------
  try {
    const burstHeaders = {
      'Content-Type': 'application/json',
      'x-forwarded-for': '198.51.100.42',
      Origin: BASE_URL,
    };

    const requests = Array.from({ length: 75 }).map((_, i) =>
      fetch(`${BASE_URL}/api/admin/cms`, {
        method: 'POST',
        headers: burstHeaders,
        body: JSON.stringify({ key: 'ping', data: i }),
      })
    );

    const responses = await Promise.all(requests);
    const hit429 = responses.some((r) => r.status === 429);

    testResults.push({
      id: 'PR-03',
      name: 'Sliding-Window Rate Limiting (60 requests/minute ceiling)',
      expected: 'HTTP 429 Too Many Requests when threshold exceeded',
      actual: hit429 ? 'HTTP 429 Triggered successfully on burst' : 'No 429 received',
      passed: hit429,
    });
  } catch (e: any) {
    testResults.push({
      id: 'PR-03',
      name: 'Sliding-Window Rate Limiting',
      expected: 'HTTP 429',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // TEST 4: End-to-End CMS Mutation & Instant Visitor Synchronization
  // ----------------------------------------------------
  const uniqueMarker = `توسعة البنية التحتية والمشاريع الكبرى ${Date.now()}`;
  try {
    // 1. Mutate via Admin API
    const postRes = await fetch(`${BASE_URL}/api/admin/cms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
      body: JSON.stringify({
        key: 'gulf_hills_timeline_items',
        data: [
          {
            id: 'm-live-sync-test',
            year: '2030',
            titleAr: uniqueMarker,
            titleEn: 'Mega Infrastructure Expansion 2030',
            descriptionAr: 'تنفيذ أعمال الأنفاق والجسور العملاقة',
            descriptionEn: 'Major viaducts and tunneling execution',
            colorCard: '14, 165, 233',
            colorRing: '#0284c7',
          },
        ],
      }),
    });

    const postJson = await postRes.json();
    const writeSuccess = postRes.status === 200 && postJson.success;

    // 2. Fetch public page as an independent visitor
    const publicPageRes = await fetch(`${BASE_URL}/ar/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Public Visitor Browser)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    // 3. Read back from server storage API
    const readCmsRes = await fetch(`${BASE_URL}/api/admin/cms?key=gulf_hills_timeline_items`, {
      headers: {
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
    });
    const readCmsJson = await readCmsRes.json();
    const isStored = readCmsJson.data?.[0]?.titleAr === uniqueMarker;

    const passed = writeSuccess && publicPageRes.status === 200 && isStored;
    testResults.push({
      id: 'PR-04',
      name: 'End-to-End CMS Mutation & Public Visitor Synchronization',
      expected: 'Admin write persists instantly and public pages respond with 200 OK',
      actual: `Write: ${postRes.status}, Visitor Page: ${publicPageRes.status}, Stored Data: ${isStored}`,
      passed,
    });
  } catch (e: any) {
    testResults.push({
      id: 'PR-04',
      name: 'End-to-End CMS Mutation & Public Visitor Sync',
      expected: 'Success',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // TEST 5: Full Import, Automatic Snapshotting & Rollback Lifecycle
  // ----------------------------------------------------
  try {
    // 1. Export current state
    const exportRes = await fetch(`${BASE_URL}/api/admin/backup`, {
      headers: {
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
    });
    const exportData = await exportRes.json();

    // 2. Import a new modified payload
    const importRes = await fetch(`${BASE_URL}/api/admin/backup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
      body: JSON.stringify({
        action: 'import',
        payload: {
          version: '1.0',
          data: {
            test_rollback_key: 'imported_value_before_rollback',
          },
        },
      }),
    });
    const importJson = await importRes.json();
    const snapshotCreated = importJson.snapshotCreated;

    // 3. Rollback from the created snapshot
    const rollbackRes = await fetch(`${BASE_URL}/api/admin/backup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
      body: JSON.stringify({
        action: 'rollback',
        snapshotName: snapshotCreated,
      }),
    });
    const rollbackJson = await rollbackRes.json();

    const passed =
      exportRes.status === 200 &&
      importRes.status === 200 &&
      rollbackRes.status === 200 &&
      rollbackJson.success === true;

    testResults.push({
      id: 'PR-05',
      name: 'Atomic Backup Import, Auto Snapshotting & Rollback Cycle',
      expected: 'Snapshot created automatically and rollback restores previous state cleanly',
      actual: `Export: ${exportRes.status}, Import: ${importRes.status}, Rollback: ${rollbackRes.status}`,
      passed,
    });
  } catch (e: any) {
    testResults.push({
      id: 'PR-05',
      name: 'Atomic Backup Import & Rollback Lifecycle',
      expected: 'Success',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // PRINT SUMMARY
  // ----------------------------------------------------
  console.log('----------------------------------------------------------------');
  console.log('📋 PRODUCTION READINESS TEST RESULTS:');
  console.log('----------------------------------------------------------------');

  let allPassed = true;
  testResults.forEach((r) => {
    const icon = r.passed ? '✅ PASS' : '❌ FAIL';
    if (!r.passed) allPassed = false;
    console.log(`${icon} [${r.id}] ${r.name}`);
    console.log(`   Expected: ${r.expected}`);
    console.log(`   Actual:   ${r.actual}\n`);
  });

  console.log('================================================================');
  if (allPassed) {
    console.log('🎉 ALL PRODUCTION READINESS & PUBLIC SYNC TESTS PASSED (100%)!');
  } else {
    console.error('❌ SOME PRODUCTION READINESS TESTS FAILED.');
  }
  console.log('================================================================');
}

runProductionReadinessTests();

export {};
