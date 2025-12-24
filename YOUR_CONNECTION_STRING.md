# Your Complete DATABASE_URL

Based on what you showed me, here's how to construct your connection string:

## Your Supabase Details:
- Host: `szbtvouggpch.supabase.co`
- Port: `5432`
- Password: `BLMichaels2026!`
- Database: `postgres` (not "postgre")

## Complete Connection String:

```
postgresql://postgres:BLMichaels2026!@szbtvouggpch.supabase.co:5432/postgres?sslmode=require
```

## How to Use This in Vercel:

1. In the Vercel environment variables screen:
2. Find the `DATABASE_URL` row
3. Click in the **Value** field
4. Delete the current value: `szbtvouggpch.supabase.co:5432/postgre`
5. Paste this complete string:
   ```
   postgresql://postgres:BLMichaels2026!@szbtvouggpch.supabase.co:5432/postgres?sslmode=require
   ```
6. Make sure all environments are selected (Production, Preview, Development)
7. Click **Save**

## Important Notes:

⚠️ **URL Encoding**: If the password contains special characters (like `!`), you might need to URL-encode it:
- `!` becomes `%21`
- So the password `BLMichaels2026!` becomes `BLMichaels2026%21`

**If the connection string above doesn't work, try this URL-encoded version:**
```
postgresql://postgres:BLMichaels2026%21@szbtvouggpch.supabase.co:5432/postgres?sslmode=require
```

## To Get the Exact Format from Supabase:

1. Go to https://supabase.com/dashboard
2. Click your project
3. Settings (⚙️) → Database
4. Scroll to "Connection string"
5. Click the **"URI"** tab
6. Copy the full string shown there
7. Replace `[YOUR-PASSWORD]` with: `BLMichaels2026!` (or `BLMichaels2026%21` if URL-encoded)

The Supabase dashboard will show you the exact format to use!

