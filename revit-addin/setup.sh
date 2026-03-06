#!/bin/bash
# ARQIA Revit Add-in Setup Script
# Run this to set up the development environment

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   ARQIA Revit Add-in MVP - Setup Script                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    echo -e "${RED}Error: Run this script from the arqia-revit-addin directory${NC}"
    exit 1
fi

echo "Step 1: Setting up Backend..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo -e "${YELLOW}node_modules already exists. Skipping npm install.${NC}"
fi

echo ""
echo "Step 2: Creating logs directory..."
mkdir -p logs

echo ""
echo -e "${GREEN}✓ Backend setup complete!${NC}"
echo ""
echo "To start the backend server:"
echo "  cd backend"
echo "  npm start"
echo ""

# Check for Revit installation
echo "Step 3: Checking for Revit installation..."
REVI_2026="C:\Program Files\Autodesk\Revit 2026"
REVI_2025="C:\Program Files\Autodesk\Revit 2025"
REVI_2024="C:\Program Files\Autodesk\Revit 2024"

if [ -d "$REVI_2026" ]; then
    echo -e "${GREEN}✓ Found Revit 2026${NC}"
elif [ -d "$REVI_2025" ]; then
    echo -e "${YELLOW}⚠ Found Revit 2025 (update .csproj if using 2025)${NC}"
elif [ -d "$REVI_2024" ]; then
    echo -e "${YELLOW}⚠ Found Revit 2024 (update .csproj if using 2024)${NC}"
else
    echo -e "${YELLOW}⚠ Revit installation not found at standard path${NC}"
    echo "  Please update the .csproj file with your Revit installation path"
fi

echo ""
echo "Step 4: Checking for .NET Framework..."
if command -v msbuild &> /dev/null; then
    echo -e "${GREEN}✓ MSBuild found${NC}"
    msbuild -version | head -1
elif command -v dotnet &> /dev/null; then
    echo -e "${GREEN}✓ .NET SDK found${NC}"
    dotnet --version
else
    echo -e "${YELLOW}⚠ .NET build tools not found${NC}"
    echo "  Install Visual Studio or Build Tools for .NET Framework 4.8"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Setup Complete!                                          ║"
echo "║                                                            ║"
echo "║   Next Steps:                                              ║"
echo "║   1. cd backend && npm start                               ║"
echo "║   2. Open src/ARQIARevitAddin.csproj in Visual Studio      ║"
echo "║   3. Build and copy to Revit Addins folder                 ║"
echo "║   4. Test in Revit!                                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
