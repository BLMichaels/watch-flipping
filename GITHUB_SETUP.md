# Detailed GitHub Setup Instructions

## Step 2.1: Initialize Git (Substep 1)

Open your terminal (Terminal on Mac, Command Prompt or PowerShell on Windows) and navigate to your project folder:

```bash
cd "/Users/benmichaels/Desktop/Watch Flipping"
```

Then run these commands one by one:

### Command 1: Initialize Git repository
```bash
git init
```
**What this does**: Creates a new Git repository in your project folder  
**Expected output**: `Initialized empty Git repository in /Users/benmichaels/Desktop/Watch Flipping/.git/`

### Command 2: Add all files
```bash
git add .
```
**What this does**: Stages all your project files to be committed  
**Expected output**: (No output is normal - it means it worked!)

### Command 3: Create your first commit
```bash
git commit -m "Initial commit"
```
**What this does**: Saves all your files as the first version in Git  
**Expected output**: Something like:
```
[main (or master) xxxxxxx] Initial commit
 X files changed, X insertions(+)
```

**✅ If you see this, substep 1 is complete!**

---

## Step 2.2: Create GitHub Repository (Substep 2)

This is done in your web browser:

1. **Go to GitHub**: https://github.com/new
   - If you're not logged in, sign in or create a free account

2. **Fill in the form**:
   - **Repository name**: `watch-flipping` (or any name you want)
   - **Description**: (Optional) "Watch flipping business manager"
   - **Visibility**: Choose **Public** (free) or **Private** (if you have GitHub Pro)
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore or license (we already have these)

3. **Click the green "Create repository" button**

4. **Copy the repository URL** that appears on the next page
   - It will look like: `https://github.com/YOUR_USERNAME/watch-flipping.git`
   - ⚠️ **Save this URL** - you'll need it for the next step!

---

## Step 2.3: Push Your Code (Substep 3)

Back in your terminal, run these commands:

### Command 1: Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/watch-flipping.git
```
**What this does**: Links your local repository to the GitHub one you just created  
**Replace `YOUR_USERNAME`** with your actual GitHub username  
**Replace `watch-flipping`** if you used a different repository name

**Example** (if your username is `johndoe`):
```bash
git remote add origin https://github.com/johndoe/watch-flipping.git
```

**Expected output**: (No output means it worked!)

### Command 2: Set main branch
```bash
git branch -M main
```
**What this does**: Renames your branch to "main" (GitHub's standard)  
**Expected output**: (No output is normal)

### Command 3: Push to GitHub
```bash
git push -u origin main
```
**What this does**: Uploads all your code to GitHub

**First time?** You'll be asked to authenticate:
- **GitHub username**: Enter your GitHub username
- **Password**: You'll need a **Personal Access Token** (not your regular password)

#### How to create a Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name it: `watch-flipping-setup`
4. Check **"repo"** scope (gives access to repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when prompted

**Expected output**:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/YOUR_USERNAME/watch-flipping.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**✅ If you see this, your code is now on GitHub!**

---

## Troubleshooting

### "fatal: not a git repository"
- Make sure you're in the project folder: `cd "/Users/benmichaels/Desktop/Watch Flipping"`
- Run `git init` first

### "remote origin already exists"
- Run: `git remote remove origin`
- Then run the `git remote add origin` command again

### "Authentication failed"
- Make sure you're using a Personal Access Token, not your password
- Create a new token if needed: https://github.com/settings/tokens

### "Permission denied"
- Check that the repository URL is correct
- Make sure you have access to the repository on GitHub

### "Everything up-to-date"
- This means your code is already pushed - you're good to go!

---

## Quick Reference

**All commands in order:**
```bash
# Navigate to project
cd "/Users/benmichaels/Desktop/Watch Flipping"

# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/watch-flipping.git
git branch -M main
git push -u origin main
```

**Need help?** Check GitHub's guide: https://docs.github.com/en/get-started/quickstart/create-a-repo

