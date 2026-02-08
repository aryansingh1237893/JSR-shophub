#!/bin/bash

# ShopHub Mobile App - Build & Deploy Script
# Automates building and submitting to Play Store & App Store

set -e

echo "🚀 ShopHub Mobile App Build & Deploy Script"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
  echo "🔧 Checking prerequisites..."
  
  if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not installed${NC}"
    exit 1
  fi
  
  if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not installed${NC}"
    exit 1
  fi
  
  if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}⚠️  EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
  fi
  
  echo -e "${GREEN}✅ All prerequisites met${NC}"
  echo ""
}

# Install dependencies
install_deps() {
  echo "📦 Installing dependencies..."
  npm install
  echo -e "${GREEN}✅ Dependencies installed${NC}"
  echo ""
}

# Build for Android
build_android() {
  echo "🔨 Building Android app..."
  echo "Options:"
  echo "1) Build with EAS (Recommended)"
  echo "2) Build locally"
  read -p "Select option (1 or 2): " android_choice
  
  if [ "$android_choice" == "1" ]; then
    echo "Building with EAS..."
    eas build --platform android
  else
    echo "Building locally..."
    expo build:android
  fi
  
  echo -e "${GREEN}✅ Android build complete${NC}"
  echo "📥 Download APK/AAB from Expo dashboard"
  echo ""
}

# Build for iOS
build_ios() {
  echo "🔨 Building iOS app..."
  echo "Options:"
  echo "1) Build with EAS (Recommended)"
  echo "2) Build locally (Mac only)"
  read -p "Select option (1 or 2): " ios_choice
  
  if [ "$ios_choice" == "1" ]; then
    echo "Building with EAS..."
    eas build --platform ios
  else
    if [[ "$OSTYPE" == "darwin"* ]]; then
      echo "Building locally..."
      expo build:ios
    else
      echo -e "${RED}❌ Local iOS build requires macOS${NC}"
      exit 1
    fi
  fi
  
  echo -e "${GREEN}✅ iOS build complete${NC}"
  echo "📥 Download IPA from Expo dashboard"
  echo ""
}

# Create test environment
create_test_env() {
  echo "📝 Creating test environment file..."
  
  if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || echo ".env.example not found"
    echo "⚠️  Created .env - Please fill in your API keys"
  else
    echo "✅ .env already exists"
  fi
  echo ""
}

# Run diagnostics
run_diagnostics() {
  echo "🔍 Running app diagnostics..."
  expo doctor
  echo -e "${GREEN}✅ Diagnostics complete${NC}"
  echo ""
}

# Main menu
main_menu() {
  echo "════════════════════════════════════════"
  echo "ShopHub Mobile App - Build & Deploy Menu"
  echo "════════════════════════════════════════"
  echo ""
  echo "Options:"
  echo "1) Install dependencies"
  echo "2) Create test environment (.env)"
  echo "3) Run app locally (dev server)"
  echo "4) Build for Android"
  echo "5) Build for iOS"
  echo "6) Build for both Android & iOS"
  echo "7) Run diagnostics"
  echo "8) Show build status"
  echo "9) Exit"
  echo ""
  read -p "Select option (1-9): " choice
  
  case $choice in
    1)
      install_deps
      main_menu
      ;;
    2)
      create_test_env
      main_menu
      ;;
    3)
      echo "🚀 Starting development server..."
      echo "Scan QR code with Expo Go app or press 'a' for Android, 'i' for iOS"
      npm start
      ;;
    4)
      build_android
      main_menu
      ;;
    5)
      build_ios
      main_menu
      ;;
    6)
      build_android
      build_ios
      main_menu
      ;;
    7)
      run_diagnostics
      main_menu
      ;;
    8)
      echo "📊 Recent builds:"
      eas build:list --limit 10 || echo "No builds yet. Run a build first."
      echo ""
      main_menu
      ;;
    9)
      echo -e "${GREEN}👋 Goodbye!${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}❌ Invalid option${NC}"
      main_menu
      ;;
  esac
}

# Start
check_prerequisites
clear
main_menu
