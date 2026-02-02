#!/bin/bash
# RoomMate Pre-Deployment Verification Script
# Run this script to verify your setup is ready for Vercel deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 RoomMate Pre-Deployment Verification"
echo "========================================"
echo ""

# 1. Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js (v16+)"
    exit 1
fi

# 2. Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found."
    exit 1
fi

# 3. Check Git
echo -n "Checking Git... "
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | sed 's/git version //')
    echo -e "${GREEN}✓${NC} $GIT_VERSION"
else
    echo -e "${RED}✗${NC} Git not found."
    exit 1
fi

# 4. Check repository is initialized
echo -n "Checking Git repository... "
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Git repository found"
else
    echo -e "${RED}✗${NC} Not a Git repository"
    exit 1
fi

# 5. Check client dependencies
echo -n "Checking client dependencies... "
if [ -d "client/node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules present"
else
    echo -e "${YELLOW}⚠${NC} Dependencies not installed. Run: cd client && npm install"
fi

# 6. Check server dependencies
echo -n "Checking server dependencies... "
if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules present"
else
    echo -e "${YELLOW}⚠${NC} Dependencies not installed. Run: cd server && npm install"
fi

# 7. Check client build configuration
echo -n "Checking client build config... "
if grep -q "build" client/package.json; then
    echo -e "${GREEN}✓${NC} Build script found"
else
    echo -e "${RED}✗${NC} Build script not found in client/package.json"
fi

# 8. Check Vite config exists
echo -n "Checking Vite configuration... "
if [ -f "client/vite.config.js" ]; then
    echo -e "${GREEN}✓${NC} vite.config.js found"
else
    echo -e "${RED}✗${NC} vite.config.js not found"
fi

# 9. Check Vercel config
echo -n "Checking Vercel configuration... "
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json found"
else
    echo -e "${YELLOW}⚠${NC} vercel.json not found (Vercel will use defaults)"
fi

# 10. Check API functions exist
echo -n "Checking API functions... "
API_DIRS=$(find api -type d -name "auth" -o -name "listings" 2>/dev/null | wc -l)
API_FILES=$(find api -type f -name "*.js" 2>/dev/null | wc -l)
if [ $API_FILES -gt 5 ]; then
    echo -e "${GREEN}✓${NC} API functions found ($API_FILES files)"
else
    echo -e "${RED}✗${NC} Not enough API functions found"
    exit 1
fi

# 11. Check .env file exists
echo -n "Checking environment file template... "
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example found"
else
    echo -e "${YELLOW}⚠${NC} .env.example not found"
fi

# 12. Check server .env.local exists (optional)
echo -n "Checking server environment file... "
if [ -f "server/.env.local" ]; then
    echo -e "${GREEN}✓${NC} server/.env.local found"
else
    echo -e "${YELLOW}⚠${NC} server/.env.local not found (needed for local testing)"
fi

# 13. Check deployment docs
echo -n "Checking deployment documentation... "
if [ -f "VERCEL_DEPLOYMENT.md" ] && [ -f "DEPLOYMENT_SUMMARY.md" ]; then
    echo -e "${GREEN}✓${NC} Documentation found"
else
    echo -e "${YELLOW}⚠${NC} Deployment documentation missing"
fi

# 14. Test client build
echo -n "Testing client build... "
cd client 2>/dev/null && npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build successful"
    cd ..
else
    echo -e "${RED}✗${NC} Build failed"
    cd ..
    exit 1
fi

# 15. Check for hardcoded localhost
echo -n "Checking for hardcoded localhost in client... "
if grep -r "localhost:" client/src --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "node_modules" | wc -l | grep -q "^0$"; then
    echo -e "${GREEN}✓${NC} No hardcoded localhost found"
else
    MATCHES=$(grep -r "localhost:" client/src --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "node_modules" | wc -l)
    echo -e "${YELLOW}⚠${NC} Found $MATCHES hardcoded localhost references (should use VITE_API_URL)"
fi

# 16. Git status
echo -n "Checking Git status... "
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓${NC} Working directory clean"
else
    echo -e "${YELLOW}⚠${NC} Uncommitted changes exist"
fi

echo ""
echo "========================================"
echo -e "${GREEN}✓${NC} Pre-deployment verification complete!"
echo ""
echo "Next steps:"
echo "1. Read: VERCEL_DEPLOYMENT.md"
echo "2. Set up: MongoDB Atlas, AWS S3, Google API, Gmail"
echo "3. Run: vercel link (to connect to Vercel project)"
echo "4. Run: vercel env pull (to get Vercel env vars)"
echo "5. Deploy: git push (will trigger Vercel auto-deploy)"
echo ""
