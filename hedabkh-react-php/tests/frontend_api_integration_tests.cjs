/**
 * Frontend API Integration & Parity Verification Suite
 * Phase 2C.1 — React Frontend to PHP REST API Integration
 */

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
  console.log('HEDABKH PHASE 2C.1 — FRONTEND API INTEGRATION TEST SUITE');
  console.log('================================================================\n');

  // Test 1: System Health
  console.log('1. Testing System Health & API Base:');
  const healthRes = await apiRequest('/health');
  assert(healthRes.status === 200, 'Health endpoint returns 200 OK');
  assert(healthRes.data?.data?.database === 'connected', 'Database is connected to MariaDB');
  assert(healthRes.data?.data?.status === 'ok', 'Status is ok');

  // Test 2: Public Projects API
  console.log('\n2. Testing Public Projects API:');
  const projectsRes = await apiRequest('/projects?locale=ar');
  assert(projectsRes.status === 200, 'GET /projects returns 200 OK');
  assert(Array.isArray(projectsRes.data?.data), 'Projects data is an array');
  assert(projectsRes.data?.data?.length === 16, `Projects array contains 16 records (actual: ${projectsRes.data?.data?.length})`);
  const sampleProj = projectsRes.data?.data[0];
  assert(!!sampleProj?.title, 'Project has localized title');
  assert(!!sampleProj?.category, 'Project has category');

  // Test 3: Public Services API
  console.log('\n3. Testing Public Services API:');
  const servicesRes = await apiRequest('/services?locale=ar');
  assert(servicesRes.status === 200, 'GET /services returns 200 OK');
  assert(Array.isArray(servicesRes.data?.data), 'Services data is an array');
  assert(servicesRes.data?.data?.length === 6, `Services count is 6 (actual: ${servicesRes.data?.data?.length})`);

  // Test 4: Public Statistics API
  console.log('\n4. Testing Public Statistics API:');
  const statsRes = await apiRequest('/statistics?locale=ar');
  assert(statsRes.status === 200, 'GET /statistics returns 200 OK');
  assert(Array.isArray(statsRes.data?.data), 'Statistics data is an array');
  assert(statsRes.data?.data?.length === 4, `Statistics count is 4 (actual: ${statsRes.data?.data?.length})`);

  // Test 5: Public Team API
  console.log('\n5. Testing Public Team API:');
  const teamRes = await apiRequest('/team?locale=ar');
  assert(teamRes.status === 200, 'GET /team returns 200 OK');
  assert(Array.isArray(teamRes.data?.data), 'Team data is an array');
  assert(teamRes.data?.data?.length === 8, `Team count is 8 (actual: ${teamRes.data?.data?.length})`);

  // Test 6: Public Certificates API
  console.log('\n6. Testing Public Certificates API:');
  const certsRes = await apiRequest('/certificates');
  assert(certsRes.status === 200, 'GET /certificates returns 200 OK');
  assert(Array.isArray(certsRes.data?.data), 'Certificates data is an array');
  assert(certsRes.data?.data?.length === 12, `Certificates count is 12 (actual: ${certsRes.data?.data?.length})`);

  // Test 7: Public Equipment Fleet API
  console.log('\n7. Testing Public Equipment Fleet API:');
  const equipRes = await apiRequest('/equipment');
  assert(equipRes.status === 200, 'GET /equipment returns 200 OK');
  assert(Array.isArray(equipRes.data?.data), 'Equipment data is an array');
  assert(equipRes.data?.data?.length === 10, `Equipment fleet count is 10 (actual: ${equipRes.data?.data?.length})`);

  // Test 8: Public Partners API
  console.log('\n8. Testing Public Partners API:');
  const partnersRes = await apiRequest('/partners');
  assert(partnersRes.status === 200, 'GET /partners returns 200 OK');
  assert(Array.isArray(partnersRes.data?.data), 'Partners data is an array');
  assert(partnersRes.data?.data?.length === 18, `Partners count is 18 (actual: ${partnersRes.data?.data?.length})`);

  // Test 9: Public Articles API
  console.log('\n9. Testing Public Articles API:');
  const articlesRes = await apiRequest('/articles');
  assert(articlesRes.status === 200, 'GET /articles returns 200 OK');
  assert(Array.isArray(articlesRes.data?.data), 'Articles data is an array');
  assert(articlesRes.data?.data?.length === 8, `Articles count is 8 (actual: ${articlesRes.data?.data?.length})`);

  // Test 10: Timeline Milestones API
  console.log('\n10. Testing Timeline Milestones API:');
  const timelineRes = await apiRequest('/timeline?locale=ar');
  assert(timelineRes.status === 200, 'GET /timeline returns 200 OK');
  assert(Array.isArray(timelineRes.data?.data), 'Timeline milestones data is an array');
  assert(timelineRes.data?.data?.length === 6, `Timeline milestones count is 6 (actual: ${timelineRes.data?.data?.length})`);

  // Test 11: Regional Coverage API
  console.log('\n11. Testing Regional Coverage API:');
  const regionsRes = await apiRequest('/regions?locale=ar');
  assert(regionsRes.status === 200, 'GET /regions returns 200 OK');
  assert(Array.isArray(regionsRes.data?.data), 'Regions data is an array');
  assert(regionsRes.data?.data?.length === 6, `Regions count is 6 (actual: ${regionsRes.data?.data?.length})`);

  // Test 12: Brand & SEO Settings API
  console.log('\n12. Testing Brand & SEO Settings API:');
  const brandRes = await apiRequest('/settings/brand');
  assert(brandRes.status === 200, 'GET /settings/brand returns 200 OK');
  assert(!!(brandRes.data?.data?.companyNameAr || brandRes.data?.data?.nameAr), 'Brand identity name present');

  const seoRes = await apiRequest('/settings/seo');
  assert(seoRes.status === 200, 'GET /settings/seo returns 200 OK');
  assert(Array.isArray(seoRes.data?.data), 'SEO settings data is an array');
  assert(seoRes.data?.data?.length === 10, `SEO records count is 10 (actual: ${seoRes.data?.data?.length})`);

  // Test 13: Visual CMS Pages Block Trees
  console.log('\n13. Testing Visual CMS Page Block Trees:');
  const homeCms = await apiRequest('/content/pages/page-home?locale=ar');
  assert(homeCms.status === 200, 'GET /content/pages/page-home returns 200 OK');
  assert(homeCms.data?.data?.blocks?.length === 10, `page-home has 10 blocks (actual: ${homeCms.data?.data?.blocks?.length})`);

  const aboutCms = await apiRequest('/content/pages/page-about?locale=ar');
  assert(aboutCms.status === 200, 'GET /content/pages/page-about returns 200 OK');
  assert(aboutCms.data?.data?.blocks?.length === 6, `page-about has 6 blocks (actual: ${aboutCms.data?.data?.blocks?.length})`);

  const chairmanCms = await apiRequest('/content/pages/page-chairman?locale=ar');
  assert(chairmanCms.status === 200, 'GET /content/pages/page-chairman returns 200 OK');
  assert(chairmanCms.data?.data?.blocks?.length === 6, `page-chairman has 6 blocks (actual: ${chairmanCms.data?.data?.blocks?.length})`);

  const contactCms = await apiRequest('/content/pages/page-contact?locale=ar');
  assert(contactCms.status === 200, 'GET /content/pages/page-contact returns 200 OK');
  assert(contactCms.data?.data?.blocks?.length === 5, `page-contact has 5 blocks (actual: ${contactCms.data?.data?.blocks?.length})`);

  // Test 14: Inquiries Submission API
  console.log('\n14. Testing Inquiry Form Submission:');
  const inquiryRes = await apiRequest('/inquiries', {
    method: 'POST',
    body: {
      name: 'م. عبدالله القحطاني',
      email: 'abdullah.q@example.com',
      phone: '0501234567',
      message: 'طلب استشارة هندسية لتنفيذ شبكة تصريف سيول بمدينة الرياض'
    }
  });
  assert(inquiryRes.status === 201, 'POST /inquiries returns 201 Created');
  assert(!!inquiryRes.data?.data?.id, 'Inquiry ID was generated');

  // Test 15: Admin Session Authentication Lifecycle
  console.log('\n15. Testing Admin Session Authentication Lifecycle:');
  const loginRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: {
      email: 'admin@hedabkh.com.sa',
      password: 'admin123'
    }
  });
  assert(loginRes.status === 200, 'POST /auth/login returns 200 OK');
  assert(loginRes.data?.data?.user?.email === 'admin@hedabkh.com.sa', 'Logged in user email matches');

  const cookieHeader = loginRes.headers.get('set-cookie');
  const sessionCookie = cookieHeader ? cookieHeader.split(';')[0] : '';
  assert(!!sessionCookie, `Session cookie received: ${sessionCookie}`);

  const sessionRes = await apiRequest('/auth/session', {
    headers: { Cookie: sessionCookie }
  });
  assert(sessionRes.status === 200, 'GET /auth/session with cookie returns 200 OK');
  assert(sessionRes.data?.data?.user?.role === 'super_admin', 'User has super_admin role');

  const logoutRes = await apiRequest('/auth/logout', {
    method: 'POST',
    headers: { Cookie: sessionCookie }
  });
  assert(logoutRes.status === 200, 'POST /auth/logout returns 200 OK');

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
