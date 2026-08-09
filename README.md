# DevPortfolio – Smart Portfolio & Resume Builder

> Build your professional identity once. Showcase it everywhere.

DevPortfolio is a unified developer-focused full-stack web application designed for students, fresh graduates, and software engineers preparing for internship and placement drives. It solves the fragmentation problem of maintaining resumes, portfolio websites, GitHub profiles, and academic records separately.

---

## 1. Problem Statement
Maintaining separate files or platforms for resume printouts, personal portfolio websites, and professional profiles leads to out-of-sync details, inconsistent data formats, and repetitive inputs. 

DevPortfolio addresses this by introducing a **centralized professional profile** as the single source of truth. Users enter information once—such as adding a project description or a certification credential—and the application immediately reflects that update across their dashboard, dynamic resume preview (exportable to PDF), and hosted portfolio website.

---

## 2. Key Features

- **Centralized Data Management**: Custom forms to manage personal bio, education history, technical skills (categorized), projects, certifications, and academic achievements.
- **Dynamic Resume Builder**: Instantly formats data into clean templates (Minimal Professional, Modern Developer, Clean Academic) with customizable fonts, colors, line spacing, and section ordering.
- **Interactive Portfolio Builder**: Toggles section visibility, theme modes (Light/Dark), and project arrangements in real-time.
- **Completeness Scorer**: A smart checklist-based dashboard analyzer that tracks fields and recommends improvements.
- **Smart Resume Analyzer**: Supports direct TXT and PDF uploads, parses content streams, and measures completeness against industry rules.
- **SVG Data Visualization**: Renders vector-based progression charts representing profile improvements over time without bloating dependencies.
- **Clean Responsive Layouts**: Transitions smoothly between sidebar views on Desktop, compact frames on Tablets, and drawer toggles on Mobile.

---

## 3. Technology Stack

- **Frontend**: React (Functional Components, Hook States, Context Theme Provider, SPAs with React Router).
- **Styling**: Pure CSS3 utilizing cohesive dark/light CSS custom properties, grid layouts, flexbox, and media queries.
- **Icons**: Lucide React.
- **Backend**: Native Node.js HTTP Server (`http.createServer`) parsing request streams, headers, buffers, and mapping endpoints.
- **Persistence**: Local JSON-based database (`server/data/*.json`) allowing easy inspection.
- **Text Extraction**: Pure JavaScript PDF stream parser (`pdf-parse`).

---

## 4. Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│                        React UI                        │
└───────────────────────────┬────────────────────────────┘
                            │ (Fetch API Calls)
                            ▼
┌────────────────────────────────────────────────────────┐
│               Node.js HTTP Server Port 5000            │
│                     (createServer)                     │
└───────────────────────────┬────────────────────────────┘
                            │ (Buffer parsing & Router)
                            ▼
┌────────────────────────────────────────────────────────┐
│                    Service Data Layer                  │
│               (JSON File I/O & Audit Logger)           │
└────────────────────────────────────────────────────────┘
```

When a resource is modified:
1. React forms send a `PUT` or `POST` request.
2. The Node.js native server buffers the incoming stream chunks.
3. The server validates headers, checks authorizations (`Authorization: Bearer <username>`), parses the payload, and saves it.
4. Custom Node.js `EventEmitters` capture the modification (e.g. `projectCreated`) and append audit entries.
5. The JSON storage updates, and the server returns the updated profile schema.

---

## 5. Folder Structure

```
devportfolio/
├── client/
│   ├── public/              # Branding assets & SVG templates
│   ├── src/
│   │   ├── components/      # Sidebar, Modals, EmptyState, Toasts, Preview Frames
│   │   ├── context/         # ThemeContext (Light, Dark, System mode)
│   │   ├── layouts/         # DashboardLayout frames
│   │   ├── pages/           # Pages (Dashboard, Profile, Projects, Builders, Settings)
│   │   ├── services/        # Fetch API clients (api.js)
│   │   ├── index.css        # Core custom SaaS CSS variables and resets
│   │   ├── App.jsx          # Route coordinator (React Router)
│   │   └── main.jsx         # StrictMode React bootstrapper
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── data/                # JSON database structures
│   ├── events/              # EventEmitter audit logger
│   ├── logs/                # Audit stream output logs
│   ├── routes/              # Native HTTP route handlings (api.js)
│   ├── services/            # File storage operations
│   ├── utils/               # PDF extracting and multipart parsers
│   ├── server.js            # createServer entry point
│   └── package.json
│
├── package.json             # Workspace-level concurrency commands
└── README.md
```

---

## 6. API Endpoints

### Authentication
- `POST /api/auth/register` - Registers a new username profile.
- `POST /api/auth/login` - Authenticates credentials.
- `POST /api/auth/logout` - Terminates sessions.

### Profile
- `GET /api/profile` - Fetches the user profile.
- `PUT /api/profile` - Updates personal bio and contact handles.

### CRUD Resources
- `GET/POST/PUT/DELETE /api/projects` - Manage featured projects.
- `GET/POST/PUT/DELETE /api/skills` - Manage technical tags and proficiency level.
- `GET/POST/PUT/DELETE /api/education` - Manage academic degrees.
- `GET/POST/PUT/DELETE /api/certifications` - Manage verified certifications.
- `GET/POST/PUT/DELETE /api/achievements` - Manage honors and hackathons won.

### Builders
- `GET/PUT /api/portfolio` - Read/write portfolio template arrangements.
- `POST /api/resume/analyze` - Upload resume and get rule-based Resume Score.

---

## 7. Installation & How to Run

### Prerequisite
Ensure [Node.js](https://nodejs.org) is installed on your computer.

### Step 1: Install Dependencies
Navigate to the root workspace folder and install the root, client, and server libraries concurrently:
```bash
npm run install:all
```

### Step 2: Start Development Servers
Run the following script to boot both the Node.js API server (Port 5000) and the Vite development server (Port 5173) simultaneously:
```bash
npm run dev
```

### Step 3: Open in Browser
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

- **Default Test User**: Log in with Username: `arjun`, Password: `password123` to inspect seeded profile records immediately, or click **Get Started** to register a new profile.

---

## 8. Future AI Enhancements
- **AI Professional Summary**: Integration with LLM APIs to draft developer summaries based on entered projects.
- **Tailored Bullet Points**: Automatically refine project descriptions to highlight metrics (e.g. "Increased loading speed by 20%").
- **Smart Skills Recommendations**: Recommend additional technical categories based on current project descriptions.

---

## 9. Author
Developed as a production-style Full-Stack Web Application for placement portfolios and software engineering lab evaluations.
