/**
 * Production Backup Retention & Pruning Utility
 * Enforces Grandfather-Father-Son (GFS) retention policy:
 * - 7 Daily backups
 * - 4 Weekly backups
 * - 3 Monthly backups
 * Strictly prohibits deleting live data or the sole remaining valid backup.
 */

import fs from 'fs';
import path from 'path';

export interface PruneResult {
  totalFound: number;
  validFound: number;
  retained: string[];
  pruned: string[];
  skippedReason?: string;
}

export function pruneProductionBackups(customBackupDir?: string): PruneResult {
  const workspaceRoot = process.cwd();
  const backupsRoot = customBackupDir || path.join(workspaceRoot, 'backups');

  if (!fs.existsSync(backupsRoot)) {
    return { totalFound: 0, validFound: 0, retained: [], pruned: [], skippedReason: 'Backups directory does not exist.' };
  }

  const entries = fs.readdirSync(backupsRoot);
  const backupDirs = entries
    .filter((name) => name.startsWith('backup_') && !name.startsWith('.'))
    .map((name) => {
      const fullPath = path.join(backupsRoot, name);
      const manifestPath = path.join(fullPath, 'manifest.json');
      let timestamp = 0;
      let isValid = false;

      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          if (manifest && manifest.timestamp && manifest.verified) {
            timestamp = new Date(manifest.timestamp).getTime();
            isValid = true;
          }
        } catch {
          isValid = false;
        }
      }

      if (!timestamp) {
        try {
          timestamp = fs.statSync(fullPath).mtime.getTime();
        } catch {
          timestamp = 0;
        }
      }

      return {
        name,
        fullPath,
        timestamp,
        isValid,
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp); // Newest first

  const validBackups = backupDirs.filter((b) => b.isValid);

  // Safety Rule: Never prune if 1 or 0 valid backups exist
  if (validBackups.length <= 1) {
    return {
      totalFound: backupDirs.length,
      validFound: validBackups.length,
      retained: backupDirs.map((b) => b.name),
      pruned: [],
      skippedReason: 'Safety guard active: At least 1 valid backup must always be preserved.',
    };
  }

  // Classify retention sets (GFS)
  const kept = new Set<string>();

  // Always keep the absolute most recent backup
  kept.add(validBackups[0].name);

  // 1. Daily: 1 per day for last 7 days
  const dailyMap = new Map<string, string>();
  // 2. Weekly: 1 per week for last 4 weeks
  const weeklyMap = new Map<string, string>();
  // 3. Monthly: 1 per month for last 3 months
  const monthlyMap = new Map<string, string>();

  for (const backup of validBackups) {
    const d = new Date(backup.timestamp);
    const dayKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    const weekKey = `${d.getUTCFullYear()}-W${Math.ceil(d.getUTCDate() / 7)}`;
    const monthKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

    if (dailyMap.size < 7 && !dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, backup.name);
      kept.add(backup.name);
    }
    if (weeklyMap.size < 4 && !weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, backup.name);
      kept.add(backup.name);
    }
    if (monthlyMap.size < 3 && !monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, backup.name);
      kept.add(backup.name);
    }
  }

  const pruned: string[] = [];
  const retained: string[] = [];

  for (const backup of backupDirs) {
    if (kept.has(backup.name)) {
      retained.push(backup.name);
    } else {
      try {
        fs.rmSync(backup.fullPath, { recursive: true, force: true });
        pruned.push(backup.name);
      } catch (err: unknown) {
        console.warn(`Failed to remove expired backup [${backup.name}]:`, err);
        retained.push(backup.name);
      }
    }
  }

  return {
    totalFound: backupDirs.length,
    validFound: validBackups.length,
    retained,
    pruned,
  };
}

if (require.main === module) {
  console.log('================================================================');
  console.log('🧹 RUNNING PRODUCTION BACKUP PRUNING');
  console.log('================================================================');

  const result = pruneProductionBackups();
  console.log(`Total Backups Found:  ${result.totalFound}`);
  console.log(`Valid Backups Found:  ${result.validFound}`);
  console.log(`Retained Backups:     ${result.retained.length}`);
  console.log(`Pruned Backups:       ${result.pruned.length}`);
  if (result.skippedReason) {
    console.log(`Note:                 ${result.skippedReason}`);
  }
  console.log('================================================================');
}
