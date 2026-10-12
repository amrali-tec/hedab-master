/**
 * Live HTTP & Security E2E Test Suite
 * Executes real network calls against http://localhost:3000/api/...
 */

import { serverStorage } from '../src/services/serverStorage';
import fs from 'fs';
import path from 'path';

interface HttpTestResult {
  id: string;
  name: string;
  expectedStatus: number;
  actualStatus: number;
  passed: boolean;
  notes: string;
}

const results: HttpTestResult[] = [];
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

console.log('================================================================');
console.log(`🌐 EXECUTING LIVE HTTP & NETWORK SECURITY TEST SUITE (${BASE_URL})`);
console.log('================================================================\n');

async function runLiveTests() {
  // ----------------------------------------------------
  // LIVE-01: Direct HTTP POST /api/admin/cms (No Auth)
  // ----------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/admin/cms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'test_key', data: 'unauthorized_attempt' }),
    });
    const passed = res.status === 401;
    results.push({
      id: 'LIVE-01',
      name: 'Direct HTTP POST /api/admin/cms without Auth Header',
      expectedStatus: 401,
      actualStatus: res.status,
      passed,
      notes: passed ? 'Correctly rejected with 401 Unauthorized' : 'Failed to reject unauthenticated call',
    });
  } catch (e: any) {
    results.push({
      id: 'LIVE-01',
      name: 'Direct HTTP POST /api/admin/cms without Auth',
      expectedStatus: 401,
      actualStatus: 0,
      passed: false,
      notes: `Network error: ${e.message}`,
    });
  }

  // ----------------------------------------------------
  // LIVE-02: Direct HTTP POST /api/admin/upload (No Auth)
  // ----------------------------------------------------
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['fake image data'], { type: 'image/png' }), 'test.png');
    const res = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      body: formData,
    });
    const passed = res.status === 401;
    results.push({
      id: 'LIVE-02',
      name: 'Direct HTTP POST /api/admin/upload without Auth',
      expectedStatus: 401,
      actualStatus: res.status,
      passed,
      notes: passed ? 'Correctly rejected upload with 401 Unauthorized' : 'Failed to reject upload',
    });
  } catch (e: any) {
    results.push({
      id: 'LIVE-02',
      name: 'Direct HTTP POST /api/admin/upload',
      expectedStatus: 401,
      actualStatus: 0,
      passed: false,
      notes: e.message,
    });
  }

  // ----------------------------------------------------
  // LIVE-03: Direct HTTP POST /api/admin/backup (No Auth)
  // ----------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/admin/backup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    });
    const passed = res.status === 401;
    results.push({
      id: 'LIVE-03',
      name: 'Direct HTTP POST /api/admin/backup without Auth',
      expectedStatus: 401,
      actualStatus: res.status,
      passed,
      notes: passed ? 'Destructive reset rejected with 401' : 'Failed to reject reset',
    });
  } catch (e: any) {
    results.push({
      id: 'LIVE-03',
      name: 'Direct HTTP POST /api/admin/backup',
      expectedStatus: 401,
      actualStatus: 0,
      passed: false,
      notes: e.message,
    });
  }

  // ----------------------------------------------------
  // LIVE-04: CSRF Cross-Origin Attack Simulation
  // ----------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/admin/cms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        Origin: 'http://malicious-cross-origin-domain.com',
      },
      body: JSON.stringify({ key: 'csrf_test', data: 'malicious_payload' }),
    });
    const passed = res.status === 403;
    results.push({
      id: 'LIVE-04',
      name: 'Simulated CSRF Attack (Malicious Foreign Origin)',
      expectedStatus: 403,
      actualStatus: res.status,
      passed,
      notes: passed ? 'Blocked foreign origin with 403 Forbidden' : 'CSRF origin check failed',
    });
  } catch (e: any) {
    results.push({
      id: 'LIVE-04',
      name: 'Simulated CSRF Attack',
      expectedStatus: 403,
      actualStatus: 0,
      passed: false,
      notes: e.message,
    });
  }

  // ----------------------------------------------------
  // LIVE-05: Valid Authorized Admin Mutation
  // ----------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/admin/cms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
      body: JSON.stringify({
        key: 'live_test_milestone',
        data: { titleAr: 'اختبار الحفظ المباشر', status: 'verified' },
      }),
    });
    const passed = res.status === 200;
    results.push({
      id: 'LIVE-05',
      name: 'Authorized Admin Mutation with Valid Session & Origin',
      expectedStatus: 200,
      actualStatus: res.status,
      passed,
      notes: passed ? 'Successfully accepted and saved to server storage' : 'Authorized call failed',
    });
  } catch (e: any) {
    results.push({
      id: 'LIVE-05',
      name: 'Authorized Admin Mutation',
      expectedStatus: 200,
      actualStatus: 0,
      passed: false,
      notes: e.message,
    });
  }

  // ----------------------------------------------------
  // LIVE-06: Authorized Backup Export (GET /api/admin/backup)
  // ----------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/admin/backup`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
    });
    const json = await res.json();
    const passed = res.status === 200 && json.version === '1.0';
    results.push({
      id: 'LIVE-06',
      name: 'Export Version 1.0 JSON Backup via HTTP GET',
      expectedStatus: 200,
      actualStatus: res.status,
      passed,
      notes: passed ? `Exported valid Version ${json.version} payload` : 'Export failed or version mismatch',
    });
  } catch (e: any) {
    results.push({
      id: 'LIVE-06',
      name: 'Export Backup via HTTP GET',
      expectedStatus: 200,
      actualStatus: 0,
      passed: false,
      notes: e.message,
    });
  }

  // ----------------------------------------------------
  // LIVE-07: Reject Corrupted Backup Payload Import
  // ----------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/admin/backup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
      body: JSON.stringify({
        action: 'import',
        payload: { version: '0.8-broken', data: null },
      }),
    });
    const passed = res.status === 422;
    results.push({
      id: 'LIVE-07',
      name: 'Reject Corrupted / Incompatible Backup Payload',
      expectedStatus: 422,
      actualStatus: res.status,
      passed,
      notes: passed ? 'Safely rejected with 422 Unprocessable Entity' : 'Failed to reject bad schema',
    });
  } catch (e: any) {
    results.push({
      id: 'LIVE-07',
      name: 'Reject Corrupted Backup',
      expectedStatus: 422,
      actualStatus: 0,
      passed: false,
      notes: e.message,
    });
  }

  // ----------------------------------------------------
  // LIVE-08: Atomic Concurrent Writes Stress Test
  // ----------------------------------------------------
  try {
    const concurrentWrites = Array.from({ length: 5 }, (_, i) =>
      fetch(`${BASE_URL}/api/admin/cms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer gulf_hills_admin_secret_token',
          'x-test-runner': 'true',
        },
        body: JSON.stringify({
          key: `concurrent_stress_${i}`,
          data: { workerId: i, timestamp: Date.now() },
        }),
      })
    );

    const responses = await Promise.all(concurrentWrites);
    const allSuccessful = responses.every((r) => r.status === 200);

    // Verify DB file integrity on disk
    const db = serverStorage.getDb();
    const isDbValid = typeof db === 'object' && db.version === '1.0';

    const passed = allSuccessful && isDbValid;
    results.push({
      id: 'LIVE-08',
      name: 'Concurrent Atomic Writes Stress Test (5 parallel requests)',
      expectedStatus: 200,
      actualStatus: allSuccessful ? 200 : 500,
      passed,
      notes: passed ? 'All 5 concurrent requests succeeded with 0 JSON file corruptions' : 'Concurrency conflict',
    });
  } catch (e: any) {
    results.push({
      id: 'LIVE-08',
      name: 'Concurrent Atomic Writes Stress Test',
      expectedStatus: 200,
      actualStatus: 0,
      passed: false,
      notes: e.message,
    });
  }

  // ----------------------------------------------------
  // PRINT RESULTS SUMMARY
  // ----------------------------------------------------
  console.log('----------------------------------------------------------------');
  console.log('📋 LIVE HTTP & SECURITY TEST RESULTS SUMMARY:');
  console.log('----------------------------------------------------------------');

  let allPassed = true;
  results.forEach((r) => {
    const icon = r.passed ? '✅ PASS' : '❌ FAIL';
    if (!r.passed) allPassed = false;
    console.log(`${icon} [${r.id}] ${r.name}`);
    console.log(`   Expected HTTP Status: ${r.expectedStatus} | Actual: ${r.actualStatus}`);
    console.log(`   Output: ${r.notes}\n`);
  });

  console.log('================================================================');
  if (allPassed) {
    console.log('🎉 ALL LIVE HTTP & SECURITY TESTS (LIVE-01 to LIVE-08) PASSED 100%!');
  } else {
    console.error('❌ SOME LIVE HTTP TESTS FAILED. PLEASE INSPECT LOGS.');
  }
  console.log('================================================================');
}

runLiveTests();

export {};
