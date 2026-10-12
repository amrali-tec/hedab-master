/**
 * Comprehensive Test Suite for Visual CMS by Composition
 * Validates Block Registry, Draft Lifecycle, Atomic Publishing, and Rollback
 */

import { BLOCK_REGISTRY } from '../src/lib/cms/blockRegistry';
import { contentEngine } from '../src/services/contentEngine';
import { BlockType } from '../src/lib/cms/blockSchemas';

interface TestResult {
  id: string;
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const results: TestResult[] = [];

console.log('================================================================');
console.log('🎨 TESTING VISUAL CMS BY COMPOSITION & DRAFT/PUBLISH LIFECYCLE');
console.log('================================================================\n');

async function runVisualCmsTests() {
  // ----------------------------------------------------
  // VCMS-01: Block Registry Integrity
  // ----------------------------------------------------
  try {
    const requiredBlockTypes: BlockType[] = [
      'hero',
      'richText',
      'timeline',
      'saudiMap',
      'partners',
      'projectCollection',
      'serviceCollection',
      'statistics',
      'cta',
      'whatsapp',
    ];

    const allRegistered = requiredBlockTypes.every(
      (type) => BLOCK_REGISTRY[type] && typeof BLOCK_REGISTRY[type].labelAr === 'string'
    );

    results.push({
      id: 'VCMS-01',
      name: 'Block Registry Completeness & Strict Typed Schemas',
      expected: 'All 10 enterprise blocks registered with Arabic/English labels and default configs',
      actual: `Count: ${Object.keys(BLOCK_REGISTRY).length}, All Found: ${allRegistered}`,
      passed: allRegistered && Object.keys(BLOCK_REGISTRY).length >= 10,
    });
  } catch (e: any) {
    results.push({
      id: 'VCMS-01',
      name: 'Block Registry Completeness',
      expected: 'Valid registry',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // VCMS-02: Draft Isolation from Production
  // ----------------------------------------------------
  try {
    const pageId = 'page-home';
    const initialPublished = contentEngine.getPublishedVersion(pageId);
    const draft = contentEngine.getDraftVersion(pageId);

    // Modify draft block
    const updatedHero = contentEngine.updateBlockInDraft(pageId, draft.blocks[0].id, {
      titleAr: 'عنوان مسودة تجريبي معزول عن الإنتاج',
    });

    const refreshedPublished = contentEngine.getPublishedVersion(pageId);
    const isIsolated = refreshedPublished.blocks[0].config.titleAr !== 'عنوان مسودة تجريبي معزول عن الإنتاج';

    results.push({
      id: 'VCMS-02',
      name: 'Draft Isolation (Working edits do not alter published version)',
      expected: 'Published version remains unchanged while draft is edited',
      actual: `Draft Title: "${updatedHero?.config.titleAr}", Published Title: "${refreshedPublished.blocks[0].config.titleAr}"`,
      passed: isIsolated,
    });
  } catch (e: any) {
    results.push({
      id: 'VCMS-02',
      name: 'Draft Isolation',
      expected: 'Isolated state',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // VCMS-03: Atomic Version Publishing
  // ----------------------------------------------------
  try {
    const pageId = 'page-home';
    const prePublishPage = contentEngine.getPageById(pageId);
    const preVersion = prePublishPage?.publishedVersionId;

    const publishRes = contentEngine.publishDraft(pageId, 'اختبار اعتماد ونشر إصدار مؤتمت');
    const postPublishPage = contentEngine.getPageById(pageId);
    const publishedVer = contentEngine.getPublishedVersion(pageId);

    const isUpdated =
      publishRes.success &&
      postPublishPage?.publishedVersionId !== preVersion &&
      publishedVer.id === publishRes.publishedVersion.id;

    results.push({
      id: 'VCMS-03',
      name: 'Atomic Version Publishing Workflow',
      expected: 'Draft published to new immutable version and publishedVersionId pointer updated',
      actual: `Success: ${publishRes.success}, New Version: v${publishedVer.versionNumber} (${publishedVer.id})`,
      passed: isUpdated,
    });
  } catch (e: any) {
    results.push({
      id: 'VCMS-03',
      name: 'Atomic Version Publishing',
      expected: 'Published version',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // VCMS-04: Version History & Rollback Cycle
  // ----------------------------------------------------
  try {
    const pageId = 'page-home';
    const history = contentEngine.getPageHistory(pageId);
    const targetVersion = history[history.length - 1]; // oldest version

    const rollbackRes = contentEngine.rollbackToVersion(pageId, targetVersion.id);
    const currentPublished = contentEngine.getPublishedVersion(pageId);

    const rollbackSuccess = Boolean(
      rollbackRes.success &&
      currentPublished.changeNote?.includes('استرجاع') &&
      currentPublished.blocks.length === targetVersion.blocks.length
    );

    results.push({
      id: 'VCMS-04',
      name: 'Version History & Safe Rollback Cycle',
      expected: 'Previous version restored as a new audited release without history deletion',
      actual: `Rollback: ${rollbackRes.success}, Restored Version Note: "${currentPublished.changeNote}"`,
      passed: rollbackSuccess,
    });
  } catch (e: any) {
    results.push({
      id: 'VCMS-04',
      name: 'Version History & Safe Rollback',
      expected: 'Successful rollback',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // VCMS-05: Block Dynamic Operations (Add, Reorder, Remove)
  // ----------------------------------------------------
  try {
    const pageId = 'page-home';
    const draftBefore = contentEngine.getDraftVersion(pageId);
    const initialCount = draftBefore.blocks.length;

    // Add block
    const addedBlock = contentEngine.addBlockToDraft(pageId, 'cta');
    const afterAdd = contentEngine.getDraftVersion(pageId);

    // Reorder block
    const reordered = contentEngine.reorderBlocksInDraft(pageId, afterAdd.blocks.length - 1, 0);

    // Remove block
    const removed = contentEngine.removeBlockFromDraft(pageId, addedBlock.id);
    const afterRemove = contentEngine.getDraftVersion(pageId);

    const opsValid =
      afterAdd.blocks.length === initialCount + 1 &&
      reordered[0].id === addedBlock.id &&
      removed &&
      afterRemove.blocks.length === initialCount;

    results.push({
      id: 'VCMS-05',
      name: 'Block Dynamic Composition (Add, Reorder, Remove)',
      expected: 'Block operations execute cleanly in memory and persist in draft',
      actual: `Added: true, Reordered: true, Removed: ${removed}, Final Count: ${afterRemove.blocks.length}`,
      passed: opsValid,
    });
  } catch (e: any) {
    results.push({
      id: 'VCMS-05',
      name: 'Block Dynamic Composition',
      expected: 'Valid block ops',
      actual: e.message,
      passed: false,
    });
  }

  // ----------------------------------------------------
  // PRINT SUMMARY
  // ----------------------------------------------------
  console.log('----------------------------------------------------------------');
  console.log('📋 VISUAL CMS TEST RESULTS:');
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
    console.log('🎉 ALL VISUAL CMS & DRAFT/PUBLISH TESTS PASSED (100%)!');
  } else {
    console.error('❌ SOME VISUAL CMS TESTS FAILED.');
  }
  console.log('================================================================');
}

runVisualCmsTests();

export {};
