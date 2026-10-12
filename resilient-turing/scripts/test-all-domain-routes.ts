/**
 * Comprehensive Multi-Domain & Route Test Suite
 * Visual CMS Studio — Saudi Sovereign Infrastructure Platform
 * Probes all public and admin pages across both live domains:
 * 1. https://hedabkh.com.sa
 * 2. https://darkorchid-baboon-185531.hostingersite.com
 * Date: 2026-08-24
 */

import https from 'https';

interface RouteTestResult {
  domain: string;
  route: string;
  fullUrl: string;
  statusCode: number;
  contentType: string;
  contentLength: number;
  hstsHeader: boolean;
  responseTimeMs: number;
  status: 'PASS' | 'FAIL';
}

const DOMAINS = [
  'https://hedabkh.com.sa',
  'https://darkorchid-baboon-185531.hostingersite.com'
];

const ROUTES = [
  '/',
  '/ar',
  '/en',
  '/ar/about',
  '/en/about',
  '/ar/services',
  '/en/services',
  '/ar/projects',
  '/en/projects',
  '/ar/contact',
  '/en/contact',
  '/admin',
  '/ar/admin',
  '/en/admin',
  '/sitemap.xml',
  '/robots.txt'
];

function probeRoute(domain: string, route: string): Promise<RouteTestResult> {
  const fullUrl = `${domain}${route}`;
  const start = Date.now();

  return new Promise((resolve) => {
    const req = https.get(fullUrl, { rejectUnauthorized: false }, (res) => {
      const responseTimeMs = Date.now() - start;
      const statusCode = res.statusCode || 0;
      const contentType = (res.headers['content-type'] || '').split(';')[0];
      const contentLength = parseInt(res.headers['content-length'] || '0', 10);
      const hstsHeader = !!res.headers['strict-transport-security'];

      const isPass = statusCode >= 200 && statusCode < 400;

      resolve({
        domain,
        route,
        fullUrl,
        statusCode,
        contentType,
        contentLength,
        hstsHeader,
        responseTimeMs,
        status: isPass ? 'PASS' : 'FAIL',
      });
    });

    req.on('error', () => {
      const responseTimeMs = Date.now() - start;
      resolve({
        domain,
        route,
        fullUrl,
        statusCode: 0,
        contentType: 'none',
        contentLength: 0,
        hstsHeader: false,
        responseTimeMs,
        status: 'FAIL',
      });
    });

    req.setTimeout(8000, () => {
      req.destroy();
    });
  });
}

export async function runFullDomainRouteTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING COMPREHENSIVE DOMAIN ROUTE & ADMIN TEST SUITE [2026-08-24]');
  console.log('================================================================\n');

  const results: RouteTestResult[] = [];

  for (const domain of DOMAINS) {
    console.log(`\n🌐 Probing Domain: ${domain}`);
    console.log('----------------------------------------------------------------');

    for (const route of ROUTES) {
      const res = await probeRoute(domain, route);
      results.push(res);

      const icon = res.status === 'PASS' ? '✅' : '❌';
      console.log(
        `${icon} [${res.statusCode}] ${res.route.padEnd(16)} | ${(res.responseTimeMs + 'ms').padEnd(6)} | ${res.contentType} (${res.contentLength} B)`
      );
    }
  }

  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = total - passed;

  console.log('\n================================================================');
  console.log(`📊 FINAL ROUTE TEST SUMMARY: ${passed}/${total} PASSED`);
  console.log(`✅ Passed Routes: ${passed}`);
  console.log(`❌ Failed Routes: ${failed}`);
  console.log('================================================================\n');
}

if (require.main === module) {
  runFullDomainRouteTests().catch(console.error);
}
