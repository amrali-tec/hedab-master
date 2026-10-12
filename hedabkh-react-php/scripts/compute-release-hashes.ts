/**
 * Release Cryptographic Hash Inventory Generator
 * Calculates deterministic SHA256 hashes and file sizes for all release-critical files.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface FileHashEntry {
  file: string;
  sha256: string;
  sizeBytes: number;
}

const CRITICAL_FILES = [
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  '.env.production.example',
  'ecosystem.config.cjs',
  'nginx/gulf-hills-portal.conf',
  'data/cms_database.json',
  'release/FINAL_RELEASE_MANIFEST.md',
  'release/FINAL_DEPLOYMENT_HANDOFF_CHECKLIST.md',
  'release/FINAL_RELEASE_IDENTITY.md',
  'release/FINAL_LOCAL_RELEASE_GATE_REPORT.md',
  'release/RELEASE_METADATA.json',
];

export function computeReleaseHashes(): FileHashEntry[] {
  const root = process.cwd();
  const results: FileHashEntry[] = [];

  for (const relPath of CRITICAL_FILES) {
    const fullPath = path.join(root, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath);
      const sha256 = crypto.createHash('sha256').update(content).digest('hex');
      const sizeBytes = fs.statSync(fullPath).size;
      results.push({
        file: relPath.replace(/\\/g, '/'),
        sha256,
        sizeBytes,
      });
    }
  }

  return results;
}

if (require.main === module) {
  console.log('================================================================');
  console.log('🔒 RELEASE CRYPTOGRAPHIC HASH INVENTORY');
  console.log('================================================================');
  const hashes = computeReleaseHashes();
  for (const h of hashes) {
    console.log(`${h.sha256}  ${String(h.sizeBytes).padStart(8)}B  ${h.file}`);
  }
  console.log('================================================================');
}
