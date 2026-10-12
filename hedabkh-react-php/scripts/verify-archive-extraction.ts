/**
 * Archive Integrity & Extraction Verification Harness
 * Tests extraction into isolated temp folder and audits archive contents.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const RELEASE_DIR = path.join(ROOT_DIR, 'release');
const TEMP_EXTRACT_DIR = path.join(ROOT_DIR, '.temp_extract_test');

export function verifyArchiveIntegrity() {
  console.log('================================================================');
  console.log('📦 RUNNING ARCHIVE INTEGRITY & EXTRACTION VERIFICATION');
  console.log('================================================================');

  const sourceArchive = path.join(RELEASE_DIR, 'hedabkh-portal-v1.0.0-rc1.tar.gz');
  const dataArchive = path.join(RELEASE_DIR, 'hedabkh-data-v1.0.0-rc1.tar.gz');

  if (!fs.existsSync(sourceArchive) || !fs.existsSync(dataArchive)) {
    throw new Error('Release archives not found in release/');
  }

  // 1. Check size & SHA256
  const sourceBuf = fs.readFileSync(sourceArchive);
  const dataBuf = fs.readFileSync(dataArchive);

  const sourceSha = crypto.createHash('sha256').update(sourceBuf).digest('hex');
  const dataSha = crypto.createHash('sha256').update(dataBuf).digest('hex');

  console.log(`Source Archive: ${sourceArchive}`);
  console.log(`Size:           ${sourceBuf.length} Bytes`);
  console.log(`SHA256:         ${sourceSha}`);

  console.log(`Data Archive:   ${dataArchive}`);
  console.log(`Size:           ${dataBuf.length} Bytes`);
  console.log(`SHA256:         ${dataSha}`);

  // 2. Test extraction into isolated temp directory
  if (fs.existsSync(TEMP_EXTRACT_DIR)) {
    fs.rmSync(TEMP_EXTRACT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEMP_EXTRACT_DIR, { recursive: true });

  console.log(`Testing extraction into: ${TEMP_EXTRACT_DIR}...`);
  execSync(`tar -xzf "${sourceArchive}" -C "${TEMP_EXTRACT_DIR}"`, { stdio: 'inherit' });
  execSync(`tar -xzf "${dataArchive}" -C "${TEMP_EXTRACT_DIR}"`, { stdio: 'inherit' });

  // 3. Inspect extracted files
  const extractedFiles = fs.readdirSync(TEMP_EXTRACT_DIR);
  console.log(`Extracted top-level items: ${extractedFiles.join(', ')}`);

  // Verify critical files exist in extracted package
  const expectedItems = [
    'src',
    'public',
    'scripts',
    'nginx',
    'data',
    'package.json',
    'package-lock.json',
    'next.config.ts',
    'tsconfig.json',
    'ecosystem.config.cjs',
    '.env.production.example',
  ];

  for (const item of expectedItems) {
    const p = path.join(TEMP_EXTRACT_DIR, item);
    if (!fs.existsSync(p)) {
      throw new Error(`Missing expected item in extracted archive: ${item}`);
    }
  }

  // Verify no forbidden files are in extracted source
  const forbiddenItems = ['node_modules', '.next', '.git', '.env.production', '.env.local'];
  for (const item of forbiddenItems) {
    const p = path.join(TEMP_EXTRACT_DIR, item);
    if (fs.existsSync(p)) {
      throw new Error(`Forbidden item found in extracted archive: ${item}`);
    }
  }

  // Cleanup temp directory
  fs.rmSync(TEMP_EXTRACT_DIR, { recursive: true, force: true });

  console.log('================================================================');
  console.log('✅ ARCHIVE INTEGRITY & ISOLATED EXTRACTION: 100% PASS');
  console.log('================================================================');
  return { sourceSha, dataSha };
}

if (require.main === module) {
  try {
    verifyArchiveIntegrity();
  } catch (err) {
    console.error('❌ Archive integrity test failed:', err);
    process.exit(1);
  }
}
