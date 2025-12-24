#!/bin/bash

# Quick setup script for Vercel + Supabase deployment
# This automates the initial setup process

echo "🚀 Watch Flipping App - Vercel + Supabase Setup"
echo "================================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database - Get this from Supabase (Settings → Database → Connection string → URI)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres?sslmode=require"

# AI API Keys (Optional)
PERPLEXITY_API_KEY=
ANTHROPIC_API_KEY=
EOF
    echo "✅ Created .env file"
    echo "⚠️  Please update DATABASE_URL with your Supabase connection string"
else
    echo "✅ .env file already exists"
fi

# Check if git is initialized
if [ ! -d .git ]; then
    echo ""
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git repository initialized"
    echo "⚠️  Next: Create a GitHub repo and run: git remote add origin [YOUR-REPO-URL]"
else
    echo "✅ Git repository already initialized"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo ""
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up Supabase: https://supabase.com"
echo "2. Update DATABASE_URL in .env with your Supabase connection string"
echo "3. Create GitHub repository and push code"
echo "4. Deploy to Vercel: https://vercel.com"
echo ""
echo "📖 See QUICK_START.md for detailed instructions"

