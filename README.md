# ✨ Profolio – AI-Powered Smart Portfolio & Resume Builder

> **Build your professional developer presence once. Showcase it everywhere, instantly.**

Profolio is a state-of-the-art, developer-focused full-stack web application designed for software engineers, fresh graduates, and students preparing for placements. It serves as a unified command center, solving the fragmentation of separately maintaining resume documents, custom portfolio websites, and professional project logs.

---

## 🚀 Live Links & Production Details

* **Live Web Application (Vercel)**: [https://pro-folio-fawn.vercel.app](https://pro-folio-fawn.vercel.app)
* **GitHub Repository**: [https://github.com/Nivetha15122006/ProFolio](https://github.com/Nivetha15122006/ProFolio)
* **Production Database**: MongoDB Atlas (AWS Mumbai region Cluster)
* **AI Core**: Google Gemini 1.5 Flash API

---

## 🌟 Key Features

### 🧠 1. Google Gemini AI Integrations
* **✨ Real-Time Resume Enhancer**: Evaluates summaries and project summaries on the fly. Automatically rewrites weak/passive statements into metrics-driven sentences emphasizing action verbs and STAR methodology.
* **📝 Raw Text Editor & AI Structurizer**: Provides a full-page, clean blank document canvas (simulating a Microsoft Word page). Type or paste unstructured resume scribbles and click **AI Compile**—Gemini parses the text and instantly hydrates your visual profile database records.

### 💼 2. Centralized Profile Management
* Enter information once—such as adding a project, skill, or certification—and see changes propagate instantly across your dashboard, interactive resume templates, and public portfolio pages.
* Categorized skills array with proficiency levels, achievements logger, and academic history blocks.

### 📐 3. Dynamic Visual Document Builder
* **Resume Builder**: Select from multiple layout variations (Minimal Professional, Modern Developer, Clean Academic) with customizable typography, line density, color accent dots, and custom section orders.
* **Portfolio Showcase**: Interactive controls to toggle section visibilities, switch between vibrant Light and Dark modes, and copy portfolio links to the clipboard with one click.
* **Completeness Scorer**: A real-time checklist-based dashboard analyzer that tracks fields and recommends improvements.
* **Smart Resume PDF Parser**: Upload existing resumes (PDF/TXT) to analyze layout, formatting rules, and receive visual progress reports.

---

## 🛠️ Technology Stack & Architecture

* **Frontend**: React (Context APIs, Custom Hooks, Theme Provider, React Router SPAs).
* **Styling**: Pure CSS3 utilizing cohesive HSL color variables, responsive flexbox/grid containers, and smooth dark/light transitions.
* **Backend Router**: Native Node.js HTTP Server (`http.createServer`) parsing request streams, headers, buffers, and mapping endpoints.
* **Serverless Runtime**: Vercel Node.js Serverless Functions for cloud deployment.
* **Persistence Layer**: MongoDB (Mongoose schemas) with a fail-safe, local JSON-based file-system fallback to ensure offline operation.
* **AI Engine**: Google Gemini API via official endpoint connections.

```
┌────────────────────────────────────────────────────────┐
│             Vercel Static Edge Server (React UI)       │
└───────────────────────────┬────────────────────────────┘
                            │ (Fetch HTTPS Calls)
                            ▼
┌────────────────────────────────────────────────────────┐
│          Vercel Serverless Functions (Node.js API)     │
└───────────────────────────┬────────────────────────────┘
                            │ (Mongoose Protocols)
                            ▼
┌────────────────────────────────────────────────────────┐
│             MongoDB Atlas Database (AWS Cloud)         │
│          *Fallback to Local JSON files if offline      │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
profolio/
├── api/
│   └── server.js            # Vercel serverless entry point bridging native routes
├── client/
│   ├── public/              # Brand assets & layout visual icons
│   ├── src/
│   │   ├── components/      # Sidebar, Modals, EmptyState, Toasts, Preview Frames
│   │   ├── context/         # ThemeContext (Light/Dark/System presets)
│   │   ├── pages/           # Dashboard, Profile, Projects, Builders, Settings
│   │   ├── services/        # Fetch API clients (api.js)
│   │   ├── App.jsx          # Route coordinator (React Router)
│   │   └── index.css        # Core custom SaaS CSS variables and resets
│   └── package.json
├── server/
│   ├── data/                # Local JSON fallback backup files
│   ├── models/              # MongoDB/Mongoose database schemas (User, Profile, Portfolio)
│   ├── routes/              # Native HTTP API route handlers (api.js)
│   ├── services/            # Storage connectivity engine (storageService.js)
│   ├── utils/               # PDF extracting and multipart parsers
│   └── server.js            # Node.js native createServer entry point
├── package.json             # Root monorepo workspace dependencies
└── vercel.json              # Vercel deployment and rewrite rules
```

---

## 🔌 API Endpoints

### 🔐 Authentication
* `POST /api/auth/register` - Registers a new username profile.
* `POST /api/auth/login` - Authenticates credentials.
* `POST /api/auth/logout` - Terminates session.

### 👤 Profile
* `GET /api/profile` - Fetches the active user profile details.
* `PUT /api/profile` - Updates personal bio and contact coordinates.
* `POST /api/profile/restore-backup` - Restores pre-loaded user profile state.

### 🔧 CRUD Resources
* `GET/POST/PUT/DELETE /api/projects` - Manage featured projects.
* `GET/POST/PUT/DELETE /api/skills` - Manage technical tags and proficiency level.
* `GET/POST/PUT/DELETE /api/education` - Manage academic degrees.
* `GET/POST/PUT/DELETE /api/certifications` - Manage verified certifications.
* `GET/POST/PUT/DELETE /api/achievements` - Manage honors and hackathons won.

### 🧠 AI Builders & Analytics
* `GET/PUT /api/portfolio` - Read/write portfolio template arrangements.
* `POST /api/resume/analyze` - Upload resume file and get completeness report.
* `POST /api/resume/ai-enhance` - Google Gemini optimization for bio and project descriptions.
* `POST /api/resume/ai-structurize` - Google Gemini raw plain-text compilation into database schemas.

---

## 💻 Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org) (v18+)
* Local MongoDB server (Optional—falls back to local JSON files automatically if offline).

### Step 1: Install Dependencies
Run the package installer script in the root directory to download libraries across all workspaces concurrently:
```bash
npm run install:all
```

### Step 2: Start Development Servers
Start both the backend API server (Port 5000) and the Vite React client (Port 5173) simultaneously:
```bash
npm run dev
```

### Step 3: Open in Browser
Visit **[http://localhost:5173](http://localhost:5173)** to access the app.
* Click **Get Started** to register a new profile and start building your portfolio!

---

## 👩‍💻 Built By

**Nivetha G** — *M.Sc. AI & ML, Coimbatore Institute of Technology*

* **GitHub**: [@Nivetha15122006](https://github.com/Nivetha15122006)
* **Live Deployment**: [pro-folio-fawn.vercel.app](https://pro-folio-fawn.vercel.app)
