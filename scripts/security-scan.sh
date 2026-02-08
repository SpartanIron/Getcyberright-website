#!/bin/bash

echo "========================================"
echo "  Security Vulnerability Scan Report"
echo "  $(date)"
echo "========================================"
echo ""

VULNERABILITIES_FOUND=0

echo "📦 Scanning npm dependencies..."
echo "----------------------------------------"
npm audit --audit-level=moderate 2>/dev/null
NPM_EXIT_CODE=$?

if [ $NPM_EXIT_CODE -ne 0 ]; then
    VULNERABILITIES_FOUND=1
    echo ""
    echo "⚠️  npm audit found vulnerabilities!"
else
    echo "✅ No npm vulnerabilities found"
fi

echo ""
echo "----------------------------------------"
echo "🔬 Running Trivy vulnerability scanner..."
echo "----------------------------------------"

if command -v trivy &> /dev/null; then
    trivy fs --severity HIGH,CRITICAL --scanners vuln --quiet . 2>/dev/null
    TRIVY_EXIT_CODE=$?
    if [ $TRIVY_EXIT_CODE -ne 0 ]; then
        VULNERABILITIES_FOUND=1
    fi
else
    echo "ℹ️  Trivy not installed - skipping deep scan"
    echo "   Install with: nix-env -iA nixpkgs.trivy"
fi

echo ""
echo "----------------------------------------"
echo "🔍 Checking for outdated packages..."
echo "----------------------------------------"
npm outdated 2>/dev/null | head -30 || true

echo ""
echo "----------------------------------------"
echo "🔐 Scanning for hardcoded secrets..."
echo "----------------------------------------"

SECRETS_PATTERN='(API_KEY|SECRET_KEY|PRIVATE_KEY|ACCESS_TOKEN|AUTH_TOKEN)[[:space:]]*=[[:space:]]*["\x27][A-Za-z0-9_-]{20,}["\x27]'

SECRET_FILES=$(grep -r -l -E "$SECRETS_PATTERN" \
    --include="*.ts" \
    --include="*.tsx" \
    --include="*.js" \
    --include="*.jsx" \
    --include="*.env.local" \
    --include="*.env.production" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=dist \
    --exclude="*.d.ts" \
    . 2>/dev/null || true)

if [ -n "$SECRET_FILES" ]; then
    echo "⚠️  Potential secrets found in files:"
    echo "$SECRET_FILES"
    VULNERABILITIES_FOUND=1
else
    echo "✅ No hardcoded secrets detected"
fi

echo ""
echo "----------------------------------------"
echo "📋 Checking for security headers..."
echo "----------------------------------------"

if grep -rq "helmet" server/ --include="*.ts" 2>/dev/null; then
    echo "✅ Helmet middleware detected"
else
    echo "⚠️  Helmet middleware not detected - consider adding security headers"
fi

if grep -rq "express-rate-limit\|rateLimit" server/ --include="*.ts" 2>/dev/null; then
    echo "✅ Rate limiting detected"
else
    echo "⚠️  Rate limiting not detected - consider adding rate limits"
fi

if grep -rq "cors" server/ --include="*.ts" 2>/dev/null; then
    echo "✅ CORS middleware detected"
else
    echo "⚠️  CORS configuration not detected"
fi

if grep -rq "csurf\|csrf" server/ --include="*.ts" 2>/dev/null; then
    echo "✅ CSRF protection detected"
else
    echo "⚠️  CSRF protection not detected"
fi

echo ""
echo "----------------------------------------"
echo "🔒 Checking for SQL injection patterns..."
echo "----------------------------------------"

SQL_INJECTION_PATTERNS=$(grep -r -n -E 'db\.execute\(`|pool\.query\(`|\.raw\(' \
    --include="*.ts" \
    --include="*.tsx" \
    --include="*.js" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    . 2>/dev/null | grep -v "sql\`" || true)

if [ -n "$SQL_INJECTION_PATTERNS" ]; then
    echo "⚠️  Potential unsafe SQL patterns found:"
    echo "$SQL_INJECTION_PATTERNS"
    VULNERABILITIES_FOUND=1
else
    echo "✅ No unsafe SQL patterns detected"
fi

echo ""
echo "----------------------------------------"
echo "🛡️  Checking for XSS vulnerabilities..."
echo "----------------------------------------"

XSS_PATTERNS=$(grep -r -n "dangerouslySetInnerHTML" \
    --include="*.tsx" \
    --include="*.jsx" \
    --exclude-dir=node_modules \
    . 2>/dev/null || true)

if [ -n "$XSS_PATTERNS" ]; then
    echo "⚠️  dangerouslySetInnerHTML found (potential XSS):"
    echo "$XSS_PATTERNS" | head -10
    echo "   Review these to ensure input is properly sanitized"
else
    echo "✅ No dangerouslySetInnerHTML usage detected"
fi

echo ""
echo "========================================"
echo "  Scan Complete"
echo "========================================"

if [ $VULNERABILITIES_FOUND -eq 1 ]; then
    echo "⚠️  Some issues were found - please review above"
    exit 1
else
    echo "✅ All security checks passed"
    exit 0
fi
