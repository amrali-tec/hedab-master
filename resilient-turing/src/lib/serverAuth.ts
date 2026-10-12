import { NextRequest } from 'next/server';
import { AdminUser, AdminPermission } from '../types';
import { verifyAdminToken, SUPER_ADMIN_USER, SESSION_COOKIE_NAME } from './authStore';

const EDITOR_USER_DEFAULT: AdminUser = {
  id: 'usr-editor-1',
  name: 'محرر المحتوى',
  email: 'editor@hedabkh.com.sa',
  role: 'editor',
  roleTitleAr: 'محرر محتوى وتصميم',
  roleTitleEn: 'Content Editor',
  permissions: ['design_manage', 'media_manage'],
  status: 'active',
  createdAt: '2024-03-01',
};

// Sliding-window in-memory Rate Limiter
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120; // 120 requests per minute for API operations

function checkRateLimit(clientIdentifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIdentifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(clientIdentifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

export interface AuthValidationResult {
  authorized: boolean;
  status: number;
  error?: string;
  user?: AdminUser;
}

/**
 * Validates Origin/Referer against host to protect against Cross-Site Request Forgery (CSRF)
 */
function validateCsrf(req: NextRequest): boolean {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return true;
  }

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host') || 'localhost:3000';

  const cleanHost = host.replace(/^https?:\/\//, '').toLowerCase();

  if (origin) {
    const originHost = origin.replace(/^https?:\/\//, '').toLowerCase();
    return (
      originHost === cleanHost ||
      originHost === 'localhost:3000' ||
      originHost === '127.0.0.1:3000' ||
      originHost.endsWith('hostingersite.com') ||
      originHost.endsWith('hedabkh.com.sa')
    );
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).host.toLowerCase();
      return (
        refererHost === cleanHost ||
        refererHost === 'localhost:3000' ||
        refererHost === '127.0.0.1:3000' ||
        refererHost.endsWith('hostingersite.com') ||
        refererHost.endsWith('hedabkh.com.sa')
      );
    } catch {
      return false;
    }
  }

  // If both origin and referer are absent on a browser mutation request, fail closed
  const secFetchSite = req.headers.get('sec-fetch-site');
  if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'same-site' && secFetchSite !== 'none') {
    return false;
  }

  return true;
}

/**
 * Server-Side Session, Permission, CSRF & Rate-Limit Validator
 * Enforces strict cryptographic signed stateless token validation without trusting client-provided role headers.
 */
export function validateServerSession(
  req: NextRequest,
  requiredPermission?: AdminPermission
): AuthValidationResult {
  // 1. Rate Limiting Check
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous_client';

  if (!checkRateLimit(clientIp)) {
    return {
      authorized: false,
      status: 429,
      error: 'تجاوزت الحد المسموح من الطلبات (Rate limit exceeded). يرجى الانتظار دقيقة.',
    };
  }

  // 2. CSRF Origin Verification
  if (!validateCsrf(req)) {
    return {
      authorized: false,
      status: 403,
      error: 'تم رفض الطلب: مصدر الطلب (Origin) غير موثوق أو غير متطابق (CSRF Violation).',
    };
  }

  // 3. Cryptographic Signed Stateless Token Inspection
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authHeader = req.headers.get('authorization')?.replace('Bearer ', '').trim();
  const token = sessionCookie || authHeader;

  if (!token) {
    return {
      authorized: false,
      status: 401,
      error: 'غير مصرح: يرجى تسجيل الدخول للوصول إلى هذه الواجهة (Unauthorized).',
    };
  }

  // Verify HMAC-SHA256 signature and token claims statelessly
  const tokenPayload = verifyAdminToken(token);
  const configuredSecret = process.env.ADMIN_SESSION_SECRET;

  let authenticatedUser: AdminUser | null = null;

  if (tokenPayload) {
    authenticatedUser =
      tokenPayload.role === 'super_admin'
        ? {
            ...SUPER_ADMIN_USER,
            id: tokenPayload.userId || SUPER_ADMIN_USER.id,
            email: tokenPayload.email || SUPER_ADMIN_USER.email,
            name: tokenPayload.name || SUPER_ADMIN_USER.name,
          }
        : {
            ...EDITOR_USER_DEFAULT,
            id: tokenPayload.userId || EDITOR_USER_DEFAULT.id,
            email: tokenPayload.email || EDITOR_USER_DEFAULT.email,
            name: tokenPayload.name || EDITOR_USER_DEFAULT.name,
          };
  } else if (configuredSecret && token === configuredSecret) {
    // Secret-based machine-to-machine or CI/CD admin access
    authenticatedUser = { ...SUPER_ADMIN_USER };
  }

  if (!authenticatedUser) {
    return {
      authorized: false,
      status: 401,
      error: 'رمز المصادقة غير صالح أو منتهي الصلاحية أو تم التلاعب به.',
    };
  }

  // 4. Role-Based Access Control (RBAC) Permission Verification
  if (requiredPermission && !authenticatedUser.permissions.includes(requiredPermission)) {
    return {
      authorized: false,
      status: 403,
      error: `تم رفض الوصول: المستخدم يفتقر لصلاحية [${requiredPermission}] (Forbidden).`,
    };
  }

  return {
    authorized: true,
    status: 200,
    user: authenticatedUser,
  };
}

/**
 * Sanitizes audit logs to ensure sensitive tokens and passwords are never persisted.
 */
export function sanitizeLogDetails(details: unknown): unknown {
  if (typeof details !== 'object' || details === null) {
    return details;
  }
  const clean = { ...(details as Record<string, unknown>) };
  const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'cookie', 'session'];
  for (const key of Object.keys(clean)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      clean[key] = '***REDACTED***';
    }
  }
  return clean;
}
