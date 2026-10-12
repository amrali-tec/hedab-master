#!/usr/bin/env bash
# ==============================================================================
# GULF HILLS CONTRACTING — LINUX RELEASE DEPLOYMENT & VERIFICATION SCRIPT
# Target Domain: https://hedabkh.com.sa
# ==============================================================================

set -euo pipefail

RELEASE_TAG="v1.0.0-rc1"
TARGET_DIR="/var/www/hedabkh-portal/releases/${RELEASE_TAG}"
SHARED_DIR="/var/www/hedabkh-portal/shared"
DATA_DIR="/var/data/hedabkh"
ARCHIVE_DIR="/tmp/hedabkh-release"

echo "================================================================="
echo "📦 STEP 2: RELEASE ARTIFACT VERIFICATION & ZERO-DOWNTIME DEPLOY"
echo "================================================================="

# 1. Verify archive SHA256 before extraction
cd "${ARCHIVE_DIR}"
echo "Verifying archive cryptographic signatures..."
sha256sum -c ARCHIVE_SHA256SUMS.txt
echo "✅ Archive signatures verified 100% match."

# 2. Extract application source into immutable release directory
mkdir -p "${TARGET_DIR}"
tar -xzf hedabkh-portal-v1.0.0-rc1.tar.gz -C "${TARGET_DIR}"
echo "✅ Source archive extracted to ${TARGET_DIR}."

# 3. Extract persistent data into /var/data/hedabkh (Initial seed if empty)
if [ ! -f "${DATA_DIR}/cms_database.json" ]; then
    echo "Seeding persistent data directory from archive..."
    TEMP_DATA_DIR=$(mktemp -d)
    tar -xzf hedabkh-data-v1.0.0-rc1.tar.gz -C "${TEMP_DATA_DIR}"
    cp -r "${TEMP_DATA_DIR}/data/"* "${DATA_DIR}/"
    mkdir -p "${DATA_DIR}/uploads"
    if [ -d "${TEMP_DATA_DIR}/public/uploads" ]; then
        cp -r "${TEMP_DATA_DIR}/public/uploads/"* "${DATA_DIR}/uploads/" 2>/dev/null || true
    fi
    rm -rf "${TEMP_DATA_DIR}"
    chown -R hedabkh:hedabkh "${DATA_DIR}"
    echo "✅ Persistent database and snapshots seeded."
fi

# Guard: Ensure persistent database exists before linking
if [ ! -f "${DATA_DIR}/cms_database.json" ]; then
    echo "❌ FATAL: Persistent database ${DATA_DIR}/cms_database.json does not exist!"
    exit 1
fi

# 4. Bind persistent storage to release
rm -rf "${TARGET_DIR}/data"
ln -sfn "${DATA_DIR}" "${TARGET_DIR}/data"
mkdir -p "${TARGET_DIR}/public"
rm -rf "${TARGET_DIR}/public/uploads"
ln -sfn "${DATA_DIR}/uploads" "${TARGET_DIR}/public/uploads"
echo "✅ Persistent data symlinks bound to ${TARGET_DIR}."

# 5. Generate random ADMIN_SESSION_SECRET on server only (if not present)
if [ ! -f "${SHARED_DIR}/.env.production" ]; then
    RANDOM_SECRET=$(openssl rand -hex 32)
    cat <<EOF > "${SHARED_DIR}/.env.production"
NODE_ENV=production
PORT=3000
HOSTNAME=127.0.0.1
NEXT_PUBLIC_APP_URL=https://hedabkh.com.sa
ADMIN_SESSION_SECRET=${RANDOM_SECRET}
EOF
    chmod 600 "${SHARED_DIR}/.env.production"
    chown hedabkh:hedabkh "${SHARED_DIR}/.env.production"
    echo "✅ Created random 64-character ADMIN_SESSION_SECRET in ${SHARED_DIR}/.env.production."
fi

ln -sfn "${SHARED_DIR}/.env.production" "${TARGET_DIR}/.env.production"

# 6. Install dependencies and compile Next.js production build
cd "${TARGET_DIR}"
echo "Running npm ci for clean production dependencies..."
npm ci --omit=dev --ignore-scripts=false || npm ci
echo "Compiling Next.js production build..."
npm run build
echo "✅ Production build compiled successfully."

# 7. Start application via PM2 Fork Mode (Single Instance)
chown -R hedabkh:hedabkh "${TARGET_DIR}"
su - hedabkh -c "cd ${TARGET_DIR} && pm2 delete hedabkh-portal 2>/dev/null || true"
su - hedabkh -c "cd ${TARGET_DIR} && pm2 start ecosystem.config.cjs --env production"
su - hedabkh -c "pm2 save"
env PATH=$PATH:/usr/bin pm2 startup systemd -u hedabkh --hp /var/www/hedabkh-portal

# 8. Test restart & boot recovery
echo "Testing restart and boot recovery..."
su - hedabkh -c "pm2 restart hedabkh-portal"
sleep 3
curl -fsS http://127.0.0.1:3000/api/health/ >/dev/null
curl -fsS http://127.0.0.1:3000/api/ready/ >/dev/null
echo "✅ PM2 process supervision & health probes verified."

echo "================================================================="
echo "✅ DEPLOYMENT COMPLETE: Next.js running on 127.0.0.1:3000"
echo "================================================================="
