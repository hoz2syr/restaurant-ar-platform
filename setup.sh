#!/bin/bash

set -e

echo "🚀 Starting Restaurant AR Platform Setup..."
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🐳 Starting Docker containers (PostgreSQL & Redis)..."
docker-compose up -d

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

echo ""
echo "🗄️ Setting up database..."
cd packages/database
npm install
npx prisma generate
npx prisma db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Start the API server:"
echo "     cd apps/api && npm run dev"
echo ""
echo "  2. Start the web app (in another terminal):"
echo "     cd apps/web && npm run dev"
echo ""
echo "  3. Start the admin app (in another terminal):"
echo "     cd apps/admin && npm run dev"
echo ""
echo "🌐 Access the applications:"
echo "  - Web App: http://localhost:3000"
echo "  - Admin App: http://localhost:3002"
echo "  - API: http://localhost:3001/api"
echo ""
