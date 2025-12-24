# Quick Setup: Cloud Database for Cross-Device Access

Follow these steps to set up a cloud database so your watch data syncs across all your devices.

## Step 1: Choose a Database Provider (Free Options)

### Option A: Supabase (Recommended - Easiest)

1. Go to https://supabase.com
2. Click "Start your project" and sign up (free)
3. Create a new project:
   - Name: `watch-flipping-db` (or any name)
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Wait 2-3 minutes for setup

4. Get your connection string:
   - Go to **Settings** → **Database**
   - Scroll to **Connection string**
   - Select **URI** tab
   - Copy the connection string
   - It looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`

### Option B: Neon (Alternative)

1. Go to https://neon.tech
2. Sign up (free)
3. Create a new project
4. Copy the connection string from the dashboard
5. It looks like: `postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### Option C: Railway (Alternative)

1. Go to https://railway.app
2. Sign up (free)
3. Click "New Project" → "Add PostgreSQL"
4. Click on the PostgreSQL service → **Variables** tab
5. Copy the `DATABASE_URL` value

## Step 2: Update Your Local Environment

1. Open your `.env` file (create it if it doesn't exist)

2. Replace the SQLite database URL with your PostgreSQL connection string:
   ```bash
   # OLD (SQLite - single device only):
   # DATABASE_URL="file:./dev.db"
   
   # NEW (PostgreSQL - cross-device):
   DATABASE_URL="postgresql://postgres:password@host:5432/dbname?sslmode=require"
   ```

3. Make sure to include `?sslmode=require` at the end for secure connections

## Step 3: Initialize the Database

Run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to your cloud database
npx prisma db push
```

You should see: `✔ Your database is now in sync with your schema.`

## Step 4: Test It Works

```bash
# Start your app
npm run dev
```

1. Add a watch in the app
2. Check your database provider's dashboard to see the data
3. The data is now stored in the cloud!

## Step 5: Deploy to Vercel (For Web Access)

To access your app from any device via the web:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a repo on GitHub, then:
   git remote add origin https://github.com/yourusername/watch-flipping.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `PERPLEXITY_API_KEY`: (Optional) Your API key
   - Click "Deploy"

3. **Run database migration on Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel env pull` to get environment variables
   - Run: `npx prisma db push` to sync database

4. **Access from any device:**
   - Your app will be at: `https://your-project.vercel.app`
   - Access it from phone, tablet, laptop - anywhere!

## Troubleshooting

### Connection Error?
- Make sure your connection string includes `?sslmode=require`
- Check that your database allows external connections
- Verify your password is correct

### Can't Connect from Vercel?
- Some providers require IP whitelisting
- Check your database provider's settings for connection restrictions
- Supabase and Neon work out of the box with Vercel

### Want to Switch Back to SQLite?
Change in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"  // Change from "postgresql"
  url      = env("DATABASE_URL")
}
```

Then update `.env`:
```bash
DATABASE_URL="file:./dev.db"
```

## Next Steps

- ✅ Your data now syncs across devices!
- 📱 Access from any device via the web URL
- 🔄 Changes sync automatically
- 💾 Data is backed up in the cloud

Enjoy your cross-device watch flipping manager! 🎉

