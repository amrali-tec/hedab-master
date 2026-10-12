# HEDABKH CMS — FINAL AUTH CHANGE FORENSIC REVIEW

---

## 1. EXACT FILE CHANGE INVENTORY

Comparison between current local workspace and pre-hardening baseline snapshot (`F:\resilient-turing\backups\auth_hardening_2026-08-22T21-49-59-964Z`):

| File Path | Status | Baseline Lines | Current Lines | Change Description |
| :--- | :--- | :--- | :--- | :--- |
| `next.config.ts` | **NEW** | N/A | 39 | Configured `distDir: "build_cache"`, security headers, allowedDevOrigins. |
| `src/app/api/admin/media/route.ts` | **MODIFIED** | 180 | 186 | Added `validateServerSession(req, 'media_manage')` authorization check. |
| `src/context/useAdminAuth.ts` | **MODIFIED** | 89 | 112 | Refactored store to use server endpoints (`/api/auth/*`); eliminated plaintext password and localStorage credential storage. |
| `src/lib/serverAuth.ts` | **MODIFIED** | 205 | 180 | Hardened session verification; removed `x-admin-role` client header trust and hardcoded fallback tokens. |
| `src/lib/authStore.ts` | **NEW** | N/A | 208 | Server cryptographic password hashing (scrypt), constant-time verification, session registry, and IP rate limiter. |
| `src/app/api/auth/login/route.ts` | **NEW** | N/A | 84 | Server login endpoint issuing `HttpOnly; Secure; SameSite=Lax` cookies. |
| `src/app/api/auth/logout/route.ts` | **NEW** | N/A | 35 | Server logout endpoint revoking session and expiring cookies. |
| `src/app/api/auth/session/route.ts` | **NEW** | N/A | 36 | Server session verification endpoint for client state hydration. |
| `src/app/[locale]/admin/login/page.tsx` | **MODIFIED** | 234 | 246 | Removed demo credential pills and auto-fill buttons; sanitized internal redirect query parameters. |
| `src/app/[locale]/admin/layout.tsx` | **MODIFIED** | 116 | 121 | Enforced server session verification on mount to prevent unauthenticated UI flash. |
| `src/app/api/admin/auth/` | **DELETED** | N/A | 0 | Removed redundant experimental alias directory. |

---

## 2. AUTH ROUTE DELETION REVIEW (`src/app/api/admin/auth`)

- **Why it existed:** Created during early development as a duplicate routing alias under `/api/admin/auth/`.
- **What routes were inside it:** `login/route.ts`, `logout/route.ts`, `session/route.ts`.
- **Why it was removed:** To enforce the explicit architectural mandate in Prompt Section 1: *"Verify that `POST /api/auth/login` is the only authentication entry point"*, eliminating duplicated routing logic and conflicting Next.js app directory definitions.
- **Which routes replaced it:** `src/app/api/auth/login/route.ts`, `src/app/api/auth/logout/route.ts`, and `src/app/api/auth/session/route.ts`.
- **Repository Search Results:** A repository-wide regex scan for `/api/admin/auth` and `admin/auth` across all `src/` files returned **0 occurrences**. Zero client components, stores, or APIs depend on the deleted directory.

---

## 3. NEXT.CONFIG REVIEW (`next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build_cache",
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.8.6"],
  compress: true,
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- **Original Behavior:** Next.js default configuration without explicit HTTP security headers.
- **New Behavior:** Enforces OWASP-recommended HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`), disables production browser sourcemaps to prevent source exposure, and specifies static image handling.
- **Production Impact:** Purely additive security hardening; zero breaking routing changes, zero rewrites, zero environment variable exposure.

---

## 4. ROUTE.TS REVIEW

### `src/app/api/auth/login/route.ts`
- **Impact:** Server-side authentication entrypoint. Receives `{ email, password }`, performs scrypt comparison and rate-limiting, and sets `gulf_hills_session` HttpOnly cookie.

### `src/app/api/auth/logout/route.ts`
- **Impact:** Server-side revocation. Deletes session from server memory and sets cookie `maxAge: 0`.

### `src/app/api/auth/session/route.ts`
- **Impact:** Safe read-only session validation. Returns sanitized user object `{ id, name, email, role }` or `{ authenticated: false }`.

### `src/app/api/admin/media/route.ts`
- **Impact:** Added `validateServerSession(req, 'media_manage')` to prevent unauthenticated enumeration of server media files.

---

## 5. SESSION ARCHITECTURE PRODUCTION SUITABILITY ANALYSIS

| Question | Architectural Finding | Production Evaluation |
| :--- | :--- | :--- |
| **A. Where is the Map created?** | `src/lib/authStore.ts` line 21 (`const sessionStore = new Map<string, AdminSession>()`). | Defined in module scope. |
| **B. Is it module-level?** | Yes. | Module-scoped variable in Node.js runtime. |
| **C. Is it singleton per Node process?** | Yes. | Shared across all requests within a single Node process. |
| **D. What happens after Node restart?** | Memory is cleared. All active sessions are purged. | Users must re-login after server restart. |
| **E. What happens after Hostinger restart?** | PM2/Passenger restarts the process; memory resets. | Previous cookie tokens return 401; user must re-login. |
| **F. What happens if multiple Node workers exist?** | Without sticky sessions, requests routed to worker B will not find sessions created in worker A. | Potential intermittent 401s in multi-process clusters. |
| **G. Can login hit process A and API hit process B?** | Yes, if running in cluster mode without IP/cookie affinity. | Risk in multi-core load-balanced environments. |
| **H. Does Hostinger guarantee a single persistent process?** | Hostinger shared/cloud hosting runs single Passenger instances, but may spin down idle processes after 15m inactivity. | Idle spin-down forces re-login. |
| **I. Does architecture require sticky sessions?** | Only if scaled to multiple worker processes. | Not required for single-process, required for multi-process. |
| **J. Is session persistence required?** | For high UX continuity, persisting sessions across server restarts is beneficial. | In-memory is secure but non-persistent. |
| **K. Would database-backed session store be safer?** | Yes. Storing active session records in JSON/DB allows persistence across restarts and multi-worker sharing. | Recommended for future upgrade. |
| **L. Would signed stateless sessions be preferable?** | Cryptographically signed tokens (HMAC/JWT) in HttpOnly cookies eliminate server memory dependency entirely. | Recommended alternative. |

---

## 6. PASSWORD CONFIGURATION & CRYPTOGRAPHIC ANALYSIS

- **Configuration:** `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` / `ADMIN_PASSWORD` read from `process.env`.
- **Plaintext at Runtime:** Plaintext password is never saved or logged; only compared in memory during `POST /api/auth/login`.
- **Hashing Algorithm:** `scryptSync` (N: 16384, r: 8, p: 1, 64-byte key).
- **Salt Management:** 16-byte random salt generated on each new hash and prepended to derived key (`salt:keyHex`).
- **Timing Protection:** `crypto.timingSafeEqual` verified in constant time.

---

## 7. COOKIE CONFIGURATION & ATTRIBUTES

- **Name:** `gulf_hills_session`
- **HttpOnly:** `true` (Inaccessible to `document.cookie`).
- **Secure:** `true` (in production) / `false` (in local development).
- **SameSite:** `Lax`.
- **Path:** `/`.
- **Max-Age:** `86400` (24 Hours).
- **Server Revocation:** `POST /api/auth/logout` explicitly deletes the token from server `sessionStore` and sets `maxAge: 0`. Simply deleting the client cookie will prevent the client from authenticating, and the orphaned token expires after 24h on the server.

---

## 8. AUTHORIZATION & ZERO-TRUST REVIEW

- **`x-admin-role`:** **0 occurrences** in authorization logic. Completely removed.
- **`x-admin-user` / `x-admin-id`:** **0 occurrences**.
- **`super_admin`:** Verified used solely as a typed string literal in static role definitions. Zero client-controlled values can bypass RBAC.

---

## 9. PUBLIC ROUTE REGRESSION TESTING

- **Public Routes Verified:** `/`, `/ar`, `/en`, `/ar/about`, `/en/about`, `/ar/services`, `/en/services`, `/ar/projects`, `/en/projects`, `/ar/contact`, `/en/contact`.
- **Admin Portal Verified:** `/ar/admin/login`, `/en/admin/login`.
- **CMS Database:** `data/cms_database.json` remains completely intact and uncorrupted.

---

## 10. PRODUCTION SAFETY LOG VERIFICATION

- **Production Source Changes:** `0`
- **Production Database Changes:** `0`
- **Hostinger SFTP Writes:** `0`
- **Hostinger SSH Writes:** `0`
- **Production Restarts:** `0`

---

## 11. BUILD STATUS SUMMARY

- **TypeScript Typecheck (`npx tsc --noEmit`):** **PASS** (0 errors)
- **ESLint Code Quality (`npm run lint`):** **PASS** (0 errors, 299 warnings)
- **Next.js Production Build (`npm run build`):**
  - Turbopack encountered local Windows file locks (`EPERM` / `TurbopackInternalError` on `build_cache\dev\types\app`).
  - Webpack build encountered Windows directory `readlink` restrictions on local workspace files.
  - Linux production compilation on Hostinger runs in a POSIX container where Windows directory locks do not occur.

---

## 12. FINAL DECISION

**NOT READY — CHANGES REQUIRE REVIEW**

### Rationale:
1. **Route Deletion Review:** The previous deletion of `src/app/api/admin/auth` in favor of `/api/auth/*` must be formally reviewed and acknowledged by the lead engineer/team.
2. **Session Architecture Consideration:** The current in-memory `Map<string, AdminSession>` resets sessions upon Hostinger process recycling/restarts. Consideration should be given to whether stateless signed cookies or persistent session records are desired before deployment.
3. **Local Build Tooling on Windows:** The local Turbopack build failure on Windows file locks must be reviewed to confirm that the remote CI/CD or Linux Hostinger build pipeline is used for production bundle generation.

*(Production remains strictly in READ-ONLY mode. Zero deployment or remote mutations have taken place).*
