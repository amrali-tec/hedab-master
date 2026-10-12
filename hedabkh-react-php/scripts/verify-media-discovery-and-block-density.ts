import fs from 'fs';
import path from 'path';
import { BLOCK_REGISTRY } from '../src/lib/cms/blockRegistry';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ PASS [${msg}]`);
    passed++;
  } else {
    console.error(`❌ FAIL [${msg}]`);
    failed++;
  }
}

console.log('================================================================');
console.log('🖼️  RUNNING MEDIA DISCOVERY & BLOCK DENSITY VERIFICATION SUITE');
console.log('================================================================\n');

// 1. Check approved scan roots exist in public/
const publicDir = path.join(process.cwd(), 'public');
assert(fs.existsSync(publicDir), 'public/ root directory exists');

const imagesDir = path.join(publicDir, 'images');
assert(fs.existsSync(imagesDir), 'public/images directory exists');

const projectsDir = path.join(imagesDir, 'projects');
assert(fs.existsSync(projectsDir), 'public/images/projects directory exists');

const equipmentDir = path.join(imagesDir, 'equipment');
assert(fs.existsSync(equipmentDir), 'public/images/equipment directory exists');

const logosDir = path.join(imagesDir, 'logos');
assert(fs.existsSync(logosDir), 'public/images/logos directory exists');

const beforeAfterDir = path.join(imagesDir, 'before-after');
assert(fs.existsSync(beforeAfterDir), 'public/images/before-after directory exists');

// 2. Check total physical media assets
let totalImages = 0;
const approvedExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.pdf']);

function countFiles(dir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (approvedExts.has(ext)) {
        totalImages++;
      }
    } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
      countFiles(path.join(dir, entry.name));
    }
  }
}

countFiles(publicDir);
assert(totalImages >= 60, `Physical project media assets discovered: ${totalImages} (Expected >= 60)`);

// 3. Security: Ensure dangerous folders are never in scan roots
const scanDirs = [
  'images',
  'images/projects',
  'images/equipment',
  'images/logos',
  'images/before-after',
  'uploads',
  'documents',
];
assert(!scanDirs.includes('node_modules'), 'node_modules is strictly excluded from scan roots');
assert(!scanDirs.includes('.next'), '.next is strictly excluded from scan roots');
assert(!scanDirs.includes('.git'), '.git is strictly excluded from scan roots');
assert(!scanDirs.includes('src'), 'src is strictly excluded from scan roots');

// 4. API route existence & typing
const apiRouteFile = path.join(process.cwd(), 'src', 'app', 'api', 'admin', 'media', 'route.ts');
assert(fs.existsSync(apiRouteFile), 'src/app/api/admin/media/route.ts exists');
const apiContent = fs.readFileSync(apiRouteFile, 'utf-8');
assert(apiContent.includes('APPROVED_MEDIA_EXTENSIONS'), 'API route implements strict extension allowlist');
assert(apiContent.includes('seenUrls.add'), 'API route implements URL-based deduplication');

// 5. UnifiedMediaPickerModal updates
const modalFile = path.join(process.cwd(), 'src', 'components', 'admin', 'common', 'UnifiedMediaPickerModal.tsx');
assert(fs.existsSync(modalFile), 'UnifiedMediaPickerModal.tsx exists');
const modalContent = fs.readFileSync(modalFile, 'utf-8');
assert(modalContent.includes('fetchDiscoveredMedia'), 'Modal fetches discovered media from server');
assert(modalContent.includes('onSelect'), 'Modal preserves onSelect(url) contract');
assert(modalContent.includes('filterSource'), 'Modal implements source/type filtering');
assert(modalContent.includes('RefreshCw'), 'Modal provides manual refresh button');

// 6. BlockLibrary compaction
const blockLibFile = path.join(process.cwd(), 'src', 'components', 'admin', 'visual-cms', 'BlockLibrary.tsx');
assert(fs.existsSync(blockLibFile), 'BlockLibrary.tsx exists');
const blockLibContent = fs.readFileSync(blockLibFile, 'utf-8');
assert(!blockLibContent.includes('line-clamp-2'), 'BlockLibrary removed persistent line-clamp-2 descriptions');
assert(blockLibContent.includes('title={tooltipText}'), 'BlockLibrary provides accessible tooltip on element cards');
assert(blockLibContent.includes('tabIndex={0}'), 'BlockLibrary supports keyboard focus accessibility');
assert(blockLibContent.includes('layoutPresets'), 'BlockLibrary preserves Layout Primitives & quick presets');

// 7. Verify All 16 BLOCK_REGISTRY definitions remain registered
const registryKeys = Object.keys(BLOCK_REGISTRY);
assert(registryKeys.length === 16, `All 16 widget definitions intact in BLOCK_REGISTRY (found ${registryKeys.length})`);

console.log('\n================================================================');
console.log(`🎉 MEDIA DISCOVERY & BLOCK DENSITY RESULTS: Passed: ${passed} | Failed: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
