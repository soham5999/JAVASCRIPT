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

## 📊 Private Visitor Analytics & Admin Dashboard

This portfolio includes a privacy-conscious, production-ready telemetry and admin monitoring system engineered to analyze technical traffic patterns without invasive surveillance or PII exploitation.

### 🌟 Analytics System Features
- **Zero Public Navigation Link**: Accessible strictly via private route `/admin/analytics` or discreetly via Command Palette (`Ctrl+K` → type `admin`).
- **Cryptographic JWT Authentication**: Role-based access control (RBAC), bcrypt-hashed passwords, and brute-force rate-limiting (10 attempts / 15m).
- **Privacy-First IP Masking**: Raw IP storage is **disabled by default**. IPs are truncated (`192.168.1.xxx`) or pseudonymized using daily rotating salted HMAC-SHA256 hashes. Full IP retention is strictly optional and admin-controlled.
- **Server-Side Coarse Geolocation**: Offline `geoip-lite` lookup resolves country, region, and city on the server with zero third-party client API leakage. Geolocation is explicitly marked as approximate.
- **Active Real-Time Radar**: Near-real-time live telemetry stream with active visitor counter strictly bounded by a 5-minute activity window (no false "always-online" claims).
- **Automated Data Retention & Purge**: Scheduled auto-deletion daemon purges records older than the configured horizon (default: 60 days). Includes manual instant complete database wipe with confirmation safety phrase.
- **Data Portability**: Full data export in JSON and CSV formats.
- **Browser Privacy Signal Honor**: Automatic respect for `DNT: 1` (Do Not Track) and `Sec-GPC: 1` (Global Privacy Control) headers.
- **Zero-Trust Reverse Proxy Protection**: Anti-spoofing mechanism reads direct socket connection metadata unless `TRUST_PROXY=true` is explicitly enabled behind verified reverse proxies.

---

## ⚙️ Backend & Database Setup

### 1. Database Architecture
- **Local & Self-Hosted**: Built using Node 24 native SQLite (`DatabaseSync`), requiring zero external database installations, C++ native compilations, or Redis dependencies. Stored in `./data/analytics.db` with Write-Ahead Logging (WAL) enabled.
- **PostgreSQL / Supabase Ready**: Production migration schemas with Row-Level Security (RLS) policies are provided in:
  - SQLite: `server/migrations/schema-sqlite.sql`
  - PostgreSQL / Supabase: `server/migrations/schema-postgres.sql`

### 2. Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env
```
Key variables in `.env`:
| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `CLIENT_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `JWT_SECRET` | Secret key for signing admin authentication tokens | *(Set to random 32+ char string)* |
| `ADMIN_USERNAME` | Initial administrator username | `admin` |
| `ADMIN_PASSWORD` | Initial administrator password | `antigravity2026!` |
| `TRUST_PROXY` | Set to `true` behind Vercel/Cloudflare/Nginx | `false` |
| `COLLECT_RAW_IP` | Enable storing raw IP addresses (opt-in only) | `false` |
| `DEFAULT_RETENTION_DAYS` | Days before automatic event expiration | `60` |
| `IP_ANONYMIZE_MODE` | `truncate` (e.g. 192.168.1.xxx) or `hash` | `truncate` |

### 3. Creating / Resetting the Administrator Account
Run the interactive secure seed script:
```bash
node server/scripts/seed-admin.js <username> <new_password>
# Example:
node server/scripts/seed-admin.js admin MySecureP@ssw0rd!
```

---

## 🧪 Testing & Verification

Run the automated 28-point unit, integration, and HTTP end-to-end test suites:
```bash
# Run database, privacy service, and geoip test suite
npm run test:analytics

# Run full HTTP End-to-End server test
node server/tests/test-http-e2e.js
```

---

## 🚀 Running the Full Stack Locally

To run the unified stack (Express backend on `:5000` + Vite dev frontend on `:3000` with reverse proxy):
```bash
npm run dev
```

Visit:
- **Public Portfolio**: `http://localhost:3000/`
- **Private Admin Dashboard**: `http://localhost:3000/admin/analytics`
- **Default Credentials**: `admin` / `antigravity2026!` (Change immediately in dashboard settings!)

---

## 🌐 Production Deployment

### Option A: Node.js Full Stack (Render, Railway, Fly.io, VPS)
1. Build frontend:
   ```bash
   npm run build
   ```
2. Start the production server (serves both API and optimized Vite SPA assets):
   ```bash
   npm start
   ```
3. Set `TRUST_PROXY=true` in your host's environment settings.

### Option B: Separate Frontend (Vercel / Netlify) + Backend Server
1. Deploy `server/` to Railway/Render or a Node server.
2. In Vite frontend `vite.config.js`, update proxy target or set `VITE_API_URL` to point to your live backend.
3. Import `server/migrations/schema-postgres.sql` into Supabase or Neon if using managed PostgreSQL.

---

## 🔍 Troubleshooting Guide

### 1. Client IP Shows `127.0.0.1` or `LOCAL`
- In local development (`localhost`), connections originate from loopback addresses (`127.0.0.1`, `::1`). This is expected and correctly tagged as `LOCAL` coarse location.
- In production behind a CDN or reverse proxy (Cloudflare, Nginx, Vercel), ensure `TRUST_PROXY=true` is set in your `.env`.

### 2. Spoofed `X-Forwarded-For` Headers
- When `TRUST_PROXY=false` (standalone mode), the backend strictly rejects untrusted client-supplied headers and reads `req.socket.remoteAddress`, preventing IP spoofing.

### 3. Geolocation Returns "Unresolvable"
- Private networks (e.g. `10.x.x.x`, `192.168.x.x`, `172.16.x.x`) do not have public registry entries and are safely mapped to "Local / Private Network".

### 4. Admin Session Lost or 401 Unauthorized
- Check if your `JWT_SECRET` in `.env` was changed while active tokens were in use. Re-authenticate at `/admin/analytics` to receive a freshly signed token.

---

## 🛡️ License & Credits
Designed and engineered with the Antigravity design philosophy for Soham Khadatkar.
Built with React, Vite, Express, Tailwind CSS, Three.js, and Node SQLite.

