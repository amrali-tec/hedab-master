/**
 * Comprehensive Unit Test Suite for TreeUtils Engine (Phase 1)
 * Visual CMS Studio — Saudi Sovereign Infrastructure Platform
 * Milestone: v1.1.0-dev
 */

import { treeUtils, TreeOperationError } from '../src/lib/cms/treeUtils';
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
console.log('🌳 RUNNING ELEMENTOR-CLASS TREE UTILS VERIFICATION SUITE (45 TESTS)');
console.log('================================================================\n');

// -------------------------------------------------------------
// Sample Test Trees
// -------------------------------------------------------------
const createLeaf = (id: string, type: any = 'hero'): ContentBlock => ({
  id,
  type,
  sortOrder: 0,
  isVisible: true,
  config: { title: `Block ${id}` },
  createdAt: '2026-08-22T00:00:00Z',
  updatedAt: '2026-08-22T00:00:00Z',
});

const createContainer = (id: string, children: ContentBlock[] = []): ContentBlock => ({
  id,
  type: 'container',
  sortOrder: 0,
  isVisible: true,
  config: { direction: 'column' },
  children,
  createdAt: '2026-08-22T00:00:00Z',
  updatedAt: '2026-08-22T00:00:00Z',
});

// 1. DATA Tests
assert(treeUtils.countNodes([]) === 0, '1. Empty tree node count is 0');
const flatTree = [createLeaf('blk-1'), createLeaf('blk-2'), createLeaf('blk-3')];
assert(treeUtils.countNodes(flatTree) === 3, '2. Flat tree node count is 3');

const nestedTree = [
  createContainer('cont-1', [
    createLeaf('blk-1.1'),
    createLeaf('blk-1.2'),
  ]),
];
assert(treeUtils.countNodes(nestedTree) === 3, '3. Nested tree node count is 3');

const deeplyNestedTree = [
  createContainer('c1', [
    createContainer('c2', [
      createContainer('c3', [
        createContainer('c4', [
          createLeaf('leaf-deep'),
        ]),
      ]),
    ]),
  ]),
];
assert(treeUtils.getTreeDepth(deeplyNestedTree) === 5, '4. Deeply nested tree depth is 5');

const mixedTree = [
  createLeaf('root-1'),
  createContainer('cont-1', [
    createLeaf('child-1'),
    createContainer('cont-inner', [createLeaf('child-inner')]),
  ]),
  createLeaf('root-2'),
];
assert(treeUtils.countNodes(mixedTree) === 6, '5. Mixed flat + nested tree count is 6');

// 2. FIND Tests
const findRoot = treeUtils.findNode(mixedTree, 'root-1');
assert(findRoot.node?.id === 'root-1' && findRoot.parent === null && findRoot.index === 0, '6. Find root node');

const findNested = treeUtils.findNode(mixedTree, 'child-inner');
assert(findNested.node?.id === 'child-inner' && findNested.parent?.id === 'cont-inner', '7. Find nested node with correct parent');

const findMissing = treeUtils.findNode(mixedTree, 'missing-999');
assert(findMissing.node === null && findMissing.parent === null, '8. Find missing node returns null');

// 3. PARENT Tests
assert(treeUtils.findParent(mixedTree, 'root-1') === null, '9. Find root parent returns null');
assert(treeUtils.findParent(mixedTree, 'child-1')?.id === 'cont-1', '10. Find nested parent returns cont-1');

// 4. ANCESTORS Tests
const ancestors = treeUtils.getAncestors(mixedTree, 'child-inner');
assert(ancestors.map((a) => a.id).join(' > ') === 'cont-1 > cont-inner', '11. Nested ancestors returns path cont-1 > cont-inner');
assert(treeUtils.getAncestors(mixedTree, 'root-1').length === 0, '12. Root node has 0 ancestors');

// 5. DESCENDANTS Tests
assert(treeUtils.getDescendants(mixedTree, 'root-1').length === 0, '13. Leaf block has 0 descendants');
const contDescendants = treeUtils.getDescendants(mixedTree, 'cont-1');
assert(contDescendants.length === 3 && contDescendants.map((d) => d.id).includes('child-inner'), '14. Container descendants returns all recursive children (3 total)');

// 6. INSERT Tests
const afterRootInsert = treeUtils.insertNode(flatTree, createLeaf('blk-inserted'), null, 1);
assert(afterRootInsert.length === 4 && afterRootInsert[1].id === 'blk-inserted', '15. Root insertion at index 1');

const afterNestedInsert = treeUtils.insertNode(mixedTree, createLeaf('new-child'), 'cont-1', 0);
assert(treeUtils.findParent(afterNestedInsert, 'new-child')?.id === 'cont-1', '16. Nested insertion inside container');

const contChildren = treeUtils.findNode(afterNestedInsert, 'cont-1').node?.children;
assert(contChildren?.[0].id === 'new-child', '17. Nested insertion ordering respects targetIndex 0');

// 7. REMOVE Tests
const afterRootRemove = treeUtils.removeNode(flatTree, 'blk-2');
assert(afterRootRemove.length === 2 && !treeUtils.containsNode(afterRootRemove, 'blk-2'), '18. Root removal');

const afterNestedRemove = treeUtils.removeNode(mixedTree, 'child-inner');
assert(treeUtils.countNodes(afterNestedRemove) === 5 && !treeUtils.containsNode(afterNestedRemove, 'child-inner'), '19. Nested removal');

// 8. MOVE Tests
const afterReorder = treeUtils.moveNode(flatTree, 'blk-1', null, 2);
assert(afterReorder[2].id === 'blk-1', '20. Root -> Root move (Reorder)');

const afterRootToCont = treeUtils.moveNode(mixedTree, 'root-1', 'cont-inner');
assert(treeUtils.findParent(afterRootToCont, 'root-1')?.id === 'cont-inner', '21. Root -> Container move');

const afterContToRoot = treeUtils.moveNode(mixedTree, 'child-inner', null, 0);
assert(afterContToRoot[0].id === 'child-inner' && treeUtils.findParent(afterContToRoot, 'child-inner') === null, '22. Container -> Root move');

const afterContToCont = treeUtils.moveNode(mixedTree, 'child-1', 'cont-inner');
assert(treeUtils.findParent(afterContToCont, 'child-1')?.id === 'cont-inner', '23. Container -> Container move');

const siblingReorder = treeUtils.moveNode(nestedTree, 'blk-1.1', 'cont-1', 1);
const reorderedCont = treeUtils.findNode(siblingReorder, 'cont-1').node;
assert(reorderedCont?.children?.[1].id === 'blk-1.1', '24. Reorder siblings within container');

let threwSelfMove = false;
try {
  treeUtils.moveNode(mixedTree, 'cont-1', 'cont-1');
} catch (e: any) {
  threwSelfMove = e.code === 'CIRCULAR_REFERENCE';
}
assert(threwSelfMove, '25. Reject move node into itself');

let threwDescendantMove = false;
try {
  treeUtils.moveNode(mixedTree, 'cont-1', 'cont-inner');
} catch (e: any) {
  threwDescendantMove = e.code === 'CIRCULAR_REFERENCE';
}
assert(threwDescendantMove, '26. Reject move node into its own descendant');

let threwDepthOverflow = false;
try {
  treeUtils.moveNode(deeplyNestedTree, 'leaf-deep', 'c4');
  // Create max depth tree
  const maxDepthTree = [
    createContainer('l1', [
      createContainer('l2', [
        createContainer('l3', [
          createContainer('l4', [
            createContainer('l5', [
              createContainer('l6'),
            ]),
          ]),
        ]),
      ]),
    ]),
  ];
  treeUtils.insertNode(maxDepthTree, createLeaf('overflow'), 'l6');
} catch (e: any) {
  threwDepthOverflow = e.code === 'MAX_DEPTH_EXCEEDED';
}
assert(threwDepthOverflow, '27. Reject depth overflow > MAX_TREE_DEPTH (6)');

// 9. DUPLICATE Tests
const dupLeaf = treeUtils.duplicateNode(flatTree, 'blk-1');
assert(dupLeaf.nextTree.length === 4 && dupLeaf.newId !== 'blk-1', '28. Duplicate leaf creates new node with new ID');

const dupSubtree = treeUtils.duplicateNode(mixedTree, 'cont-1');
assert(treeUtils.countNodes(dupSubtree.nextTree) === 10, '29. Duplicate container clones entire subtree (6 -> 10 nodes)');

const clonedCont = treeUtils.findNode(dupSubtree.nextTree, dupSubtree.newId).node;
const clonedChild = clonedCont?.children?.[0];
assert(clonedChild?.id !== 'child-1', '30. Duplicated descendants receive unique IDs');

assert(clonedCont !== treeUtils.findNode(mixedTree, 'cont-1').node, '31. Duplicated subtree shares no object references');

// 10. UPDATE Tests
const afterRootUpdate = treeUtils.updateNode(flatTree, 'blk-1', (n) => ({
  ...n,
  config: { ...n.config, title: 'Updated Title' },
}));
assert(afterRootUpdate[0].config.title === 'Updated Title' && flatTree[0].config.title === 'Block blk-1', '32. Update root node immutably');

const afterNestedUpdate = treeUtils.updateNode(mixedTree, 'child-inner', (n) => ({
  ...n,
  config: { ...n.config, title: 'Updated Inner' },
}));
assert(
  treeUtils.findNode(afterNestedUpdate, 'child-inner').node?.config.title === 'Updated Inner',
  '33. Update nested node immutably'
);

// 11. VALIDATION Tests
const validFlat = treeUtils.validateTree(flatTree);
assert(validFlat.valid && validFlat.errors.length === 0, '34. Valid flat tree validates with 0 errors');

const validNested = treeUtils.validateTree(mixedTree);
assert(validNested.valid && validNested.errors.length === 0, '35. Valid nested tree validates with 0 errors');

const duplicateTree = [createLeaf('dup-1'), createLeaf('dup-1')];
const dupVal = treeUtils.validateTree(duplicateTree);
assert(!dupVal.valid && dupVal.errors.some((e) => e.code === 'DUPLICATE_NODE_ID'), '36. Validation detects duplicate IDs');

const invalidDepthTree = [
  createContainer('d1', [
    createContainer('d2', [
      createContainer('d3', [
        createContainer('d4', [
          createContainer('d5', [
            createContainer('d6', [
              createLeaf('d7'),
            ]),
          ]),
        ]),
      ]),
    ]),
  ]),
];
const depthVal = treeUtils.validateTree(invalidDepthTree);
assert(!depthVal.valid && depthVal.errors.some((e) => e.code === 'MAX_DEPTH_EXCEEDED'), '37. Validation detects depth > 6');

const oversizedTree: ContentBlock[] = [];
for (let i = 0; i < 105; i++) {
  oversizedTree.push(createLeaf(`node-${i}`));
}
const sizeVal = treeUtils.validateTree(oversizedTree);
assert(!sizeVal.valid && sizeVal.errors.some((e) => e.code === 'MAX_NODES_EXCEEDED'), '38. Validation detects total nodes > 100');

const malformedTree: any = [{ id: 'x' }, 'not-an-object'];
const malformedVal = treeUtils.validateTree(malformedTree);
assert(!malformedVal.valid && malformedVal.errors.some((e) => e.code === 'INVALID_CHILD'), '39. Validation detects malformed non-object nodes');

const invalidChildPlacement = [
  {
    ...createLeaf('leaf-with-children', 'hero'),
    children: [createLeaf('illegal-child')],
  },
];
const placementVal = treeUtils.validateTree(invalidChildPlacement);
assert(!placementVal.valid && placementVal.errors.some((e) => e.code === 'INVALID_CONTAINER'), '40. Validation detects children on non-container leaf block');

// 12. IMMUTABILITY Tests
const origTree = [createLeaf('orig-1'), createContainer('orig-cont', [createLeaf('orig-child')])];
const snapshotBefore = JSON.stringify(origTree);

treeUtils.insertNode(origTree, createLeaf('inserted-test'));
assert(JSON.stringify(origTree) === snapshotBefore, '41. Original tree unchanged after insertNode()');

treeUtils.removeNode(origTree, 'orig-child');
assert(JSON.stringify(origTree) === snapshotBefore, '42. Original tree unchanged after removeNode()');

treeUtils.moveNode(origTree, 'orig-child', null);
assert(JSON.stringify(origTree) === snapshotBefore, '43. Original tree unchanged after moveNode()');

treeUtils.duplicateNode(origTree, 'orig-cont');
assert(JSON.stringify(origTree) === snapshotBefore, '44. Original tree unchanged after duplicateNode()');

treeUtils.updateNode(origTree, 'orig-child', (n) => ({ ...n, isVisible: false }));
assert(JSON.stringify(origTree) === snapshotBefore, '45. Original tree unchanged after updateNode()');

console.log('\n================================================================');
console.log(`🎉 TREE ENGINE TEST RESULTS: Passed: ${passed} | Failed: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
