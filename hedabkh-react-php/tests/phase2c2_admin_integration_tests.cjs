/**
 * HEDABKH Phase 2C.2 — Admin Integration, CRUD Lifecycle & Security Verification Suite
 * Native PHP 8.2 + MariaDB backend testing
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
  console.log('HEDABKH PHASE 2C.2 — ADMIN INTEGRATION & SECURITY TEST SUITE');
  console.log('================================================================\n');

  let sessionCookie = '';

  // 1. Authentication & Session Lifecycle
  console.log('1. Testing Authentication & Session Lifecycle:');
  
  // 1.1 Unauthenticated access to admin routes must return 401
  const unauthRes = await apiRequest('/admin/overview/metrics');
  assert(unauthRes.status === 401, 'Unauthenticated request to /admin/overview/metrics returns 401');

  // 1.2 Invalid login attempt
  const badLoginRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hedabkh.com.sa', password: 'wrongpassword' }
  });
  assert(badLoginRes.status === 401 || badLoginRes.status === 400, 'Invalid login credentials rejected');

  // 1.3 Successful login
  const loginRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hedabkh.com.sa', password: 'admin123' }
  });
  assert(loginRes.status === 200, 'Admin login returns 200 OK');
  assert(loginRes.data?.data?.user?.email === 'admin@hedabkh.com.sa', 'User identity matches');

  const cookieHeader = loginRes.headers.get('set-cookie');
  sessionCookie = cookieHeader ? cookieHeader.split(';')[0] : '';
  assert(!!sessionCookie, `Session cookie received: ${sessionCookie}`);

  // 1.4 Check session with cookie
  const sessionRes = await apiRequest('/auth/session', {
    headers: { Cookie: sessionCookie }
  });
  assert(sessionRes.status === 200, 'GET /auth/session with session cookie returns 200 OK');
  assert(sessionRes.data?.data?.user?.role === 'super_admin', 'User has super_admin role');

  const authHeader = { Cookie: sessionCookie };

  // 2. Admin Overview Metrics
  console.log('\n2. Testing Admin Overview Metrics:');
  const metricsRes = await apiRequest('/admin/overview/metrics', { headers: authHeader });
  assert(metricsRes.status === 200, 'GET /admin/overview/metrics returns 200 OK');
  assert(typeof metricsRes.data?.data?.projectsCount === 'number', 'Metrics includes projectsCount');

  // 3. Projects CRUD Lifecycle
  console.log('\n3. Testing Projects CRUD Lifecycle:');
  const newProjId = `test-proj-${Date.now()}`;
  const createProjRes = await apiRequest('/admin/projects', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: newProjId,
      title: 'مشروع اختبار الأتمتة الميداني',
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
  assert(createProjRes.status === 201 || createProjRes.status === 200, 'POST /admin/projects creates project');

  const updateProjRes = await apiRequest(`/admin/projects/${newProjId}`, {
    method: 'PUT',
    headers: authHeader,
    body: {
      title: 'مشروع اختبار الأتمتة المحدث',
      progress: 80
    }
  });
  assert(updateProjRes.status === 200, 'PUT /admin/projects/{id} updates project');

  const deleteProjRes = await apiRequest(`/admin/projects/${newProjId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  assert(deleteProjRes.status === 200, 'DELETE /admin/projects/{id} deletes project');

  // 4. Services CRUD Lifecycle
  console.log('\n4. Testing Services CRUD Lifecycle:');
  const newSrvId = `test-srv-${Date.now()}`;
  const createSrvRes = await apiRequest('/admin/services', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: newSrvId,
      title: 'خدمة اختبارية للشبكات',
      description: 'وصف الخدمة الهندسية الاختبارية',
      icon: 'barrier-icon',
      features: ['ميزة هندسية 1'],
      sectors: ['البنية التحتية']
    }
  });
  assert(createSrvRes.status === 201 || createSrvRes.status === 200, 'POST /admin/services creates service');

  const updateSrvRes = await apiRequest(`/admin/services/${newSrvId}`, {
    method: 'PUT',
    headers: authHeader,
    body: {
      title: 'خدمة اختبارية محدثة',
      description: 'وصف محدث للخدمة'
    }
  });
  assert(updateSrvRes.status === 200, 'PUT /admin/services/{id} updates service');

  const deleteSrvRes = await apiRequest(`/admin/services/${newSrvId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  assert(deleteSrvRes.status === 200, 'DELETE /admin/services/{id} deletes service');

  // 5. Equipment Fleet CRUD Lifecycle
  console.log('\n5. Testing Equipment Fleet CRUD Lifecycle:');
  const newEqId = `test-eq-${Date.now()}`;
  const createEqRes = await apiRequest('/admin/equipment', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: newEqId,
      nameAr: 'معدة كشط اختبارية',
      nameEn: 'Test Milling Machine',
      categoryAr: 'صيانة وكشط الطرق',
      categoryEn: 'Road Milling',
      model: 'W210-TEST',
      brand: 'Wirtgen',
      count: 2,
      image: '/images/equipment/wirtgen-milling-machine.jpg',
      specsAr: ['محرك ديزل هيدروليكي'],
      status: 'active'
    }
  });
  assert(createEqRes.status === 201 || createEqRes.status === 200, 'POST /admin/equipment creates equipment');

  const updateEqRes = await apiRequest(`/admin/equipment/${newEqId}`, {
    method: 'PUT',
    headers: authHeader,
    body: {
      nameAr: 'معدة كشط اختبارية محدثة',
      count: 3
    }
  });
  assert(updateEqRes.status === 200, 'PUT /admin/equipment/{id} updates equipment');

  const deleteEqRes = await apiRequest(`/admin/equipment/${newEqId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  assert(deleteEqRes.status === 200, 'DELETE /admin/equipment/{id} deletes equipment');

  // 6. Certificates CRUD Lifecycle
  console.log('\n6. Testing Certificates CRUD Lifecycle:');
  const newCertId = `test-cert-${Date.now()}`;
  const createCertRes = await apiRequest('/admin/certificates', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: newCertId,
      title: 'شهادة اعتماد اختبارية',
      issuer: 'هيئة المواصفات السعودية',
      issueDate: '2024-01-01',
      expiryDate: '2027-01-01',
      idNumber: 'CERT-TEST-99',
      type: 'iso',
      category: 'iso'
    }
  });
  assert(createCertRes.status === 201 || createCertRes.status === 200, 'POST /admin/certificates creates certificate');

  const deleteCertRes = await apiRequest(`/admin/certificates/${newCertId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  assert(deleteCertRes.status === 200, 'DELETE /admin/certificates/{id} deletes certificate');

  // 7. Team Members CRUD Lifecycle
  console.log('\n7. Testing Team Members CRUD Lifecycle:');
  const newTeamId = `test-team-${Date.now()}`;
  const createTeamRes = await apiRequest('/admin/team', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: newTeamId,
      name: 'مهندس اختباري',
      role: 'مهندس إشراف ميداني',
      bio: 'خبرة في متابعة أعمال البنية التحتية',
      image: '/images/team/team-1.jpg',
      sector: 'PROJECTS',
      badge: 'إشراف ميداني',
      experience: '+5 سنوات'
    }
  });
  assert(createTeamRes.status === 201 || createTeamRes.status === 200, 'POST /admin/team creates team member');

  const deleteTeamRes = await apiRequest(`/admin/team/${newTeamId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  assert(deleteTeamRes.status === 200, 'DELETE /admin/team/{id} deletes team member');

  // 8. Partners CRUD Lifecycle
  console.log('\n8. Testing Partners CRUD Lifecycle:');
  const newPartnerId = `test-partner-${Date.now()}`;
  const createPartnerRes = await apiRequest('/admin/partners', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: newPartnerId,
      nameAr: 'جهة شريكة اختبارية',
      nameEn: 'Test Partner Entity',
      categoryAr: 'جهة حكومية',
      categoryEn: 'Government Entity',
      badgeAr: 'شريك استراتيجي',
      badgeEn: 'Strategic Partner',
      projectsCount: 4,
      logoUrl: '/images/logos/balady-platform.png'
    }
  });
  assert(createPartnerRes.status === 201 || createPartnerRes.status === 200, 'POST /admin/partners creates partner');

  const deletePartnerRes = await apiRequest(`/admin/partners/${newPartnerId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  assert(deletePartnerRes.status === 200, 'DELETE /admin/partners/{id} deletes partner');

  // 9. Articles CRUD Lifecycle
  console.log('\n9. Testing Articles CRUD Lifecycle:');
  const newArticleId = `test-art-${Date.now()}`;
  const newArticleSlug = `test-art-slug-${Date.now()}`;
  const createArticleRes = await apiRequest('/admin/articles', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: newArticleId,
      slug: newArticleSlug,
      titleAr: 'مقال اختباري للأتمتة',
      titleEn: 'Automation Test Article',
      excerptAr: 'موجز المقال الاختباري',
      excerptEn: 'Excerpt of test article',
      contentAr: '<p>محتوى المقال الاختباري</p>',
      contentEn: '<p>Content of test article</p>',
      category: 'news',
      categoryAr: 'أخبار الشركة',
      categoryEn: 'Company News',
      coverImage: '/images/news/news-1.jpg',
      status: 'published'
    }
  });
  assert(createArticleRes.status === 201 || createArticleRes.status === 200, 'POST /admin/articles creates article');

  const deleteArticleRes = await apiRequest(`/admin/articles/${newArticleId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  assert(deleteArticleRes.status === 200, 'DELETE /admin/articles/{id} deletes article');

  // 10. Statistics KPI Management
  console.log('\n10. Testing Statistics KPI Update:');
  const updateStatRes = await apiRequest('/admin/statistics/stat-1', {
    method: 'PUT',
    headers: authHeader,
    body: {
      label: 'عقود وطنية منجزة ومستمرة',
      value: 125,
      prefix: '+',
      suffix: 'مشروع'
    }
  });
  assert(updateStatRes.status === 200, 'PUT /admin/statistics/stat-1 updates KPI statistic');

  // 11. Inquiries Management
  console.log('\n11. Testing Inquiries Management:');
  // Create an inquiry first
  const newInqRes = await apiRequest('/inquiries', {
    method: 'POST',
    body: {
      name: 'سالم الدوسري',
      email: 'salem@example.com',
      phone: '0555555555',
      message: 'طلب عرض سعر تجريبي لاختبار دورة حياة الاستفسار'
    }
  });
  assert(newInqRes.status === 201, 'POST /inquiries creates inquiry');
  const createdInqId = newInqRes.data?.data?.id;

  const patchInqRes = await apiRequest(`/admin/inquiries/${createdInqId}/status`, {
    method: 'PATCH',
    headers: authHeader,
    body: { status: 'in_progress' }
  });
  assert(patchInqRes.status === 200, 'PATCH /admin/inquiries/{id}/status updates inquiry status');

  const deleteInqRes = await apiRequest(`/admin/inquiries/${createdInqId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  assert(deleteInqRes.status === 200, 'DELETE /admin/inquiries/{id} deletes inquiry');

  // 12. Settings Management
  console.log('\n12. Testing Settings Management:');
  const getSettingsRes = await apiRequest('/admin/settings', { headers: authHeader });
  assert(getSettingsRes.status === 200, 'GET /admin/settings returns 200 OK');

  const updateBrandRes = await apiRequest('/admin/settings/brand', {
    method: 'PUT',
    headers: authHeader,
    body: {
      companyNameAr: 'شركة هضاب الخليج للمقاولات',
      commercialRegistration: '1010720712'
    }
  });
  assert(updateBrandRes.status === 200, 'PUT /admin/settings/brand updates brand identity');

  // 13. Visual CMS Lifecycle
  console.log('\n13. Testing Visual CMS Lifecycle:');
  const getCmsPagesRes = await apiRequest('/admin/cms/pages', { headers: authHeader });
  assert(getCmsPagesRes.status === 200, 'GET /admin/cms/pages returns 200 OK');

  const getPageDetailRes = await apiRequest('/admin/cms/pages/page-home', { headers: authHeader });
  assert(getPageDetailRes.status === 200, 'GET /admin/cms/pages/page-home returns 200 OK');
  assert(Array.isArray(getPageDetailRes.data?.data?.blocks), 'Page has blocks array');

  const saveDraftRes = await apiRequest('/admin/cms/pages/page-home/draft', {
    method: 'POST',
    headers: authHeader,
    body: {
      blocks: getPageDetailRes.data.data.blocks,
      note: 'مسودة اختبارية آلية'
    }
  });
  assert(saveDraftRes.status === 200, 'POST /admin/cms/pages/page-home/draft saves draft');

  const publishRes = await apiRequest('/admin/cms/pages/page-home/publish', {
    method: 'POST',
    headers: authHeader,
    body: { note: 'نشر نسبي اختباري' }
  });
  assert(publishRes.status === 200, 'POST /admin/cms/pages/page-home/publish publishes page');

  // 14. Admin Users & RBAC
  console.log('\n14. Testing Admin Users & RBAC Management:');
  const newUserId = `test-usr-${Date.now()}`;
  const createUserRes = await apiRequest('/admin/users', {
    method: 'POST',
    headers: authHeader,
    body: {
      id: newUserId,
      name: 'مستخدم اختباري',
      email: `test-${Date.now()}@hedabkh.com.sa`,
      role: 'project_manager',
      status: 'active',
      avatar: '/images/team/team-1.jpg',
      password: 'TemporaryPass123!'
    }
  });
  assert(createUserRes.status === 201 || createUserRes.status === 200, 'POST /admin/users creates admin user');

  const deleteUserRes = await apiRequest(`/admin/users/${newUserId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  assert(deleteUserRes.status === 200, 'DELETE /admin/users/{id} deletes admin user');

  // 15. Activity Logs
  console.log('\n15. Testing Activity Audit Logs:');
  const logsRes = await apiRequest('/admin/logs', { headers: authHeader });
  assert(logsRes.status === 200, 'GET /admin/logs returns 200 OK');
  assert(Array.isArray(logsRes.data?.data), 'Activity logs data is an array');

  // 16. Security & Input Sanitization
  console.log('\n16. Testing Security, SQL Injection Resistance & 404 Handling:');
  const sqliRes = await apiRequest(`/projects?search=${encodeURIComponent("' OR 1=1 --")}`);
  assert(sqliRes.status === 200, 'SQL injection probe safely handled without SQL errors');

  const notFoundRes = await apiRequest('/admin/projects/non-existent-id-99999', { headers: authHeader });
  assert(notFoundRes.status === 404 || notFoundRes.status === 200, 'Non-existent item handled gracefully');

  // 17. Logout
  console.log('\n17. Testing Admin Logout:');
  const logoutRes = await apiRequest('/auth/logout', {
    method: 'POST',
    headers: authHeader
  });
  assert(logoutRes.status === 200, 'POST /auth/logout terminates active session');

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
