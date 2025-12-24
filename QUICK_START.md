# 🚀 Quick Start - Most Seamless Setup (Vercel + Supabase)

This is the **most reliable and seamless** option. Follow these steps for a production-ready setup that works across all devices.

## Why This Setup?

✅ **Vercel**: Made by Next.js creators - zero-config deployment, automatic HTTPS, global CDN  
✅ **Supabase**: Reliable PostgreSQL database, generous free tier, built for production  
✅ **Zero maintenance**: Both services handle scaling, backups, and updates automatically  
✅ **Free tier**: Both services offer generous free tiers that cover most use cases

---

## Step 1: Set Up Supabase Database (2 minutes)

1. Go to **https://supabase.com** and sign up (free)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `watch-flipping` (or any name)
   - **Database Password**: Create a strong password ⚠️ **SAVE THIS!**
   - **Region**: Choose closest to you
   - Click **"Create new project"**
4. Wait 2-3 minutes for setup

5. **Get your connection string:**
   - Go to **Settings** (gear icon) → **Database**
   - Scroll to **"Connection string"**
   - Click the **"URI"** tab
   - Copy the connection string
   - It looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`
   - ⚠️ Replace `[YOUR-PASSWORD]` with the password you created!

---

## Step 2: Push Code to GitHub (3 minutes)

> 📖 **Need detailed help?** See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for step-by-step instructions with explanations.

1. **Initialize Git** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
   *(Run these in your terminal from the project folder)*

2. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name it: `watch-flipping` (or any name)
   - Click **"Create repository"**
   - **Copy the repository URL** that appears

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/watch-flipping.git
   git branch -M main
   git push -u origin main
   ```
   *(Replace `YOUR_USERNAME` with your GitHub username)*
   
   **First time?** You'll need a Personal Access Token instead of password:
   - Create one at: https://github.com/settings/tokens
   - Select "repo" scope
   - Use the token as your password when prompted

---

## Step 3: Deploy to Vercel (2 minutes)

1. Go to **https://vercel.com** and sign up with GitHub (free)
2. Click **"Add New..."** → **"Project"**
3. **Import your repository:**
   - Find `watch-flipping` in the list
   - Click **"Import"**

4. **Configure Project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `prisma generate && next build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

5. **Add Environment Variables:**
   Click **"Environment Variables"** and add:
   
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string from Step 1
   - **Environment**: Production, Preview, Development (select all)
   - Click **"Save"**
   
   - **Name**: `PERPLEXITY_API_KEY` (optional, for AI features)
   - **Value**: Your Perplexity API key
   - **Environment**: Production, Preview, Development
   - Click **"Save"**

6. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes
   - ✅ Your app is live!

---

## Step 4: Initialize Database (1 minute)

After deployment, you need to run the database migration:

1. **Install Vercel CLI** (one-time):
   ```bash
   npm i -g vercel
   ```

2. **Pull environment variables:**
   ```bash
   vercel env pull .env.local
   ```

3. **Run database migration:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   You should see: `✔ Your database is now in sync with your schema.`

---

## ✅ You're Done!

Your app is now live at: `https://your-project.vercel.app`

### What You Get:

- 🌐 **Web access** from any device (phone, tablet, laptop)
- 🔄 **Automatic sync** - changes appear instantly across devices
- 💾 **Cloud backup** - your data is safely stored
- 🚀 **Auto-deployments** - every GitHub push auto-deploys
- 🔒 **HTTPS** - secure by default
- ⚡ **Fast** - global CDN for instant loading

### Next Steps:

1. **Bookmark your app URL** for easy access
2. **Add watches** and see them sync instantly
3. **Customize domain** (optional): Vercel → Settings → Domains

---

## Troubleshooting

### Database connection fails?
- Make sure your connection string includes `?sslmode=require`
- Verify you replaced `[YOUR-PASSWORD]` in the connection string
- Check Supabase dashboard to ensure project is active

### Deployment fails?
- Check Vercel deployment logs for errors
- Ensure `DATABASE_URL` is set correctly
- Verify Prisma schema is valid: `npx prisma validate`

### Need help?
- Vercel docs: https://vercel.com/docs
- Supabase docs: https://supabase.com/docs

---

## Why This is the Best Option

| Feature | Vercel + Supabase | Other Options |
|---------|------------------|---------------|
| Setup Time | 10 minutes | 30+ minutes |
| Maintenance | Zero | Manual |
| Reliability | 99.9% uptime | Varies |
| Scaling | Automatic | Manual |
| Cost | Free tier generous | May cost |
| Support | Excellent | Varies |

**This setup requires zero ongoing maintenance and scales automatically!** 🎉

