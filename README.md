# LearnSphere — Collaborative Learning Management System

**A hackathon project built in 24 hours**  
React 19 + TypeScript + PostgreSQL + Express

---

## 🎯 What We're Building

A dual-sided LMS platform:
- **Learner Side:** Browse courses, watch lessons, take quizzes, earn badges
- **Instructor/Admin Side:** Create courses, manage content, track analytics

---

## 🚀 Quick Start

### Frontend
```bash
npm install
npm run dev
# Opens on http://localhost:3001
```

### Backend (in `/server`)
```bash
cd server
npm install
# Set up .env file (copy from .env.example)
npm run dev
# Runs on http://localhost:5001
```

---

## 📁 Project Structure

```
├── pages/               → Route pages (Landing, Login)
├── components/          → Reusable UI components
│   ├── auth/           → D's auth system (AuthForm)
│   └── ui/             → Button, Input components
├── src/
│   ├── pages/          → Dashboard pages
│   └── components/     → Feature components (courses, etc.)
├── services/           → API client (auth, courses)
└── server/             → Express backend with PostgreSQL
    ├── controllers/    → Route handlers
    ├── middleware/     → Auth middleware (JWT)
    └── routes/         → API routes
```

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS (CDN), brand sage green palette |
| Icons | lucide-react |
| Animation | framer-motion |
| 3D Effects | Three.js (PixelBlast component) |
| Routing | react-router-dom |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT with bcrypt |

---

## ✅ Current Status

**Completed:**
- ✅ Landing page with Hero, course cards, stats
- ✅ Login/signup with role selector (learner/instructor/admin)
- ✅ Backend auth APIs (register, login, forgot, reset)
- ✅ Courses dashboard with kanban/list views
- ✅ React Router setup (/, /login, /courses)
- ✅ PostgreSQL database with users table
- ✅ Dark mode support throughout

**In Progress:**
- 🔄 Auth context for protected routes
- 🔄 Learner course browsing + detail pages
- 🔄 Lesson player with video/doc support
- 🔄 Instructor course creation form
- 🔄 Quiz builder and quiz flow

---

## 👥 Team

| Name | Role |
|------|------|
| A | Architect + Integration |
| D | Backend + Database |
| S | Frontend Implementation |
| J | Product + Presentation |

---

## 📖 Documentation

- `PROJECT_PLAN.md` — Full feature list, database schema, task assignments
- `TEAM_INSTRUCTIONS.md` — Git workflow, design system, team coordination
- `DEVELOPMENT_REFERENCE.md` — Comprehensive technical reference (700+ lines)

---

**Built for Hackathon 2026 🚀**
