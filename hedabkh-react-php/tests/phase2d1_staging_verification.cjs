/**
 * HEDABKH Phase 2D.1 — Staging Environment Verification Suite
 * Executes full end-to-end HTTP validation against staging API
 */

const fs = require('fs');
const path = require('path');

const API_BASE = process.env.STAGING_API_URL || 'http://127.0.0.1:8000/api/v1';

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
  console.log(`HEDABKH PHASE 2D.1 — STAGING ENVIRONMENT VERIFICATION SUITE`);
  console.log(`Target: ${API_BASE}`);
  console.log('================================================================\n');

  // 1. Health & Infrastructure
  console.log('1. Testing Health & Connectivity:');
  const healthRes = await apiRequest('/health');
  assert(healthRes.status === 200, 'Health endpoint returns 200 OK');
  assert(healthRes.data?.data?.database === 'connected', 'Database connection confirmed');

  // 2. Security Headers
  console.log('\n2. Testing Security Headers:');
  assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff present');
  assert(healthRes.headers.get('x-frame-options') === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN present');
  assert(healthRes.headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy present');

  // 3. Public Catalog Parity
  console.log('\n3. Testing Public Catalog Data Parity:');
  const [proj, srv, eq, cert, team, part, art, stat, time, reg] = await Promise.all([
    apiRequest('/projects'),
    apiRequest('/services'),
    apiRequest('/equipment'),
    apiRequest('/certificates'),
    apiRequest('/team'),
    apiRequest('/partners'),
    apiRequest('/articles'),
    apiRequest('/statistics'),
    apiRequest('/timeline'),
    apiRequest('/regions')
  ]);

  assert(proj.data?.data?.length === 16, 'Projects count = 16');
  assert(srv.data?.data?.length === 6, 'Services count = 6');
  assert(eq.data?.data?.length === 10, 'Equipment fleet count = 10');
  assert(cert.data?.data?.length === 12, 'Certificates count = 12');
  assert(team.data?.data?.length === 8, 'Team members count = 8');
  assert(part.data?.data?.length === 18, 'Partners count = 18');
  assert(art.data?.data?.length === 8, 'Articles count = 8');
  assert(stat.data?.data?.length === 4, 'Statistics count = 4');
  assert(time.data?.data?.length === 6, 'Timeline milestones count = 6');
  assert(reg.data?.data?.length === 6, 'Coverage regions count = 6');

  // 4. Visual CMS All 4 Sovereign Pages
  console.log('\n4. Testing Visual CMS 4 Pages & 54 Blocks:');
  const [homeCms, aboutCms, chairCms, contactCms] = await Promise.all([
    apiRequest('/content/pages/page-home'),
    apiRequest('/content/pages/page-about'),
    apiRequest('/content/pages/page-chairman'),
    apiRequest('/content/pages/page-contact')
  ]);

  assert(homeCms.data?.data?.blocks?.length === 10, 'page-home has 10 blocks');
  assert(aboutCms.data?.data?.blocks?.length === 6, 'page-about has 6 blocks');
  assert(chairCms.data?.data?.blocks?.length === 6, 'page-chairman has 6 blocks');
  assert(contactCms.data?.data?.blocks?.length === 5, 'page-contact has 5 blocks');

  // 5. Admin Authentication & Session Security
  console.log('\n5. Testing Admin Authentication & Cookie Session:');
  const unauthRes = await apiRequest('/admin/overview/metrics');
  assert(unauthRes.status === 401, 'Unauthenticated admin request returns 401');

  const loginRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hedabkh.com.sa', password: 'admin123' }
  });
  assert(loginRes.status === 200, 'Admin login returns 200 OK');
  const cookie = (loginRes.headers.get('set-cookie') || '').split(';')[0];
  const authHeader = { Cookie: cookie };

  const sessionRes = await apiRequest('/auth/session', { headers: authHeader });
  assert(sessionRes.status === 200, 'GET /auth/session confirms active session');
  assert(sessionRes.data?.data?.user?.role === 'super_admin', 'User has super_admin role');

  const metricsRes = await apiRequest('/admin/overview/metrics', { headers: authHeader });
  assert(metricsRes.status === 200, 'Authenticated admin metrics request returns 200 OK');

  // 6. Inquiry Submission & Cleanup
  console.log('\n6. Testing Inquiry Submission & Automated Cleanup:');
  const testInquiry = {
    name: 'مهندس اعتماد تجريبي',
    email: 'staging-test@hedabkh.com.sa',
    phone: '+966500000000',
    message: 'طلب تسعير تدقيقي لاختبار بيئة الاستضافة التجريبية'
  };
  const inqRes = await apiRequest('/inquiries', { method: 'POST', body: testInquiry });
  assert(inqRes.status === 201, 'POST /inquiries creates staging inquiry record');
  const inqId = inqRes.data?.data?.id;

  if (inqId) {
    const delInq = await apiRequest(`/admin/inquiries/${inqId}`, { method: 'DELETE', headers: authHeader });
    assert(delInq.status === 200, 'DELETE /admin/inquiries removes staging test record');
  }

  // 7. Admin Logout
  console.log('\n7. Testing Admin Logout:');
  const logoutRes = await apiRequest('/auth/logout', { method: 'POST', headers: authHeader });
  assert(logoutRes.status === 200, 'POST /auth/logout terminates session');

  const postLogout = await apiRequest('/admin/overview/metrics', { headers: authHeader });
  assert(postLogout.status === 401, 'Post-logout request correctly rejected with 401');

  // 8. Error Contract
  console.log('\n8. Testing Error Contract & Zero Stack Trace Exposure:');
  const notFound = await apiRequest('/projects/proj-nonexistent-000');
  assert(notFound.status === 404, 'Non-existent item returns 404 JSON');
  assert(!notFound.data?.trace && !notFound.data?.file, 'No internal server paths or stack traces exposed');

  console.log('\n================================================================');
  console.log(`STAGING VERIFICATION TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal staging test suite error:', err);
  process.exit(1);
});
