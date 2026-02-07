# LearnSphere — Project Plan & AI Reference

> **Last updated:** 2026-02-07  
> **Status:** Backend infrastructure added, UI refinements in progress  
> **This file is for A (Architect / Tech Lead / Copilot's operator)**  
> **AI assistants: Reference DEVELOPMENT_REFERENCE.md** for all technical details.  
> Copilot: refer to this file before every major task.

---

## ⚡ Recent Updates (Feb 7, 2026)

### Completed Features
- ✅ **DomeGallery Component** — 3D interactive course thumbnail dome on login page
- ✅ **Theme Unification** — Removed dual light/dark theme, unified to single light theme
- ✅ **Admin Role Removal** — Removed admin from login role selector
- ✅ **Backend Infrastructure** — Node.js/Express API server with PostgreSQL schema added
- ✅ **API Service Layer** — Frontend-to-backend communication ready (src/services/api.ts)

### Current Branch Status
- **main:** Synced with remote, includes backend + UI updates
- **feat/noAdmin/globe/theme:** Pushed to remote (26 files, +1,265 -382)
  - PR available: https://github.com/Kukyos/LearnSphere/pull/new/feat/noAdmin/globe/theme

---

## 1. What Exists Right Now

### Current Stack
| Layer | Tech | Notes |
|-------|------|-------|
| Framework | React 19 + TypeScript | Vite bundler, port 3002 |
| Styling | Tailwind CSS (CDN `<script>` tag) | **Light theme ONLY** (dark mode removed), custom `brand` + `nature` palette |
| Icons | lucide-react | Already imported throughout |
| 3D Effects | Three.js + @use-gesture/react | PixelBlast (Hero), DomeGallery (Login) |
| Animations | Framer Motion 12.x | Page transitions, role selector animation |
| Backend | Node.js + Express + PostgreSQL | API server, database schema, controllers/routes |
| Fonts | Inter (Google Fonts) | Loaded in index.html |

### Current File Map
```Router setup with pages
├── index.tsx            → ReactDOM entry
├── index.html           → HTML shell with Tailwind CDN config (NO darkMode)
├── constants.ts         → 20 mock courses (MOCK_COURSES) + 3 review snippets
├── types.ts             → Course, FilterState, SortOption, Difficulty types
├── vite.config.ts       → Vite config with @/ alias, Gemini API key passthrough
├── tsconfig.json        → Standard React TS config
├── package.json         → Dependencies: react, framer-motion, lucide-react, three, @use-gesture/react
├── metadata.json        → AI Studio metadata
├── README.md            → Updated project readme
├── PROJECT_PLAN.md      → This file
├── DEVELOPMENT_REFERENCE.md → Design system & patterns
├── TEAM_INSTRUCTIONS.md     → Workflow & Git conventions
├── UI_SESSION_REFERENCE.md  → Latest UI session context
└── components/
    ├── Navbar.tsx        → Floating pill navbar (NO theme toggle)
    ├── Hero.tsx          → Full-width hero with search bar + PixelBlast 3D background
    ├── CourseCard.tsx    → Netflix-style card with hover pop-out
    ├── FilterPanel.tsx   → Category/Difficulty/Price filter sidebar
    ├── StatsSection.tsx  → Stats counters + 3 review cards
    ├── Footer.tsx        → 4-column footer with socials

**⚠️ IMPORTANT: Dark mode has been REMOVED. Use light theme only.**

```
Primary Palette (Sage/Forest Green):
  brand-50:  #f4f6f0   (lightest)
  brand-100: #e3e8dc   (card bg, overlays)
  brand-200: #c8d4be   (light sage)
  brand-300: #a3b896  
  brand-400: #7e9a6e
  brand-500: #5c7f4c   (primary sage green)
  brand-600: #46623a   (hover states)
  brand-700: #384e2f   (button hover)
  brand-800: #2f3e29
  brand-900: #263323   (dark text)
  brand-950: #131b11

Semantic:
  nature-light:  #E6E8D6  (main bg)
  nature-card:   #F3F4ED  (card bg)
  nature-accent: #D9DCD6
  nature-dark:   #1F2922

Font: Inter (300–700)
Border radius: rounded-full for pills/buttons, rounded-xl/2xl/3xl for cards/modals
Transitions: 300ms ease default
```

**Usage:**
```tsx
// NO MORE dark: classes! Light theme only.
<div className="bg-nature-light text-brand-900">
<button className="bg-brand-700 hover:bg-brand-600 text-white">
<inpBackend now exists!** Server folder with Node/Express + PostgreSQL schema
- **Routing implemented.** Using `react-router-dom` for multi-page navigation
- **Auth system in progress.** Login page exists, backend auth endpoints needed
- **Database schema ready.** Need to seed and wire up frontend
- **Tailwind is CDN-loaded** via `<script>` tag in `index.html`, NOT PostCSS
- **No global state management beyond Context API.** Using AppContext for courses, AuthContext for auth
- **Three.js confined to visuals.** Used in PixelBlast (Hero) and DomeGallery (Login) only
- **Theme system simplified.** NO dark mode toggle, light theme only
    │   └── courses/
    │       ├── CourseCard.tsx
    │       ├── CourseTable.tsx
    │       └── CreateCourseModal.tsx
    ├── contexts/
    │   └── AppContext.tsx  → Global state (NO theme state)
    ├── pages/
    │   ├── CourseDetailPage.tsx
    │   ├── CoursesDashboard.tsx
    │   ├── CoursesPage.tsx
    │   ├── LessonPlayerPage.tsx
    │   ├── MyCoursesPage.tsx
    │   ├── QuizBuilder.tsx
    │   ├── ReportingDashboard.tsx
    │   └── course/
    │       └── CourseForm.tsx
    └── services/
        └── api.ts          → API client for backend (NEW)
└── server/                 → Backend (NEW)
    ├── controllers/
    ├── routes/
    ├── schema.sql          → PostgreSQL database schema
    └── seed.js             → Database seeding scrip
    ├── Footer.tsx        → 4-column footer with socials
    └── PixelBlast.tsx    → Three.js instanced mesh grid with mouse ripple effect
```

### Design System (REFERENCE — keep consistent everywhere)
```
Primary Palette (Sage/Forest Green):
  brand-50:  #f4f6f0   (lightest)
  brand-100: #e3e8dc   (card bg light)
  brand-200: #c8d4be   (light sage)
  brand-300: #a3b896  
  brand-400: #7e9a6e
  brand-500: #5c7f4c   (primary sage green)
  brand-600: #46623a
  brand-700: #384e2f   (button hover)
  brand-800: #2f3e29
  brand-900: #263323   (dark text / dark bg)
  brand-950: #131b11

Semantic:
  nature-light:  #E6E8D6  (main bg)
  nature-card:   #F3F4ED  (card bg)
  nature-accent: #D9DCD6
  nature-dark:   #1F2922

Font: Inter (300–700)
Border radius: rounded-full for pills/buttons, rounded-xl/2xl/3xl for cards/modals
Transitions: 300ms ease default, view-transition API for theme toggle
```

**📖 For complete design system, packages, and technical references: see [DEVELOPMENT_REFERENCE.md](DEVELOPMENT_REFERENCE.md)**
### Hard Constraints (Hackathon Rules)
- **Time:** ~23 hours total
- **Team:** 4 people (A, D, S, J)  
- **Must deliver:** Working demo with both Instructor/Admin backoffice AND Learner website
- **Must cover:** Course CRUD, Lessons, Quizzes, Progress tracking, Points/Badges, Ratings, Reporting

### Technical Constraints
- **No real backend yet.** Everything is mock data in `constants.ts`. D needs to set up backend.
- **No routing.** Currently a single-page app. Need `react-router-dom` for multi-page.
- **No auth system.** Login modal is visual only. Need real auth flow.
- **No database.** Need to decide: Firebase/Supabase (fastest) vs. custom Node/Express + DB.
- **Tailwind is CDN-loaded** via `<script>` tag in `index.html`, NOT PostCSS. This works for now but custom classes must go in the tailwind.config inside `index.html`.
- **No state management.** Only React useState. May need Context API or Zustand for auth/user state.
- **Three.js is a heavy dependency.** Only used for Hero background. Keep it isolated — don't spread it.

### What I (Copilot) CAN Do
- ✅ Generate React components (TSX + Tailwind)
- ✅ Create page layouts, forms, modals, dashboards
- ✅ Wire up react-router-dom routes
- ✅ Build mock data structures and local state logic
- ✅ Create quiz builder UI, lesson editors, kanban boards
- ✅ Implement client-side filtering, sorting, searching
- ✅ Generate TypeScript types and interfaces
- ✅ Help with Supabase/Firebase integration patterns
- ✅ Create reporting tables and chart layouts

### What I (Copilot) CANNOT Do
- ❌ Deploy to production hosting (need human for Vercel/Netlify/Firebase deploy)
- ❌ Create actual cloud database instances (need D to provision)
- ❌ Send real emails (attendee invites need backend service)
- ❌ Process real payments (Stripe/Razorpay needs backend + keys)
- ❌ Upload actual files to cloud storage (need S3/Firebase Storage config)
- ❌ Create real OAuth (Google sign-in needs console setup)

### Pragmatic Decisions for 23 Hours
| Feature | Approach | Why |
|---------|----------|-----|
| Auth | Mock auth with Context (localStorage) OR Supabase Auth | No time for custom JWT |
| Database | Supabase (Postgres + realtime) OR Firebase Firestore | Fastest to wire up |
| File uploads | Mock with URLs / Supabase Storage | Real upload needs backend |
| Payments | Show UI, mock the flow | No time for Stripe integration |
| Email invites | Show UI, log to console | No SMTP setup in 23h |
| Video player | Embed YouTube/iframe | Don't build custom player |
| Document viewer | PDF.js embed or iframe | Keep it simple |
| Quiz scoring | Client-side calculation, persist to DB | Works fine for demo |

---

## 3. Full Feature Checklist (Priority Order)

### 🔴 CRITICAL — Must have for demo
- [ ] **Routing setup** — react-router-dom with layout wrappers
- [ ] **Auth context** — login/signup/logout, role-based (Admin, Instructor, Learner)
- [ ] **Learner: Course browsing page** (B1/B2) — grid of published courses with search
- [ ] **Learner: Course detail page** (B3) — overview, progress bar, lesson list
- [ ] **Learner: Full-screen lesson player** (B5) — sidebar + video/doc/image viewer
- [ ] **Instructor: Course dashboard** (A1) — list/kanban view of courses
- [ ] **Instructor: Course form** (A2) — edit course details, publish toggle
- [ ] **Instructor: Lesson management** (A3/A4) — add/edit/delete lessons
- [ ] **Database schema + seed data** (D's job)

### 🟡 IMPORTANT — Makes demo convincing
- [ ] **Learner: Quiz flow** (B6) — one question per page, submit, score
- [ ] **Instructor: Quiz builder** (A7) — add questions, set rewards
- [ ] **Points & Badges** (B7/B2) — earn points from quizzes, badge levels display
- [ ] **Course progress tracking** — lesson completion status, % bar
- [ ] **Ratings & Reviews** (B4) — star rating + review text
- [ ] **Instructor: Reporting dashboard** (A8) — overview cards + user table
- [ ] **Course visibility/access rules** (A5) — Everyone/SignedIn, Open/Invite/Paid

### 🟢 NICE TO HAVE — If time allows
- [ ] **Kanban view** for instructor dashboard (vs just list)
- [ ] **Customizable columns** in reporting table
- [ ] **Share course link** generation
- [ ] **Contact attendees** wizard
- [ ] **Additional attachments** on lessons
- [ ] **Course completion certificate/popup**
- [ ] **Dark mode** across ALL new pages (already works on landing)
- [ ] **Mobile responsive** polish on all new pages
- [ ] **Chatbot / AI feature** (J's optional task)

---

## 4. Recommended Architecture (For New Pages)

```
/                          → Landing page (DONE — current App.tsx)
/courses                   → Public course listing (B1/B2)
/courses/:id               → Course detail page (B3)
/courses/:id/learn         → Full-screen lesson player (B5)
/courses/:id/learn/:lessonId → Specific lesson in player
/my-courses                → Learner dashboard (B2)
/login                     → Login page
/signup                    → Signup page

/admin                     → Admin/Instructor shell
/admin/courses             → Course dashboard - Kanban/List (A1)
/admin/courses/new         → Create course
/admin/courses/:id         → Course form/editor (A2)
/admin/courses/:id/content → Lesson management (A3)
/admin/courses/:id/quiz    → Quiz management (A6)
/admin/courses/:id/quiz/:qid → Quiz builder (A7)
/admin/reporting           → Reporting dashboard (A8)
```

### Folder Structure Target
```
/
├── components/            → Shared/reusable components
│   ├── ui/                → Buttons, Inputs, Modals, Cards (design system)
│   ├── layout/            → Navbar, Footer, Sidebar, AdminShell
│   └── ...existing...
├── pages/                 → Route-level page components
│   ├── Landing.tsx         (move current App.tsx content here)
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── CourseList.tsx      (B1/B2)
│   ├── CourseDetail.tsx    (B3)
│   ├── LessonPlayer.tsx   (B5)
│   ├── MyCourses.tsx       (B2 - learner dashboard)
│   └── admin/
│       ├── Dashboard.tsx   (A1)
│       ├── CourseForm.tsx  (A2)
│       ├── QuizBuilder.tsx (A7)
│       └── Reporting.tsx   (A8)
├── context/               → React contexts
│   ├── AuthContext.tsx
│   └── CourseContext.tsx
├── hooks/                 → Custom hooks
├── lib/                   → Utilities, API helpers, Supabase client
├── types.ts               → All TypeScript interfaces
├── constants.ts           → Mock data (until DB is ready)
├── App.tsx                → Router setup only
└── index.tsx              → Entry point
```

---

## 5. Database Schema (Reference for D)

### Core Tables
```sql
-- Users
users (id, email, name, avatar_url, role [admin/instructor/learner], total_points, created_at)

-- Courses
courses (id, title, description, image_url, tags[], website_url, 
         responsible_user_id, visibility [everyone/signed_in], 
         access_rule [open/invite/paid], price, is_published, 
         created_at, updated_at)

-- Lessons
lessons (id, course_id, title, type [video/document/image/quiz], 
         content_url, duration, description, allow_download, 
         sort_order, created_at)

-- Lesson Attachments
lesson_attachments (id, lesson_id, type [file/link], url, name)

-- Quizzes
quizzes (id, course_id, title, created_at)

-- Quiz Questions
quiz_questions (id, quiz_id, question_text, sort_order)

-- Quiz Options
quiz_options (id, question_id, option_text, is_correct)

-- Quiz Rewards
quiz_rewards (id, quiz_id, attempt_number, points)

-- Enrollments
enrollments (id, user_id, course_id, status [not_started/in_progress/completed],
             enrolled_at, started_at, completed_at, time_spent_seconds)

-- Lesson Progress
lesson_progress (id, user_id, lesson_id, status [not_started/in_progress/completed],
                 completed_at)

-- Quiz Attempts
quiz_attempts (id, user_id, quiz_id, attempt_number, score, points_earned, completed_at)

-- Reviews
reviews (id, user_id, course_id, rating, review_text, created_at)

-- Badges (derived from total_points, but can store unlocked ones)
badges (id, name, min_points, icon)
```

### Badge Levels (Hardcoded)
| Badge | Points |
|-------|--------|
| Newbie | 20 |
| Explorer | 40 |
| Achiever | 60 |
| Specialist | 80 |
| Expert | 100 |
| Master | 120 |

---

## 6. Task Assignment Quick Reference

| Task | Owner | Depends On | Priority |
|------|-------|-----------|----------|
| Repo setup, branching, initial commit | A | — | NOW |
| DB schema creation | D | Repo access | 🔴 |
| Auth API (signup/login/role check) | D | Schema | 🔴 |
| Course CRUD API | D | Schema | 🔴 |
| Lesson CRUD API | D | Schema | 🔴 |
| React Router setup | S | Initial commit | 🔴 |
| Auth context + login/signup pages | S | Auth API contract | 🔴 |
| Learner course listing page | S | Router | 🔴 |
| Course detail page | S | Router | 🔴 |
| Lesson player page | S | Router | 🟡 |
| Instructor dashboard page | S/A | Router | 🟡 |
| Course form (instructor) | S/A | Router | 🟡 |
| Quiz builder (instructor) | A | Router | 🟡 |
| Quiz flow (learner) | A | Quiz API | 🟡 |
| Points/Badges display | S | Points API | 🟡 |
| Ratings/Reviews | S | Reviews API | 🟡 |
| Reporting dashboard | A/S | Enrollment API | 🟡 |
| PPT + demo script | J | Working demo | 🔴 |
| User flow diagrams | J | Feature list | 🔴 |
| Problem statement doc | J | — | 🔴 |

---

## 7. Next Steps (In Order)

1. **Create `.gitignore` and make initial commit** ← doing now
2. **Install `react-router-dom`** and set up routing in App.tsx
3. **Create page shell components** (empty pages with basic layout)
4. **Create AuthContext** with mock login (localStorage)
5. **Build Learner flow first** (most visible for demo):
   - Course listing → Course detail → Lesson player
6. **Build Instructor flow** (backoffice):
   - Dashboard → Course form → Lesson editor → Quiz builder
7. **Wire up to real backend** when D has APIs ready
8. **Add polish**: progress tracking, points, badges, reviews
9. **Final integration + bug fixes** in last 3-4 hours

---

*This file should be updated as tasks are completed. Check boxes off as you go.*
