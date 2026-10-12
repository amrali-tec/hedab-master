/**
 * Production Automated Backup Restore Utility
 * Safely restores CMS database, snapshots, and uploaded media from verified backups.
 * Features mandatory pre-restore backup generation, SHA256 verification, and dry-run mode.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createProductionBackup, BackupManifest } from './create-production-backup';

export interface RestoreOptions {
  backupTarget?: string;
  dryRun?: boolean;
  skipPreRestoreBackup?: boolean;
}

export interface RestoreResult {
  success: boolean;
  dryRun: boolean;
  backupUsed: string;
  preRestoreBackupPath?: string;
  restoredDbSha256?: string;
  restoredSnapshotsCount?: number;
  restoredUploadsCount?: number;
  error?: string;
}

function computeSha256(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function copyDirectoryRecursive(srcDir: string, destDir: string): void {
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
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function restoreProductionBackup(options: RestoreOptions = {}): RestoreResult {
  const workspaceRoot = process.cwd();
  const backupsRoot = path.join(workspaceRoot, 'backups');
  const dataDir = path.join(workspaceRoot, 'data');
  const liveDbPath = path.join(dataDir, 'cms_database.json');
  const liveSnapshotsDir = path.join(dataDir, 'snapshots');
  const liveUploadsDir = path.join(workspaceRoot, 'public', 'uploads');

  const dryRun = Boolean(options.dryRun);

  // 1. Locate Target Backup Directory
  let backupDir = options.backupTarget;
  if (!backupDir) {
    if (!fs.existsSync(backupsRoot)) {
      return { success: false, dryRun, backupUsed: '', error: 'No backups directory found.' };
    }
    const entries = fs.readdirSync(backupsRoot).filter((d) => d.startsWith('backup_') && !d.startsWith('.'));
    if (entries.length === 0) {
      return { success: false, dryRun, backupUsed: '', error: 'No valid backups found in backups/ directory.' };
    }
    entries.sort().reverse();
    backupDir = path.join(backupsRoot, entries[0]);
  } else if (!path.isAbsolute(backupDir)) {
    backupDir = path.join(backupsRoot, backupDir);
  }

  if (!fs.existsSync(backupDir)) {
    return { success: false, dryRun, backupUsed: backupDir, error: `Backup directory does not exist: ${backupDir}` };
  }

  // 2. Validate Manifest
  const manifestPath = path.join(backupDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return { success: false, dryRun, backupUsed: backupDir, error: 'Backup is corrupted or incomplete: manifest.json is missing.' };
  }

  let manifest: BackupManifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    if (!manifest || !manifest.databaseSha256 || !manifest.files) {
      throw new Error('Manifest schema invalid.');
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, dryRun, backupUsed: backupDir, error: `Manifest parse failure: ${msg}` };
  }

  // 3. Validate All Checksums in Backup
  for (const fileEntry of manifest.files) {
    const backupFilePath = path.join(backupDir, fileEntry.relativePath);
    if (!fs.existsSync(backupFilePath)) {
      return {
        success: false,
        dryRun,
        backupUsed: backupDir,
        error: `Integrity check failed: missing file [${fileEntry.relativePath}] in backup.`,
      };
    }
    const currentHash = computeSha256(backupFilePath);
    if (currentHash !== fileEntry.sha256) {
      return {
        success: false,
        dryRun,
        backupUsed: backupDir,
        error: `Integrity check failed: SHA256 mismatch on [${fileEntry.relativePath}]. Expected ${fileEntry.sha256}, got ${currentHash}`,
      };
    }
  }

  // 4. Validate Database JSON Structure
  const backupDbPath = path.join(backupDir, 'cms_database.json');
  try {
    const dbContent = fs.readFileSync(backupDbPath, 'utf-8');
    const parsed = JSON.parse(dbContent);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== '1.0' || !parsed.data) {
      return {
        success: false,
        dryRun,
        backupUsed: backupDir,
        error: 'Database in backup is structurally invalid (missing version 1.0 or data field).',
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, dryRun, backupUsed: backupDir, error: `Database JSON parse error: ${msg}` };
  }

  // If Dry-Run, stop here and report valid
  if (dryRun) {
    return {
      success: true,
      dryRun: true,
      backupUsed: backupDir,
      restoredDbSha256: manifest.databaseSha256,
      restoredSnapshotsCount: manifest.snapshotsCount,
      restoredUploadsCount: manifest.uploadsCount,
    };
  }

  // 5. Mandatory Pre-Restore Backup
  let preRestoreBackupPath: string | undefined;
  if (!options.skipPreRestoreBackup && fs.existsSync(liveDbPath)) {
    const preBackupResult = createProductionBackup();
    if (!preBackupResult.success) {
      return {
        success: false,
        dryRun: false,
        backupUsed: backupDir,
        error: `Mandatory pre-restore backup failed: ${preBackupResult.error}. Aborting restore to protect production state.`,
      };
    }
    preRestoreBackupPath = preBackupResult.backupPath;
  }

  // 6. Execute Atomic Restoration
  try {
    // Restore DB atomically via temp file
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const tempLiveDb = path.join(dataDir, `.cms_database.json.restore.tmp.${Date.now()}`);
    fs.copyFileSync(backupDbPath, tempLiveDb);
    fs.renameSync(tempLiveDb, liveDbPath);

    // Restore Snapshots
    const backupSnapshotsDir = path.join(backupDir, 'snapshots');
    if (fs.existsSync(backupSnapshotsDir)) {
      if (!fs.existsSync(liveSnapshotsDir)) {
        fs.mkdirSync(liveSnapshotsDir, { recursive: true });
      }
      copyDirectoryRecursive(backupSnapshotsDir, liveSnapshotsDir);
    }

    // Restore Uploads
    const backupUploadsDir = path.join(backupDir, 'uploads');
    if (fs.existsSync(backupUploadsDir)) {
      if (!fs.existsSync(liveUploadsDir)) {
        fs.mkdirSync(liveUploadsDir, { recursive: true });
      }
      copyDirectoryRecursive(backupUploadsDir, liveUploadsDir);
    }

    // Verify Restored Live DB Hash
    const finalHash = computeSha256(liveDbPath);
    if (finalHash !== manifest.databaseSha256) {
      throw new Error(`Restored database hash mismatch! Expected ${manifest.databaseSha256}, got ${finalHash}`);
    }

    return {
      success: true,
      dryRun: false,
      backupUsed: backupDir,
      preRestoreBackupPath,
      restoredDbSha256: finalHash,
      restoredSnapshotsCount: manifest.snapshotsCount,
      restoredUploadsCount: manifest.uploadsCount,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      dryRun: false,
      backupUsed: backupDir,
      preRestoreBackupPath,
      error: `Restore operation failed during file copy: ${msg}`,
    };
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const targetIndex = args.indexOf('--backup');
  const backupTarget = targetIndex >= 0 ? args[targetIndex + 1] : undefined;

  console.log('================================================================');
  console.log(`🔄 RUNNING PRODUCTION BACKUP RESTORE ${dryRun ? '(DRY-RUN MODE)' : ''}`);
  console.log('================================================================');

  const result = restoreProductionBackup({ backupTarget, dryRun });

  if (result.success) {
    console.log(`✅ Restore ${dryRun ? 'Dry-Run Validation' : 'Execution'} PASSED!`);
    console.log(`   Backup Source:       ${result.backupUsed}`);
    if (result.preRestoreBackupPath) {
      console.log(`   Pre-Restore Safety:  ${result.preRestoreBackupPath}`);
    }
    console.log(`   Restored DB SHA256:  ${result.restoredDbSha256}`);
    console.log(`   Snapshots Restored:  ${result.restoredSnapshotsCount}`);
    console.log(`   Uploads Restored:    ${result.restoredUploadsCount}`);
    console.log('================================================================');
    process.exit(0);
  } else {
    console.error(`❌ Restore failed: ${result.error}`);
    console.log('================================================================');
    process.exit(1);
  }
}
