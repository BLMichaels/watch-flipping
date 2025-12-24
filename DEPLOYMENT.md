# Deployment Guide - Cross-Device Access

This guide will help you deploy the Watch Flipping app so your data is accessible across all your devices.

## Option 1: Deploy to Vercel (Recommended - Free & Easy)

Vercel is the easiest way to deploy Next.js apps with automatic deployments.

### Step 1: Set Up Cloud Database

Choose one of these free PostgreSQL options:

#### A. Supabase (Recommended - Free Tier)
1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

#### B. Neon (Alternative - Free Tier)
1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string from the dashboard
4. It will look like: `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`

#### C. Railway (Alternative - Free Tier)
1. Go to https://railway.app and sign up
2. Create a new project → Add PostgreSQL
3. Copy the DATABASE_URL from the Variables tab

### Step 2: Deploy to Vercel

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [YOUR-GITHUB-REPO-URL]
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com and sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string from Step 1
     - `PERPLEXITY_API_KEY`: Your Perplexity API key (optional)
     - `ANTHROPIC_API_KEY`: Your Anthropic API key (optional)
   - Click "Deploy"

3. **Run Database Migrations:**
   After deployment, run:
   ```bash
   npx prisma db push
   ```
   Or use Vercel's CLI:
   ```bash
   vercel env pull
   npx prisma db push
   ```

### Step 3: Access Your App

Your app will be available at `https://your-project.vercel.app` and accessible from any device!

---

## Option 2: Local Development with Cloud Database

If you want to develop locally but still sync across devices:

1. **Set up a cloud database** (use one of the options from Step 1 above)

2. **Update your `.env` file:**
   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
   PERPLEXITY_API_KEY=your_key_here
   ```

3. **Run migrations:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

---

## Option 3: Self-Hosted (Advanced)

If you have your own server:

1. Set up PostgreSQL on your server
2. Update `DATABASE_URL` to point to your server
3. Deploy using Docker, PM2, or your preferred method
4. Ensure your server is accessible from the internet

---

## Image Storage

For production, consider using cloud storage for images:

### Option A: Vercel Blob Storage
1. Install: `npm install @vercel/blob`
2. Update image upload API to use Vercel Blob
3. Images will be stored in the cloud automatically

### Option B: Cloudinary
1. Sign up at https://cloudinary.com
2. Install: `npm install cloudinary`
3. Update image upload to use Cloudinary API

### Option C: AWS S3
1. Set up S3 bucket
2. Install AWS SDK
3. Update image upload to use S3

---

## Environment Variables for Production

Make sure to set these in your hosting platform:

- `DATABASE_URL`: PostgreSQL connection string
- `PERPLEXITY_API_KEY`: (Optional) For AI features
- `ANTHROPIC_API_KEY`: (Optional) For AI features
- `NODE_ENV`: Set to `production`

---

## Troubleshooting

### Database Connection Issues
- Ensure your database allows connections from Vercel's IP ranges
- Check that SSL is enabled (most cloud databases require it)
- Verify your connection string includes `?sslmode=require`

### Migration Issues
- Run `npx prisma generate` before deploying
- Use `npx prisma db push` for development
- Use `npx prisma migrate deploy` for production

### Image Upload Issues
- Ensure `public/uploads` directory exists
- For production, use cloud storage instead of local filesystem

---

## Quick Start (Vercel + Supabase)

1. Create Supabase project → Copy connection string
2. Push code to GitHub
3. Deploy to Vercel → Add environment variables
4. Run `npx prisma db push` via Vercel CLI or add as build command
5. Access your app from any device!

Your data will now sync across all devices! 🎉

