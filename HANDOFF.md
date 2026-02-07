# LearnSphere — Session Handoff Reference

> **Last session:** February 8, 2026  
> **Branch:** `dev` (synced to `main`)  
> **AI assistant:** Read this file FIRST before doing anything.

---

## What Was Built This Session

### Full Express + PostgreSQL Backend
Built from scratch in `server/`. Covers **all 3 roles** (Learner, Instructor, Admin):

- **Auth system** — JWT tokens (24h expiry), bcrypt hashing (12 rounds), no mock fallback
- **Course CRUD** — Instructor ownership enforced, role-scoped visibility
- **Lesson CRUD** — Per-course lessons with ordering
- **Quiz system** — Multiple-choice questions via `PUT /courses/:id/quiz`
- **Enrollment & Progress** — Enroll, track lesson completion, auto-complete courses
- **Points & Badges** — Auto-award on quiz/course completion, badge tiers (Newbie→Master)
- **Ratings & Reviews** — Star ratings + text reviews, avg rating auto-calculated
- **Reporting** — Role-scoped reporting data (admin sees all, instructor sees own)
- **Admin user management** — List users, change roles, delete users
- **Profile management** — Update name/avatar, change password
- **Forgot password flow** — Token-based reset (tokens stored in DB)

### Auth Rewrite (Critical Change)
**All mock login/register fallbacks were REMOVED.** The backend MUST be running for auth to work.  
Only guest sessions (browse without login) work without the backend.

Key auth details:
- `login(email, password)` — no role parameter, backend determines role from DB
- `register(name, email, password, role)` — blocks `admin` role registration
- Admin is seeded only: `admin@learnsphere.com` / `Admin@123`
- Token stored in localStorage as `ls_token`
- User profile stored as `learnsphere_user`
- AuthContext exposes: `user`, `isLoggedIn`, `login`, `register`, `logout`, `loginAsGuest`, `backendOnline`, `refreshProfile`

### Teammate Branch Merges (Surgical)
Two teammate branches were merged by cherry-picking ONLY the intended files:

1. **`feat/noAdmin/globe/theme`** → Took `DomeGallery.tsx` + `DomeGallery.css` only
   - Swapped Login right panel from WorldGlobe to DomeGallery
   - Added `@use-gesture/react` dependency
   
2. **`feature_QuizRewardspoints`** → Took `QuizBuilder.tsx` only
   - Updated quiz scoring mechanics

Both branches had committed deletions of ALL server files and auth reverts — those were deliberately SKIPPED.

---

## How to Start the App

### Prerequisites
- Node.js >= 18
- PostgreSQL 18 running (installed at `C:\Program Files\PostgreSQL\18\bin\`)
- Database `learnsphere` created with schema loaded and admin seeded

### Start Backend (Terminal 1)
```bash
cd server
npm run dev
```
Server runs on **http://localhost:5000**. Health check: `GET /health`

### Start Frontend (Terminal 2)  
```bash
npm run dev
```
Vite runs on **http://localhost:3000**

### If Starting from Scratch (New Machine)
```bash
# Frontend
npm install

# Database
psql -U postgres -c "CREATE DATABASE learnsphere;"
cd server
psql -U postgres -d learnsphere -f schema.sql

# Backend
npm install
# Create server/.env (copy from .env.example, set DB_PASSWORD)
npm run seed

# Run both
npm run dev          # in server/
cd .. && npm run dev # in root
```

---

## Credentials

| Role | Email | Password | How Created |
|------|-------|----------|-------------|
| Admin | `admin@learnsphere.com` | `Admin@123` | `npm run seed` |
| Instructor | Register via UI | User-chosen | `/auth/register` with role=instructor |
| Learner | Register via UI | User-chosen | `/auth/register` with role=learner |

---

## Known Issues & Quirks

### 1. Pre-existing TypeScript Error
`CoursesDashboard.tsx` has a key prop warning. Not from our work, harmless — doesn't block anything.

### 2. AppContext Mock Data
`AppContext.tsx` still has mock courses from `constants.ts` as the initial state. When the backend is running, it fetches real courses and merges/overwrites. The mock data acts as a fallback for guest browsing.

### 3. `backendOnline` Boolean Not Shown in UI
`AuthContext` exposes `backendOnline` (true/false) but no UI indicator exists yet. Could add a banner: "Backend unavailable — running in offline mode."

### 4. SettingsPage Status
`SettingsPage.tsx` exists at `src/pages/SettingsPage.tsx` but may need verification — teammate branches may have modified it.

### 5. Login Page — No Admin Pill
The Login page only shows Learner and Instructor pills. Admin logs in by entering admin credentials on the Learner pill — the backend determines the role from the database, not the UI pill.

### 6. Two Context Directories
Auth lives in `context/AuthContext.tsx`, app state lives in `src/contexts/AppContext.tsx`. This split happened organically — could be consolidated.

### 7. server/.env Is Not in Git
Each developer needs their own `server/.env`. A `.env.example` exists in `server/`.

### 8. PORT 5000 Conflicts
If you get `EADDRINUSE`, kill the old process:
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
```

---

## Database Schema (Quick Reference)

7 tables in `server/schema.sql`:

| Table | Purpose |
|-------|---------|
| `users` | All users (learner/instructor/admin), points, badge, avatar |
| `password_reset_tokens` | Forgot-password token storage |
| `courses` | Course metadata, instructor_id, status, avg_rating |
| `lessons` | Course lessons with ordering |
| `quiz_questions` | Multiple-choice questions per course |
| `enrollments` | User-course enrollment + completion status |
| `lesson_progress` | Per-lesson completion tracking |
| `reviews` | Star ratings + text reviews |

10 indexes for query performance.

---

## API Architecture

```
Frontend (React, port 3000)
    │
    ├── services/api.ts          → All API calls (fetch-based, Bearer token auth)
    ├── context/AuthContext.tsx   → Auth state, login/register/logout
    └── src/contexts/AppContext.tsx → Courses, enrollment, progress, reviews
            │
            │ HTTP (JSON)
            ▼
Backend (Express, port 5000)
    │
    ├── routes/auth.js       → /auth/*
    ├── routes/courses.js    → /courses/*
    ├── routes/progress.js   → /api/*
    │       │
    │       ▼
    ├── controllers/         → Business logic
    ├── middleware/           → JWT verify + role authorization
    └── db.js                → PostgreSQL pool
            │
            ▼
    PostgreSQL (learnsphere database)
```

### API Pattern: Optimistic UI
AppContext updates local React state **immediately**, then fires the API call in the background. If the API fails, it logs an error but doesn't revert the UI. This keeps the app fast during demos.

---

## What to Work On Next (Suggested Priority)

### High Priority
1. **End-to-end testing** — Register as instructor → create course → add lessons → publish → login as learner → enroll → complete lessons → take quiz → verify points
2. **SettingsPage verification** — Check if it works correctly after teammate merges
3. **Mobile responsive polish** — Inner pages (dashboard, course form, etc.) may need mobile fixes
4. **Course visibility rules** — The schema supports `status` (draft/published/archived) but UI enforcement is partial

### Medium Priority  
5. **Backend online indicator** — Show a banner when `backendOnline` is false
6. **Consolidate context directories** — Move `context/AuthContext.tsx` into `src/contexts/`
7. **Remove mock course data** — AppContext still seeds from `constants.ts`; could remove once backend is reliable
8. **Course completion certificate** — Popup or page when learner completes all lessons

### Nice to Have
9. **Kanban view** for instructor course dashboard
10. **File/image uploads** — Currently mock URLs only
11. **Chatbot / AI feature** — J's optional task
12. **Share course link generation**

---

## File Quick Reference

| What | Where |
|------|-------|
| API client | `services/api.ts` |
| Auth state | `context/AuthContext.tsx` |
| App state + course logic | `src/contexts/AppContext.tsx` |
| Login page | `pages/Login.tsx` |
| Landing page | `pages/Landing.tsx` |
| Course dashboard (instructor) | `src/pages/CoursesDashboard.tsx` |
| Course detail (learner) | `src/pages/CourseDetailPage.tsx` |
| Lesson player | `src/pages/LessonPlayerPage.tsx` |
| Quiz builder | `src/pages/QuizBuilder.tsx` |
| Reporting | `src/pages/ReportingDashboard.tsx` |
| Backend entry | `server/server.js` |
| DB schema | `server/schema.sql` |
| Design system | `DEVELOPMENT_REFERENCE.md` |
| Project plan | `PROJECT_PLAN.md` |

---

*This document reflects the state as of Feb 8, 2026. Update it as work continues.*
