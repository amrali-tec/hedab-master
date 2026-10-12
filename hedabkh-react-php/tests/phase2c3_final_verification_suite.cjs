/**
 * HEDABKH Phase 2C.3 — Performance Optimization, Visual CMS Hardening & Staging Readiness Suite
 * Comprehensive automated verification of all 17 phase objectives
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'http://127.0.0.1:8000/api/v1';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const fetchOptions = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  };

  const response = await fetch(url, fetchOptions);
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { rawText: text };
  }

  return {
    status: response.status,
    headers: response.headers,
    data: json
  };
}

async function runTests() {
  console.log('================================================================');
  console.log('HEDABKH PHASE 2C.3 — PERFORMANCE, CMS HARDENING & STAGING SUITE');
  console.log('================================================================\n');

  // 1. Session Login
  console.log('1. Authenticating Admin Session:');
  const loginRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hedabkh.com.sa', password: 'admin123' }
  });
  assert(loginRes.status === 200, 'Admin login succeeded');
  const sessionCookie = (loginRes.headers.get('set-cookie') || '').split(';')[0];
  const authHeader = { Cookie: sessionCookie };

  // 2. Security Headers & Rate Limit Verification
  console.log('\n2. Testing Security Headers & Rate Limiting:');
  const healthRes = await apiRequest('/health');
  assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'Header X-Content-Type-Options: nosniff present');
  assert(healthRes.headers.get('x-frame-options') === 'SAMEORIGIN', 'Header X-Frame-Options: SAMEORIGIN present');
  assert(healthRes.headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Header Referrer-Policy present');
  assert(!!healthRes.headers.get('x-ratelimit-limit'), 'Header X-RateLimit-Limit present in response');

  // 3. Rate Limit Abuse Protection
  console.log('\n3. Testing Rate Limiting on Mutation Route:');
  let rateLimitTriggered = false;
  for (let i = 0; i < 20; i++) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email: 'probe@hedabkh.com.sa', password: 'probe_password' }
    });
    if (res.status === 429) {
      rateLimitTriggered = true;
      assert(res.status === 429, `Rate limit successfully throttled burst at attempt #${i + 1} (HTTP 429)`);
      break;
    }
  }
  assert(rateLimitTriggered, 'Rate limit abuse protection is active and functional');

  // Clean rate limit cache to restore normal testing flow
  const rateLimitDir = path.resolve(__dirname, '../backend/storage/cache/ratelimit');
  if (fs.existsSync(rateLimitDir)) {
    fs.readdirSync(rateLimitDir).forEach(f => fs.unlinkSync(path.join(rateLimitDir, f)));
  }

  // Re-login after rate limit cache cleanup
  const freshLogin = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hedabkh.com.sa', password: 'admin123' }
  });
  const freshCookie = (freshLogin.headers.get('set-cookie') || '').split(';')[0];
  const freshAuth = { Cookie: freshCookie };

  // 4. API Bounded Pagination & Query Protection
  console.log('\n4. Testing API Bounded Pagination & Sorting:');
  const projectsPage = await apiRequest('/projects?page=1&limit=5');
  assert(projectsPage.status === 200, 'GET /projects with pagination returns 200');
  assert(projectsPage.data?.data?.length === 5, 'Pagination limit=5 correctly honored');
  const total = projectsPage.data?.meta?.pagination?.total || projectsPage.data?.pagination?.total;
  assert(total === 16, `Pagination metadata total count is 16 (actual: ${total})`);

  // Test unbounded request ceiling
  const unboundedPage = await apiRequest('/projects?page=1&limit=99999');
  assert(unboundedPage.status === 200, 'Unbounded limit request handled safely');
  assert(unboundedPage.data?.data?.length <= 100, 'Pagination hard ceiling capped to <= 100 records');

  // 5. Visual CMS Block Hardening & Malformed Payload Rejection
  console.log('\n5. Testing Visual CMS Block Hardening & Validation:');
  
  // 5.1 Rejection of malformed block payload
  const badBlockSave = await apiRequest('/admin/cms/pages/page-home/draft', {
    method: 'POST',
    headers: freshAuth,
    body: {
      blocks: [
        { invalid: true } // missing required id and type
      ]
    }
  });
  assert(badBlockSave.status === 400 || badBlockSave.status === 422, 'Malformed CMS block payload rejected with HTTP 400/422');

  // 5.2 Valid CMS save and publish cycle
  const homePub = await apiRequest('/content/pages/page-home');
  assert(homePub.status === 200, 'Published page-home retrieved');
  const validBlocks = homePub.data?.data?.blocks || [];

  const goodSave = await apiRequest('/admin/cms/pages/page-home/draft', {
    method: 'POST',
    headers: freshAuth,
    body: {
      blocks: validBlocks,
      changeNote: 'Phase 2C.3 Staging verification draft'
    }
  });
  assert(goodSave.status === 200, 'Valid CMS draft saved successfully');

  const goodPublish = await apiRequest('/admin/cms/pages/page-home/publish', {
    method: 'POST',
    headers: freshAuth,
    body: { note: 'Phase 2C.3 Staging verification publish' }
  });
  assert(goodPublish.status === 200, 'Valid CMS version published successfully');

  // 6. Media Library Upload Validation & Deletion
  console.log('\n6. Testing Media Library & Upload Security:');
  const mediaList = await apiRequest('/admin/media', { headers: freshAuth });
  assert(mediaList.status === 200, 'GET /admin/media returns media asset list');

  const testMediaId = `stg-media-${Date.now()}`;
  const saveMediaRes = await apiRequest('/admin/media', {
    method: 'POST',
    headers: freshAuth,
    body: {
      id: testMediaId,
      name: 'صورة اعتماد الجاهزية',
      url: '/images/projects/project-1.jpg',
      category: 'projects',
      type: 'image',
      altAr: 'صورة الاعتماد',
      altEn: 'Staging Image'
    }
  });
  assert(saveMediaRes.status === 201, 'POST /admin/media creates media metadata');

  const deleteMediaRes = await apiRequest(`/admin/media/${testMediaId}`, {
    method: 'DELETE',
    headers: freshAuth
  });
  assert(deleteMediaRes.status === 200, 'DELETE /admin/media/{id} removes test media metadata');

  // 7. Error Contract & Information Disclosure
  console.log('\n7. Testing Error Contract & Zero Stack Trace Disclosure:');
  const notFoundRes = await apiRequest('/services/srv-nonexistent-999');
  assert(notFoundRes.status === 404, 'Non-existent service returns 404');
  assert(!notFoundRes.data?.trace && !notFoundRes.data?.file, 'No PHP stack trace or server paths disclosed in 404 response');

  // 8. Public Data Parity
  console.log('\n8. Testing Public Data Parity:');
  const [proj, srv, eq, cert, team, part, art, stat] = await Promise.all([
    apiRequest('/projects'),
    apiRequest('/services'),
    apiRequest('/equipment'),
    apiRequest('/certificates'),
    apiRequest('/team'),
    apiRequest('/partners'),
    apiRequest('/articles'),
    apiRequest('/statistics')
  ]);

  assert(proj.data?.data?.length === 16, 'Projects count parity = 16');
  assert(srv.data?.data?.length === 6, 'Services count parity = 6');
  assert(eq.data?.data?.length === 10, 'Equipment fleet count parity = 10');
  assert(cert.data?.data?.length === 12, 'Certificates count parity = 12');
  assert(team.data?.data?.length === 8, 'Team members count parity = 8');
  assert(part.data?.data?.length === 18, 'Partners count parity = 18');
  assert(art.data?.data?.length === 8, 'Articles count parity = 8');
  assert(stat.data?.data?.length === 4, 'Statistics KPI count parity = 4');

  // 9. Logout
  console.log('\n9. Testing Admin Session Termination:');
  const logoutRes = await apiRequest('/auth/logout', {
    method: 'POST',
    headers: freshAuth
  });
  assert(logoutRes.status === 200, 'Admin session terminated');

  console.log('\n================================================================');
  console.log(`PHASE 2C.3 TEST SUITE TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal Phase 2C.3 test suite error:', err);
  process.exit(1);
});
