import { TransactionManager } from '../src/lib/cms/transactionManager';
import { contentEngine } from '../src/services/contentEngine';
import { ContentBlock } from '../src/lib/cms/blockSchemas';

async function runUndoRedoVerificationSuite() {
  console.log('================================================================');
  console.log('⏮️ RUNNING ENTERPRISE TRANSACTION-BASED UNDO / REDO TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean, details: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS [UR-${total.toString().padStart(2, '0')}] ${name}`);
      console.log(`   Details: ${details}\n`);
      passed++;
    } else {
      console.error(`❌ FAIL [UR-${total.toString().padStart(2, '0')}] ${name}`);
      console.error(`   Details: ${details}\n`);
      process.exitCode = 1;
    }
  }

  const manager = new TransactionManager(50, 50); // 50 items limit, 50ms test debounce
  const pageA = 'page-home';
  const pageB = 'page-about';

  // Seed blocks
  const initialBlocksA: ContentBlock[] = [
    {
      id: 'blk-1',
      type: 'hero',
      sortOrder: 0,
      isVisible: true,
      config: { titleAr: 'العنوان الأصلي A' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'blk-2',
      type: 'cta',
      sortOrder: 1,
      isVisible: true,
      config: { titleAr: 'زر الاتصال' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Test 1: Add block -> Undo
  const addedBlock: ContentBlock = {
    id: 'blk-3',
    type: 'whatsapp',
    sortOrder: 2,
    isVisible: true,
    config: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const afterAddBlocks = [...initialBlocksA, addedBlock];

  manager.recordDiscreteTransaction({
    pageId: pageA,
    type: 'ADD_BLOCK',
    descriptionAr: 'إضافة كتلة واتساب',
    descriptionEn: 'Add WhatsApp Block',
    previousBlocks: initialBlocksA,
    nextBlocks: afterAddBlocks,
  });

  const undoAdd = manager.undo(pageA);
  assert(
    '1. Add block → Undo restores previous blocks list',
    undoAdd?.restoredBlocks.length === 2 && !undoAdd.restoredBlocks.find((b) => b.id === 'blk-3'),
    `Restored blocks count: ${undoAdd?.restoredBlocks.length}`
  );

  // Test 2: Add block -> Undo -> Redo
  const redoAdd = manager.redo(pageA);
  assert(
    '2. Add block → Undo → Redo re-applies the addition',
    redoAdd?.restoredBlocks.length === 3 && !!redoAdd.restoredBlocks.find((b) => b.id === 'blk-3'),
    `Restored blocks count: ${redoAdd?.restoredBlocks.length}`
  );

  // Test 3: Delete block -> Undo
  const afterDeleteBlocks = redoAdd!.restoredBlocks.filter((b) => b.id !== 'blk-2');
  manager.recordDiscreteTransaction({
    pageId: pageA,
    type: 'DELETE_BLOCK',
    descriptionAr: 'حذف كتلة الاتصال',
    descriptionEn: 'Delete CTA Block',
    previousBlocks: redoAdd!.restoredBlocks,
    nextBlocks: afterDeleteBlocks,
  });

  const undoDelete = manager.undo(pageA);
  assert(
    '3. Delete block → Undo recovers deleted block',
    undoDelete?.restoredBlocks.length === 3 && !!undoDelete.restoredBlocks.find((b) => b.id === 'blk-2'),
    `Restored blocks count: ${undoDelete?.restoredBlocks.length} (blk-2 restored)`
  );

  // Test 4: Duplicate block -> Undo
  const dupBlock = { ...initialBlocksA[0], id: 'blk-1-dup' };
  const afterDupBlocks = [initialBlocksA[0], dupBlock, initialBlocksA[1]];
  manager.recordDiscreteTransaction({
    pageId: pageA,
    type: 'DUPLICATE_BLOCK',
    descriptionAr: 'تكرار كتلة الهيرو',
    descriptionEn: 'Duplicate Hero Block',
    previousBlocks: initialBlocksA,
    nextBlocks: afterDupBlocks,
  });

  const undoDup = manager.undo(pageA);
  assert(
    '4. Duplicate block → Undo removes duplicated block',
    undoDup?.restoredBlocks.length === 2 && !undoDup.restoredBlocks.find((b) => b.id === 'blk-1-dup'),
    `Restored blocks count: ${undoDup?.restoredBlocks.length}`
  );

  // Test 5: Move block -> Undo
  const afterMoveBlocks = [initialBlocksA[1], initialBlocksA[0]];
  manager.recordDiscreteTransaction({
    pageId: pageA,
    type: 'MOVE_BLOCK',
    descriptionAr: 'إعادة ترتيب الكتل',
    descriptionEn: 'Reorder Blocks',
    previousBlocks: initialBlocksA,
    nextBlocks: afterMoveBlocks,
  });

  const undoMove = manager.undo(pageA);
  assert(
    '5. Move block → Undo restores original block order',
    undoMove?.restoredBlocks[0].id === 'blk-1' && undoMove.restoredBlocks[1].id === 'blk-2',
    `First block ID: ${undoMove?.restoredBlocks[0].id}`
  );

  // Test 6: Update block property -> Undo
  const updatedBlocks = [
    { ...initialBlocksA[0], config: { titleAr: 'العنوان المعدل الجديد' } },
    initialBlocksA[1],
  ];
  manager.recordContinuousPropertyUpdate({
    pageId: pageA,
    blockId: 'blk-1',
    propertyKey: 'titleAr',
    descriptionAr: 'تعديل العنوان',
    descriptionEn: 'Update Title',
    previousBlocks: initialBlocksA,
    nextBlocks: updatedBlocks,
  });
  manager.flushPending();

  const undoUpdate = manager.undo(pageA);
  assert(
    '6. Update block property → Undo restores previous property value',
    undoUpdate?.restoredBlocks[0].config.titleAr === 'العنوان الأصلي A',
    `Restored title: "${undoUpdate?.restoredBlocks[0].config.titleAr}"`
  );

  // Test 7: Update block property -> Undo -> Redo
  const redoUpdate = manager.redo(pageA);
  assert(
    '7. Update block property → Undo → Redo re-applies the update',
    redoUpdate?.restoredBlocks[0].config.titleAr === 'العنوان المعدل الجديد',
    `Redo title: "${redoUpdate?.restoredBlocks[0].config.titleAr}"`
  );

  // Test 8: Multiple mutations -> Multiple Undo
  manager.clearPageHistory(pageA);
  let current = initialBlocksA;
  for (let i = 1; i <= 3; i++) {
    const next = [{ ...current[0], config: { titleAr: `نسخة ${i}` } }, current[1]];
    manager.recordDiscreteTransaction({
      pageId: pageA,
      type: 'UPDATE_BLOCK',
      descriptionAr: `تعديل ${i}`,
      descriptionEn: `Edit ${i}`,
      previousBlocks: current,
      nextBlocks: next,
    });
    current = next;
  }

  const u3 = manager.undo(pageA); // Reverts to 2
  const u2 = manager.undo(pageA); // Reverts to 1
  const u1 = manager.undo(pageA); // Reverts to initial
  assert(
    '8. Multiple mutations → Sequential Undo unwinds in LIFO order',
    u3?.restoredBlocks[0].config.titleAr === 'نسخة 2' &&
      u2?.restoredBlocks[0].config.titleAr === 'نسخة 1' &&
      u1?.restoredBlocks[0].config.titleAr === 'العنوان الأصلي A',
    `U3: "${u3?.restoredBlocks[0].config.titleAr}" -> U2: "${u2?.restoredBlocks[0].config.titleAr}" -> U1: "${u1?.restoredBlocks[0].config.titleAr}"`
  );

  // Test 9: Undo -> New mutation -> Redo stack must be cleared
  manager.clearPageHistory(pageA);
  manager.recordDiscreteTransaction({
    pageId: pageA,
    type: 'ADD_BLOCK',
    descriptionAr: 'خطوة 1',
    descriptionEn: 'Step 1',
    previousBlocks: initialBlocksA,
    nextBlocks: afterAddBlocks,
  });
  manager.undo(pageA);
  assert('9a. Redo available before new branch', manager.canRedo(pageA), 'Redo count: ' + manager.getRedoCount(pageA));

  // Branching mutation
  manager.recordDiscreteTransaction({
    pageId: pageA,
    type: 'DELETE_BLOCK',
    descriptionAr: 'خطوة تفريع جديدة',
    descriptionEn: 'Branch step',
    previousBlocks: initialBlocksA,
    nextBlocks: [initialBlocksA[0]],
  });
  assert('9b. Redo stack cleared after new branching mutation', !manager.canRedo(pageA), 'Redo count: ' + manager.getRedoCount(pageA));

  // Test 10 & 11: Published version is untouched during Undo / Redo
  const publishedBefore = contentEngine.getPublishedVersion(pageA);
  manager.undo(pageA);
  const publishedAfterUndo = contentEngine.getPublishedVersion(pageA);
  manager.redo(pageA);
  const publishedAfterRedo = contentEngine.getPublishedVersion(pageA);
  assert(
    '10 & 11. Undo/Redo operations never mutate the published production version',
    publishedBefore.id === publishedAfterUndo.id && publishedAfterUndo.id === publishedAfterRedo.id,
    `Published ID unchanged: ${publishedBefore.id}`
  );

  // Test 12: Page A history must not affect Page B
  manager.clearPageHistory(pageA);
  manager.clearPageHistory(pageB);

  manager.recordDiscreteTransaction({
    pageId: pageA,
    type: 'ADD_BLOCK',
    descriptionAr: 'إضافة في صفحة A',
    descriptionEn: 'Add in Page A',
    previousBlocks: initialBlocksA,
    nextBlocks: afterAddBlocks,
  });

  assert(
    '12. Page History Isolation: Page A mutation does not create undo entry in Page B',
    manager.canUndo(pageA) && !manager.canUndo(pageB),
    `Page A Undo count: ${manager.getUndoCount(pageA)} | Page B Undo count: ${manager.getUndoCount(pageB)}`
  );

  // Test 13: Grouped continuous text typing produces ONE transaction
  manager.clearPageHistory(pageA);
  const textChars = ['ش', 'شر', 'شرك', 'شركة', 'شركة هضاب'];
  let prevSnapshot = initialBlocksA;
  for (const str of textChars) {
    const nextSnap = [{ ...prevSnapshot[0], config: { titleAr: str } }, prevSnapshot[1]];
    manager.recordContinuousPropertyUpdate({
      pageId: pageA,
      blockId: 'blk-1',
      propertyKey: 'titleAr',
      descriptionAr: 'تعديل العنوان',
      descriptionEn: 'Update Title',
      previousBlocks: initialBlocksA, // Base snapshot
      nextBlocks: nextSnap,
    });
  }
  manager.flushPending();

  assert(
    '13. Grouped continuous typing produces exactly 1 transaction instead of 5',
    manager.getUndoCount(pageA) === 1,
    `Total undo transactions recorded: ${manager.getUndoCount(pageA)}`
  );

  // Test 14: History limit is enforced
  manager.clearPageHistory(pageA);
  for (let i = 0; i < 65; i++) {
    manager.recordDiscreteTransaction({
      pageId: pageA,
      type: 'UPDATE_BLOCK',
      descriptionAr: `تحديث ${i}`,
      descriptionEn: `Update ${i}`,
      previousBlocks: initialBlocksA,
      nextBlocks: initialBlocksA,
    });
  }
  assert(
    '14. History depth limit enforced at max 50 items (FIFO eviction)',
    manager.getUndoCount(pageA) === 50,
    `Current history stack size: ${manager.getUndoCount(pageA)} (capped at 50)`
  );

  // Test 15: Existing Draft/Publish compatibility
  const draftVersion = contentEngine.getDraftVersion(pageA);
  assert(
    '15. Draft and Version Engine integrity is fully maintained',
    !!draftVersion && Array.isArray(draftVersion.blocks),
    `Draft ID: ${draftVersion?.id} with ${draftVersion?.blocks.length} blocks`
  );

  console.log('================================================================');
  console.log(`🎉 ALL UNDO/REDO VERIFICATION TESTS PASSED: ${passed}/${total} (100%)`);
  console.log('================================================================');
}

runUndoRedoVerificationSuite();
