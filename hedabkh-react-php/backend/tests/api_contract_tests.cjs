const http = require('http');

const BASE_URL = 'http://127.0.0.1:8000';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const reqHeaders = { ...headers };
    let payload = null;

    if (body) {
      payload = typeof body === 'string' ? body : JSON.stringify(body);
      reqHeaders['Content-Type'] = reqHeaders['Content-Type'] || 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: reqHeaders
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json
        });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('=== HEDABKH REST API AUTOMATED TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}\n  Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Health & Version
  await test('GET /api/v1/health returns 200 and database connected', async () => {
    const res = await request('GET', '/api/v1/health');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.database !== 'connected') throw new Error('DB not connected');
  });

  await test('GET /api/v1/version returns 200 and v1', async () => {
    const res = await request('GET', '/api/v1/version');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.version !== '1.0.0') throw new Error('Version mismatch');
  });

  // 2. Public Data Endpoints
  await test('GET /api/v1/projects returns 16 projects with pagination', async () => {
    const res = await request('GET', '/api/v1/projects');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 16) throw new Error(`Expected 16 projects, got ${res.body.data.length}`);
    if (!res.body.meta.pagination || res.body.meta.pagination.total !== 16) throw new Error('Pagination total mismatch');
  });

  await test('GET /api/v1/projects/proj-1 returns single project with features', async () => {
    const res = await request('GET', '/api/v1/projects/proj-1');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.id !== 'proj-1') throw new Error('ID mismatch');
    if (!res.body.data.features || res.body.data.features.length === 0) throw new Error('Missing features');
  });

  await test('GET /api/v1/services returns 6 services with features and sectors', async () => {
    const res = await request('GET', '/api/v1/services');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 6) throw new Error(`Expected 6 services, got ${res.body.data.length}`);
    if (!res.body.data[0].features || !res.body.data[0].sectors) throw new Error('Missing features/sectors');
  });

  await test('GET /api/v1/services/srv-1 returns single service', async () => {
    const res = await request('GET', '/api/v1/services/srv-1');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.id !== 'srv-1') throw new Error('ID mismatch');
  });

  await test('GET /api/v1/equipment returns 10 machinery items', async () => {
    const res = await request('GET', '/api/v1/equipment');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 10) throw new Error(`Expected 10 items, got ${res.body.data.length}`);
  });

  await test('GET /api/v1/certificates returns 12 certificates', async () => {
    const res = await request('GET', '/api/v1/certificates');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 12) throw new Error(`Expected 12 certs, got ${res.body.data.length}`);
  });

  await test('GET /api/v1/team returns 8 team members', async () => {
    const res = await request('GET', '/api/v1/team');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 8) throw new Error(`Expected 8 members, got ${res.body.data.length}`);
  });

  await test('GET /api/v1/partners returns 18 partners', async () => {
    const res = await request('GET', '/api/v1/partners');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 18) throw new Error(`Expected 18 partners, got ${res.body.data.length}`);
  });

  await test('GET /api/v1/articles returns 8 articles', async () => {
    const res = await request('GET', '/api/v1/articles');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 8) throw new Error(`Expected 8 articles, got ${res.body.data.length}`);
  });

  await test('GET /api/v1/articles/article-1 returns single article', async () => {
    const res = await request('GET', '/api/v1/articles/article-1');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.id !== 'article-1') throw new Error('ID mismatch');
  });

  await test('GET /api/v1/statistics returns 4 KPI stats', async () => {
    const res = await request('GET', '/api/v1/statistics');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 4) throw new Error(`Expected 4 stats, got ${res.body.data.length}`);
  });

  await test('GET /api/v1/timeline returns 6 milestones', async () => {
    const res = await request('GET', '/api/v1/timeline');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 6) throw new Error(`Expected 6 milestones, got ${res.body.data.length}`);
  });

  await test('GET /api/v1/regions returns 6 coverage regions', async () => {
    const res = await request('GET', '/api/v1/regions');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 6) throw new Error(`Expected 6 regions, got ${res.body.data.length}`);
  });

  await test('GET /api/v1/settings/brand returns brand identity', async () => {
    const res = await request('GET', '/api/v1/settings/brand');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (!res.body.data.companyNameAr && !res.body.data.nameAr) throw new Error('Missing brand data');
  });

  await test('GET /api/v1/settings/seo returns 10 SEO records', async () => {
    const res = await request('GET', '/api/v1/settings/seo');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.length !== 10) throw new Error(`Expected 10 SEO items, got ${res.body.data.length}`);
  });

  await test('POST /api/v1/inquiries submits new lead', async () => {
    const res = await request('POST', '/api/v1/inquiries', {
      name: 'عبدالله السعدون',
      email: 'a.alsaadoon@example.com',
      phone: '0509998888',
      message: 'طلب استشارة هندسية لتصريف السيول'
    });
    if (res.statusCode !== 201) throw new Error(`Status ${res.statusCode}`);
    if (!res.body.data.id) throw new Error('Missing created ID');
  });

  // 3. Visual CMS Public Endpoints
  await test('GET /api/v1/content/pages/page-home returns 10 blocks tree', async () => {
    const res = await request('GET', '/api/v1/content/pages/page-home');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.blocks.length !== 10) throw new Error(`Expected 10 blocks, got ${res.body.data.blocks.length}`);
  });

  await test('GET /api/v1/content/pages/page-about returns 6 blocks tree', async () => {
    const res = await request('GET', '/api/v1/content/pages/page-about');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.blocks.length !== 6) throw new Error(`Expected 6 blocks, got ${res.body.data.blocks.length}`);
  });

  await test('GET /api/v1/content/pages/page-chairman returns 6 blocks tree', async () => {
    const res = await request('GET', '/api/v1/content/pages/page-chairman');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.blocks.length !== 6) throw new Error(`Expected 6 blocks, got ${res.body.data.blocks.length}`);
  });

  await test('GET /api/v1/content/pages/page-contact returns 5 blocks tree', async () => {
    const res = await request('GET', '/api/v1/content/pages/page-contact');
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
    if (res.body.data.blocks.length !== 5) throw new Error(`Expected 5 blocks, got ${res.body.data.blocks.length}`);
  });

  // 4. Error & Security Tests
  await test('GET /api/v1/projects/proj-999 returns 404', async () => {
    const res = await request('GET', '/api/v1/projects/proj-999');
    if (res.statusCode !== 404) throw new Error(`Expected 404, got ${res.statusCode}`);
    if (res.body.success !== false) throw new Error('Expected success=false');
  });

  await test('POST /api/v1/inquiries with missing fields returns 422', async () => {
    const res = await request('POST', '/api/v1/inquiries', { name: '' });
    if (res.statusCode !== 422) throw new Error(`Expected 422, got ${res.statusCode}`);
  });

  await test('GET /api/v1/admin/overview/metrics without auth returns 401', async () => {
    const res = await request('GET', '/api/v1/admin/overview/metrics');
    if (res.statusCode !== 401) throw new Error(`Expected 401, got ${res.statusCode}`);
  });

  await test('POST /api/v1/admin/projects without auth returns 401', async () => {
    const res = await request('POST', '/api/v1/admin/projects', { title_ar: 'test' });
    if (res.statusCode !== 401) throw new Error(`Expected 401, got ${res.statusCode}`);
  });

  await test('SQL Injection attempt in search returns 200 and sanitized result', async () => {
    const res = await request('GET', "/api/v1/projects?search=' OR 1=1 --");
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.data.length > 16) throw new Error('SQL injection was executed!');
  });

  // 5. Admin Authentication & Protected Session
  let sessionCookie = '';
  await test('POST /api/v1/auth/login with valid credentials returns 200 and session', async () => {
    const res = await request('POST', '/api/v1/auth/login', {
      email: 'admin@hedabkh.com.sa',
      password: 'admin123'
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.data.user.email !== 'admin@hedabkh.com.sa') throw new Error('User mismatch');
    
    const setCookie = res.headers['set-cookie'];
    if (setCookie && setCookie.length > 0) {
      sessionCookie = setCookie[0].split(';')[0];
    }
  });

  await test('GET /api/v1/auth/session with session cookie returns active user', async () => {
    const res = await request('GET', '/api/v1/auth/session', null, {
      'Cookie': sessionCookie
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.data.user.email !== 'admin@hedabkh.com.sa') throw new Error('User mismatch');
  });

  await test('GET /api/v1/admin/overview/metrics with session cookie returns 200', async () => {
    const res = await request('GET', '/api/v1/admin/overview/metrics', null, {
      'Cookie': sessionCookie
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.body.data.projectsCount !== 16) throw new Error('Projects count mismatch');
  });

  await test('POST /api/v1/auth/logout terminates session', async () => {
    const res = await request('POST', '/api/v1/auth/logout', null, {
      'Cookie': sessionCookie
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
  });

  console.log(`\n========================================`);
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
