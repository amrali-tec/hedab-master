/**
 * Comprehensive Production Release Packaging & Hashing Engine
 * Visual CMS Studio — Saudi Sovereign Infrastructure Platform
 * Target Canonical Domain: https://hedabkh.com.sa
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const RELEASE_DIR = path.join(ROOT_DIR, 'release');

// Exact release payload items
const SOURCE_PAYLOAD = [
  'src',
  'public',
  'scripts',
  'nginx',
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'ecosystem.config.cjs',
  '.env.production.example',
  'AGENTS.md',
];

function collectFiles(itemPath: string, fileList: string[] = []): string[] {
  const full = path.join(ROOT_DIR, itemPath);
  if (!fs.existsSync(full)) return fileList;

  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    const entries = fs.readdirSync(full);
    for (const entry of entries) {
      collectFiles(path.join(itemPath, entry), fileList);
    }
  } else if (stat.isFile()) {
    fileList.push(itemPath);
  }
  return fileList;
}

export async function packageRelease() {
  console.log('================================================================');
  console.log('📦 PACKAGING COMPREHENSIVE PRODUCTION RELEASE ARCHIVES');
  console.log('================================================================');

  if (!fs.existsSync(RELEASE_DIR)) {
    fs.mkdirSync(RELEASE_DIR, { recursive: true });
  }

  // 1. Gather all release source files
  const allSourceFiles: string[] = [];
  for (const item of SOURCE_PAYLOAD) {
    collectFiles(item, allSourceFiles);
  }

  // Also include data files
  collectFiles('data', allSourceFiles);

  console.log(`Audited ${allSourceFiles.length} total source/config/data files for release.`);

  // 2. Compute full source SHA256 catalog
  const fullChecksums: string[] = [];
  for (const relPath of allSourceFiles.sort()) {
    const fullPath = path.join(ROOT_DIR, relPath);
    const content = fs.readFileSync(fullPath);
    const sha256 = crypto.createHash('sha256').update(content).digest('hex');
    const sizeBytes = fs.statSync(fullPath).size;
    const normalized = relPath.replace(/\\/g, '/');
    fullChecksums.push(`${sha256}  ${String(sizeBytes).padStart(10)}B  ${normalized}`);
  }

  const fullChecksumsPath = path.join(RELEASE_DIR, 'FULL_SOURCE_SHA256SUMS.txt');
  fs.writeFileSync(fullChecksumsPath, fullChecksums.join('\n') + '\n', 'utf-8');
  console.log(`✅ Generated comprehensive source SHA256 catalog: ${fullChecksumsPath}`);

  // 3. Create Source Archive: release/hedabkh-portal-v1.0.0-rc1.tar.gz
  const sourceArchiveName = 'hedabkh-portal-v1.0.0-rc1.tar.gz';
  const sourceArchivePath = path.join(RELEASE_DIR, sourceArchiveName);

  console.log(`Creating source archive: ${sourceArchiveName}...`);
  const payloadArgs = SOURCE_PAYLOAD.join(' ');
  execSync(`tar -czf "release/${sourceArchiveName}" ${payloadArgs}`, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });
  console.log(`✅ Source archive created: ${sourceArchivePath}`);

  // 4. Create Separate Data Archive: release/hedabkh-data-v1.0.0-rc1.tar.gz
  const dataArchiveName = 'hedabkh-data-v1.0.0-rc1.tar.gz';
  const dataArchivePath = path.join(RELEASE_DIR, dataArchiveName);
  console.log(`Creating separate persistent data archive: ${dataArchiveName}...`);

  execSync(`tar -czf "release/${dataArchiveName}" data public/uploads`, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });
  console.log(`✅ Data archive created: ${dataArchivePath}`);

  // 5. Compute SHA256 of the generated archives
  const archiveChecksums: string[] = [];
  for (const archive of [sourceArchiveName, dataArchiveName]) {
    const archPath = path.join(RELEASE_DIR, archive);
    if (fs.existsSync(archPath)) {
      const content = fs.readFileSync(archPath);
      const sha256 = crypto.createHash('sha256').update(content).digest('hex');
      const sizeBytes = fs.statSync(archPath).size;
      archiveChecksums.push(`${sha256}  ${String(sizeBytes).padStart(10)}B  ${archive}`);
    }
  }

  const archiveChecksumsPath = path.join(RELEASE_DIR, 'ARCHIVE_SHA256SUMS.txt');
  fs.writeFileSync(archiveChecksumsPath, archiveChecksums.join('\n') + '\n', 'utf-8');
  console.log(`✅ Generated archive SHA256 manifest: ${archiveChecksumsPath}`);

  console.log('================================================================');
  for (const line of archiveChecksums) {
    console.log(`📦 ARCHIVE: ${line}`);
  }
  console.log('================================================================');
}

if (require.main === module) {
  packageRelease().catch((err) => {
    console.error('Packaging failed:', err);
    process.exit(1);
  });
}
