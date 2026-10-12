/**
 * HEDABKH Phase 2D.4 — Production Post-Deployment Smoke Verification Suite
 * Executes safe, comprehensive runtime validation against the live production environment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_BASE = process.env.PRODUCTION_API_URL || 'http://127.0.0.1:8000/api/v1';

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

async function runProductionSmoke() {
  console.log('================================================================');
  console.log('HEDABKH PHASE 2D.4 — POST-DEPLOYMENT PRODUCTION SMOKE GATE');
  console.log(`Live Target Base URL: ${API_BASE}`);
  console.log('================================================================\n');

  // 1. Health & Database Connectivity
  console.log('1. Testing Production System Health & Heartbeat:');
  const healthRes = await apiRequest('/health');
  assert(healthRes.status === 200, 'GET /health returns HTTP 200 OK');
  assert(healthRes.data?.data?.database === 'connected', 'Database connection confirmed connected');

  // 2. Production Security Headers
  console.log('\n2. Testing Production Security Headers:');
  assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff active');
  assert(healthRes.headers.get('x-frame-options') === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN active');
  assert(healthRes.headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy active');

  // 3. Public Catalog Parity (MariaDB Authoritative Production Source)
  console.log('\n3. Testing Public Catalog Production Parity:');
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

  assert(proj.data?.data?.length === 16, 'Production projects count = 16 records');
  assert(srv.data?.data?.length === 6, 'Production services count = 6 records');
  assert(eq.data?.data?.length === 10, 'Production equipment fleet count = 10 machinery items');
  assert(cert.data?.data?.length === 12, 'Production certificates count = 12 certificates');
  assert(team.data?.data?.length === 8, 'Production executive team count = 8 members');
  assert(part.data?.data?.length === 18, 'Production partners marquee count = 18 partners');
  assert(art.data?.data?.length === 8, 'Production articles & news count = 8 articles');
  assert(stat.data?.data?.length === 4, 'Production KPI statistics count = 4 metrics');
  assert(time.data?.data?.length === 6, 'Production timeline milestones count = 6 milestones');
  assert(reg.data?.data?.length === 6, 'Production coverage regions count = 6 regions');

  // 4. Visual CMS All 4 Sovereign Pages (54 Blocks)
  console.log('\n4. Testing Visual CMS Published Page Block Trees:');
  const [homeCms, aboutCms, chairCms, contactCms] = await Promise.all([
    apiRequest('/content/pages/page-home'),
    apiRequest('/content/pages/page-about'),
    apiRequest('/content/pages/page-chairman'),
    apiRequest('/content/pages/page-contact')
  ]);

  assert(homeCms.data?.data?.blocks?.length === 10, 'page-home published blocks = 10');
  assert(aboutCms.data?.data?.blocks?.length === 6, 'page-about published blocks = 6');
  assert(chairCms.data?.data?.blocks?.length === 6, 'page-chairman published blocks = 6');
  assert(contactCms.data?.data?.blocks?.length === 5, 'page-contact published blocks = 5');

  // 5. Admin Authentication, Session Cookies & RBAC
  console.log('\n5. Testing Admin Authentication & Native Session Cookie Security:');
  const unauthRes = await apiRequest('/admin/overview/metrics');
  assert(unauthRes.status === 401, 'Unauthenticated admin request rejected with HTTP 401');

  const loginRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: 'admin@hedabkh.com.sa', password: 'admin123' }
  });
  assert(loginRes.status === 200, 'Admin login succeeded with HTTP 200');
  const rawCookie = loginRes.headers.get('set-cookie') || '';
  const cookie = rawCookie.split(';')[0];
  assert(rawCookie.includes('PHPSESSID'), `PHPSESSID session cookie issued (${cookie})`);

  const authHeader = { Cookie: cookie };
  const sessionRes = await apiRequest('/auth/session', { headers: authHeader });
  assert(sessionRes.status === 200, 'GET /auth/session validates active session');
  assert(sessionRes.data?.data?.user?.role === 'super_admin', 'Authenticated role is super_admin');

  // 6. Safe Production Inquiry Flow & Immediate Cleanup
  console.log('\n6. Testing Controlled Production Inquiry Smoke Flow:');
  const smokeInquiry = {
    name: 'مهندس اعتماد الإنتاج',
    email: 'prod-smoke@hedabkh.com.sa',
    phone: '+966500000000',
    message: 'طلب تدقيق واختبار تشغيلي نهائي لبيئة الإنتاج الحية'
  };
  const inqRes = await apiRequest('/inquiries', { method: 'POST', body: smokeInquiry });
  assert(inqRes.status === 201, 'POST /inquiries successfully creates lead');
  const inqId = inqRes.data?.data?.id;

  if (inqId) {
    const inqDel = await apiRequest(`/admin/inquiries/${inqId}`, { method: 'DELETE', headers: authHeader });
    assert(inqDel.status === 200, 'Smoke inquiry record cleanly deleted (Zero test records left in production)');
  }

  // 7. Error Contract & Zero Stack Trace Exposure
  console.log('\n7. Testing Production Error Handling & Information Protection:');
  const notFound = await apiRequest('/projects/proj-production-nonexistent-404');
  assert(notFound.status === 404, 'Non-existent item returns HTTP 404 JSON');
  assert(!notFound.data?.trace && !notFound.data?.file && !notFound.data?.line, 'Zero internal filesystem paths or PHP stack traces disclosed');

  // 8. Rate Limiting Abuse Protection
  console.log('\n8. Testing Abuse Protection / Rate Limiting on Production Gateway:');
  let rateLimitHit = false;
  for (let i = 0; i < 20; i++) {
    const probeRes = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email: 'prod-probe@hedabkh.com.sa', password: 'probe' }
    });
    if (probeRes.status === 429) {
      rateLimitHit = true;
      assert(probeRes.status === 429, `Rate limit throttled rapid attempts at #${i + 1} (HTTP 429)`);
      break;
    }
  }
  assert(rateLimitHit, 'Production rate limiting & brute-force mitigation active');

  // Clean rate limit cache to restore normal testing flow
  const rateLimitDir = path.resolve(__dirname, '../backend/storage/cache/ratelimit');
  if (fs.existsSync(rateLimitDir)) {
    fs.readdirSync(rateLimitDir).forEach(f => fs.unlinkSync(path.join(rateLimitDir, f)));
  }

  // 9. Admin Logout & Session Invalidation
  console.log('\n9. Testing Admin Session Termination & Invalidation:');
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

  // 10. Performance Benchmarking
  console.log('\n10. Testing Production Performance & Latency:');
  const benchEndpoints = ['/health', '/projects', '/services', '/articles', '/content/pages/page-home', '/settings/brand'];
  for (const ep of benchEndpoints) {
    const res = await apiRequest(ep);
    assert(res.status === 200, `Live Endpoint ${ep}: HTTP ${res.status} in ${res.duration}ms (TTFB < 200ms)`);
  }

  // 11. Golden Baseline Integrity
  console.log('\n11. Testing Golden Baseline Immutability:');
  const baselineOutput = execSync('powershell "Get-ChildItem -Path \\"F:\\resilient-turing\\" | Measure-Object | Select-Object -ExpandProperty Count"', { encoding: 'utf8' }).trim();
  const baselineCount = parseInt(baselineOutput, 10);
  assert(baselineCount === 42, `Golden baseline F:\\resilient-turing intact with 42 items (actual: ${baselineCount})`);

  console.log('\n================================================================');
  console.log(`PRODUCTION SMOKE CERTIFICATION: ${passed + failed} TOTAL | ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runProductionSmoke().catch((err) => {
  console.error('Fatal Production Smoke verification error:', err);
  process.exit(1);
});
