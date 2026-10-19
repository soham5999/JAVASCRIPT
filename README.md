# Soham Khadatkar - Antigravity Portfolio Website

An award-level, zero-gravity personal portfolio engineered with React 18, Tailwind CSS, and Three.js WebGL physics. Designed with an ultra-premium dark aesthetic, responsive 3D floating crystal solids, interactive sound feedback, keyboard command palette, and verified academic credentials.

---

## 🌟 Highlights & Features
- **Zero-G WebGL Physics**: Interactive Three.js particle constellation and floating geometric crystalline meshes responsive to cursor velocity and inertia.
- **100% Grounded Academic Facts**: Sourced exclusively from official transcripts, project reports, and certificates (SIT Nagpur, Symbiosis International University).
- **Interactive Command Palette (`Ctrl+K` / `⌘K`)**: Instant keyboard search, section jumping, quick actions, and celebratory zero-g Easter egg.
- **Accredited Certifications Showcase**: Visual gallery featuring verified credentials from Red Hat, IBM SkillsBuild, and Tata Group with embedded PDF previews and external links.
- **Engineered Micro-Interactions**: Custom trailing zero-g cursor, Web Audio API acoustic feedback, and 3D parallax card tilt physics.
- **Theme & Sound Toggle**: Dark mode default with seamless light mode switch and acoustic effect controls.
- **Responsive Architecture**: Fully optimized across desktop, tablet, and mobile with reduced-motion support.

---

## 🚀 Quick Start & Local Run

### Prerequisites
- Node.js (v18.0 or newer)
- npm or pnpm

### 1. Installation
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The site will run at `http://localhost:3000/`.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## ✏️ How to Customize & Edit Content
All personal content, projects, skills, education, and links are centralized in a single file:
👉 **`src/data.js`**

To update your email, phone, GPA, new projects, or certification links, simply edit the exported constants in `src/data.js`. No need to touch component markup.

### Updating Media Assets
- **Profile Photo**: Place your portrait in `public/soham_profile.jpg`.
- **Resume PDF**: Place your latest CV in `public/Soham_Khadatkar_Resume.pdf`.
- **Certificates**: Add PDF copies to `public/` and update `src/data.js`.

---

## 🌐 Free Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push this repository to your GitHub account (`github.com/soham5999/portfolio`).
2. Visit [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build` | Output Directory: `dist`.
6. Click **Deploy**. Your portfolio will be live with free global CDN and automatic SSL!

### Deploy to Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Select **"Import from Git"**.
3. Choose your repository.
4. Set Build command to `npm run build` and Publish directory to `dist`.
5. Click **Deploy Site**.

### Deploy to GitHub Pages
1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```
2. In `vite.config.js`, set `base: '/portfolio/'` (matching your repo name).
3. In `package.json`, add:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run `npm run deploy`.

---

## 📋 Inventory of Facts & Placeholders
- **Name**: Soham Pradip Khadatkar (Extracted from resume & academic reports)
- **Role**: Computer Science & Data Science Engineer (B.Tech 2024–28 at SIT Nagpur)
- **GPA**: 7.7 / 10.0 (Verified from academic records)
- **Email**: `sohamkhadatkar34@gmail.com` (Verified from official documents)
- **Phone**: `+91 97663 17030` (Verified from resume)
- **Location**: Nagpur, Maharashtra, India
- **Profile Photo**: Actual photograph verified and included (`/soham_profile.jpg`)
- **GitHub**: `https://github.com/soham5999` (Extracted from official resume)
- **LinkedIn**: `https://www.linkedin.com/in/soham-khadatkar-991ab2315` (Extracted from official resume)
- **HackerRank**: `@sohamkhadatkar34` (Extracted from official resume)
- **Projects**: 5 genuine technical implementations (BERT/LSTM Fake News Research with Prof. Dr. Deepak Asudani, OLAP Star-Schema ROLLUP, 8051 Safety Dual Comparator, 8051 RAM Defragmenter, NGO DSS Architecture).
- **Missing / Custom Placeholders to Fill**:
  - Live deployment URLs for projects (currently linked to verified GitHub profile `https://github.com/soham5999` until dedicated individual sub-repositories are published).
  - Formspree / EmailJS endpoint: The contact form automatically triggers a pre-filled `mailto:` transmission and provides instant confirmation. To use direct backend API submissions, add your Formspree ID to `Contact.jsx`.

---

## 🛡️ License & Credits
Designed and engineered with the Antigravity design philosophy for Soham Khadatkar.
Built with React, Vite, Tailwind CSS, and Three.js.
