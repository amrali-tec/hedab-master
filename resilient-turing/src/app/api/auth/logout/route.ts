import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '../../../../lib/authStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      authenticated: false,
      message: 'تم تسجيل الخروج بنجاح.',
    });

    // Clear stateless session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch {
    return NextResponse.json({ success: true, authenticated: false });
  }
}
