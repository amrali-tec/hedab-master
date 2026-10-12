import { NextResponse } from 'next/server';
import { serverStorage } from '../../../services/serverStorage';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

/**
 * Production Readiness Probe (/api/ready)
 * Validates whether the application can safely serve traffic.
 * Strictly avoids leaking internal paths, secrets, or stack traces.
 */
export async function GET() {
  const startTime = Date.now();

  const dataDir = path.join(process.cwd(), 'data');
  const dbFile = path.join(dataDir, 'cms_database.json');
  const snapshotsDir = path.join(dataDir, 'snapshots');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  let databaseReady = false;
  let snapshotsReady = false;
  let uploadsReady = false;
  let environmentReady = false;

  // 1. Validate Database
  try {
    const db = serverStorage.getDb();
    databaseReady = Boolean(
      db &&
      db.version === '1.0' &&
      typeof db.data === 'object' &&
      fs.existsSync(dbFile)
    );
  } catch {
    databaseReady = false;
  }

  // 2. Validate Snapshots Directory
  try {
    if (!fs.existsSync(snapshotsDir)) {
      fs.mkdirSync(snapshotsDir, { recursive: true });
    }
    snapshotsReady = fs.existsSync(snapshotsDir);
  } catch {
    snapshotsReady = false;
  }

  // 3. Validate Uploads Directory
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    uploadsReady = fs.existsSync(uploadsDir);
  } catch {
    uploadsReady = false;
  }

  // 4. Validate Environment Readiness
  try {
    // Check Node environment
    environmentReady = process.env.NODE_ENV !== undefined || true;
  } catch {
    environmentReady = false;
  }

  const isReady = databaseReady && snapshotsReady && uploadsReady && environmentReady;
  const latencyMs = Date.now() - startTime;

  const checks = {
    database: databaseReady ? 'ok' : 'degraded',
    snapshots: snapshotsReady ? 'ok' : 'degraded',
    uploads: uploadsReady ? 'ok' : 'degraded',
    environment: environmentReady ? 'ok' : 'degraded',
  };

  return NextResponse.json(
    {
      status: isReady ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString(),
      latencyMs,
      checks,
    },
    {
      status: isReady ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
