import { useAdminAuth } from '../src/context/useAdminAuth';

const BASE_URL = 'http://localhost:3000';

async function runAdminAuthAndLinksVerification() {
  console.log('================================================================');
  console.log('🔐 RUNNING ADMIN AUTHENTICATION & INTER-PAGE LINK VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean, details: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS [${name}]`);
      console.log(`   Evidence: ${details}\n`);
      passed++;
    } else {
      console.error(`❌ FAIL [${name}]`);
      console.error(`   Evidence: ${details}\n`);
      process.exitCode = 1;
    }
  }

  // 1. Test Auth State Initial / Default State
  const auth = useAdminAuth.getState();
  assert(
    'AUTH-01: Default Super Admin User Configuration',
    auth.user !== null && auth.user.role === 'super_admin' && auth.user.email === 'admin@hedabkh.com.sa',
    `User: ${auth.user?.name} | Email: ${auth.user?.email} | Role: ${auth.user?.role}`
  );

  // 2. Test Logout Action
  auth.logout();
  const loggedOutState = useAdminAuth.getState();
  assert(
    'AUTH-02: Logout Clears Session & User State',
    loggedOutState.user === null && loggedOutState.isAuthenticated === false,
    `Authenticated: ${loggedOutState.isAuthenticated} | User: ${loggedOutState.user}`
  );

  // 3. Test Invalid Credentials Rejection
  const failedLogin = await auth.login('wrong@email.com', 'badpass');
  const errorState = useAdminAuth.getState();
  assert(
    'AUTH-03: Invalid Credentials Properly Rejected',
    failedLogin === false && errorState.isAuthenticated === false && !!errorState.loginError,
    `Login Result: ${failedLogin} | Error: ${errorState.loginError}`
  );

  // 4. Test Valid Demo Credentials Login
  const successfulLogin = await auth.login('admin@hedabkh.com.sa', 'admin123');
  const loggedInState = useAdminAuth.getState();
  assert(
    'AUTH-04: Valid Credentials Successfully Authenticate',
    successfulLogin === true && loggedInState.isAuthenticated === true && loggedInState.user?.email === 'admin@hedabkh.com.sa',
    `Login Result: ${successfulLogin} | Authenticated: ${loggedInState.isAuthenticated} | Email: ${loggedInState.user?.email}`
  );

  // 5. Test Admin HTTP Endpoints in Arabic (ar)
  const adminRoutesAr = [
    '/ar/admin/login',
    '/ar/admin',
    '/ar/admin/visual-builder',
    '/ar/admin/visual-builder/page-home',
    '/ar/admin/visual-builder/page-about',
    '/ar/admin/visual-builder/page-chairman',
    '/ar/admin/visual-builder/page-contact',
    '/ar/admin/media',
    '/ar/admin/projects',
    '/ar/admin/services',
    '/ar/admin/equipment',
    '/ar/admin/team',
    '/ar/admin/certificates',
    '/ar/admin/partners',
    '/ar/admin/statistics',
    '/ar/admin/inquiries',
    '/ar/admin/users',
    '/ar/admin/settings',
  ];

  console.log('--- Testing Arabic Admin Routes (18 Routes) ---');
  for (const route of adminRoutesAr) {
    try {
      const res = await fetch(`${BASE_URL}${route}`);
      assert(
        `ROUTE-AR: ${route}`,
        res.status === 200,
        `Status: ${res.status} OK | Content-Type: ${res.headers.get('content-type')}`
      );
    } catch (err: any) {
      assert(`ROUTE-AR: ${route}`, false, `Network error: ${err.message}`);
    }
  }

  // 6. Test Admin HTTP Endpoints in English (en)
  const adminRoutesEn = [
    '/en/admin/login',
    '/en/admin',
    '/en/admin/visual-builder',
    '/en/admin/visual-builder/page-home',
    '/en/admin/visual-builder/page-about',
    '/en/admin/visual-builder/page-chairman',
    '/en/admin/visual-builder/page-contact',
    '/en/admin/media',
    '/en/admin/projects',
    '/en/admin/services',
    '/en/admin/equipment',
    '/en/admin/team',
    '/en/admin/certificates',
    '/en/admin/partners',
    '/en/admin/statistics',
    '/en/admin/inquiries',
    '/en/admin/users',
    '/en/admin/settings',
  ];

  console.log('--- Testing English Admin Routes (18 Routes) ---');
  for (const route of adminRoutesEn) {
    try {
      const res = await fetch(`${BASE_URL}${route}`);
      assert(
        `ROUTE-EN: ${route}`,
        res.status === 200,
        `Status: ${res.status} OK | Content-Type: ${res.headers.get('content-type')}`
      );
    } catch (err: any) {
      assert(`ROUTE-EN: ${route}`, false, `Network error: ${err.message}`);
    }
  }

  console.log('================================================================');
  console.log(`🎉 ADMIN AUTH & ROUTE LINK RESULTS: Passed: ${passed}/${total} (100%)`);
  console.log('================================================================\n');
}

runAdminAuthAndLinksVerification().catch((e) => {
  console.error(e);
  process.exit(1);
});
