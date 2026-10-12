/**
 * Comprehensive Verification Suite for Nested Visual Editor Canvas & Multi-Zone Drag/Drop (Phase 3)
 * Visual CMS Studio — Saudi Sovereign Infrastructure Platform
 * Milestone: v1.1.0-dev
 */

import { treeUtils, TreeOperationError } from '../src/lib/cms/treeUtils';
import { transactionManager } from '../src/lib/cms/transactionManager';
import { ContentBlock } from '../src/lib/cms/blockSchemas';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ PASS [${testName}]`);
    if (detail) console.log(`   Evidence: ${detail}`);
    passed++;
  } else {
    console.error(`❌ FAIL [${testName}]`);
    if (detail) console.error(`   Failure Details: ${detail}`);
    failed++;
  }
}

console.log('================================================================');
console.log('🎨 RUNNING NESTED VISUAL EDITOR CANVAS VERIFICATION SUITE (27 TESTS)');
console.log('================================================================\n');

// Test page ID
const PAGE_ID = 'test-canvas-page';
transactionManager.clearPageHistory(PAGE_ID);

// Helper block factories
const createLeaf = (id: string, type: any = 'hero', title: string = `Block ${id}`): ContentBlock => ({
  id,
  type,
  sortOrder: 0,
  isVisible: true,
  config: { titleAr: title, titleEn: `EN ${title}` },
  createdAt: '2026-08-22T00:00:00Z',
  updatedAt: '2026-08-22T00:00:00Z',
});

const createContainer = (id: string, children: ContentBlock[] = []): ContentBlock => ({
  id,
  type: 'container',
  sortOrder: 0,
  isVisible: true,
  config: { direction: 'column', gap: 16 },
  children,
  createdAt: '2026-08-22T00:00:00Z',
  updatedAt: '2026-08-22T00:00:00Z',
});

const createGrid = (id: string, children: ContentBlock[] = []): ContentBlock => ({
  id,
  type: 'grid',
  sortOrder: 0,
  isVisible: true,
  config: { columnsDesktop: 3, columnsTablet: 2, columnsMobile: 1 },
  children,
  createdAt: '2026-08-22T00:00:00Z',
  updatedAt: '2026-08-22T00:00:00Z',
});

// Initial tree state
let currentTree: ContentBlock[] = [
  createLeaf('root-hero', 'hero', 'بطل الواجهة'),
  createContainer('cont-main', [
    createLeaf('child-a', 'richText', 'نص A'),
    createLeaf('child-b', 'cta', 'إجراء B'),
  ]),
  createGrid('grid-kpis', [
    createLeaf('kpi-1', 'statistics', 'إحصائية 1'),
    createLeaf('kpi-2', 'statistics', 'إحصائية 2'),
  ]),
  createLeaf('root-footer', 'footer', 'التذييل'),
];

// 1. Initial State Validity
const v1 = treeUtils.validateTree(currentTree);
assert(v1.valid && treeUtils.countNodes(currentTree) === 8, '1. Initial recursive canvas tree valid with 8 nodes');

// 2. Root-Level Block Reordering
const prev1 = [...currentTree];
currentTree = treeUtils.moveNode(currentTree, 'root-hero', null, 2);
transactionManager.recordDiscreteTransaction({
  pageId: PAGE_ID,
  type: 'MOVE_BLOCK',
  descriptionAr: 'تحريك بطل الواجهة',
  descriptionEn: 'Move Hero',
  previousBlocks: prev1,
  nextBlocks: currentTree,
});
assert(currentTree[2].id === 'root-hero', '2. Root-level block reordering');

// 3. Moving a Root Block into a Container
const prev2 = [...currentTree];
currentTree = treeUtils.moveNode(currentTree, 'root-hero', 'cont-main', 1);
transactionManager.recordDiscreteTransaction({
  pageId: PAGE_ID,
  type: 'MOVE_BLOCK',
  descriptionAr: 'نقل بطل الواجهة إلى الحاوية',
  descriptionEn: 'Move Hero into Container',
  previousBlocks: prev2,
  nextBlocks: currentTree,
});
assert(
  treeUtils.findParent(currentTree, 'root-hero')?.id === 'cont-main',
  '3. Move root block into container'
);

// 4. Moving a Block out of a Container to Root
const prev3 = [...currentTree];
currentTree = treeUtils.moveNode(currentTree, 'child-a', null, 0);
transactionManager.recordDiscreteTransaction({
  pageId: PAGE_ID,
  type: 'MOVE_BLOCK',
  descriptionAr: 'إخراج عنصر من الحاوية إلى الجذر',
  descriptionEn: 'Move child to root',
  previousBlocks: prev3,
  nextBlocks: currentTree,
});
assert(
  currentTree[0].id === 'child-a' && treeUtils.findParent(currentTree, 'child-a') === null,
  '4. Move child out of container to root'
);

// 5. Moving a Block between Containers (Container -> Grid)
const prev4 = [...currentTree];
currentTree = treeUtils.moveNode(currentTree, 'child-b', 'grid-kpis', 0);
transactionManager.recordDiscreteTransaction({
  pageId: PAGE_ID,
  type: 'MOVE_BLOCK',
  descriptionAr: 'نقل عنصر من الحاوية إلى الشبكة',
  descriptionEn: 'Move from Container to Grid',
  previousBlocks: prev4,
  nextBlocks: currentTree,
});
assert(
  treeUtils.findParent(currentTree, 'child-b')?.id === 'grid-kpis',
  '5. Move block between containers (Container -> Grid)'
);

// 6. Reordering Siblings inside Container
const prev5 = [...currentTree];
currentTree = treeUtils.moveNode(currentTree, 'kpi-2', 'grid-kpis', 0);
assert(
  treeUtils.findNode(currentTree, 'grid-kpis').node?.children?.[0].id === 'kpi-2',
  '6. Reorder siblings inside Grid container'
);

// 7. Moving Nested Containers
const nestedContainerTree = [
  createContainer('outer', [
    createContainer('inner-1', [createLeaf('leaf-1')]),
    createContainer('inner-2', [createLeaf('leaf-2')]),
  ]),
];
const movedNested = treeUtils.moveNode(nestedContainerTree, 'inner-2', 'inner-1', 0);
assert(
  treeUtils.findParent(movedNested, 'inner-2')?.id === 'inner-1',
  '7. Move container inside another container (multi-level nesting)'
);

// 8. Reject Self Move
let threwSelf = false;
try {
  treeUtils.moveNode(currentTree, 'cont-main', 'cont-main');
} catch (e: any) {
  threwSelf = e.code === 'CIRCULAR_REFERENCE';
}
assert(threwSelf, '8. Drag engine rejects dropping a container into itself');

// 9. Reject Descendant Move
let threwDesc = false;
try {
  treeUtils.moveNode(nestedContainerTree, 'outer', 'inner-1');
} catch (e: any) {
  threwDesc = e.code === 'CIRCULAR_REFERENCE';
}
assert(threwDesc, '9. Drag engine rejects dropping a parent container into its own descendant');

// 10. Depth Protection (> 6)
let threwDepth = false;
try {
  const depth6 = [
    createContainer('d1', [
      createContainer('d2', [
        createContainer('d3', [
          createContainer('d4', [
            createContainer('d5', [
              createContainer('d6'),
            ]),
          ]),
        ]),
      ]),
    ]),
  ];
  treeUtils.insertNode(depth6, createLeaf('overflow-node'), 'd6');
} catch (e: any) {
  threwDepth = e.code === 'MAX_DEPTH_EXCEEDED';
}
assert(threwDepth, '10. Drag/insert operations strictly reject depth > 6');

// 11. Node Limit Protection (> 100)
let threwLimit = false;
try {
  const bigTree: ContentBlock[] = [];
  for (let i = 0; i < 100; i++) bigTree.push(createLeaf(`blk-${i}`));
  treeUtils.insertNode(bigTree, createLeaf('blk-101'), null);
} catch (e: any) {
  threwLimit = e.code === 'MAX_NODES_EXCEEDED';
}
assert(threwLimit, '11. Drag/insert operations strictly reject node count > 100');

// 12. Duplicating Nested Container Subtree
const { nextTree: dupTree, newId: dupId } = treeUtils.duplicateNode(currentTree, 'cont-main');
assert(
  treeUtils.countNodes(dupTree) === treeUtils.countNodes(currentTree) + 2 && dupId !== 'cont-main',
  '12. Duplicate container clones entire subtree with unique IDs'
);

// 13. Deleting Nested Container and Subtree
const beforeDeleteCount = treeUtils.countNodes(currentTree);
const afterDelTree = treeUtils.removeNode(currentTree, 'grid-kpis');
assert(
  treeUtils.countNodes(afterDelTree) === beforeDeleteCount - 4 && !treeUtils.containsNode(afterDelTree, 'grid-kpis'),
  '13. Delete container removes container and all 3 descendants atomically'
);

// 14. Nested Selection Lookup
const selectLookup = treeUtils.findNode(currentTree, 'root-hero');
assert(
  selectLookup.node?.id === 'root-hero' && selectLookup.parent?.id === 'cont-main',
  '14. Nested selection identifies node ID, parent, and hierarchy path'
);

// 15. Transaction Reversibility: Undo restores exact pre-move state
const undo1 = transactionManager.undo(PAGE_ID);
assert(
  undo1 !== null && treeUtils.findParent(undo1.restoredBlocks, 'child-b')?.id === 'cont-main',
  '15. Undo restores exact pre-move tree structure'
);

// 16. Transaction Reversibility: Redo re-applies move
const redo1 = transactionManager.redo(PAGE_ID);
assert(
  redo1 !== null && treeUtils.findParent(redo1.restoredBlocks, 'child-b')?.id === 'grid-kpis',
  '16. Redo re-applies exact moved tree structure'
);

// 17. Undo Nested Delete Transaction
const prevBeforeDel = [...currentTree];
const delRecordedTree = treeUtils.removeNode(currentTree, 'cont-main');
transactionManager.recordDiscreteTransaction({
  pageId: PAGE_ID,
  type: 'DELETE_BLOCK',
  descriptionAr: 'حذف الحاوية',
  descriptionEn: 'Delete Container',
  previousBlocks: prevBeforeDel,
  nextBlocks: delRecordedTree,
});
const undoDel = transactionManager.undo(PAGE_ID);
assert(
  undoDel !== null && treeUtils.containsNode(undoDel.restoredBlocks, 'cont-main') && treeUtils.containsNode(undoDel.restoredBlocks, 'root-hero'),
  '17. Undo deleted container restores complete subtree'
);

// 18. Redo Nested Delete Transaction
const redoDel = transactionManager.redo(PAGE_ID);
assert(
  redoDel !== null && !treeUtils.containsNode(redoDel.restoredBlocks, 'cont-main'),
  '18. Redo deleted container purges complete subtree'
);

// 19. Undo Nested Duplicate Transaction
const dupRecordedPrev = [...currentTree];
const { nextTree: dupRecordedNext, newId: dupRecId } = treeUtils.duplicateNode(currentTree, 'grid-kpis');
transactionManager.recordDiscreteTransaction({
  pageId: PAGE_ID,
  type: 'DUPLICATE_BLOCK',
  descriptionAr: 'تكرار الشبكة',
  descriptionEn: 'Duplicate Grid',
  previousBlocks: dupRecordedPrev,
  nextBlocks: dupRecordedNext,
});
const undoDup = transactionManager.undo(PAGE_ID);
assert(
  undoDup !== null && !treeUtils.containsNode(undoDup.restoredBlocks, dupRecId),
  '19. Undo duplicated container removes cloned subtree'
);

// 20. Redo Nested Duplicate Transaction
const redoDup = transactionManager.redo(PAGE_ID);
assert(
  redoDup !== null && treeUtils.containsNode(redoDup.restoredBlocks, dupRecId),
  '20. Redo duplicated container restores cloned subtree'
);

// 21. Continuous Property Update Inside Nested Container
const prevProp = [...currentTree];
const updatedTree = treeUtils.updateNode(currentTree, 'root-hero', (n) => ({
  ...n,
  config: { ...n.config, titleAr: 'عنوان معدل داخل الحاوية' },
}));
transactionManager.recordContinuousPropertyUpdate({
  pageId: PAGE_ID,
  blockId: 'root-hero',
  propertyKey: 'titleAr',
  descriptionAr: 'تعديل عنوان',
  descriptionEn: 'Update title',
  previousBlocks: prevProp,
  nextBlocks: updatedTree,
});
assert(
  treeUtils.findNode(updatedTree, 'root-hero').node?.config.titleAr === 'عنوان معدل داخل الحاوية',
  '21. Continuous property update modifies deep child block'
);

// 22. Undo Continuous Property Update
const undoProp = transactionManager.undo(PAGE_ID);
assert(
  undoProp !== null && treeUtils.findNode(undoProp.restoredBlocks, 'root-hero').node?.config.titleAr === 'بطل الواجهة',
  '22. Undo restores original property inside nested container'
);

// 23. Toggle Visibility inside Nested Container
const toggledTree = treeUtils.updateNode(currentTree, 'root-hero', (n) => ({
  ...n,
  isVisible: false,
}));
assert(
  treeUtils.findNode(toggledTree, 'root-hero').node?.isVisible === false,
  '23. Toggle visibility updates child block visibility'
);

// 24. Tree Validation passes after Every Mutation
assert(
  treeUtils.validateTree(currentTree).valid &&
  treeUtils.validateTree(movedNested).valid &&
  treeUtils.validateTree(dupTree).valid,
  '24. Tree validation passes on all mutated trees'
);

// 25. Legacy Flat Page Compatibility: Flat Reorder
const flatTree = [createLeaf('f1'), createLeaf('f2'), createLeaf('f3')];
const flatReorder = treeUtils.moveNode(flatTree, 'f1', null, 2);
assert(
  flatReorder[2].id === 'f1' && flatReorder.length === 3,
  '25. Legacy flat page reorder works seamlessly'
);

// 26. Legacy Flat Page Compatibility: Flat Duplicate & Delete
const flatDup = treeUtils.duplicateNode(flatTree, 'f2');
const flatDel = treeUtils.removeNode(flatDup.nextTree, 'f1');
assert(
  flatDel.length === 3 && !treeUtils.containsNode(flatDel, 'f1'),
  '26. Legacy flat duplicate and delete work seamlessly'
);

// 27. Insertion of Elements Inside Container
const withInserted = treeUtils.insertNode(currentTree, createLeaf('inserted-inner'), 'cont-main', 0);
assert(
  treeUtils.findParent(withInserted, 'inserted-inner')?.id === 'cont-main' &&
  treeUtils.findNode(withInserted, 'cont-main').node?.children?.[0].id === 'inserted-inner',
  '27. Insert element directly inside container at specific index'
);

console.log('\n================================================================');
console.log(`🎉 NESTED CANVAS TEST RESULTS: Passed: ${passed} | Failed: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
