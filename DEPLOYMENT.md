# Vercel Deployment Guide
## SIH 2026 — Problem Statement 26064
**“Low-Cost Deployable Seafloor Metal Detection Sensor for Ocean Resource Exploration”**  
*Interactive Prototype & 3D Digital Twin*

---

## 🚀 Overview
This repository contains a high-performance **React + Vite + TypeScript + Three.js** interactive prototype web application designed for live presentation during SIH judging sessions.

This document walks through deploying the application to **Vercel** with zero downtime, instant global CDN delivery, and automatic SSL/HTTPS.

---

## 📋 Prerequisites
1. A **GitHub**, **GitLab**, or **Bitbucket** account with this code pushed to a repository.
2. A free **[Vercel Account](https://vercel.com/signup)** (log in via GitHub recommended).
3. (Optional) **Node.js 18+ or 20+** installed locally if deploying via CLI.

---

## 🛠️ Method 1: Deploy via Vercel Web Dashboard (Recommended)

### Step 1: Push Project to GitHub
Initialize your local git repository and push to GitHub (if not already done):
```bash
git init
git add .
git commit -m "feat: complete interactive seafloor sensor pod prototype"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository and click **"Import"**.

### Step 3: Configure Project Settings
Vercel automatically detects the Vite framework thanks to the included [`vercel.json`](file:///e:/sih-ps1-prot/vercel.json). Confirm the following build configuration:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | `18.x` or `20.x` (Default) |

> *Note: No environment variables are required.*

### Step 4: Deploy
1. Click **"Deploy"**.
2. Vercel will run `npm install`, compile TypeScript (`tsc -b`), and build the Vite production bundle into `dist/`.
3. In ~1 minute, your deployment will be live with a production URL like:
   `https://<your-project-name>.vercel.app`

---

## 💻 Method 2: Deploy via Vercel CLI

If you prefer deploying directly from your terminal:

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Log In & Deploy
In the root directory of this project (`e:\sih-ps1-prot`):
```bash
vercel login
vercel
```

Follow the interactive prompts:
* **Set up and deploy?** → `Y`
* **Which scope?** → Select your personal account
* **Link to existing project?** → `N`
* **Project name?** → Press Enter (or type `sih-26064-seafloor-prototype`)
* **In which directory is your code located?** → `./`
* **Want to modify build settings?** → `N` (auto-detected via `vercel.json`)

### Step 3: Deploy to Production
To promote the build directly to production:
```bash
vercel --prod
```

---

## ⚙️ Configuration Files Included

### `vercel.json`
A pre-configured [`vercel.json`](file:///e:/sih-ps1-prot/vercel.json) has been added to the root directory:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```
**Benefits:**
* **SPA Routing**: Rewrites ensure smooth client-side single-page routing without 404s on page refresh.
* **Asset Caching**: Sets immutable 1-year browser caching on generated Three.js and JS chunks for blazing fast subsequent loads.

---

## 🔍 Pre-Flight Local Check

Before triggering a deployment, you can verify that the build compiles locally:

```bash
# 1. Test build compilation
npm run build

# 2. Test production build locally
npm run preview
```
Visit `http://localhost:5173` to verify that the 3D scene, controls, and telemetry dashboard run without errors.

---

## 💡 Troubleshooting & Performance on Vercel

### 1. WebGL & GPU Performance
* The 3D scene uses optimized low-poly geometry and limited particles (<280 particles) to run smoothly on any presentation laptop, tablet, or smartphone without dedicated GPU requirements.
* If a judge is using a browser with hardware acceleration disabled, the included **2D Schematic Fallback** can be opened instantly using the `[2D SCHEMATIC]` button.

### 2. Custom Domains (Optional)
In your Vercel Project Dashboard:
1. Go to **Settings** → **Domains**.
2. Add your custom team domain (e.g., `ocean.yourteam.org`).
3. Follow Vercel's DNS instructions (CNAME / A record). Vercel provisions a free SSL certificate automatically.

### 3. Continuous Deployment (CI/CD)
Whenever you push changes to your GitHub `main` branch, Vercel will automatically trigger a new build and update the live URL within seconds.

---

## 🎯 Quick SIH Presentation Checklist (Live Demo)
When presenting live to the judges from your Vercel URL:
1. **Show the 3D Scene First**:
   * Drag the mouse to demonstrate free 360° orbit, zoom, and pitch around the sensor pod.
   * Click **`[TOP VIEW]`** and **`[SEAFLOOR VIEW]`** to show multi-angle bathymetric inspection.
2. **Launch the Demo Mode**:
   * Click **`START DEMO (35s)`** on the top sticky playback bar to guide judges through the 7-stage automated survey flow:  
     $$\text{Deploy} \to \text{Sense} \to \text{Process} \to \text{Fuse} \to \text{Detect} \to \text{Map} \to \text{Target}$$
3. **Inspect Individual Sensors**:
   * Click any sensor pill tag in 3D or in the bottom sensor dock to open the technical specs modal (e.g. PI-EM search coil, fluxgate magnetometer, ORP electrode).
4. **Trigger Anomaly Simulation**:
   * Click **`SIMULATE ANOMALY`** to show how sensor fusion shifts from Baseline ($\sim 0.21$) to Candidate Anomaly ($\sim 0.47$) to Strong Candidate ($\sim 0.76$).
5. **Highlight the Real-World Positioning**:
   * Point out the prominent survey conclusion:
     > *“Our system is designed for preliminary screening and target prioritization, not as a replacement for deep-sea ROV/AUV exploration systems.”*
