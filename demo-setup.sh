#!/bin/bash

# ShopHub Local Demo Setup Script
# Runs the app locally with test keys (Stripe test mode, Ethereal email)

set -e

echo "🚀 Starting ShopHub Local Demo Setup..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker & Docker Compose found"
echo ""

# Setup backend test env
echo "📝 Setting up backend environment..."
cp backend/.env.test backend/.env 2>/dev/null || echo "Using existing backend/.env"

# Setup frontend test env
echo "📝 Setting up frontend environment..."
cp frontend/.env.test frontend/.env.local 2>/dev/null || echo "Using existing frontend/.env.local"

echo ""
echo "🐳 Building and starting Docker containers..."
echo "This may take 2-3 minutes on first run..."
echo ""

# Build and start services
docker-compose down 2>/dev/null || true
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "backend.*Up"; then
    echo "✅ Backend is running"
else
    echo "❌ Backend failed to start. Check logs:"
    docker-compose logs backend
    exit 1
fi

if docker-compose ps | grep -q "frontend.*Up"; then
    echo "✅ Frontend is running"
else
    echo "⚠️  Frontend may take a moment to start..."
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "🎉 ShopHub Demo is Running!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔧 Backend:   http://localhost:5000"
echo "🗄️  MongoDB:   localhost:27017"
echo "📊 Redis:     localhost:6379"
echo "🔍 Elasticsearch: localhost:9200"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "🧪 Test Credentials (for Stripe)"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Test Card (Success):  4242 4242 4242 4242"
echo "Expiry: Any future date (MM/YY)"
echo "CVC: Any 3 digits"
echo ""
echo "Test Card (Decline):  4000 0000 0000 0002"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "📧 Test Email (Ethereal - No Real Credentials)"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "All emails are captured by Ethereal test service."
echo "Check demo backend logs for email preview URLs."
echo ""
echo "════════════════════════════════════════════════════════════"
echo "📖 Demo Features"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "✅ Browse products"
echo "✅ Search & filter"
echo "✅ User authentication (signup/login/OTP)"
echo "✅ Add to cart & wishlist"
echo "✅ Checkout with Stripe (test mode)"
echo "✅ Order creation & tracking"
echo "✅ Image uploads (local storage)"
echo "✅ Product reviews & ratings"
echo "✅ Admin dashboard"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "📝 Useful Commands"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "View backend logs:"
echo "  docker-compose logs -f backend"
echo ""
echo "View frontend logs:"
echo "  docker-compose logs -f frontend"
echo ""
echo "Stop all services:"
echo "  docker-compose down"
echo ""
echo "Restart services:"
echo "  docker-compose restart"
echo ""
echo "Clean everything (remove volumes):"
echo "  docker-compose down -v"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "🌐 Next Steps for Production"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "1. Read DEPLOYMENT_SETUP.md for full production guide"
echo "2. Get real API keys:"
echo "   - Stripe (live keys)"
echo "   - Cloudinary"
echo "   - Twilio"
echo "   - Email provider"
echo "3. Deploy to Vercel (frontend) + Railway (backend)"
echo "4. Configure MongoDB Atlas (production database)"
echo "5. Register Stripe webhook"
echo ""
echo "Happy coding! 🚀"
echo "════════════════════════════════════════════════════════════"
