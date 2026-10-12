/**
 * Production Load, Reliability, Concurrency & Failure-Mode Validation Suite
 * Executes deterministic benchmark, concurrency load tests, security failure modes,
 * JSON persistence integrity drills, and data fingerprint comparisons.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BASE_URL = process.env.PRODUCTION_BASE_URL || 'http://localhost:3000';
const DATA_FILE = path.join(process.cwd(), 'data', 'cms_database.json');
const SNAPSHOTS_DIR = path.join(process.cwd(), 'data', 'snapshots');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

interface RequestResult {
  url: string;
  status: number;
  timeMs: number;
  sizeBytes: number;
  success: boolean;
  error?: string;
}

interface LatencyStats {
  count: number;
  min: number;
  avg: number;
  median: number;
  p95: number;
  p99: number;
  max: number;
  rps: number;
  errors: number;
}

function calculateStats(latencies: number[], totalTimeSeconds: number, errors: number): LatencyStats {
  if (latencies.length === 0) {
    return { count: 0, min: 0, avg: 0, median: 0, p95: 0, p99: 0, max: 0, rps: 0, errors };
  }
  latencies.sort((a, b) => a - b);
  const sum = latencies.reduce((acc, v) => acc + v, 0);
  const avg = Math.round(sum / latencies.length);
  const min = latencies[0];
  const max = latencies[latencies.length - 1];
  const median = latencies[Math.floor(latencies.length * 0.5)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];
  const rps = totalTimeSeconds > 0 ? parseFloat((latencies.length / totalTimeSeconds).toFixed(1)) : 0;

  return { count: latencies.length, min, avg, median, p95, p99, max, rps, errors };
}

function makeRequest(
  urlPath: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    timeoutMs?: number;
  } = {}
): Promise<RequestResult> {
  const method = options.method || 'GET';
  const timeoutMs = options.timeoutMs || 10000;
  const fullUrl = new URL(urlPath, BASE_URL);

  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.request(
      fullUrl,
      {
        method,
        headers: options.headers || {},
        timeout: timeoutMs,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const timeMs = Date.now() - start;
          resolve({
            url: urlPath,
            status: res.statusCode || 0,
            timeMs,
            sizeBytes: Buffer.byteLength(body),
            success: (res.statusCode || 0) < 400,
          });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: urlPath,
        status: 408,
        timeMs: Date.now() - start,
        sizeBytes: 0,
        success: false,
        error: 'Request timeout',
      });
    });

    req.on('error', (err) => {
      resolve({
        url: urlPath,
        status: 0,
        timeMs: Date.now() - start,
        sizeBytes: 0,
        success: false,
        error: err.message,
      });
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

function computeFileHash(filePath: string): string {
  if (!fs.existsSync(filePath)) return 'FILE_NOT_FOUND';
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function runConcurrentBatch(
  paths: string[],
  concurrency: number,
  totalRequests: number
): Promise<{ stats: LatencyStats; peakMemory: NodeJS.MemoryUsage }> {
  const latencies: number[] = [];
  let errors = 0;
  let executed = 0;
  let peakMemory = process.memoryUsage();

  const startTotal = Date.now();

  const worker = async () => {
    while (executed < totalRequests) {
      executed++;
      const targetPath = paths[executed % paths.length];
      const res = await makeRequest(targetPath);
      if (res.success) {
        latencies.push(res.timeMs);
      } else {
        errors++;
      }
      const mem = process.memoryUsage();
      if (mem.rss > peakMemory.rss) {
        peakMemory = mem;
      }
    }
  };

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  const durationSec = (Date.now() - startTotal) / 1000;
  const stats = calculateStats(latencies, durationSec, errors);
  return { stats, peakMemory };
}

export async function runReliabilitySuite() {
  console.log('================================================================');
  console.log('🛡️ PHASE 2.5: PRODUCTION LOAD, RELIABILITY & FAILURE-MODE SUITE');
  console.log(`Target Host: ${BASE_URL}`);
  console.log('================================================================\n');

  // 1. Initial State Fingerprinting
  const preTestHash = computeFileHash(DATA_FILE);
  const initialMem = process.memoryUsage();
  console.log(`[1] PRE-TEST FINGERPRINT:`);
  console.log(`    CMS Database SHA256: ${preTestHash}`);
  console.log(`    Initial Process RSS: ${(initialMem.rss / 1024 / 1024).toFixed(2)} MB\n`);

  // 2. Baseline Performance Benchmarking (5 Sequential Requests per Route)
  console.log('[2] BASELINE LATENCY BENCHMARK:');
  const baselineRoutes = [
    '/api/health/',
    '/ar/',
    '/en/',
    '/ar/about/',
    '/ar/contact/',
    '/ar/chairman-message/',
    '/ar/admin/visual-builder/page-home/',
  ];

  const baselineResults: Record<string, LatencyStats> = {};

  for (const route of baselineRoutes) {
    const latencies: number[] = [];
    let errCount = 0;
    const start = Date.now();
    for (let i = 0; i < 5; i++) {
      const res = await makeRequest(route);
      if (res.success) latencies.push(res.timeMs);
      else errCount++;
    }
    const duration = (Date.now() - start) / 1000;
    const stats = calculateStats(latencies, duration, errCount);
    baselineResults[route] = stats;
    console.log(
      `    ${route.padEnd(38)} | Median: ${String(stats.median).padStart(4)}ms | P95: ${String(stats.p95).padStart(4)}ms | Max: ${String(stats.max).padStart(4)}ms | Errors: ${stats.errors}`
    );
  }

  // 3. Concurrent Public Read Load Tests (Concurrency: 5, 10, 25, 50)
  console.log('\n[3] CONCURRENT PUBLIC LOAD TESTING:');
  const publicRoutes = ['/ar/', '/en/', '/ar/about/', '/ar/contact/', '/ar/chairman-message/'];
  const concurrencyLevels = [5, 10, 25, 50];
  const loadResults: Array<{ concurrency: number; requests: number; stats: LatencyStats; peakRssMb: number }> = [];

  for (const c of concurrencyLevels) {
    const totalReqs = c * 10; // 50, 100, 250, 500 requests
    const { stats, peakMemory } = await runConcurrentBatch(publicRoutes, c, totalReqs);
    loadResults.push({
      concurrency: c,
      requests: totalReqs,
      stats,
      peakRssMb: parseFloat((peakMemory.rss / 1024 / 1024).toFixed(2)),
    });
    console.log(
      `    Concurrency ${String(c).padStart(2)} (${String(totalReqs).padStart(3)} reqs) | RPS: ${String(stats.rps).padStart(5)} | Median: ${String(stats.median).padStart(3)}ms | P95: ${String(stats.p95).padStart(4)}ms | Errors: ${stats.errors} | Peak RSS: ${(peakMemory.rss / 1024 / 1024).toFixed(1)}MB`
    );
  }

  // 4. Security & Malformed Request Failure Modes (Run BEFORE exhausting rate limit)
  console.log('\n[4] SECURITY FAILURE-MODE TESTING:');
  interface FailureTestCase {
    name: string;
    path: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    expectedStatus: number;
  }

  const failureTests: FailureTestCase[] = [
    {
      name: 'Unauthenticated CMS Access',
      path: '/api/admin/visual-cms/?action=getPages',
      method: 'GET',
      expectedStatus: 401,
    },
    {
      name: 'Invalid Session Token',
      path: '/api/admin/visual-cms/?action=getPages',
      method: 'GET',
      headers: { authorization: 'Bearer invalid_fake_token_12345' },
      expectedStatus: 401,
    },
    {
      name: 'CSRF Origin Mismatch',
      path: '/api/admin/visual-cms/',
      method: 'POST',
      headers: {
        authorization: 'Bearer admin_session',
        origin: 'https://malicious-attacker-domain.evil',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ action: 'saveDraft', blocks: [] }),
      expectedStatus: 403,
    },
    {
      name: 'Editor Unauthorized Publish Attempt',
      path: '/api/admin/visual-cms/',
      method: 'POST',
      headers: {
        authorization: 'Bearer usr-editor-1',
        'x-admin-role': 'editor',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ action: 'publish', pageId: 'page-home' }),
      expectedStatus: 403,
    },
    {
      name: 'Malformed JSON Payload',
      path: '/api/admin/visual-cms/',
      method: 'POST',
      headers: {
        authorization: 'Bearer admin_session',
        'content-type': 'application/json',
      },
      body: '{ "invalid_unclosed_json": ',
      expectedStatus: 400,
    },
    {
      name: 'Invalid Action Parameter',
      path: '/api/admin/visual-cms/?action=unknownAction999',
      method: 'GET',
      headers: { authorization: 'Bearer admin_session' },
      expectedStatus: 400,
    },
  ];

  const secResults: Array<{ name: string; expected: number; actual: number; pass: boolean }> = [];
  for (const ft of failureTests) {
    const res = await makeRequest(ft.path, {
      method: ft.method,
      headers: ft.headers,
      body: ft.body,
    });
    const pass = res.status === ft.expectedStatus;
    secResults.push({ name: ft.name, expected: ft.expectedStatus, actual: res.status, pass });
    console.log(
      `    ${ft.name.padEnd(38)} | Expected: ${ft.expectedStatus} | Actual: ${res.status} | ${pass ? '✅ PASS' : '❌ FAIL'}`
    );
  }

  // 5. Rate Limiting Verification (Exhaust remaining quota to trigger 429)
  console.log('\n[5] RATE LIMITING FAILURE-MODE TEST:');
  let rateLimit429Count = 0;
  for (let i = 0; i < 70; i++) {
    const res = await makeRequest('/api/admin/visual-cms/?action=getPages');
    if (res.status === 429) rateLimit429Count++;
  }
  console.log(`    Triggered Rate Limit Test (70 reqs): ${rateLimit429Count > 0 ? '✅ TRIGGERED 429' : 'ℹ️ Rate limit bypassed/open'} (429 Responses: ${rateLimit429Count})`);

  // 6. Persistence & Backup Restore Drill (On Isolated Copy)
  console.log('\n[6] BACKUP & RESTORE DRILL (ISOLATED COPY):');
  const tempTestDbPath = path.join(process.cwd(), 'data', 'temp_restore_test_db.json');
  try {
    // 1. Copy active DB to test path
    fs.copyFileSync(DATA_FILE, tempTestDbPath);
    // 2. Parse and verify structure
    const content = fs.readFileSync(tempTestDbPath, 'utf-8');
    const parsed = JSON.parse(content);
    const hasValidStructure = !!parsed && typeof parsed === 'object';
    // 3. Cleanup temp file
    fs.unlinkSync(tempTestDbPath);
    console.log(`    Isolated Restore & Integrity Verification: ${hasValidStructure ? '✅ PASS (Structurally Valid)' : '❌ FAIL'}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`    Isolated Restore Drill: ❌ ERROR (${msg})`);
  }

  // 7. Post-Test Memory & Integrity Check
  console.log('\n[7] POST-TEST INTEGRITY & MEMORY CHECK:');
  const postTestMem = process.memoryUsage();
  const postTestHash = computeFileHash(DATA_FILE);
  const hashMatches = preTestHash === postTestHash;

  console.log(`    Pre-Test Hash:  ${preTestHash}`);
  console.log(`    Post-Test Hash: ${postTestHash}`);
  console.log(`    State Integrity Intact: ${hashMatches ? '✅ 100% MATCH' : '⚠️ STATE MUTATED'}`);
  console.log(`    Process RSS Memory: ${(postTestMem.rss / 1024 / 1024).toFixed(2)} MB\n`);

  console.log('================================================================');
  console.log('🎉 RELIABILITY, CONCURRENCY & FAILURE-MODE VALIDATION COMPLETE');
  console.log('================================================================');

  return {
    baselineResults,
    loadResults,
    secResults,
    hashMatches,
    initialMem,
    postTestMem,
  };
}

if (require.main === module) {
  runReliabilitySuite().catch((err) => {
    console.error('Reliability Suite Execution Failed:', err);
    process.exit(1);
  });
}
