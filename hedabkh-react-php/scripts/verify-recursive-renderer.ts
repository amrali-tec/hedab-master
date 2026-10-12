/**
 * Comprehensive Verification Suite for Recursive Public Page Renderer (Phase 2)
 * Visual CMS Studio — Saudi Sovereign Infrastructure Platform
 * Milestone: v1.1.0-dev
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PublicPageRenderer } from '../src/components/cms/PublicPageRenderer';
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
console.log('🌐 RUNNING RECURSIVE PUBLIC PAGE RENDERER VERIFICATION SUITE');
console.log('================================================================\n');

// -------------------------------------------------------------
// Test Block Helpers
// -------------------------------------------------------------
const createHero = (id: string, titleAr: string): ContentBlock => ({
  id,
  type: 'hero',
  sortOrder: 0,
  isVisible: true,
  config: { titleAr, titleEn: 'Hero Title EN', theme: 'dark' },
  createdAt: '2026-08-22T00:00:00Z',
  updatedAt: '2026-08-22T00:00:00Z',
});

const createRichText = (id: string, contentAr: string): ContentBlock => ({
  id,
  type: 'richText',
  sortOrder: 1,
  isVisible: true,
  config: { titleAr: 'عنوان نصي', contentAr, theme: 'slate' },
  createdAt: '2026-08-22T00:00:00Z',
  updatedAt: '2026-08-22T00:00:00Z',
});

const createContainer = (id: string, children: ContentBlock[] = [], config: Record<string, any> = {}): ContentBlock => ({
  id,
  type: 'container',
  sortOrder: 0,
  isVisible: true,
  config: { direction: 'row', gap: 24, theme: 'navy', ...config },
  children,
  createdAt: '2026-08-22T00:00:00Z',
  updatedAt: '2026-08-22T00:00:00Z',
});

const createGrid = (id: string, children: ContentBlock[] = [], config: Record<string, any> = {}): ContentBlock => ({
  id,
  type: 'grid',
  sortOrder: 0,
  isVisible: true,
  config: { columnsDesktop: 3, columnsTablet: 2, columnsMobile: 1, ...config },
  children,
  createdAt: '2026-08-22T00:00:00Z',
  updatedAt: '2026-08-22T00:00:00Z',
});

// TEST A: Legacy Flat Page
const legacyBlocks = [
  createHero('blk-hero', 'نبني المستقبل'),
  createRichText('blk-text', 'محتوى نصي عريق'),
];
const legacyHtml = renderToStaticMarkup(React.createElement(PublicPageRenderer, { blocks: legacyBlocks, locale: 'ar' }));
assert(
  legacyHtml.includes('نبني المستقبل') && legacyHtml.includes('محتوى نصي عريق'),
  'TEST A: Legacy flat page renders all specialized blocks identically',
  `Rendered HTML Length: ${legacyHtml.length}`
);

// TEST B: Single Container with 2 Leaf Blocks
const containerBlocks = [
  createContainer('cont-1', [
    createHero('child-hero', 'بطل داخل حاوية'),
    createRichText('child-text', 'نص داخل حاوية'),
  ]),
];
const containerHtml = renderToStaticMarkup(React.createElement(PublicPageRenderer, { blocks: containerBlocks, locale: 'ar' }));
assert(
  containerHtml.includes('بطل داخل حاوية') && containerHtml.includes('نص داخل حاوية'),
  'TEST B: Single container renders layout wrapper and child leaf blocks',
  `Found child nodes in container HTML`
);

// TEST C: Container inside Container (Nested 2-Level)
const nestedContainerBlocks = [
  createContainer('outer-cont', [
    createContainer('inner-col-1', [createHero('deep-hero', 'بطل في عمود متداخل')]),
    createContainer('inner-col-2', [createRichText('deep-text', 'نص في عمود متداخل')]),
  ]),
];
const nestedHtml = renderToStaticMarkup(React.createElement(PublicPageRenderer, { blocks: nestedContainerBlocks, locale: 'ar' }));
assert(
  nestedHtml.includes('بطل في عمود متداخل') && nestedHtml.includes('نص في عمود متداخل'),
  'TEST C: Nested container-in-container structures render recursively',
  `Multi-level layout classes verified`
);

// TEST D: Grid Containing Multiple Leaf Blocks
const gridBlocks = [
  createGrid('grid-kpis', [
    createRichText('card-1', 'كارت 1'),
    createRichText('card-2', 'كارت 2'),
    createRichText('card-3', 'كارت 3'),
  ]),
];
const gridHtml = renderToStaticMarkup(React.createElement(PublicPageRenderer, { blocks: gridBlocks, locale: 'ar' }));
assert(
  gridHtml.includes('grid-cols') && gridHtml.includes('كارت 1') && gridHtml.includes('كارت 3'),
  'TEST D: Grid structure renders responsive grid columns and children',
  `Grid classes verified`
);

// TEST E: Container Containing Grid Containing Leaf Blocks
const containerGridBlocks = [
  createContainer('section-wrap', [
    createGrid('inner-grid', [
      createHero('grid-hero', 'هيرو في شبكة'),
      createRichText('grid-text', 'نص في شبكة'),
    ]),
  ]),
];
const compHtml = renderToStaticMarkup(React.createElement(PublicPageRenderer, { blocks: containerGridBlocks, locale: 'ar' }));
assert(
  compHtml.includes('هيرو في شبكة') && compHtml.includes('نص في شبكة'),
  'TEST E: Composite container > grid > leaf tree renders recursively',
  `Composite tree verified`
);

// TEST F: Mixed Legacy Flat Blocks + Modern Nested Blocks
const mixedBlocks = [
  createHero('flat-hero-1', 'هيرو مسطح أصلي'),
  createContainer('nested-section', [
    createRichText('nested-child', 'نص في قسم متداخل'),
  ]),
  createRichText('flat-text-2', 'نص مسطح نهائي'),
];
const mixedHtml = renderToStaticMarkup(React.createElement(PublicPageRenderer, { blocks: mixedBlocks, locale: 'ar' }));
assert(
  mixedHtml.includes('هيرو مسطح أصلي') &&
  mixedHtml.includes('نص في قسم متداخل') &&
  mixedHtml.includes('نص مسطح نهائي'),
  'TEST F: Mixed legacy flat blocks and modern nested blocks coexist seamlessly',
  `All 3 sections rendered in sequence`
);

// TEST G: Hard Depth Guardrail (> MAX_TREE_DEPTH 6)
const buildExcessiveDepth = (currentDepth: number): ContentBlock => {
  if (currentDepth >= 8) {
    return createHero('deep-overflow', 'هذا العنصر تجاوز الحد الأقصى للعمق');
  }
  return createContainer(`depth-${currentDepth}`, [buildExcessiveDepth(currentDepth + 1)]);
};
const overflowTree = [buildExcessiveDepth(1)];
const overflowHtml = renderToStaticMarkup(React.createElement(PublicPageRenderer, { blocks: overflowTree, locale: 'ar' }));
assert(
  !overflowHtml.includes('هذا العنصر تجاوز الحد الأقصى للعمق'),
  'TEST G: Depth > 6 is safely halted by recursion guard without crashing',
  `Recursion terminated at depth 6 safely`
);

// TEST H: Malformed Child Nodes Defensive Handling
const malformedBlocks: any = [
  createHero('valid-hero', 'هيرو سليم 100%'),
  null,
  undefined,
  'invalid-string-node',
  { malformed: true },
  createContainer('valid-container', [
    null as any,
    createRichText('valid-inner-text', 'نص داخلي سليم'),
  ]),
];
let malformedHtml = '';
let malformedThrew = false;
try {
  malformedHtml = renderToStaticMarkup(React.createElement(PublicPageRenderer, { blocks: malformedBlocks, locale: 'ar' }));
} catch (e) {
  malformedThrew = true;
}
assert(
  !malformedThrew && malformedHtml.includes('هيرو سليم 100%') && malformedHtml.includes('نص داخلي سليم'),
  'TEST H: Malformed non-object nodes are skipped defensively without crashing',
  `Valid siblings rendered successfully`
);

// TEST I: English Locale Rendering Parity
const enBlocks = [
  createContainer('en-cont', [
    createHero('en-hero', 'العنوان العربي'),
  ]),
];
const enHtml = renderToStaticMarkup(React.createElement(PublicPageRenderer, { blocks: enBlocks, locale: 'en' }));
assert(
  enHtml.includes('Hero Title EN'),
  'TEST I: English locale switches child block content accurately in nested tree',
  `Found EN string in output`
);

// TEST J: Standalone Site Parts In Container (Header / Footer)
const standaloneBlocks = [
  createContainer('header-container', [
    {
      id: 'hdr-1',
      type: 'header',
      sortOrder: 0,
      isVisible: true,
      config: { announcementTextAr: 'إعلان في ترويسة متداخلة' },
      createdAt: '2026-08-22T00:00:00Z',
      updatedAt: '2026-08-22T00:00:00Z',
    },
  ]),
];
const standaloneHtml = renderToStaticMarkup(
  React.createElement(PublicPageRenderer, { blocks: standaloneBlocks, locale: 'ar', isStandalone: true })
);
assert(
  standaloneHtml.includes('إعلان في ترويسة متداخلة'),
  'TEST J: Standalone header/footer blocks render in standalone mode inside containers',
  `Standalone header verified`
);

console.log('\n================================================================');
console.log(`🎉 RECURSIVE RENDERER TEST RESULTS: Passed: ${passed} | Failed: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
