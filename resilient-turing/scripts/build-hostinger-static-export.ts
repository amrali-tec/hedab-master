/**
 * Hostinger Static HTML/CSS/JS Export Builder
 * Visual CMS Studio — Saudi Sovereign Infrastructure Platform
 * Generates 100% pure static HTML bundle for Hostinger Shared Hosting (No Node.js needed)
 * Date: 2026-08-24
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const TODAY_DATE = '2026-08-24';
const STATIC_ZIP_NAME = `hostinger_static_export_${TODAY_DATE}.zip`;

function computeSha256(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
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

export async function buildHostingerStaticExport() {
  console.log('================================================================');
  console.log(`📦 GENERATING 100% PURE STATIC HTML EXPORT FOR HOSTINGER [${TODAY_DATE}]`);
  console.log('================================================================\n');

  const nextConfigPath = path.join(ROOT_DIR, 'next.config.ts');
  const nextConfigOriginal = fs.readFileSync(nextConfigPath, 'utf-8');

  try {
    // 1. Temporarily add output: 'export' to next.config.ts
    console.log('Step 1: Enabling output: "export" in next.config.ts...');
    const exportConfig = nextConfigOriginal.replace(
      'const nextConfig: NextConfig = {',
      'const nextConfig: NextConfig = {\n  output: "export",\n  trailingSlash: true,'
    );
    fs.writeFileSync(nextConfigPath, exportConfig, 'utf-8');

    // 2. Run Next.js build to generate static out/ folder
    console.log('Step 2: Running Next.js static build...');
    execSync('ADMIN_SESSION_SECRET="production-build-secret-2026" npm run build', {
      cwd: ROOT_DIR,
      stdio: 'inherit',
      env: { ...process.env, ADMIN_SESSION_SECRET: 'production-build-secret-2026' }
    });

    console.log('✅ Static HTML build completed successfully!');
  } finally {
    // Restore original next.config.ts
    fs.writeFileSync(nextConfigPath, nextConfigOriginal, 'utf-8');
    console.log('✅ Restored next.config.ts');
  }

  // 3. Prepare static target directory (out/)
  const outDir = path.join(ROOT_DIR, 'out');
  if (!fs.existsSync(outDir)) {
    throw new Error('Static export folder "out/" was not generated.');
  }

  // Copy uploads & data
  console.log('\nStep 3: Including uploads and static metadata...');
  copyRecursive(path.join(ROOT_DIR, 'public', 'uploads'), path.join(outDir, 'uploads'));

  // 4. Generate Hostinger Static .htaccess for Apache / LiteSpeed HTML routing
  const htaccessStatic = `# ==============================================================================
# GULF HILLS CONTRACTING — HOSTINGER STATIC HTML / APACHE / LITESPEED ROUTING
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

    # Serve clean URLs (e.g. /ar/about -> /ar/about/index.html or /ar/about.html)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME}.html -f
    RewriteRule ^(.*)$ $1.html [L]

    # Fallback to index.html for SPA/dynamic client routes
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ /index.html [L]
</IfModule>

# Sovereign Security Headers
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml
</IfModule>

# Long-term Caching for Immutable Static Assets
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

  fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessStatic, 'utf-8');
  console.log('✅ Added Hostinger static .htaccess to out/');

  // 5. Compress out/ into hostinger_static_export_2026-08-24.zip
  console.log('\nStep 4: Compressing static bundle into ZIP archive...');
  const zipPath = path.join(ROOT_DIR, STATIC_ZIP_NAME);
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  execSync(`cd out && zip -r -q "../${STATIC_ZIP_NAME}" .`, { cwd: ROOT_DIR });
  const zipSize = fs.statSync(zipPath).size;
  const zipHash = computeSha256(zipPath);

  console.log('\n================================================================');
  console.log('🎉 PURE STATIC HTML HOSTINGER EXPORT COMPLETED SUCCESSFULLY!');
  console.log(`📁 Static Out Folder:  ${outDir}`);
  console.log(`📦 Hostinger ZIP:      ${STATIC_ZIP_NAME}`);
  console.log(`🔒 Archive SHA256:     ${zipHash}`);
  console.log(`📏 Archive Size:       ${(zipSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log('================================================================\n');
}

if (require.main === module) {
  buildHostingerStaticExport().catch((err) => {
    console.error('Static export failed:', err);
    process.exit(1);
  });
}
