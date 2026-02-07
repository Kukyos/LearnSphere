# LearnSphere — Learning Platform

> **Last Updated:** 2026-02-07  
> **Full-stack learning management system with React + TypeScript frontend and Node.js/PostgreSQL backend**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL (for backend)
- Git

### Running the Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Opens at: http://localhost:3002
```

### Running the Backend
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Set up database (PostgreSQL)
# Configure connection in server/.env

# Run database migrations
npm run migrate

# Seed database with test data
npm run seed

# Start backend server
npm start
# Runs on: http://localhost:3001
```

---

## 📋 Project Overview

LearnSphere is a comprehensive learning management system with:
- **Learner Portal:** Browse courses, watch lessons, take quizzes, earn points/badges
- **Instructor Dashboard:** Create courses, manage lessons, build quizzes, view reports
- **Interactive UI:** 3D visual effects, smooth animations, responsive design
- **Progress Tracking:** Lesson completion, quiz attempts, course progress
- **Points & Badges:** Gamification with reward tiers

---

## 🏗️ Architecture

### Frontend Stack
- **React 19** + **TypeScript 5.8** — UI framework
- **Vite 6.2** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling (CDN)
- **Framer Motion 12** — Animations & transitions
- **Lucide React** — Icon library
- **@use-gesture/react** — Gesture handling for 3D interactions
- **Three.js** — 3D graphics (PixelBlast effect)

### Backend Stack
- **Node.js** + **Express** — API server
- **PostgreSQL** — Relational database
- **JWT** — Authentication (planned)

### Design System
**Unified Light Theme** — Sage/olive green palette
- Primary: `brand-500` (#5c7f4c), `brand-700` (#384e2f)
- Backgrounds: `nature-light` (#E6E8D6), `nature-card` (#F3F4ED)
- No dark mode (removed for consistency)

---

## 📁 Project Structure

```
d:\OdooSNS\
├── components/           # Shared UI components
│   ├── visuals/
│   │   ├── DomeGallery.tsx   # 3D course thumbnail dome (login page)
│   │   └── WorldGlobe.tsx    # Legacy 3D globe
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   └── CourseCard.tsx
├── pages/                # Route-level pages
│   ├── Landing.tsx       # Public homepage
│   ├── Login.tsx         # Auth page (with DomeGallery)
│   └── LearnerHome.tsx
├── src/
│   ├── components/       # Feature components
│   │   ├── course-form/  # Course creation UI
│   │   └── courses/      # Course management
│   ├── contexts/
│   │   └── AppContext.tsx  # Global state
│   ├── pages/            # Additional routes
│   │   ├── CoursesDashboard.tsx
│   │   ├── CourseDetailPage.tsx
│   │   ├── LessonPlayerPage.tsx
│   │   ├── QuizBuilder.tsx
│   │   └── ReportingDashboard.tsx
│   └── services/
│       └── api.ts        # Backend API client
├── server/               # Backend API
│   ├── controllers/
│   ├── routes/
│   ├── schema.sql        # Database schema
│   └── seed.js           # Test data
├── App.tsx               # Router setup
└── index.html            # Tailwind config

Documentation:
├── README.md                    # This file
├── PROJECT_PLAN.md              # Feature roadmap & architecture
├── DEVELOPMENT_REFERENCE.md     # Design system & code patterns
├── TEAM_INSTRUCTIONS.md         # Team workflow & Git conventions
└── UI_SESSION_REFERENCE.md      # Recent UI session notes
```

---

## 🎨 Recent Updates

### Latest Changes (Feb 7, 2026)
1. **DomeGallery Component** — Replaced WorldGlobe on login page with interactive 3D course thumbnail dome
   - 12 course images in spherical layout
   - Drag-to-rotate with physics
   - Auto-rotation when idle
   - Light sage theme (#e3e8dc overlays)

2. **Theme Unification** — Removed dual light/dark theme system
   - Removed ~350+ `dark:` classes from 20 files
   - Removed theme toggle from Navbar
   - Unified to single light sage/olive palette

3. **Admin Role Removal** — Removed admin from login/signup role selector
   - Now only: Learner, Instructor

4. **Login Page Polish** — Smooth gradient transitions, no vertical color lines

### Git Branches
- **main** — Stable code (current)
- **feat/noAdmin/globe/theme** — Feature branch with above changes (26 files, +1,265 -382)

---

## 🔧 Development

### Available Scripts
```bash
npm run dev       # Start dev server (Vite)
npm run build     # Build for production
npm run preview   # Preview production build
```

### Environment Variables
```env
# .env.local (create this file)
VITE_API_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feat/your-feature

# Work on feature
git add .
git commit -m "feat: description"

# Push to remote
git push origin feat/your-feature
```

---

## 📚 Documentation

- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** — Feature checklist, architecture decisions, task assignments
- **[DEVELOPMENT_REFERENCE.md](DEVELOPMENT_REFERENCE.md)** — Color system, component patterns, TypeScript types
- **[TEAM_INSTRUCTIONS.md](TEAM_INSTRUCTIONS.md)** — Git workflow, task assignments, communication rules
- **[UI_SESSION_REFERENCE.md](UI_SESSION_REFERENCE.md)** — Recent UI session context, DomeGallery details

---

## 📦 Dependencies

### Core
- `react@19.2.4`, `react-dom@19.2.4`
- `typescript@5.8.2`
- `vite@6.2.0`

### UI
- `lucide-react@0.563.0` — Icons
- `framer-motion@12.x` — Animations
- `@use-gesture/react` — Gesture handling
- `three@0.160.0` — 3D graphics

### Backend
- `express` — API server
- `pg` — PostgreSQL client
- `cors` — Cross-origin requests

---

## 🤝 Contributing

See [TEAM_INSTRUCTIONS.md](TEAM_INSTRUCTIONS.md) for Git workflow and branch conventions.

---

## 📄 License

Educational project for hackathon/learning purposes.

---

## 🔗 Repository

GitHub: [https://github.com/Kukyos/LearnSphere.git](https://github.com/Kukyos/LearnSphere.git)
