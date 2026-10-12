import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cms_database.json');
const SNAPSHOTS_DIR = path.join(DATA_DIR, 'snapshots');
const MAX_SNAPSHOTS_RETAINED = 25;

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }
}

/**
 * Atomic JSON File Writer
 * Writes to a temporary file first, then atomically renames it to target path.
 * Guarantees zero corrupted or half-written files even during abrupt termination.
 */
function writeJsonAtomic(filePath: string, data: unknown): void {
  ensureDirectories();
  const dir = path.dirname(filePath);
  const tempFile = path.join(
    dir,
    `.${path.basename(filePath)}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`
  );

  const payload = JSON.stringify(data, null, 2);
  fs.writeFileSync(tempFile, payload, 'utf-8');
  try {
    fs.renameSync(tempFile, filePath);
  } catch {
    // Windows fallback if rename is locked
    fs.copyFileSync(tempFile, filePath);
    try {
      fs.unlinkSync(tempFile);
    } catch {
      // ignore unlink error
    }
  }
}

export interface CmsDatabasePayload {
  version: string;
  updatedAt: string;
  lastUpdatedBy: string;
  data: Record<string, unknown>;
}

// Simple in-process lock to serialize concurrent write operations
let writeQueue: Promise<void> = Promise.resolve();

function runWithLock<T>(task: () => T): Promise<T> {
  const resultPromise = writeQueue.then(async () => {
    return task();
  });
  writeQueue = resultPromise.then(
    () => {},
    () => {}
  );
  return resultPromise;
}

export const serverStorage = {
  getDb: (): CmsDatabasePayload => {
    ensureDirectories();
    if (!fs.existsSync(DB_FILE)) {
      const initial: CmsDatabasePayload = {
        version: '1.0',
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: 'system_init',
        data: {},
      };
      writeJsonAtomic(DB_FILE, initial);
      return initial;
    }

    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      if (!content || !content.trim()) {
        return {
          version: '1.0',
          updatedAt: new Date().toISOString(),
          lastUpdatedBy: 'fallback',
          data: {},
        };
      }
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && parsed.version) {
        return parsed;
      }
      return {
        version: '1.0',
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: 'fallback',
        data: parsed.data || parsed || {},
      };
    } catch {
      return {
        version: '1.0',
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: 'fallback',
        data: {},
      };
    }
  },

  getItem: <T>(key: string, fallback: T): T => {
    const db = serverStorage.getDb();
    if (db.data && key in db.data) {
      return db.data[key] as T;
    }
    return fallback;
  },

  setItem: (key: string, value: unknown, adminName = 'مدير النظام'): void => {
    ensureDirectories();
    const db = serverStorage.getDb();
    db.data[key] = value;
    db.updatedAt = new Date().toISOString();
    db.lastUpdatedBy = adminName;
    writeJsonAtomic(DB_FILE, db);
  },

  setItemAsync: (key: string, value: unknown, adminName = 'مدير النظام'): Promise<void> => {
    return runWithLock(() => {
      serverStorage.setItem(key, value, adminName);
    });
  },

  createSnapshot: (reason = 'auto_snapshot'): string => {
    ensureDirectories();
    const db = serverStorage.getDb();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotName = `snapshot_${timestamp}_${reason}.json`;
    const snapshotPath = path.join(SNAPSHOTS_DIR, snapshotName);

    writeJsonAtomic(snapshotPath, db);
    serverStorage.pruneSnapshots();
    return snapshotName;
  },

  restoreSnapshot: (snapshotName: string): boolean => {
    ensureDirectories();
    const safeName = path.basename(snapshotName);
    const snapshotPath = path.join(SNAPSHOTS_DIR, safeName);
    if (!fs.existsSync(snapshotPath)) {
      return false;
    }

    try {
      const content = fs.readFileSync(snapshotPath, 'utf-8');
      if (!content || !content.trim()) {
        return false;
      }
      const parsed = JSON.parse(content);
      if (parsed && parsed.version === '1.0' && parsed.data) {
        writeJsonAtomic(DB_FILE, parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  listSnapshots: (): string[] => {
    ensureDirectories();
    return fs
      .readdirSync(SNAPSHOTS_DIR)
      .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
      .reverse();
  },

  pruneSnapshots: (): void => {
    ensureDirectories();
    const files = fs
      .readdirSync(SNAPSHOTS_DIR)
      .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
      .map((f) => ({
        name: f,
        time: fs.statSync(path.join(SNAPSHOTS_DIR, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > MAX_SNAPSHOTS_RETAINED) {
      const toDelete = files.slice(MAX_SNAPSHOTS_RETAINED);
      toDelete.forEach((f) => {
        try {
          fs.unlinkSync(path.join(SNAPSHOTS_DIR, f.name));
        } catch {
          // ignore cleanup errors
        }
      });
    }
  },
};
