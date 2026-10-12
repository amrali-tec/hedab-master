/**
 * Production Static Site Exporter & Hard Validation Pipeline
 * Visual CMS Studio — Saudi Sovereign Infrastructure Platform
 * 
 * Pipeline Flow:
 * 1. Generates fresh Next.js Production Build (npm run build).
 * 2. Launches isolated Next.js Production Runtime Server on port 3099.
 * 3. Crawls production runtime (http://127.0.0.1:3099) for all public & admin routes.
 * 4. Extracts & downloads production _next/static JS/CSS bundles.
 * 5. Executes HARD VALIDATION GATES:
 *    - Rejects any development/Turbopack runtime assets ([turbopack], hmr-client, next-devtools, etc.).
 *    - Rejects any malformed script URLs (trailing backslashes .js\).
 *    - Verifies 100% existence & non-zero byte size of all referenced static scripts/styles.
 * 6. Generates clean Hostinger static export package (.htaccess + zip).
 * 7. Cleanly shuts down production runtime server.
 * 
 * Date: 2026-08-24
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import http from 'http';
import { execSync, spawn, ChildProcess } from 'child_process';

const ROOT_DIR = process.cwd();
const PORT = 3099;
const PRODUCTION_SERVER = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.join(ROOT_DIR, 'fresh_static_export');
const ZIP_NAME = 'hostinger_fresh_static_2026-08-24.zip';
const BUILD_SECRET = 'production-build-secret-2026';

function fetchUrl(urlStr: string): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get(urlStr, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = `${PRODUCTION_SERVER}${redirectUrl}`;
        }
        return fetchUrl(redirectUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function fetchBinary(urlStr: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    http.get(urlStr, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function waitForServer(url: string, timeoutMs = 40000): Promise<boolean> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, (res) => {
          if (res.statusCode && res.statusCode < 500) {
            return resolve(true);
          }
          retry();
        })
        .on('error', retry);
    };

    const retry = () => {
      if (Date.now() - start > timeoutMs) {
        return reject(new Error(`Timed out waiting for production server at ${url}`));
      }
      setTimeout(check, 1000);
    };

    check();
  });
}

function copyRecursive(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else if (stat.isFile()) {
    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

export async function exportFreshStaticSite() {
  console.log('================================================================');
  console.log('📦 PRODUCTION STATIC EXPORT PIPELINE & VALIDATION GATES [2026-08-24]');
  console.log('================================================================\n');

  // STEP 1: Run Production Build
  console.log('Step 1: Running optimized production Next.js build (npm run build)...');
  execSync('npm run build', {
    cwd: ROOT_DIR,
    env: { ...process.env, ADMIN_SESSION_SECRET: BUILD_SECRET, NODE_ENV: 'production' },
    stdio: 'inherit',
  });
  console.log('✓ Production build completed successfully.\n');

  // STEP 2: Launch Production Runtime Server on Port 3099
  console.log(`Step 2: Launching isolated Production Runtime Server on port ${PORT}...`);
  const serverProcess: ChildProcess = spawn(
    'npx',
    ['next', 'start', '-p', String(PORT)],
    {
      cwd: ROOT_DIR,
      env: { ...process.env, ADMIN_SESSION_SECRET: BUILD_SECRET, NODE_ENV: 'production', PORT: String(PORT) },
      stdio: 'pipe',
    }
  );

  let serverOutput = '';
  serverProcess.stdout?.on('data', (d) => (serverOutput += d.toString()));
  serverProcess.stderr?.on('data', (d) => (serverOutput += d.toString()));

  try {
    await waitForServer(`${PRODUCTION_SERVER}/api/health`);
    console.log(`✓ Production runtime server active at ${PRODUCTION_SERVER}\n`);
  } catch (err: any) {
    serverProcess.kill('SIGKILL');
    throw new Error(`Failed to start production runtime server: ${err.message}\nServer Logs:\n${serverOutput}`);
  }

  try {
    if (fs.existsSync(OUT_DIR)) {
      fs.rmSync(OUT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const routes = [
      { url: '/', file: 'index.html' },
      { url: '/ar', file: 'ar.html' },
      { url: '/ar', file: 'ar/index.html' },
      { url: '/en', file: 'en.html' },
      { url: '/en', file: 'en/index.html' },
      { url: '/ar/about', file: 'ar/about.html' },
      { url: '/ar/about', file: 'ar/about/index.html' },
      { url: '/ar/chairman-message', file: 'ar/chairman-message.html' },
      { url: '/ar/chairman-message', file: 'ar/chairman-message/index.html' },
      { url: '/en/chairman-message', file: 'en/chairman-message.html' },
      { url: '/en/chairman-message', file: 'en/chairman-message/index.html' },
      { url: '/ar/services', file: 'ar/services.html' },
      { url: '/ar/services', file: 'ar/services/index.html' },
      { url: '/ar/projects', file: 'ar/projects.html' },
      { url: '/ar/projects', file: 'ar/projects/index.html' },
      { url: '/ar/contact', file: 'ar/contact.html' },
      { url: '/ar/contact', file: 'ar/contact/index.html' },
      { url: '/en/about', file: 'en/about.html' },
      { url: '/en/about', file: 'en/about/index.html' },
      { url: '/en/services', file: 'en/services.html' },
      { url: '/en/services', file: 'en/services/index.html' },
      { url: '/en/projects', file: 'en/projects.html' },
      { url: '/en/projects', file: 'en/projects/index.html' },
      { url: '/en/contact', file: 'en/contact.html' },
      { url: '/en/contact', file: 'en/contact/index.html' },
      { url: '/admin', file: 'admin.html' },
      { url: '/ar/admin', file: 'ar/admin.html' },
      { url: '/ar/admin', file: 'ar/admin/index.html' },
      { url: '/en/admin', file: 'en/admin.html' },
      { url: '/en/admin', file: 'en/admin/index.html' },
    ];

    const assetsSet = new Set<string>();

    console.log('Step 3: Downloading fresh HTML pages from Production Runtime...');
    for (const route of routes) {
      const html = await fetchUrl(`${PRODUCTION_SERVER}${route.url}`);
      const targetFile = path.join(OUT_DIR, route.file);
      const targetDir = path.dirname(targetFile);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(targetFile, html, 'utf-8');
      console.log(`  ✓ Exported [${route.url}] -> ${route.file}`);

      // Extract referenced _next/static JS/CSS assets
      const assetMatches = html.match(/[\'"](\/_next\/static\/[^\'"\s>]+)[\'"]/g);
      if (assetMatches) {
        for (const m of assetMatches) {
          const cleanAsset = m.replace(/[\'"]/g, '');
          assetsSet.add(cleanAsset);
        }
      }
    }

    // STEP 4: Download Production Assets
    console.log('\nStep 4: Downloading referenced production JS/CSS assets...');
    for (const assetUrl of Array.from(assetsSet)) {
      try {
        const buf = await fetchBinary(`${PRODUCTION_SERVER}${assetUrl}`);
        const relPath = assetUrl.startsWith('/') ? assetUrl.slice(1) : assetUrl;
        const targetFile = path.join(OUT_DIR, relPath);
        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        fs.writeFileSync(targetFile, buf);

        // Also save decoded URI version for Apache/LiteSpeed URL decoding (%5B -> [, %5D -> ])
        try {
          const decodedRelPath = decodeURIComponent(relPath);
          if (decodedRelPath !== relPath) {
            const decodedTargetFile = path.join(OUT_DIR, decodedRelPath);
            const decodedDir = path.dirname(decodedTargetFile);
            if (!fs.existsSync(decodedDir)) fs.mkdirSync(decodedDir, { recursive: true });
            fs.writeFileSync(decodedTargetFile, buf);
          }
        } catch {}
      } catch (e: any) {
        console.warn(`  ⚠ Could not fetch asset [${assetUrl}]: ${e.message}`);
      }
    }

    // STEP 5: Copy Public Assets
    console.log('\nStep 5: Copying public/ assets, images, logos, uploads...');
    copyRecursive(path.join(ROOT_DIR, 'public'), OUT_DIR);

    // Write production .htaccess
    const htaccess = `# ==============================================================================
# GULF HILLS CONTRACTING — HOSTINGER PURE STATIC HTML (.htaccess)
# Release Identity: hostinger_fresh_static_2026-08-24
# Primary Canonical Domain: https://hedabkh.com.sa
# ==============================================================================

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Force HTTPS Redirect
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # Redirect WWW to Non-WWW
    RewriteCond %{HTTP_HOST} ^www\.hedabkh\.com\.sa$ [NC]
    RewriteRule ^(.*)$ https://hedabkh.com.sa/$1 [L,R=301]

    # Clean Route Rewrites
    RewriteRule ^ar/?$ ar.html [L]
    RewriteRule ^en/?$ en.html [L]
    RewriteRule ^admin/?$ ar/admin.html [L]
    RewriteRule ^ar/admin/?$ ar/admin.html [L]
    RewriteRule ^en/admin/?$ en/admin.html [L]

    # Serve clean URLs with .html extension
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME}.html -f
    RewriteRule ^(.*)$ $1.html [L]

    # Default Fallback (excluding _next/ static assets to prevent MIME type errors)
    RewriteCond %{REQUEST_URI} !^/_next/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml
</IfModule>

# Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
`;
    fs.writeFileSync(path.join(OUT_DIR, '.htaccess'), htaccess, 'utf-8');

    // STEP 6: EXECUTE HARD VALIDATION GATES (PHASE 4, 5, 6)
    console.log('\n================================================================');
    console.log('🛡️ EXECUTING HARD VALIDATION GATES (PRODUCTION INTEGRITY AUDIT)');
    console.log('================================================================');

    const htmlFiles = getAllFiles(OUT_DIR).filter((f) => f.endsWith('.html'));
    let devAssetsCount = 0;
    let malformedUrlCount = 0;
    let missingAssetCount = 0;
    const referencedAssets = new Set<string>();

    const FORBIDDEN_DEV_KEYWORDS = [
      '[turbopack]',
      'hmr-client',
      'next-devtools',
      'browser_dev',
      'webpack-hmr',
      'next-dev',
    ];

    for (const htmlFile of htmlFiles) {
      const content = fs.readFileSync(htmlFile, 'utf-8');

      // 1. Check for Forbidden Dev Keywords
      for (const keyword of FORBIDDEN_DEV_KEYWORDS) {
        if (content.toLowerCase().includes(keyword.toLowerCase())) {
          devAssetsCount++;
          console.error(`❌ FORBIDDEN DEV ASSET DETECTED IN: ${path.relative(OUT_DIR, htmlFile)} (keyword: "${keyword}")`);
        }
      }

      // 2. Check for Malformed Script URLs (e.g. .js\)
      const scriptMatches = content.match(/src=[\'"]([^\'"]+)[\'"]/g) || [];
      for (const sm of scriptMatches) {
        const urlStr = sm.replace(/^src=[\'"]|[\'"]$/g, '');
        if (urlStr.endsWith('\\') || urlStr.includes('\\_next')) {
          malformedUrlCount++;
          console.error(`❌ MALFORMED SCRIPT URL DETECTED IN: ${path.relative(OUT_DIR, htmlFile)} -> "${urlStr}"`);
        }
        if (urlStr.startsWith('/_next/')) {
          referencedAssets.add(urlStr);
        }
      }

      const linkMatches = content.match(/href=[\'"]([^\'"]+)[\'"]/g) || [];
      for (const lm of linkMatches) {
        const urlStr = lm.replace(/^href=[\'"]|[\'"]$/g, '');
        if (urlStr.startsWith('/_next/')) {
          referencedAssets.add(urlStr);
        }
      }
    }

    // 3. Check for Missing Assets & Non-Zero File Size
    for (const refAsset of Array.from(referencedAssets)) {
      const relPath = refAsset.startsWith('/') ? refAsset.slice(1) : refAsset;
      const diskPath = path.join(OUT_DIR, relPath);
      const decodedDiskPath = path.join(OUT_DIR, decodeURIComponent(relPath));

      const exists = fs.existsSync(diskPath) || fs.existsSync(decodedDiskPath);
      if (!exists) {
        missingAssetCount++;
        console.error(`❌ MISSING REFERENCED ASSET: ${refAsset}`);
      } else {
        const targetPath = fs.existsSync(diskPath) ? diskPath : decodedDiskPath;
        const size = fs.statSync(targetPath).size;
        if (size === 0) {
          missingAssetCount++;
          console.error(`❌ ZERO-BYTE ASSET DETECTED: ${refAsset}`);
        }
      }
    }

    const allOutputFiles = getAllFiles(OUT_DIR);
    const jsAssetsCount = allOutputFiles.filter((f) => f.endsWith('.js')).length;
    const cssAssetsCount = allOutputFiles.filter((f) => f.endsWith('.css')).length;
    const imgAssetsCount = allOutputFiles.filter((f) => /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(f)).length;
    const fontAssetsCount = allOutputFiles.filter((f) => /\.(woff|woff2|ttf|otf|eot)$/i.test(f)).length;

    console.log('\n📊 PIPELINE VALIDATION AUDIT SUMMARY:');
    console.log(`  • Total Generated HTML Files: ${htmlFiles.length}`);
    console.log(`  • Total JS Assets:           ${jsAssetsCount}`);
    console.log(`  • Total CSS Assets:          ${cssAssetsCount}`);
    console.log(`  • Total Image Assets:        ${imgAssetsCount}`);
    console.log(`  • Total Font Assets:         ${fontAssetsCount}`);
    console.log(`  • Dev Assets Detected:       ${devAssetsCount}`);
    console.log(`  • Missing Referenced Assets: ${missingAssetCount}`);
    console.log(`  • Malformed Script URLs:     ${malformedUrlCount}`);

    if (devAssetsCount > 0 || missingAssetCount > 0 || malformedUrlCount > 0) {
      throw new Error(
        `PRODUCTION EXPORT BLOCKED:\n` +
          `Development/Turbopack asset detected or missing referenced assets.\n` +
          `Dev Assets: ${devAssetsCount}, Missing Assets: ${missingAssetCount}, Malformed URLs: ${malformedUrlCount}`
      );
    }

    console.log('\n✅ HARD VALIDATION GATES PASSED 100%. ZERO DEV ASSETS DETECTED.');

    // STEP 7: Zip output without macOS metadata
    console.log('\nStep 7: Compressing clean production package into ZIP...');
    const zipPath = path.join(ROOT_DIR, ZIP_NAME);
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

    execSync(`cd fresh_static_export && find . -name "._*" -delete && COPYFILE_DISABLE=1 zip -r -q "../${ZIP_NAME}" . -x "*/._*" -x "._*" -x "__MACOSX/*"`, { cwd: ROOT_DIR });
    const zipSize = fs.statSync(zipPath).size;
    const hash = crypto.createHash('sha256').update(fs.readFileSync(zipPath)).digest('hex');

    console.log('\n================================================================');
    console.log('🎉 PRODUCTION STATIC EXPORT PIPELINE COMPLETED SUCCESSFULLY!');
    console.log(`📁 Export Directory: ${OUT_DIR}`);
    console.log(`📦 Zip Archive:     ${ZIP_NAME} (${(zipSize / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`🔒 SHA256 Hash:      ${hash}`);
    console.log('================================================================\n');

  } finally {
    // Shutdown production runtime server cleanly
    console.log('Cleanly shutting down Production Runtime Server...');
    serverProcess.kill('SIGTERM');
  }
}

if (require.main === module) {
  exportFreshStaticSite().catch((err) => {
    console.error('\n❌ PRODUCTION EXPORT PIPELINE FAILED:', err.message);
    process.exit(1);
  });
}
