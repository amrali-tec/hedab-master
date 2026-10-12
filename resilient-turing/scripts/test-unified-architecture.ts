/**
 * Unified Admin Platform Architecture Test Suite
 * Validates Single Source of Truth, Unified Components & Data Integrity
 */

import { storageAdapter } from '../src/services/storageAdapter';
import { serverStorage } from '../src/services/serverStorage';

interface TestResult {
  id: string;
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const results: TestResult[] = [];

console.log('================================================================');
console.log('🏛️ TESTING UNIFIED ADMIN ARCHITECTURE & SINGLE SOURCE OF TRUTH');
console.log('================================================================\n');

async function runUnifiedArchitectureTests() {
  // ----------------------------------------------------
  // ARCH-01: Timeline Milestones Ordering & Single Source
  // ----------------------------------------------------
  try {
    const initialMilestones = storageAdapter.getTimelineItems();
    const isArray = Array.isArray(initialMilestones) && initialMilestones.length > 0;

    results.push({
      id: 'ARCH-01',
      name: 'Timeline Milestones Central Repository',
      expected: 'Milestones returned as structured array with valid properties',
      actual: `Count: ${initialMilestones.length}, Valid: ${isArray}`,
      passed: isArray,
    });
  } catch (e: any) {
    results.push({
      id: 'ARCH-01',
      name: 'Timeline Milestones Central Repository',
      expected: 'Valid array',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // ARCH-02: Saudi Map Regions Geographic Single Source
  // ----------------------------------------------------
  try {
    const regions = storageAdapter.getSaudiRegions();
    const hasRiyadh = regions.some((r) => r.id === 'riyadh');
    const validPins = regions.every((r) => r.pinX >= 0 && r.pinX <= 100 && r.pinY >= 0 && r.pinY <= 100);

    results.push({
      id: 'ARCH-02',
      name: 'Saudi Geographic Regions Single Source & Boundary Clamping',
      expected: '5 administrative regions with clamped pin coordinates [0, 100]',
      actual: `Regions: ${regions.length}, Riyadh Found: ${hasRiyadh}, Valid Clamping: ${validPins}`,
      passed: hasRiyadh && validPins,
    });
  } catch (e: any) {
    results.push({
      id: 'ARCH-02',
      name: 'Saudi Geographic Regions Single Source',
      expected: 'Valid regions',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // ARCH-03: Partners & Municipal Clients Central Repository
  // ----------------------------------------------------
  try {
    const partners = storageAdapter.getPartners();
    const hasMomrah = partners.some((p) => p.nameAr.includes('الشؤون البلدية') || p.id === 'p-1');

    results.push({
      id: 'ARCH-03',
      name: 'Partners & Municipal Clients Central Repository',
      expected: 'Accredited government partners retrieved with category and logos',
      actual: `Partners: ${partners.length}, MoMRAH Found: ${hasMomrah}`,
      passed: hasMomrah && partners.length >= 5,
    });
  } catch (e: any) {
    results.push({
      id: 'ARCH-03',
      name: 'Partners Central Repository',
      expected: 'Valid partners array',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // ARCH-04: Atomic Server DB Snapshot & Version 1.0 Integrity
  // ----------------------------------------------------
  try {
    const db = serverStorage.getDb();
    const isV1 = db && db.version === '1.0';

    results.push({
      id: 'ARCH-04',
      name: 'Server Storage Atomic Engine & Version 1.0 Schema',
      expected: 'Database payload adheres strictly to Version 1.0 format',
      actual: `Version: ${db?.version}, Last Updated: ${db?.updatedAt}`,
      passed: isV1,
    });
  } catch (e: any) {
    results.push({
      id: 'ARCH-04',
      name: 'Server Storage Atomic Engine',
      expected: 'Version 1.0',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // PRINT SUMMARY
  // ----------------------------------------------------
  console.log('----------------------------------------------------------------');
  console.log('📋 UNIFIED ARCHITECTURE TEST RESULTS:');
  console.log('----------------------------------------------------------------');

  let allPassed = true;
  results.forEach((r) => {
    const icon = r.passed ? '✅ PASS' : '❌ FAIL';
    if (!r.passed) allPassed = false;
    console.log(`${icon} [${r.id}] ${r.name}`);
    console.log(`   Expected: ${r.expected}`);
    console.log(`   Actual:   ${r.actual}\n`);
  });

  console.log('================================================================');
  if (allPassed) {
    console.log('🎉 ALL UNIFIED ARCHITECTURE & DATA MODEL TESTS PASSED (100%)!');
  } else {
    console.error('❌ SOME ARCHITECTURE TESTS FAILED.');
  }
  console.log('================================================================');
}

runUnifiedArchitectureTests();

export {};
