# ROOT CAUSE STATIC ASSETS REPORT
**Project**: Visual CMS Studio — Saudi Sovereign Infrastructure Platform (`hedabkh.com.sa`)  
**Target Domain**: `https://deeppink-louse-846985.hostingersite.com` / `https://hedabkh.com.sa`  
**Date & Time**: 2026-08-23T12:00:00+03:00  
**Status**: `ROOT CAUSE CONFIRMED — READY FOR REPAIR PROMPT`  

---

## 1. CONFIRMED ROOT CAUSE

The production static asset failure is caused by **Build Chunk Hash Invalidation & Missing Multi-Build Asset Retention**, coupled with **Next.js App Router Dynamic Fallback Routing**:

1. **Active Build vs. Stale Client Requested Hashes**:
   - During the authentication hardening deployment at `2026-08-23 00:04`, a new production build (`clean_prod_build_hardened.zip`, `BUILD_ID: IL-ZsL_m2dFNudX9ygx1l`) was extracted into the active production directory (`build_cache`).
   - The deployment completely replaced the contents of `build_cache/static/chunks/`.
   - The **current active production server** produces HTML that correctly references the new chunk hashes (e.g., `0hmhfnt70jkvy.css`, `05-c3ty_6dwfk.js`, `turbopack-3cp1-6mt44goh.js`).
   - All assets referenced by the **new active HTML** exist physically on the server in `build_cache/static/chunks/` and return `HTTP 200 OK` with proper `text/css` and `application/javascript` Content-Type headers.
   - However, browser clients holding open sessions or cached HTML from the **previous build** continue to request older chunk hashes (`2vwlnuez3dfct.css`, `1ko-w_3dgbkar.js`, `0xjz5g7epazjs.js`, `turbopack-01s979aqixc5o.js`). Because previous build chunks were deleted during deployment, these requests fail.

2. **Next.js `/[locale]` Catch-All Route returning `text/html` for Missing Assets**:
   - When a missing static asset request (e.g. `/_next/static/chunks/2vwlnuez3dfct.css`) reaches the server, Apache/Passenger routes it to `server.js` because no physical file exists at that path on disk.
   - Next.js App Router evaluates the request against its dynamic route structure `/[locale]`.
   - `locale` gets parsed as `"_next"`, and Next.js renders the 404 HTML template, returning an `HTTP 404` (or HTTP 200 404-page) with `Content-Type: text/html`.
   - The browser receives HTML for a `.css` or `.js` request and rejects it (`Refused to apply style... MIME type text/html`).

3. **Missing Public File (`/hero-bg.webp`)**:
   - `/hero-bg.webp` is not present in the `public/` directory locally or on the production server. Requests for `/hero-bg.webp` are similarly caught by `/[locale]`, returning an HTML 404 page instead of an image binary.

---

## 2. EVIDENCE FOR THE ROOT CAUSE

1. **Physical Inspection of Server `build_cache/static/chunks/`**:
   - `0hmhfnt70jkvy.css` (Active Build CSS): **EXISTS** (Size: 9,921 bytes, Date: Aug 23 00:01) -> `HTTP 200 OK`, `Content-Type: text/css; charset=UTF-8`.
   - `turbopack-3cp1-6mt44goh.js` (Active Build Turbopack Runtime): **EXISTS** (Size: 10,580 bytes, Date: Aug 23 00:01) -> `HTTP 200 OK`, `Content-Type: application/javascript`.
   - `2vwlnuez3dfct.css` (Stale Client CSS): **DOES NOT EXIST ON DISK** -> `HTTP 404`, `Content-Type: text/html`.
   - `turbopack-01s979aqixc5o.js` (Stale Client JS): **DOES NOT EXIST ON DISK** -> `HTTP 404`, `Content-Type: text/html`.

2. **Server On-Disk Route Cache Verification**:
   - On the server, `build_cache/server/app/_next/static/chunks/2vwlnuez3dfct.css.meta` contains:
     ```json
     {"headers":{"x-nextjs-stale-time":"300","x-next-cache-tags":"..."},"status":404}
     ```
   - This proves conclusively that Next.js processed `/_next/static/chunks/2vwlnuez3dfct.css` as a dynamic App Router request when it failed to locate the static file on disk.

3. **Live HTTP Header Inspection**:
   ```http
   HTTP/2 200 
   date: Sun, 23 Aug 2026 09:00:33 GMT
   content-type: text/css; charset=UTF-8
   cache-control: public, max-age=31536000, immutable
   server: hcdn
   ```
   Valid active assets served from `build_cache/static/chunks/` return perfect headers.

---

## 3. TIMELINE OF THE REGRESSION

| Timestamp | Event | Details |
|---|---|---|
| **2026-08-22 21:16** | Legacy Production Build | Previous deployment active on server. Clients cached HTML with chunk hashes like `2vwlnuez3dfct.css`. |
| **2026-08-23 00:01** | Hardened Build Compilation | `clean_prod_build_hardened.zip` compiled locally with `BUILD_ID: IL-ZsL_m2dFNudX9ygx1l`. New chunk hashes generated (`0hmhfnt70jkvy.css`). |
| **2026-08-23 00:04** | Hardened Deployment Executed | Zip file extracted into `/public_html/build_cache`. Existing `build_cache/static/chunks` replaced without keeping previous build chunks. |
| **2026-08-23 00:08** | Passenger Process Restart | `server.js` restarted by Passenger. Server began outputting fresh HTML referencing `0hmhfnt70jkvy.css`. |
| **Post 00:08** | Production Asset Mismatch Error | Clients with active open tabs or CDN caches requested old chunk hashes (`2vwlnuez3dfct.css`), triggering `text/html` MIME type errors. |

---

## 4. LAST KNOWN WORKING VS. CURRENT DEPLOYMENT STRUCTURE

### Last Known Working Deployment Structure
- Server App Root: `/home/u634705070/domains/deeppink-louse-846985.hostingersite.com/public_html`
- Dist Directory: `build_cache`
- Previous `BUILD_ID`: (Pre-hardening build)
- Active Chunks: Included `2vwlnuez3dfct.css`, `1ko-w_3dgbkar.js`, `0xjz5g7epazjs.js`, `turbopack-01s979aqixc5o.js`

### Current Deployment Structure
- Server App Root: `/home/u634705070/domains/deeppink-louse-846985.hostingersite.com/public_html`
- Dist Directory: `build_cache`
- Active `BUILD_ID`: `IL-ZsL_m2dFNudX9ygx1l`
- Active Chunks: Contains `0hmhfnt70jkvy.css`, `05-c3ty_6dwfk.js`, `14mrh2-p_w84d.js`, `turbopack-3cp1-6mt44goh.js`
- Missing Chunks: `2vwlnuez3dfct.css`, `1ko-w_3dgbkar.js`, `0xjz5g7epazjs.js`, `turbopack-01s979aqixc5o.js`

---

## 5. EXACT BUILD DIRECTORIES & BUILD_ID COMPARISON

| Environment | Directory | BUILD_ID | Static Chunks Location | Status |
|---|---|---|---|---|
| **Production Server** | `public_html/build_cache` | `IL-ZsL_m2dFNudX9ygx1l` | `build_cache/static/chunks/` | ACTIVE LIVE BUILD |
| **Local Workspace** | `prod_dist` | `2WJAiysRKepf1OZncqfMG` | `prod_dist/static/` | Local Build (Aug 23 02:46) |
| **Local Workspace** | `.next_deploy_dist` | `YnDWJMeovVev4oQz7Tf-Y` | `.next_deploy_dist/static/` | Local Build (Aug 23 02:45) |
| **Local Workspace** | `.next_dist_verify` | N/A | `.next_dist_verify/static/` | Local Build (Aug 23 02:17) |
| **Local Workspace** | `build_cache` | Dev Cache | `build_cache/` | Local Dev Cache |

---

## 6. LIVE HTML VS. BUILD ARTIFACTS COMPARISON

### First 20 Referenced Assets Audit

| # | Asset URL | Expected Type | Actual HTTP Status | Actual Content-Type | Exists on Server | Server Location |
|---|---|---|---|---|---|---|
| 1 | `/_next/static/chunks/0hmhfnt70jkvy.css` | Stylesheet | **200 OK** | `text/css; charset=UTF-8` | **YES** | `build_cache/static/chunks/` |
| 2 | `/_next/static/chunks/05-c3ty_6dwfk.js` | Script | **200 OK** | `application/javascript` | **YES** | `build_cache/static/chunks/` |
| 3 | `/_next/static/chunks/14mrh2-p_w84d.js` | Script | **200 OK** | `application/javascript` | **YES** | `build_cache/static/chunks/` |
| 4 | `/_next/static/chunks/1oytyztx-uq3n.js` | Script | **200 OK** | `application/javascript` | **YES** | `build_cache/static/chunks/` |
| 5 | `/_next/static/chunks/1-8hczfpotpkc.js` | Script | **200 OK** | `application/javascript` | **YES** | `build_cache/static/chunks/` |
| 6 | `/_next/static/chunks/2hiffxcv50mh0.js` | Script | **200 OK** | `application/javascript` | **YES** | `build_cache/static/chunks/` |
| 7 | `/_next/static/chunks/0-gd4oinbv5w3.js` | Script | **200 OK** | `application/javascript` | **YES** | `build_cache/static/chunks/` |
| 8 | `/_next/static/chunks/171rq77m2k9tm.css` | Stylesheet | **200 OK** | `text/css; charset=UTF-8` | **YES** | `build_cache/static/chunks/` |
| 9 | `/_next/static/chunks/turbopack-3cp1-6mt44goh.js` | Script | **200 OK** | `application/javascript` | **YES** | `build_cache/static/chunks/` |
| 10 | `/_next/static/media/9ff27b8a0a8f3dc0...woff2` | Font | **200 OK** | `font/woff2` | **YES** | `build_cache/static/media/` |
| 11 | `/_next/static/media/d41831e24743a3c1...woff2` | Font | **200 OK** | `font/woff2` | **YES** | `build_cache/static/media/` |
| 12 | `/logo-light.png` | Image | **200 OK** | `image/png` | **YES** | `public/logo-light.png` |
| 13 | `/logo-dark.png` | Image | **200 OK** | `image/png` | **YES** | `public/logo-dark.png` |
| 14 | `/favicon.ico` | Icon | **200 OK** | `image/x-icon` | **YES** | `public/favicon.ico` |
| 15 | `/_next/static/chunks/2vwlnuez3dfct.css` | Stylesheet | **404** | `text/html` | **NO** | *Stale Chunk (Deleted)* |
| 16 | `/_next/static/chunks/1ko-w_3dgbkar.js` | Script | **404** | `text/html` | **NO** | *Stale Chunk (Deleted)* |
| 17 | `/_next/static/chunks/0xjz5g7epazjs.js` | Script | **404** | `text/html` | **NO** | *Stale Chunk (Deleted)* |
| 18 | `/_next/static/chunks/turbopack-01s979aqixc5o.js` | Script | **404** | `text/html` | **NO** | *Stale Chunk (Deleted)* |
| 19 | `/hero-bg.webp` | Image | **404** | `text/html` | **NO** | *File missing from public/* |
| 20 | `/gulf-hills-profile.pdf` | PDF | **200 OK** | `application/pdf` | **YES** | `public/gulf-hills-profile.pdf` |

---

## 7. CONFIRMED VS. RULED-OUT CAUSES

- [x] **CONFIRMED**: **Chunk Hash Mismatch across Builds** (Previous build chunks removed during deployment; cached clients request old chunk hashes).
- [x] **CONFIRMED**: **Next.js App Router Dynamic Routing Catch-All** (`/[locale]` returns HTML 404 pages for missing static assets).
- [x] **CONFIRMED**: **Missing Public Media Asset** (`/hero-bg.webp` missing from `public/`).
- [ ] **RULED OUT**: *Wrong distDir* (`distDir: "build_cache"` is correctly set and served).
- [ ] **RULED OUT**: *Incomplete Deployment of Current Build* (Current build files are 100% complete and working).
- [ ] **RULED OUT**: *Passenger Startup Failure* (Passenger is running `server.js` cleanly).
- [ ] **RULED OUT**: *MIME Type Misconfiguration on Server* (Server returns proper `text/css` and `application/javascript` for existing assets).

---

## 8. MINIMUM SAFE REPAIR PLAN

> [!IMPORTANT]
> **READ-ONLY GUARANTEE**: THIS REPAIR PLAN IS PRESENTED FOR REVIEW ONLY. NO CODE OR DEPLOYMENT CHANGES HAVE BEEN APPLIED.

### Step 1: Multi-Build Chunk Retention Strategy
- Modify deployment packaging/release scripts to retain static chunks from previous deployments in `build_cache/static/chunks/` for at least 30 days (or keep n-1 build chunks during deploy).
- This ensures clients with active sessions continue loading JS/CSS chunks smoothly without encountering 404 errors during build cutovers.

### Step 2: Add Missing Media File
- Place `hero-bg.webp` in `public/hero-bg.webp` (or update any CSS/Component reference pointing to non-existent `/hero-bg.webp` to use existing media like `/images/vision-2030.jpg` or `hero` assets).

### Step 3: Configure Cache-Control & Client Cache Invalidation
- Send explicit `Cache-Control: no-cache` or `must-revalidate` for HTML document responses so browsers fetch updated HTML pointing to fresh build chunk hashes immediately after a release.

---

```
FINAL STATUS: ROOT CAUSE CONFIRMED — READY FOR REPAIR PROMPT
```
