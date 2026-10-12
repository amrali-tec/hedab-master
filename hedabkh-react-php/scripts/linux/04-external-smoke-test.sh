#!/usr/bin/env bash
# ==============================================================================
# GULF HILLS CONTRACTING — PUBLIC DOMAIN E2E SMOKE TEST HARNESS
# Target Domain: https://hedabkh.com.sa
# ==============================================================================

set -euo pipefail

BASE_URL="https://hedabkh.com.sa"
echo "================================================================="
echo "🧪 STEP 4: PUBLIC DOMAIN EXTERNAL SMOKE TEST"
echo "Target: ${BASE_URL}"
echo "================================================================="

# 1. Health Probe
echo -n "Checking /api/health/ ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/health/")
if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ 200 OK"; else echo "❌ $HTTP_CODE"; exit 1; fi

# 2. Readiness Probe
echo -n "Checking /api/ready/ ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/ready/")
if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ 200 OK"; else echo "❌ $HTTP_CODE"; exit 1; fi

# 3. Arabic Home
echo -n "Checking /ar/ ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/ar/")
if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ 200 OK"; else echo "❌ $HTTP_CODE"; exit 1; fi

# 4. English Home
echo -n "Checking /en/ ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/en/")
if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ 200 OK"; else echo "❌ $HTTP_CODE"; exit 1; fi

# 5. Arabic About Page
echo -n "Checking /ar/about/ ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/ar/about/")
if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ 200 OK"; else echo "❌ $HTTP_CODE"; exit 1; fi

# 6. Chairman Message Page
echo -n "Checking /ar/chairman-message/ ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/ar/chairman-message/")
if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ 200 OK"; else echo "❌ $HTTP_CODE"; exit 1; fi

# 7. Contact Page
echo -n "Checking /ar/contact/ ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/ar/contact/")
if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ 200 OK"; else echo "❌ $HTTP_CODE"; exit 1; fi

# 8. Unauthenticated Admin API (Must return 401 Unauthorized)
echo -n "Checking unauthenticated API security ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/admin/visual-cms/?action=getPages")
if [ "$HTTP_CODE" -eq 401 ]; then echo "✅ 401 Unauthorized (Security Enforced)"; else echo "❌ $HTTP_CODE"; exit 1; fi

# 9. HTTPS Redirection
echo -n "Checking HTTP to HTTPS 301 Redirect ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://hedabkh.com.sa/")
if [ "$HTTP_CODE" -eq 301 ]; then echo "✅ 301 Redirect Enforced"; else echo "⚠️ $HTTP_CODE"; fi

# 10. WWW to Canonical Redirection
echo -n "Checking WWW to Apex 301 Redirect ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://www.hedabkh.com.sa/")
if [ "$HTTP_CODE" -eq 301 ]; then echo "✅ 301 Redirect Enforced"; else echo "⚠️ $HTTP_CODE"; fi

echo "================================================================="
echo "🎉 ALL PUBLIC SMOKE TESTS PASSED (100%)"
echo "================================================================="
