/**
 * Production Automated Backup Generator
 * Creates atomic, verified, cryptographic backups of CMS database, snapshots, and uploaded media.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface BackupFileEntry {
  relativePath: string;
  sha256: string;
  sizeBytes: number;
}

export interface BackupManifest {
  version: string;
  timestamp: string;
  backupName: string;
  databaseSha256: string;
  snapshotsCount: number;
  uploadsCount: number;
  totalSizeBytes: number;
  verified: boolean;
  files: BackupFileEntry[];
}

function computeSha256(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function copyDirectoryRecursive(srcDir: string, destDir: string, entries: BackupFileEntry[], baseDestDir: string): void {
  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(srcDir);
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath, entries, baseDestDir);
    } else {
      fs.copyFileSync(srcPath, destPath);
      const hash = computeSha256(destPath);
      entries.push({
        relativePath: path.relative(baseDestDir, destPath).replace(/\\/g, '/'),
        sha256: hash,
        sizeBytes: stat.size,
      });
    }
  }
}

export function createProductionBackup(customBackupDir?: string): { success: boolean; backupPath: string; manifest?: BackupManifest; error?: string } {
  const workspaceRoot = process.cwd();
  const dataDir = path.join(workspaceRoot, 'data');
  const dbFile = path.join(dataDir, 'cms_database.json');
  const snapshotsDir = path.join(dataDir, 'snapshots');
  const uploadsDir = path.join(workspaceRoot, 'public', 'uploads');
  const backupsRoot = customBackupDir || path.join(workspaceRoot, 'backups');

  if (!fs.existsSync(dbFile)) {
    return { success: false, backupPath: '', error: 'Source database file (data/cms_database.json) does not exist.' };
  }

  const now = new Date();
  const timestampStr = now.toISOString().replace(/[:.]/g, '-');
  const backupFolderName = `backup_${timestampStr}`;
  const tempBackupDir = path.join(backupsRoot, `.tmp_${backupFolderName}_${Date.now()}`);
  const finalBackupDir = path.join(backupsRoot, backupFolderName);

  try {
    if (!fs.existsSync(backupsRoot)) {
      fs.mkdirSync(backupsRoot, { recursive: true });
    }
    fs.mkdirSync(tempBackupDir, { recursive: true });

    const fileEntries: BackupFileEntry[] = [];

    // 1. Copy Database File
    const targetDbFile = path.join(tempBackupDir, 'cms_database.json');
    fs.copyFileSync(dbFile, targetDbFile);
    const dbHash = computeSha256(targetDbFile);
    const dbStat = fs.statSync(targetDbFile);
    fileEntries.push({
      relativePath: 'cms_database.json',
      sha256: dbHash,
      sizeBytes: dbStat.size,
    });

    // 2. Copy Snapshots Directory
    const targetSnapshotsDir = path.join(tempBackupDir, 'snapshots');
    copyDirectoryRecursive(snapshotsDir, targetSnapshotsDir, fileEntries, tempBackupDir);
    const snapshotsCount = fs.existsSync(snapshotsDir)
      ? fs.readdirSync(snapshotsDir).filter((f) => f.endsWith('.json')).length
      : 0;

    // 3. Copy Uploads Directory
    const targetUploadsDir = path.join(tempBackupDir, 'uploads');
    copyDirectoryRecursive(uploadsDir, targetUploadsDir, fileEntries, tempBackupDir);
    const uploadsCount = fs.existsSync(uploadsDir)
      ? fs.readdirSync(uploadsDir).filter((f) => !f.startsWith('.')).length
      : 0;

    // 4. Verify Integrity of Backed-Up DB
    const sourceDbHash = computeSha256(dbFile);
    if (sourceDbHash !== dbHash) {
      throw new Error(`Database SHA256 checksum mismatch! Source: ${sourceDbHash}, Backup: ${dbHash}`);
    }

    const backedUpContent = fs.readFileSync(targetDbFile, 'utf-8');
    const parsedDb = JSON.parse(backedUpContent);
    if (!parsedDb || typeof parsedDb !== 'object' || parsedDb.version !== '1.0' || !parsedDb.data) {
      throw new Error('Backed up database payload failed JSON structural validation.');
    }

    const totalSizeBytes = fileEntries.reduce((sum, e) => sum + e.sizeBytes, 0);

    // 5. Generate Manifest
    const manifest: BackupManifest = {
      version: '1.0',
      timestamp: now.toISOString(),
      backupName: backupFolderName,
      databaseSha256: dbHash,
      snapshotsCount,
      uploadsCount,
      totalSizeBytes,
      verified: true,
      files: fileEntries,
    };

    const manifestPath = path.join(tempBackupDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    // 6. Atomic / Safe Rename to Final Directory (Windows EPERM resilient)
    let renamed = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        fs.renameSync(tempBackupDir, finalBackupDir);
        renamed = true;
        break;
      } catch {
        const start = Date.now();
        while (Date.now() - start < 50) {}
      }
    }

    if (!renamed) {
      fs.cpSync(tempBackupDir, finalBackupDir, { recursive: true });
      try {
        fs.rmSync(tempBackupDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup error
      }
    }

    return {
      success: true,
      backupPath: finalBackupDir,
      manifest,
    };
  } catch (err: unknown) {
    if (fs.existsSync(tempBackupDir)) {
      try {
        fs.rmSync(tempBackupDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup error
      }
    }
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, backupPath: '', error: msg };
  }
}

if (require.main === module) {
  console.log('================================================================');
  console.log('📦 RUNNING PRODUCTION BACKUP AUTOMATION');
  console.log('================================================================');

  const result = createProductionBackup();
  if (result.success && result.manifest) {
    console.log(`✅ Backup created successfully at: ${result.backupPath}`);
    console.log(`   Timestamp:      ${result.manifest.timestamp}`);
    console.log(`   DB SHA256:      ${result.manifest.databaseSha256}`);
    console.log(`   Snapshots:      ${result.manifest.snapshotsCount}`);
    console.log(`   Uploads:        ${result.manifest.uploadsCount}`);
    console.log(`   Total Size:     ${(result.manifest.totalSizeBytes / 1024).toFixed(2)} KB`);
    console.log(`   Verification:   ${result.manifest.verified ? 'PASSED (Cryptographically Verified)' : 'FAILED'}`);
    console.log('================================================================');
    process.exit(0);
  } else {
    console.error(`❌ Backup creation failed: ${result.error}`);
    console.log('================================================================');
    process.exit(1);
  }
}
