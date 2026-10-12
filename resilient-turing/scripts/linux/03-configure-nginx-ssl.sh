#!/usr/bin/env bash
# ==============================================================================
# GULF HILLS CONTRACTING — NGINX REVERSE PROXY & CERTBOT TLS AUTOMATION
# Target Domain: https://hedabkh.com.sa
# ==============================================================================

set -euo pipefail

RELEASE_TAG="v1.0.0-rc1"
TARGET_DIR="/var/www/hedabkh-portal/releases/${RELEASE_TAG}"
NGINX_CONF_DEST="/etc/nginx/sites-available/hedabkh-portal.conf"

echo "================================================================="
echo "🌐 STEP 3: NGINX REVERSE PROXY, MICROCACHE & TLS CERTIFICATE"
echo "================================================================="

# 1. Install Nginx config
cp "${TARGET_DIR}/nginx/gulf-hills-portal.conf" "${NGINX_CONF_DEST}"
mkdir -p /var/cache/nginx/gulf_hills_cache
chown -R www-data:www-data /var/cache/nginx/gulf_hills_cache

ln -sfn "${NGINX_CONF_DEST}" /etc/nginx/sites-enabled/hedabkh-portal.conf
rm -f /etc/nginx/sites-enabled/default

# 2. Test Nginx syntax
echo "Testing Nginx configuration syntax..."
nginx -t
systemctl reload nginx
echo "✅ Nginx configuration syntax verified and reloaded."

# 3. Issue Let's Encrypt TLS Certificate for apex and www
if [ ! -d "/etc/letsencrypt/live/hedabkh.com.sa" ]; then
    echo "Requesting Let's Encrypt TLS certificate for hedabkh.com.sa & www.hedabkh.com.sa..."
    certbot --nginx \
        --non-interactive \
        --agree-tos \
        -m admin@hedabkh.com.sa \
        -d hedabkh.com.sa \
        -d www.hedabkh.com.sa \
        --redirect
    echo "✅ Let's Encrypt certificate obtained successfully."
fi

# 4. Verify Nginx operational state
nginx -t
systemctl reload nginx
echo "✅ Nginx reverse proxy active with SSL and microcaching."
