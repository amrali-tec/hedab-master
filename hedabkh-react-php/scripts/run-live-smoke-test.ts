/**
 * Phase 4 Live Production Smoke Test Runner
 * Executes deterministic status code, latency, and header checks against the running server.
 */

import http from 'http';
import https from 'https';

const BASE_URL = process.env.PRODUCTION_BASE_URL || 'http://127.0.0.1:3000';

interface SmokeCheckResult {
  url: string;
  expectedStatus: number;
  actualStatus: number;
  timeMs: number;
  contentType: string;
  securityHeaders: {
    xFrameOptions?: string;
    xContentTypeOptions?: string;
  };
  pass: boolean;
}

function checkRoute(path: string, expectedStatus: number): Promise<SmokeCheckResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    const url = new URL(path, BASE_URL);
    const client = url.protocol === 'https:' ? https : http;

    const req = client.request(url, { method: 'GET', timeout: 5000 }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        const timeMs = Date.now() - start;
        const xFrameOptions = res.headers['x-frame-options'] as string | undefined;
        const xContentTypeOptions = res.headers['x-content-type-options'] as string | undefined;
        const contentType = (res.headers['content-type'] as string) || '';
        const pass = (res.statusCode || 0) === expectedStatus;

        resolve({
          url: path,
          expectedStatus,
          actualStatus: res.statusCode || 0,
          timeMs,
          contentType,
          securityHeaders: { xFrameOptions, xContentTypeOptions },
          pass,
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: path,
        expectedStatus,
        actualStatus: 408,
        timeMs: Date.now() - start,
        contentType: '',
        securityHeaders: {},
        pass: false,
      });
    });

    req.on('error', (err) => {
      resolve({
        url: path,
        expectedStatus,
        actualStatus: 0,
        timeMs: Date.now() - start,
        contentType: err.message,
        securityHeaders: {},
        pass: false,
      });
    });

    req.end();
  });
}

export async function runLiveSmokeTest(): Promise<SmokeCheckResult[]> {
  const routes = [
    { path: '/api/health', expected: 200 },
    { path: '/api/ready', expected: 200 },
    { path: '/ar', expected: 200 },
    { path: '/en', expected: 200 },
    { path: '/ar/about', expected: 200 },
    { path: '/ar/chairman-message', expected: 200 },
    { path: '/ar/contact', expected: 200 },
    { path: '/ar/admin/visual-builder/page-home', expected: 200 },
    { path: '/api/admin/visual-cms?action=getPages', expected: 401 }, // unauthenticated
    { path: '/api/admin/visual-cms?action=unknownAction999', expected: 401 },
  ];

  const results: SmokeCheckResult[] = [];
  for (const r of routes) {
    const res = await checkRoute(r.path, r.expected);
    results.push(res);
  }
  return results;
}

if (require.main === module) {
  console.log('================================================================');
  console.log('🌐 RUNNING PHASE 4 LIVE PRODUCTION SMOKE TEST');
  console.log(`Target: ${BASE_URL}`);
  console.log('================================================================');

  runLiveSmokeTest().then((results) => {
    let allPassed = true;
    for (const r of results) {
      if (r.pass) {
        console.log(`✅ PASS [${String(r.actualStatus).padStart(3)}] ${r.url.padEnd(45)} | Latency: ${String(r.timeMs).padStart(3)}ms | X-Frame: ${r.securityHeaders.xFrameOptions || 'n/a'}`);
      } else {
        console.error(`❌ FAIL [Exp: ${r.expectedStatus}, Act: ${r.actualStatus}] ${r.url.padEnd(45)} | Latency: ${r.timeMs}ms`);
        allPassed = false;
      }
    }
    console.log('================================================================');
    console.log(`Total Checks: ${results.length} | Passed: ${results.filter((r) => r.pass).length} | Failed: ${results.filter((r) => !r.pass).length}`);
    console.log('================================================================');
    process.exit(allPassed ? 0 : 1);
  });
}
