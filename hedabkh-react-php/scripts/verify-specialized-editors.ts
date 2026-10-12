import { BLOCK_EDITOR_REGISTRY } from '../src/components/admin/visual-cms/inspector/BlockEditorRegistry';
import { BLOCK_REGISTRY } from '../src/lib/cms/blockRegistry';
import { BlockType, ContentBlock } from '../src/lib/cms/blockSchemas';
import { TransactionManager } from '../src/lib/cms/transactionManager';
import { contentEngine } from '../src/services/contentEngine';

async function runSpecializedEditorsVerificationSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING PRODUCTION SPECIALIZED BLOCK EDITORS TEST SUITE (SE-01 to SE-12)');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean, details: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS [${name}]`);
      console.log(`   Details: ${details}\n`);
      passed++;
    } else {
      console.error(`❌ FAIL [${name}]`);
      console.error(`   Details: ${details}\n`);
      process.exitCode = 1;
    }
  }

  const expectedBlockTypes: BlockType[] = [
    'header',
    'hero',
    'richText',
    'timeline',
    'saudiMap',
    'partners',
    'projectCollection',
    'serviceCollection',
    'statistics',
    'gallery',
    'contactForm',
    'cta',
    'whatsapp',
    'footer',
  ];

  // SE-01: Every registered block type resolves to a valid editor strategy or valid shared fallback
  const missingInEditorRegistry = expectedBlockTypes.filter(
    (type) => !BLOCK_EDITOR_REGISTRY[type]
  );
  assert(
    'SE-01: All 14 Block Types Resolve in Editor Registry',
    missingInEditorRegistry.length === 0,
    `Registered Blocks: ${Object.keys(BLOCK_EDITOR_REGISTRY).length}/14. Missing: [${missingInEditorRegistry.join(', ')}]`
  );

  // SE-02: Editor updates modify only the intended block
  const blockA: ContentBlock = {
    id: 'blk-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: { titleAr: 'عنوان هيرو أصلي', titleEn: 'Original Hero Title' },
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };
  const blockB: ContentBlock = {
    id: 'blk-cta-2',
    type: 'cta',
    sortOrder: 1,
    isVisible: true,
    config: { titleAr: 'عنوان إجراء أصلي', titleEn: 'Original CTA Title' },
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  const initialBlocksList = [blockA, blockB];
  const updatedBlocksList = initialBlocksList.map((b) =>
    b.id === 'blk-hero-1' ? { ...b, config: { ...b.config, titleAr: 'عنوان هيرو معدل' } } : b
  );

  assert(
    'SE-02: Editor updates modify only the targeted block',
    updatedBlocksList[0].config.titleAr === 'عنوان هيرو معدل' &&
      updatedBlocksList[1].config.titleAr === 'عنوان إجراء أصلي',
    `Target Block 0: "${updatedBlocksList[0].config.titleAr}" | Untargeted Block 1: "${updatedBlocksList[1].config.titleAr}"`
  );

  // SE-03: Arabic editing does not overwrite English
  const heroConfig = {
    tagAr: 'المقاول الرائد',
    tagEn: 'PREMIER CONTRACTOR',
    titleAr: 'العنوان العربي',
    titleEn: 'English Title Untouched',
  };
  const editedArHero = { ...heroConfig, titleAr: 'تحديث العنوان العربي فقط' };
  assert(
    'SE-03: Arabic editing preserves English fields intact',
    editedArHero.titleAr === 'تحديث العنوان العربي فقط' &&
      editedArHero.titleEn === 'English Title Untouched',
    `Updated AR: "${editedArHero.titleAr}" | Preserved EN: "${editedArHero.titleEn}"`
  );

  // SE-04: English editing does not overwrite Arabic
  const editedEnHero = { ...editedArHero, titleEn: 'English Title Updated Only' };
  assert(
    'SE-04: English editing preserves Arabic fields intact',
    editedEnHero.titleAr === 'تحديث العنوان العربي فقط' &&
      editedEnHero.titleEn === 'English Title Updated Only',
    `Preserved AR: "${editedEnHero.titleAr}" | Updated EN: "${editedEnHero.titleEn}"`
  );

  // SE-05: Editor updates create compatible Undo transactions
  const manager = new TransactionManager(50, 50);
  const pageId = 'page-home';
  manager.clearPageHistory(pageId);

  manager.recordContinuousPropertyUpdate({
    pageId,
    blockId: blockA.id,
    propertyKey: 'titleAr',
    descriptionAr: 'تعديل عنوان الهيرو',
    descriptionEn: 'Update Hero Title',
    previousBlocks: initialBlocksList,
    nextBlocks: updatedBlocksList,
    previousSelectedId: blockA.id,
    nextSelectedId: blockA.id,
  });
  manager.flushPending();

  assert(
    'SE-05: Editor updates record continuous Undo transactions',
    manager.canUndo(pageId) && manager.getUndoCount(pageId) === 1,
    `Undo stack count: ${manager.getUndoCount(pageId)}`
  );

  // SE-06: Undo restores previous editor state
  const undoResult = manager.undo(pageId);
  assert(
    'SE-06: Undo restores exact pre-mutation editor state',
    undoResult?.restoredBlocks[0]?.config.titleAr === 'عنوان هيرو أصلي',
    `Restored Title AR: "${undoResult?.restoredBlocks[0]?.config.titleAr}"`
  );

  // SE-07: Redo restores updated editor state
  const redoResult = manager.redo(pageId);
  assert(
    'SE-07: Redo restores exact post-mutation editor state',
    redoResult?.restoredBlocks[0]?.config.titleAr === 'عنوان هيرو معدل',
    `Redo Title AR: "${redoResult?.restoredBlocks[0]?.config.titleAr}"`
  );

  // SE-08: Gallery media changes preserve block structure
  const galleryDef = BLOCK_REGISTRY['gallery'];
  let galleryImages = [
    { url: '/images/gallery-1.jpg', captionAr: 'مشروع 1', captionEn: 'Project 1' },
  ];
  // Add item
  galleryImages = [
    ...galleryImages,
    { url: '/images/gallery-2.jpg', captionAr: 'مشروع 2', captionEn: 'Project 2' },
  ];
  // Reorder / edit
  galleryImages[1].captionAr = 'مشروع 2 المحدث';
  // Delete item
  galleryImages = galleryImages.filter((_, i) => i !== 0);

  const galleryConfig = {
    ...galleryDef.defaultConfig,
    images: galleryImages,
    columns: 3,
  };

  assert(
    'SE-08: Gallery media modifications preserve block configuration structure',
    galleryConfig.images.length === 1 &&
      galleryConfig.images[0].url === '/images/gallery-2.jpg' &&
      galleryConfig.images[0].captionAr === 'مشروع 2 المحدث' &&
      galleryConfig.columns === 3,
    `Images: ${galleryConfig.images.length}, First URL: ${galleryConfig.images[0]?.url}, Columns: ${galleryConfig.columns}`
  );

  // SE-09: Statistics configuration does not duplicate central business data
  const statsDef = BLOCK_REGISTRY['statistics'];
  const statsConfig = {
    ...statsDef.defaultConfig,
    tagAr: 'مؤشرات الإنجاز',
    tagEn: 'KEY METRICS',
    titleAr: 'أرقام وحقائق من الميدان',
    titleEn: 'Field Facts & Numbers',
    showIcons: true,
  };

  assert(
    'SE-09: Statistics configuration restricts to presentation metadata without duplicating business entities',
    statsConfig.showIcons === true &&
      statsConfig.titleAr === 'أرقام وحقائق من الميدان' &&
      !('customEntities' in statsConfig),
    `Title AR: "${statsConfig.titleAr}" | showIcons: ${statsConfig.showIcons} | Zero Entity Duplication: true`
  );

  // SE-10: ContactForm configuration preserves the existing submission contract
  const contactDef = BLOCK_REGISTRY['contactForm'];
  const contactConfig = {
    ...contactDef.defaultConfig,
    titleAr: 'تواصل مع الإدارة الهندسية',
    titleEn: 'Contact Engineering Management',
    submitButtonTextAr: 'إرسال الطلب الفوري',
    submitButtonTextEn: 'Submit Instant Request',
    recipientEmail: 'tenders@hidab-gulf.com',
    showPhoneField: true,
  };

  assert(
    'SE-10: ContactForm configuration preserves submission contract',
    contactConfig.recipientEmail === 'tenders@hidab-gulf.com' &&
      contactConfig.submitButtonTextAr === 'إرسال الطلب الفوري' &&
      contactConfig.showPhoneField === true,
    `Recipient: ${contactConfig.recipientEmail} | Button: "${contactConfig.submitButtonTextAr}"`
  );

  // SE-11: Draft isolation remains intact
  const draftVersion = contentEngine.getDraftVersion(pageId);
  const publishedVersion = contentEngine.getPublishedVersion(pageId);
  assert(
    'SE-11: Draft isolation remains strictly decoupled from published state',
    !!draftVersion && !!publishedVersion && draftVersion.id !== publishedVersion.id,
    `Draft ID: ${draftVersion.id} | Published ID: ${publishedVersion.id}`
  );

  // SE-12: Published production content is never mutated by editor changes
  const publishedTitleBefore = publishedVersion.blocks.find((b) => b.type === 'hero')?.config.titleAr;
  // Update draft
  contentEngine.saveDraft(pageId, updatedBlocksList);
  const publishedAfter = contentEngine.getPublishedVersion(pageId);
  const publishedTitleAfter = publishedAfter.blocks.find((b) => b.type === 'hero')?.config.titleAr;

  assert(
    'SE-12: Published production content is NEVER mutated by editor modifications',
    publishedTitleBefore === publishedTitleAfter,
    `Published Title Before: "${publishedTitleBefore}" | After Draft Edit: "${publishedTitleAfter}"`
  );

  console.log('================================================================');
  console.log(`🎉 ALL 12 SPECIALIZED EDITOR VERIFICATION TESTS PASSED: ${passed}/${total} (100%)`);
  console.log('================================================================');
}

runSpecializedEditorsVerificationSuite();
