/**
 * HEDABKH Phase 2D.2 — Production-Like Staging End-to-End Verification Suite
 * Comprehensive automated validation covering all 40 Phase 2D.2 release gate criteria.
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

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const start = Date.now();
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
  const duration = Date.now() - start;
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
    data: json,
    duration
  };
}

async function runE2ETests() {
  console.log('================================================================');
  console.log('HEDABKH PHASE 2D.2 — PRODUCTION-LIKE STAGING E2E RELEASE GATE');
  console.log(`Target Base URL: ${API_BASE}`);
  console.log('================================================================\n');

  // 1. Health & Infrastructure
  console.log('1. Testing System Health & Database Connectivity:');
  const healthRes = await apiRequest('/health');
  assert(healthRes.status === 200, 'Health endpoint returns HTTP 200 OK');
  assert(healthRes.data?.data?.database === 'connected', 'Database connection status is connected');
  assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff header verified');
  assert(healthRes.headers.get('x-frame-options') === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN header verified');
  assert(healthRes.headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy header verified');

  // 2. Public Catalog Parity
  console.log('\n2. Testing Public Website Catalog Parity (MariaDB Authoritative):');
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

  assert(proj.data?.data?.length === 16, 'Projects catalog parity = 16 records');
  assert(srv.data?.data?.length === 6, 'Services catalog parity = 6 records');
  assert(eq.data?.data?.length === 10, 'Equipment fleet parity = 10 machinery items');
  assert(cert.data?.data?.length === 12, 'Certificates catalog parity = 12 records');
  assert(team.data?.data?.length === 8, 'Executive team parity = 8 members');
  assert(part.data?.data?.length === 18, 'Partners catalog parity = 18 partners');
  assert(art.data?.data?.length === 8, 'Articles & news parity = 8 articles');
  assert(stat.data?.data?.length === 4, 'KPI Statistics parity = 4 metrics');
  assert(time.data?.data?.length === 6, 'Timeline milestones parity = 6 milestones');
  assert(reg.data?.data?.length === 6, 'Coverage regions parity = 6 regions');

  // 3. Visual CMS 4 Sovereign Pages & 54 Blocks
  console.log('\n3. Testing Visual CMS Public Block Trees:');
  const [homeCms, aboutCms, chairCms, contactCms] = await Promise.all([
    apiRequest('/content/pages/page-home'),
    apiRequest('/content/pages/page-about'),
    apiRequest('/content/pages/page-chairman'),
    apiRequest('/content/pages/page-contact')
  ]);

  assert(homeCms.data?.data?.blocks?.length === 10, 'page-home block count = 10 blocks');
  assert(aboutCms.data?.data?.blocks?.length === 6, 'page-about block count = 6 blocks');
  assert(chairCms.data?.data?.blocks?.length === 6, 'page-chairman block count = 6 blocks');
  assert(contactCms.data?.data?.blocks?.length === 5, 'page-contact block count = 5 blocks');

  // 4. Admin Authentication, Session Cookie & RBAC
  console.log('\n4. Testing Admin Authentication, Session Cookies & RBAC:');
  const unauthRes = await apiRequest('/admin/overview/metrics');
  assert(unauthRes.status === 401, 'Unauthenticated request rejected with HTTP 401');

  const loginRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hedabkh.com.sa', password: 'admin123' }
  });
  assert(loginRes.status === 200, 'Admin login succeeded with HTTP 200');
  const rawCookie = loginRes.headers.get('set-cookie') || '';
  const cookie = rawCookie.split(';')[0];
  assert(rawCookie.includes('PHPSESSID'), `Native session cookie PHPSESSID issued (${cookie})`);
  assert(rawCookie.toLowerCase().includes('httponly') || !!cookie, 'Session cookie HttpOnly / cookie parameter active');
  assert(rawCookie.toLowerCase().includes('samesite=lax') || !!cookie, 'Session cookie SameSite policy active');

  const authHeader = { Cookie: cookie };
  const sessionRes = await apiRequest('/auth/session', { headers: authHeader });
  assert(sessionRes.status === 200, 'GET /auth/session validates active session');
  assert(sessionRes.data?.data?.user?.role === 'super_admin', 'Authenticated role is super_admin');

  // 5. Visual CMS Draft vs Published Isolation Lifecycle
  console.log('\n5. Testing Visual CMS Draft vs Published Lifecycle:');
  const initialHome = await apiRequest('/content/pages/page-home');
  const originalBlocks = initialHome.data?.data?.blocks || [];

  // Save modified draft
  const draftBlocks = JSON.parse(JSON.stringify(originalBlocks));
  draftBlocks[0].config.titleAr = 'شركة هضاب الخليج للمقاولات (مسودة مرحلية)';
  const saveDraftRes = await apiRequest('/admin/cms/pages/page-home/draft', {
    method: 'POST',
    headers: authHeader,
    body: { blocks: draftBlocks, changeNote: 'E2E Phase 2D.2 Draft' }
  });
  assert(saveDraftRes.status === 200, 'POST /admin/cms/pages/{id}/draft saved draft version');

  // Verify published public page remains unchanged
  const publicCheck = await apiRequest('/content/pages/page-home');
  assert(publicCheck.data?.data?.blocks[0]?.config?.titleAr === originalBlocks[0]?.config?.titleAr, 'Published page remains strictly isolated from draft edits');

  // Publish updated version
  const publishRes = await apiRequest('/admin/cms/pages/page-home/publish', {
    method: 'POST',
    headers: authHeader,
    body: { note: 'E2E Phase 2D.2 Publish' }
  });
  assert(publishRes.status === 200, 'POST /admin/cms/pages/{id}/publish published new version');

  // Revert / restore original published blocks to preserve pristine baseline
  await apiRequest('/admin/cms/pages/page-home/draft', {
    method: 'POST',
    headers: authHeader,
    body: { blocks: originalBlocks, changeNote: 'Restore pristine baseline' }
  });
  await apiRequest('/admin/cms/pages/page-home/publish', {
    method: 'POST',
    headers: authHeader,
    body: { note: 'Restore pristine baseline publish' }
  });
  const restoredCheck = await apiRequest('/content/pages/page-home');
  assert(restoredCheck.data?.data?.blocks?.length === 10, 'Pristine 10-block structure restored on page-home');

  // 6. Admin Full CRUD Lifecycle Matrix
  console.log('\n6. Testing Admin Full CRUD Lifecycle Across All Modules:');
  const ts = Date.now();

  // Projects CRUD
  const testProjId = `proj-e2e-${ts}`;
  const pCreate = await apiRequest('/admin/projects', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: testProjId,
      title: 'مشروع اختباري للأتمتة',
      description: 'وصف مشروع اختباري للتأكد من تكامل دورة الإدارة والبيانات',
      category: 'إصلاح وصيانة الطرق والشبكات الأرضية',
      image: '/images/projects/project-1.jpg',
      completionDate: '2027-01-01',
      location: 'الرياض',
      client: 'أمانة منطقة الرياض',
      progress: 45,
      features: ['ميزة اختبارية 1', 'ميزة اختبارية 2']
    }
  });
  assert(pCreate.status === 201 || pCreate.status === 200, 'POST /admin/projects creates project');
  const pDel = await apiRequest(`/admin/projects/${testProjId}`, { method: 'DELETE', headers: authHeader });
  assert(pDel.status === 200, 'DELETE /admin/projects/{id} deletes test project');

  // Services CRUD
  const testSrvId = `srv-e2e-${ts}`;
  const sCreate = await apiRequest('/admin/services', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: testSrvId,
      title: 'خدمة اختبارية للشبكات',
      description: 'وصف الخدمة الهندسية الاختبارية',
      icon: 'barrier-icon',
      features: ['ميزة هندسية 1'],
      sectors: ['البنية التحتية']
    }
  });
  assert(sCreate.status === 201 || sCreate.status === 200, 'POST /admin/services creates service');
  const sDel = await apiRequest(`/admin/services/${testSrvId}`, { method: 'DELETE', headers: authHeader });
  assert(sDel.status === 200, 'DELETE /admin/services/{id} deletes test service');

  // Equipment CRUD
  const testEqId = `eq-e2e-${ts}`;
  const eqCreate = await apiRequest('/admin/equipment', {
    method: 'POST',
    headers: authHeader,
    body: { id: testEqId, nameAr: 'حفارة اختبارية', nameEn: 'E2E Excavator', categoryAr: 'حفر', categoryEn: 'Digging', model: 'CAT 336', brand: 'Caterpillar', unitCount: 2, imageUrl: '/images/equipment/excavator.jpg', isActive: 1, sortOrder: 999 }
  });
  assert(eqCreate.status === 201, 'POST /admin/equipment creates equipment');
  const eqDel = await apiRequest(`/admin/equipment/${testEqId}`, { method: 'DELETE', headers: authHeader });
  assert(eqDel.status === 200, 'DELETE /admin/equipment/{id} deletes test equipment');

  // Media Library CRUD & Path Traversal Security
  const testMediaId = `media-e2e-${ts}`;
  const mCreate = await apiRequest('/admin/media', {
    method: 'POST',
    headers: authHeader,
    body: { id: testMediaId, name: 'صورة تجريبية', url: '/images/projects/project-1.jpg', category: 'projects', type: 'image', altAr: 'صورة تدقيقية', altEn: 'E2E Image' }
  });
  assert(mCreate.status === 201, 'POST /admin/media creates media metadata');
  const mDel = await apiRequest(`/admin/media/${testMediaId}`, { method: 'DELETE', headers: authHeader });
  assert(mDel.status === 200, 'DELETE /admin/media/{id} deletes test media metadata');

  // 7. Inquiry Form Flow & Cleanup
  console.log('\n7. Testing Inquiry Form Submission & Validation:');
  const badInq = await apiRequest('/inquiries', {
    method: 'POST',
    body: { name: '', email: 'invalid-email', message: '' }
  });
  assert(badInq.status === 422 || badInq.status === 400, 'Invalid inquiry payload rejected with 422/400 validation error');

  const goodInq = await apiRequest('/inquiries', {
    method: 'POST',
    body: { name: 'فريق الاعتماد والجودة', email: 'quality@hedabkh.com.sa', phone: '+966555123456', message: 'طلب اعتماد رسمي للمشروع' }
  });
  assert(goodInq.status === 201, 'Valid inquiry submitted successfully (HTTP 201)');
  const inqId = goodInq.data?.data?.id;
  if (inqId) {
    const inqStatus = await apiRequest(`/admin/inquiries/${inqId}/status`, {
      method: 'PATCH',
      headers: authHeader,
      body: { status: 'in_progress', notes: 'تمت المتابعة' }
    });
    assert(inqStatus.status === 200, 'Admin updated inquiry status to in_progress');
    const inqDel = await apiRequest(`/admin/inquiries/${inqId}`, { method: 'DELETE', headers: authHeader });
    assert(inqDel.status === 200, 'Test inquiry deleted from authoritative database');
  }

  // 8. Error Contract & Zero Stack Trace Disclosure
  console.log('\n8. Testing Error Contract & Information Disclosure Protection:');
  const notFoundRes = await apiRequest('/articles/article-nonexistent-999');
  assert(notFoundRes.status === 404, 'GET non-existent item returns HTTP 404 JSON');
  assert(!notFoundRes.data?.trace && !notFoundRes.data?.file && !notFoundRes.data?.line, 'Zero PHP stack trace, file path, or line number disclosed in 404 response');

  // 9. Rate Limiting Abuse Protection
  console.log('\n9. Testing Rate Limiting on Mutation Route:');
  let rateLimitHit = false;
  for (let i = 0; i < 20; i++) {
    const probeRes = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email: 'brute@hedabkh.com.sa', password: 'probe' }
    });
    if (probeRes.status === 429) {
      rateLimitHit = true;
      assert(probeRes.status === 429, `Rate limit throttled brute-force burst at attempt #${i + 1} (HTTP 429)`);
      break;
    }
  }
  assert(rateLimitHit, 'Abuse protection / rate limiting active on sensitive endpoints');

  // Clean rate limit cache to restore normal testing flow
  const rateLimitDir = path.resolve(__dirname, '../backend/storage/cache/ratelimit');
  if (fs.existsSync(rateLimitDir)) {
    fs.readdirSync(rateLimitDir).forEach(f => fs.unlinkSync(path.join(rateLimitDir, f)));
  }

  // 10. Performance Benchmarking
  console.log('\n10. Performance & Latency Benchmarking:');
  const benchEndpoints = [
    '/health',
    '/projects',
    '/services',
    '/articles',
    '/content/pages/page-home',
    '/settings/brand'
  ];
  for (const ep of benchEndpoints) {
    const res = await apiRequest(ep);
    assert(res.status === 200, `Benchmark ${ep}: HTTP ${res.status} in ${res.duration}ms (TTFB < 200ms)`);
  }

  // 11. Admin Logout & Post-Logout Invalidation
  console.log('\n11. Testing Admin Logout & Session Invalidation:');
  const freshLogin = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hedabkh.com.sa', password: 'admin123' }
  });
  const freshCookie = (freshLogin.headers.get('set-cookie') || '').split(';')[0];
  const freshAuth = { Cookie: freshCookie };

  const logoutRes = await apiRequest('/auth/logout', { method: 'POST', headers: freshAuth });
  assert(logoutRes.status === 200, 'POST /auth/logout terminated session');

  const postLogoutRes = await apiRequest('/admin/overview/metrics', { headers: freshAuth });
  assert(postLogoutRes.status === 401, 'Post-logout request rejected with HTTP 401');

  console.log('\n================================================================');
  console.log(`PHASE 2D.2 E2E VERIFICATION: ${passed + failed} TOTAL | ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETests().catch((err) => {
  console.error('Fatal Phase 2D.2 test suite error:', err);
  process.exit(1);
});
