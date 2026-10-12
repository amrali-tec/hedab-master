import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateAdminCredentials,
  signAdminToken,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from '../../../../lib/authStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous_client';

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    // 1. Basic Payload Validation
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.',
        },
        { status: 400 }
      );
    }

    // 2. Server-side Credential & Rate-Limit Verification
    const authResult = authenticateAdminCredentials(email, password, clientIp);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: authResult.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        },
        { status: authResult.status || 401 }
      );
    }

    // 3. Cryptographically Signed Stateless Token Generation
    const signedToken = signAdminToken(authResult.user);

    // 4. Create Response with HttpOnly Session Cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      success: true,
      authenticated: true,
      role: 'ADMIN',
      user: {
        id: authResult.user.id,
        name: authResult.user.name,
        email: authResult.user.email,
        role: authResult.user.role,
        roleTitleAr: authResult.user.roleTitleAr,
        roleTitleEn: authResult.user.roleTitleEn,
      },
    });

    // Set secure HttpOnly cookie containing signed stateless token
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: signedToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: 'حدث خطأ أثناء معالجة تسجيل الدخول. يرجى المحاولة لاحقاً.',
      },
      { status: 500 }
    );
  }
}
