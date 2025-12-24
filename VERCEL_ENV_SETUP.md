# Setting Up Environment Variables in Vercel

## The Problem

Your `DATABASE_URL` value looks incomplete. It should be a **full PostgreSQL connection string**, not just the hostname.

## What You Need

A complete Supabase connection string looks like this:
```
postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require
```

## How to Get the Complete Connection String

### Step 1: Go to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Click on your project (the one you created)

### Step 2: Get the Connection String
1. Click the **Settings** icon (gear ⚙️) in the left sidebar
2. Click **Database** in the settings menu
3. Scroll down to **"Connection string"** section
4. Click the **"URI"** tab (not "Session mode" or "Transaction mode")
5. You'll see a connection string that looks like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

### Step 3: Replace the Password Placeholder
The connection string will have `[YOUR-PASSWORD]` in it. Replace this with the **actual password** you created when setting up the Supabase project.

**Example:**
- If your password is `MySecurePass123!`
- And the connection string is: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`
- Replace it with: `postgresql://postgres.xxxxx:MySecurePass123!@aws-0-us-west-1.pooler.supabase.com:6543/postgres`

### Step 4: Add `?sslmode=require` at the End
Make sure to add `?sslmode=require` at the very end:
```
postgresql://postgres.xxxxx:MySecurePass123!@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require
```

## How to Add in Vercel

1. **In the Vercel interface you're looking at:**
   - Find the `DATABASE_URL` row (you already have it)
   - Click in the **Value** field
   - **Delete** the current incomplete value (the part that shows `abase.co:5432/postgres?sslmode=require`)
   - **Paste** your complete connection string from Step 4 above:
     ```
     postgresql://postgres:BLMichaels2026!@szbtvouggpch.supabase.co:5432/postgres?sslmode=require
     ```

2. **Environment Selection:**
   - If you see options for Production/Preview/Development, select all three
   - If you don't see those options, that's fine - Vercel will use the variable for all environments by default
   - The variable will be available in Production, Preview, and Development automatically

3. **Click "Save"** or the checkmark icon (if visible)
   - Or just proceed to click **"Deploy"** - the variable will be saved when you deploy

## Optional: Add PERPLEXITY_API_KEY

If you have a Perplexity API key:

1. Click **"+ Add More"** button
2. **Key**: `PERPLEXITY_API_KEY`
3. **Value**: Your actual API key (get it from https://www.perplexity.ai/)
4. Select all environments (Production, Preview, Development)
5. Click **"Save"**

## Final Check

Your environment variables should look like:

✅ **DATABASE_URL**: `postgresql://postgres.xxxxx:password@host:port/postgres?sslmode=require`  
✅ **PERPLEXITY_API_KEY**: `pplx-xxxxx` (if you added it)

## Then Deploy!

Once your `DATABASE_URL` is correct, click the **"Deploy"** button at the bottom.

## Troubleshooting

### "Invalid connection string"
- Make sure it starts with `postgresql://`
- Make sure it includes your password (not `[YOUR-PASSWORD]`)
- Make sure it ends with `?sslmode=require`

### "Connection refused"
- Double-check your password is correct
- Make sure your Supabase project is active (not paused)

### Can't find the connection string?
- Make sure you're in the **Database** settings, not API settings
- Look for the **"URI"** tab specifically
- The connection string should be long (100+ characters)

