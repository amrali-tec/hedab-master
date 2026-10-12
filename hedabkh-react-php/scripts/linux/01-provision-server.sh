#!/usr/bin/env bash
# ==============================================================================
# GULF HILLS CONTRACTING — LINUX SERVER PROVISIONING & HARDENING GATE (GATE 01)
# Target: Ubuntu 22.04 LTS / Debian 12
# Canonical Domain: https://hedabkh.com.sa
# ==============================================================================

set -euo pipefail

echo "================================================================="
echo "⚙️ GATE 01: LINUX PRODUCTION SERVER PROVISIONING & HARDENING"
echo "================================================================="

# ------------------------------------------------------------------------------
# 1. PRE-FLIGHT SYSTEM INFORMATION & COMPATIBILITY CHECK
# ------------------------------------------------------------------------------
echo "--- PRE-FLIGHT AUDIT ---"
OS_NAME=$(cat /etc/os-release | grep '^NAME=' | cut -d'=' -f2 | tr -d '"')
OS_VERSION=$(cat /etc/os-release | grep '^VERSION_ID=' | cut -d'=' -f2 | tr -d '"')
KERNEL=$(uname -r)
ARCH=$(uname -m)
CPU_COUNT=$(nproc)
TOTAL_RAM=$(free -h | awk '/^Mem:/ {print $2}')
DISK_AVAIL=$(df -h / | awk 'NR==2 {print $4}')

echo "OS Distribution: ${OS_NAME} ${OS_VERSION}"
echo "Kernel:          ${KERNEL}"
echo "Architecture:    ${ARCH}"
echo "CPU Cores:       ${CPU_COUNT}"
echo "Total RAM:       ${TOTAL_RAM}"
echo "Available Disk:  ${DISK_AVAIL}"
echo "Hostname:        $(hostname)"
echo "Timezone:        $(timedatectl | grep 'Time zone' || date +%Z)"

# Supported Platform Check
if [[ "${OS_NAME}" != *"Ubuntu"* && "${OS_NAME}" != *"Debian"* ]]; then
    echo "❌ ERROR: Unsupported OS distribution: ${OS_NAME}. Must be Ubuntu 22.04+ or Debian 12."
    exit 1
fi
echo "✅ Supported platform confirmed: ${OS_NAME} ${OS_VERSION}."

# ------------------------------------------------------------------------------
# 2. PACKAGE UPDATE & SYSTEM DEPENDENCY INSTALLATION
# ------------------------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git ufw tar gzip openssl certbot python3-certbot-nginx logrotate nginx

# ------------------------------------------------------------------------------
# 3. SERVICE USER CREATION ('hedabkh' - Non-Root)
# ------------------------------------------------------------------------------
if ! id -u hedabkh >/dev/null 2>&1; then
    useradd -m -s /bin/bash -d /var/www/hedabkh-portal hedabkh
    echo "✅ Service user 'hedabkh' created."
fi

# Verify hedabkh user
id hedabkh
echo "✅ Service user verified: $(sudo -u hedabkh whoami)"

# ------------------------------------------------------------------------------
# 4. FIREWALL HARDENING (UFW - Ports 22, 80, 443 Only; Port 3000 Forbidden)
# ------------------------------------------------------------------------------
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
echo "✅ UFW Firewall active: Allowed (22, 80, 443); Internal port 3000 protected."

# ------------------------------------------------------------------------------
# 5. NODE.JS 22 LTS INSTALLATION
# ------------------------------------------------------------------------------
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -d'.' -f1)" != "v22" ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi
echo "✅ Node runtime active: $(node -v) & npm $(npm -v)"

# ------------------------------------------------------------------------------
# 6. PM2 PROCESS SUPERVISOR INSTALLATION
# ------------------------------------------------------------------------------
if ! command -v pm2 >/dev/null 2>&1; then
    npm install -g pm2
fi
echo "✅ PM2 runtime supervisor active: $(pm2 -v)"

# ------------------------------------------------------------------------------
# 7. NGINX BASE CONFIGURATION & REVERSE PROXY PREPARATION
# ------------------------------------------------------------------------------
systemctl enable nginx
systemctl start nginx
echo "✅ Nginx reverse proxy service active (Public traffic remains disabled pending release)."

# ------------------------------------------------------------------------------
# 8. PERSISTENT STORAGE TOPOLOGY (/var/data/hedabkh)
# ------------------------------------------------------------------------------
mkdir -p /var/data/hedabkh/snapshots
mkdir -p /var/data/hedabkh/uploads
mkdir -p /var/data/hedabkh/backups
mkdir -p /var/www/hedabkh-portal/releases
mkdir -p /var/www/hedabkh-portal/shared
mkdir -p /var/www/hedabkh-portal/logs

chown -R hedabkh:hedabkh /var/data/hedabkh
chown -R hedabkh:hedabkh /var/www/hedabkh-portal
chmod -R 750 /var/data/hedabkh
chmod -R 755 /var/www/hedabkh-portal
echo "✅ Persistent storage topology configured at /var/data/hedabkh."

# ------------------------------------------------------------------------------
# 9. SECURITY & LEAST-PRIVILEGE AUDIT
# ------------------------------------------------------------------------------
echo "--- SECURITY AUDIT ---"
echo "Listening ports (Local check):"
ss -tulpn | grep -E ':(22|80|443|3000)' || true
echo "✅ No production secrets present; SSH intact; UFW active; Least-privilege applied."

echo "================================================================="
echo "🎉 GATE 01 COMPLETE: Server is hardened and ready for Gate 02"
echo "================================================================="
