import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, SESSION_COOKIE_NAME } from '../../../../lib/authStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        {
          status: 200,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
        }
      );
    }

    const payload = verifyAdminToken(token);

    if (!payload) {
      return NextResponse.json(
        { authenticated: false, user: null },
        {
          status: 200,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
        }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          roleTitleAr: payload.roleTitleAr,
          roleTitleEn: payload.roleTitleEn,
        },
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
      }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false, user: null },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
      }
    );
  }
}
