# Solar System Explorer 🌌

An interactive 3D solar system simulation featuring all 8 planets, major moons, dwarf planets, and the asteroid belt with realistic orbital mechanics.

## Deploy to Vercel (via Website) - Complete Guide

### Step 1: Prepare Your Project

1. **Download all project files** to your computer
2. Make sure you have this folder structure:
   ```
   solar-system-explorer/
   ├── src/
   │   ├── App.jsx
   │   ├── main.jsx
   │   └── index.css
   ├── index.html
   ├── package.json
   ├── vite.config.js
   └── .gitignore
   ```

### Step 2: Upload to GitHub

**Option A: Using GitHub Website (Easiest)**

1. Go to [github.com](https://github.com) and log in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Name it: `solar-system-explorer`
4. Make it **Public** (required for free Vercel)
5. Do NOT initialize with README (we have files already)
6. Click **"Create repository"**

7. On the next page, you'll see "...or create a new repository on the command line"
8. **Instead**, click on **"uploading an existing file"** link

9. Drag and drop ALL your project files:
   - Drag the entire `src` folder
   - Drag `index.html`
   - Drag `package.json`
   - Drag `vite.config.js`
   - Drag `.gitignore`

10. Scroll down and click **"Commit changes"**

**Option B: Using GitHub Desktop (Alternative)**

1. Download [GitHub Desktop](https://desktop.github.com/)
2. File → New Repository
3. Name: `solar-system-explorer`
4. Local Path: Choose where your project files are
5. Click "Create Repository"
6. Click "Publish repository" to GitHub

**Option C: Using Git Command Line**

```bash
# Navigate to your project folder
cd solar-system-explorer

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Solar System Explorer"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/solar-system-explorer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel Website

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

5. On the Vercel dashboard, click **"Add New..."** → **"Project"**

6. You'll see a list of your GitHub repositories
7. Find **"solar-system-explorer"** and click **"Import"**

8. Configure your project:
   - **Project Name**: solar-system-explorer (or customize)
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

9. Click **"Deploy"**

10. Wait 1-2 minutes while Vercel:
    - Installs dependencies
    - Builds your project
    - Deploys to their global CDN

11. 🎉 **Success!** You'll get a live URL like:
    - `https://solar-system-explorer-abc123.vercel.app`

### Step 4: Access Your Deployed Site

Click **"Visit"** or copy the URL to share with others!

---

## Troubleshooting

### Issue: Build fails with "Cannot find module 'three'"

**Solution**: Make sure `package.json` includes:
```json
"dependencies": {
  "three": "^0.160.0"
}
```

### Issue: White screen after deployment

**Solution**: Check browser console for errors. Usually means:
- Missing files in `src/` folder
- Incorrect import paths

### Issue: Repository not showing in Vercel

**Solution**:
1. Make sure repository is Public on GitHub
2. Click "Adjust GitHub App Permissions" in Vercel
3. Grant access to your repository

---

## Custom Domain (Optional)

1. In Vercel dashboard, click your project
2. Go to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

---

## Local Development

Want to run locally before deploying?

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

---

## Updating Your Deployed Site

1. Make changes to your files locally
2. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. Vercel automatically redeploys! (takes ~1 minute)

---

## Features

- 🌟 All 8 planets plus Sun
- 🌙 14+ major moons
- 🪐 Saturn's rings
- ☄️ Asteroid belt
- ⏱️ Variable time control (0.1x - 50x speed)
- 📹 Multiple camera modes
- 📊 Educational information panels
- 🎮 Interactive 3D navigation

---

## Tech Stack

- React 18
- Three.js (3D graphics)
- Vite (build tool)
- Tailwind CSS (styling via CDN)

---

## License

MIT - Feel free to use for education or personal projects!
