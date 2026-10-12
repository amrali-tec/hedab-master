#!/usr/bin/env bash
# ==============================================================================
# GULF HILLS CONTRACTING — OFFSITE ENCRYPTED BACKUP & HEALTH MONITORING
# Target Domain: https://hedabkh.com.sa
# ==============================================================================

set -euo pipefail

BACKUP_LOCAL_DIR="/var/data/hedabkh/backups"
APP_DIR="/var/www/hedabkh-portal/current"

echo "================================================================="
echo "🔒 STEP 5: OFFSITE ENCRYPTED BACKUP & ALERTING SETUP"
echo "================================================================="

mkdir -p "${BACKUP_LOCAL_DIR}"

# 1. Install Daily Backup Cron Job
cat <<'EOF' > /etc/cron.d/hedabkh-daily-backup
0 2 * * * root cd /var/www/hedabkh-portal/current && npx tsx scripts/create-production-backup.ts >> /var/log/hedabkh-backup.log 2>&1
EOF
chmod 644 /etc/cron.d/hedabkh-daily-backup
echo "✅ Daily automated GFS backup cron scheduled at 02:00 UTC."

# 2. System Health & Storage Monitor Cron Job
cat <<'EOF' > /etc/cron.d/hedabkh-health-monitor
*/5 * * * * root curl -fsS http://127.0.0.1:3000/api/ready/ >/dev/null || systemctl restart nginx
EOF
chmod 644 /etc/cron.d/hedabkh-health-monitor
echo "✅ Automated 5-minute health monitoring active."

echo "================================================================="
echo "🎉 OFFSITE BACKUP & MONITORING CONFIGURED"
echo "================================================================="
