# Watch Flipping Business Manager

A modern, full-stack web application for managing a watch flipping/resale business with AI-powered analysis features.

## 🚀 Quick Start (Recommended - Most Seamless)

**For the most reliable, zero-maintenance setup that works across all devices:**

👉 **[Follow QUICK_START.md](./QUICK_START.md)** - Deploy to Vercel + Supabase in 10 minutes

This setup gives you:
- ✅ Automatic deployments from GitHub
- ✅ Zero server maintenance
- ✅ 99.9% uptime reliability
- ✅ Free tier covers most use cases
- ✅ Works on all devices instantly

## Features

### 🎯 Dashboard
- **Total Portfolio Value**: Track purchased vs projected resale values
- **Key Metrics Cards**: Purchase costs, projected revenue (best/medium/basic scenarios), profit margins, ROI
- **Interactive Charts**:
  - Pie chart: Brand distribution
  - Bar chart: Revenue potential by scenario (As-Is vs Cleaned vs Serviced)
  - Line chart: Cumulative profit projection
  - Status indicator: % Ready to Sell vs Needs Service

### 📦 Inventory Management
- **Add Watch**: 
  - Paste eBay URL → Auto-scrape listing data (title, description, images, condition)
  - Manual entry form with all watch details
- **Watch Detail View**: 
  - Complete watch information panel
  - Image gallery with lightbox view
  - Upload additional photos
  - Edit/delete capabilities
- **Inventory List**: 
  - Sortable/filterable table
  - Color-coded status indicators
  - Quick action buttons (View, AI Analysis, Edit, Delete)

### 🤖 AI-Powered "Should I Buy?" System
- Analyze watch condition from photos and description
- Research comparable listings for market pricing
- Assess maintenance costs and ROI potential
- Provide Buy/Pass/Maybe recommendation with confidence score
- Flag potential issues (movement problems, damage, etc.)
- Estimate time to sell

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Quick Start (Local Development)
For single-device use, you can use SQLite. For cross-device access, see [SETUP_CLOUD_DB.md](./SETUP_CLOUD_DB.md).

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables

#### For Local Development (SQLite - Single Device)
Create a `.env` file in the root directory:
```bash
# Database (SQLite for local dev only)
DATABASE_URL="file:./dev.db"

# AI API Keys (at least one required for AI features)
PERPLEXITY_API_KEY=your_perplexity_api_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_claude_api_key_here
```

#### For Cross-Device Access (PostgreSQL - Cloud Database)
**Important**: To use the app across multiple devices, you need a cloud database.

1. **Set up a free PostgreSQL database:**
   - **Supabase** (Recommended): https://supabase.com
   - **Neon**: https://neon.tech
   - **Railway**: https://railway.app

2. **Update your `.env` file:**
   ```bash
   # Database (PostgreSQL connection string from your cloud provider)
   DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
   
   # AI API Keys
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_claude_api_key_here
   ```

3. **Update Prisma schema** (already configured for PostgreSQL):
   - The schema is already set to use PostgreSQL
   - If you want to use SQLite locally, change `provider = "postgresql"` to `provider = "sqlite"` in `prisma/schema.prisma`

**Note**: If you don't have API keys, the app will still work but will use mock AI analysis data.

**📱 For cross-device access, see [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions.**

### Step 3: Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push
```

### Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Start Using the App
1. **Dashboard**: View your portfolio analytics
2. **Add Watch**: Click "Add New Watch" and either:
   - Paste an eBay URL and click "Scrape Listing" to auto-fill data
   - Or manually enter watch details
3. **AI Analysis**: Use the "Get AI Analysis" button to get recommendations
4. **Manage Inventory**: View, edit, or delete watches from the Inventory page

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Cloud database (for cross-device sync)
- **Tailwind CSS** - Styling
- **Recharts** - Charts and visualizations
- **Cheerio** - Web scraping for eBay listings
- **Axios** - HTTP client

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── watches/      # Watch CRUD operations
│   │   ├── ebay-scrape/  # eBay listing scraper
│   │   └── ai-analyze/   # AI analysis endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── components/
│   ├── ui/               # Reusable UI components
│   ├── Dashboard.tsx     # Analytics dashboard
│   ├── InventoryList.tsx # Inventory table view
│   ├── WatchDetail.tsx   # Watch detail page
│   ├── AddWatchForm.tsx  # Add/edit watch form
│   ├── AIAnalysisPanel.tsx # AI analysis component
│   └── Navigation.tsx    # Top navigation bar
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── ebay-scraper.ts   # eBay scraping logic
│   └── ai-analysis.ts    # AI analysis logic
├── prisma/
│   └── schema.prisma     # Database schema
└── public/
    └── uploads/          # Uploaded watch images
```

## API Keys

### Perplexity API (Recommended)
1. Sign up at https://www.perplexity.ai/
2. Navigate to API settings
3. Generate an API key
4. Add to `.env` as `PERPLEXITY_API_KEY`

### Anthropic Claude API (Alternative)
1. Sign up at https://console.anthropic.com/
2. Create an API key
3. Add to `.env` as `ANTHROPIC_API_KEY`

**Note**: The app will work without API keys but will use mock analysis data for development/testing.

## Database Management

### View Database
```bash
npx prisma studio
```
This opens a visual database browser at http://localhost:5555

### Reset Database
```bash
# Delete the database file
rm prisma/dev.db

# Recreate it
npx prisma db push
```

## Production Deployment & Cross-Device Access

### ⭐ Recommended: Vercel + Supabase (Most Seamless)

**This is the most reliable, zero-maintenance option:**

👉 **See [QUICK_START.md](./QUICK_START.md) for step-by-step instructions**

**Why this combination?**
- 🎯 **Vercel**: Made by Next.js creators - perfect integration, zero config
- 🎯 **Supabase**: Production-grade PostgreSQL, generous free tier
- 🎯 **Automatic**: Deployments, scaling, backups all handled automatically
- 🎯 **Reliable**: 99.9% uptime, used by thousands of companies

**Time to deploy**: ~10 minutes  
**Ongoing maintenance**: Zero  
**Cost**: Free tier covers most use cases

### Alternative Options

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for other deployment options (Neon, Railway, etc.)

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Make sure to set all environment variables in your hosting platform:
- `DATABASE_URL`: PostgreSQL connection string (required for cross-device)
- `PERPLEXITY_API_KEY`: Optional, for AI features
- `ANTHROPIC_API_KEY`: Optional, for AI features

## Troubleshooting

### eBay Scraping Not Working
- eBay may block automated scraping. Try different eBay URLs or use manual entry.
- The scraper works best with active eBay listings.

### AI Analysis Not Working
- Check that your API keys are correctly set in `.env`
- Verify you have API credits/quota remaining
- Check the browser console for error messages

### Images Not Uploading
- Ensure the `public/uploads` directory exists and is writable
- Check file size limits (default is usually fine for images)

## License

MIT

