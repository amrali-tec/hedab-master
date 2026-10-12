import { NextResponse } from 'next/server';
import { serverStorage } from '../../../services/serverStorage';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

/**
 * Public Health Endpoint (Minimal disclosure - OWSASP & SOC2 compliant)
 * Does NOT leak internal file paths, storage engines, or disk layouts to unauthenticated callers.
 */
export async function GET() {
  const startTime = Date.now();
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  let dbReady = false;
  let uploadsReady = false;

  try {
    const db = serverStorage.getDb();
    dbReady = Boolean(db && db.version === '1.0');
  } catch {
    dbReady = false;
  }

  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    uploadsReady = fs.existsSync(uploadsDir);
  } catch {
    uploadsReady = false;
  }

  const isHealthy = dbReady && uploadsReady;
  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      responseTimeMs,
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
