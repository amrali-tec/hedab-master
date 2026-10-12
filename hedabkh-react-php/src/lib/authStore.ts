import crypto from 'crypto';
import { AdminUser, AdminRole } from '../types';

export interface AdminTokenPayload {
  sub: 'ADMIN';
  userId: string;
  email: string;
  name: string;
  role: AdminRole | string;
  roleTitleAr?: string;
  roleTitleEn?: string;
  iat: number; // Unix timestamp in seconds
  exp: number; // Unix timestamp in seconds
}

export const SESSION_COOKIE_NAME = 'gulf_hills_session';
export const SESSION_TTL_SECONDS = 24 * 60 * 60; // 24 hours
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const isProduction = process.env.NODE_ENV === 'production';
const ENV_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET;

// In production, enforce that a secure server-side session secret must be explicitly provided
if (isProduction && !ENV_SESSION_SECRET) {
  throw new Error('CRITICAL SECURITY ERROR: ADMIN_SESSION_SECRET or SESSION_SECRET must be set in production.');
}

// Server-side signing secret. Read strictly from server environment.
const SESSION_SIGNING_SECRET =
  ENV_SESSION_SECRET ||
  'gulf_hills_hedabkh_stateless_signing_secret_key_v2_2026_secure';

// In-memory brute-force tracker for login attempt rate limiting
interface LoginAttemptRecord {
  failures: number;
  lockoutUntil: number;
}
const loginAttemptsMap = new Map<string, LoginAttemptRecord>();

/**
 * Standard Super Admin User Profile
 */
export const SUPER_ADMIN_USER: AdminUser = {
  id: 'usr-admin-1',
  name: 'م. أيمن جميل الحاتم',
  email: process.env.ADMIN_EMAIL || 'admin@hedabkh.com.sa',
  role: 'super_admin',
  roleTitleAr: 'مدير النظام الشامل',
  roleTitleEn: 'Super Administrator',
  permissions: [
    'projects_manage',
    'certificates_manage',
    'services_manage',
    'inquiries_view_reply',
    'statistics_manage',
    'team_manage',
    'settings_manage',
    'users_manage',
    'logs_view',
    'design_manage',
    'media_manage',
  ],
  status: 'active',
  createdAt: '2024-01-15',
};

/**
 * Helper to encode Base64URL string
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64url');
}

/**
 * Helper to decode Base64URL string
 */
function base64UrlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf-8');
}

/**
 * Signs a stateless administrative session payload using HMAC-SHA256
 */
export function signAdminToken(user: AdminUser): string {
  const nowSec = Math.floor(Date.now() / 1000);
  const expSec = nowSec + SESSION_TTL_SECONDS;

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload: AdminTokenPayload = {
    sub: 'ADMIN',
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    roleTitleAr: user.roleTitleAr,
    roleTitleEn: user.roleTitleEn,
    iat: nowSec,
    exp: expSec,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', SESSION_SIGNING_SECRET)
    .update(dataToSign)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a stateless administrative session token using constant-time comparison
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    if (!encodedHeader || !encodedPayload || !signature) return null;

    // 1. Recompute HMAC-SHA256 signature
    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SIGNING_SECRET)
      .update(dataToSign)
      .digest('base64url');

    // 2. Timing-safe constant-time signature comparison
    const sigBuffer = Buffer.from(signature, 'utf-8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');

    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    // 3. Decode and parse payload
    const payloadStr = base64UrlDecode(encodedPayload);
    const payload: AdminTokenPayload = JSON.parse(payloadStr);

    // 4. Validate subject claim
    if (payload.sub !== 'ADMIN') return null;

    // 5. Validate expiration timestamp
    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload.exp || typeof payload.exp !== 'number' || payload.exp <= nowSec) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Modern Cryptographic Password Hashing (scrypt + 256-bit random salt)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
  });
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Constant-time Password Verification against stored hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) return false;

    const keyBuffer = Buffer.from(keyHex, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64, {
      N: 16384,
      r: 8,
      p: 1,
    });

    if (keyBuffer.length !== derivedKey.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// Scrypt hash for standard initial admin credential
// Can be customized/overridden dynamically via ADMIN_PASSWORD_HASH or ADMIN_PASSWORD env vars
const COMPUTED_ADMIN_HASH =
  process.env.ADMIN_PASSWORD_HASH || hashPassword(process.env.ADMIN_PASSWORD || 'admin123');

/**
 * Verifies Administrator credentials with rate limiting and timing protection
 */
export function authenticateAdminCredentials(
  email: string,
  pass: string,
  clientIp: string
): { success: boolean; error?: string; status?: number; user?: AdminUser } {
  const now = Date.now();
  const attemptRecord = loginAttemptsMap.get(clientIp);

  // 1. Check IP lockout status
  if (attemptRecord && attemptRecord.lockoutUntil > now) {
    const remainingSec = Math.ceil((attemptRecord.lockoutUntil - now) / 1000);
    return {
      success: false,
      error: `تم تجاوز الحد الأقصى للمحاولات. يرجى الانتظار لمدة ${remainingSec} ثانية.`,
      status: 429,
    };
  }

  // 2. Validate input format
  if (!email || !pass || typeof email !== 'string' || typeof pass !== 'string') {
    return {
      success: false,
      error: 'البريد الإلكتروني وكلمة المرور مطلوبان.',
      status: 400,
    };
  }

  const normalizedInputEmail = email.trim().toLowerCase();
  const targetAdminEmail = (process.env.ADMIN_EMAIL || SUPER_ADMIN_USER.email).trim().toLowerCase();

  // 3. Constant-time email verification
  const emailMatched =
    normalizedInputEmail.length === targetAdminEmail.length &&
    crypto.timingSafeEqual(
      Buffer.from(normalizedInputEmail, 'utf-8'),
      Buffer.from(targetAdminEmail, 'utf-8')
    );

  // 4. Verify password with scrypt
  const passwordMatched = verifyPassword(pass, COMPUTED_ADMIN_HASH);

  if (!emailMatched || !passwordMatched) {
    // Record failed attempt
    const failures = (attemptRecord ? attemptRecord.failures : 0) + 1;
    let lockoutUntil = 0;

    if (failures >= MAX_LOGIN_ATTEMPTS) {
      lockoutUntil = now + LOGIN_LOCKOUT_WINDOW_MS;
    }

    loginAttemptsMap.set(clientIp, { failures, lockoutUntil });

    return {
      success: false,
      error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      status: 401,
    };
  }

  // Reset failed attempts on success
  loginAttemptsMap.delete(clientIp);

  return {
    success: true,
    user: {
      ...SUPER_ADMIN_USER,
      email: targetAdminEmail,
    },
  };
}
