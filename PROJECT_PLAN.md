# LearnSphere — Project Plan & AI Reference

> **Last updated:** 2026-02-08  
> **Status:** Core features complete. Backend + Frontend integrated.  
> **This file is for A (Architect / Tech Lead / Copilot's operator)**  
> **AI assistants: Reference DEVELOPMENT_REFERENCE.md** for all technical details.  
> Copilot: refer to this file before every major task.

---

## 1. What Exists Right Now (Initial Commit State)

### Current Stack
| Layer | Tech | Notes |
|-------|------|-------|
| Framework | React 19 + TypeScript | Vite bundler, port 3000 |
| Styling | Tailwind CSS (CDN `<script>` tag) | Dark mode via `class` strategy, custom `brand` + `nature` palette |
| Icons | lucide-react | Already imported throughout |
| 3D Effects | Three.js (PixelBlast component) | Instanced mesh grid with mouse interaction on Hero |
| Fonts | Inter (Google Fonts) | Loaded in index.html |

### Current File Map
```
/ (root)
├── App.tsx              → Single-page app: Navbar → Hero → CourseRows → Stats → Footer + Login modal
├── index.tsx            → ReactDOM entry
├── index.html           → HTML shell with Tailwind CDN config, importmap, view-transition CSS
├── constants.ts         → 20 mock courses (MOCK_COURSES) + 3 review snippets
├── types.ts             → Course, FilterState, SortOption, Difficulty types
├── vite.config.ts       → Vite config with @/ alias, Gemini API key passthrough
├── tsconfig.json        → Standard React TS config
├── package.json         → "lumina-learning" — react, react-dom, lucide-react, three
├── metadata.json        → AI Studio metadata (can be removed/ignored)
├── README.md            → AI Studio generated readme (will be replaced)
└── components/
    ├── Navbar.tsx        → Floating pill navbar, theme toggle, sign-in button, mobile menu
    ├── Hero.tsx          → Full-width hero with search bar + PixelBlast 3D background
    ├── CourseCard.tsx    → Netflix-style card with hover pop-out (500ms delay)
    ├── FilterPanel.tsx   → Category/Difficulty/Price filter sidebar (NOT wired into App.tsx yet)
    ├── StatsSection.tsx  → Stats counters + 3 review cards
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
- **Backend: Express + PostgreSQL** — fully built in `server/`. 3 controllers, 3 route files, JWT auth.
- **Routing: react-router-dom** — multi-page app with role-based routes.
- **Auth: Real JWT auth** — bcrypt password hashing, 24h token expiry. NO mock fallback.
- **Database: PostgreSQL 18** — 7 tables, 10 indexes. Schema in `server/schema.sql`.
- **Tailwind is CDN-loaded** via `<script>` tag in `index.html`, NOT PostCSS. Custom classes go in the tailwind.config inside `index.html`.
- **State: React Context API** — AuthContext (auth) + AppContext (courses/state).
- **API Pattern: Optimistic UI** — local state updates immediately, API fires in background.
- **Three.js is a heavy dependency.** Only used for Hero background. Keep it isolated.

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

### Pragmatic Decisions Made
| Feature | Approach | Status |
|---------|----------|--------|
| Auth | Real JWT auth (Express + bcrypt + jsonwebtoken) | ✅ Done |
| Database | PostgreSQL 18 via `pg` library | ✅ Done |
| File uploads | Mock with URLs | Unchanged |
| Payments | Show UI, mock the flow | Unchanged |
| Email invites | Show UI, log to console | Unchanged |
| Video player | Embed YouTube/iframe | Unchanged |
| Document viewer | PDF.js embed or iframe | Unchanged |
| Quiz scoring | Client-side + backend points API | ✅ Done |

---

## 3. Full Feature Checklist (Priority Order)

### 🔴 CRITICAL — Must have for demo
- [x] **Routing setup** — react-router-dom with layout wrappers
- [x] **Auth context** — login/signup/logout, role-based (Admin, Instructor, Learner)
- [x] **Learner: Course browsing page** (B1/B2) — grid of published courses with search
- [x] **Learner: Course detail page** (B3) — overview, progress bar, lesson list
- [x] **Learner: Full-screen lesson player** (B5) — sidebar + video/doc/image viewer
- [x] **Instructor: Course dashboard** (A1) — list/kanban view of courses
- [x] **Instructor: Course form** (A2) — edit course details, publish toggle
- [x] **Instructor: Lesson management** (A3/A4) — add/edit/delete lessons
- [x] **Database schema + seed data** — PostgreSQL, 7 tables, admin seeded

### 🟡 IMPORTANT — Makes demo convincing
- [x] **Learner: Quiz flow** (B6) — quiz scoring mechanics
- [x] **Instructor: Quiz builder** (A7) — add questions, set rewards
- [x] **Points & Badges** (B7/B2) — earn points from quizzes, badge levels display
- [x] **Course progress tracking** — lesson completion status, % bar
- [x] **Ratings & Reviews** (B4) — star rating + review text
- [x] **Instructor: Reporting dashboard** (A8) — overview cards + user table
- [ ] **Course visibility/access rules** (A5) — Everyone/SignedIn, Open/Invite/Paid

### 🟢 NICE TO HAVE — If time allows
- [ ] Kanban view for instructor dashboard (vs just list)
- [ ] Customizable columns in reporting table
- [ ] Share course link generation
- [ ] Contact attendees wizard
- [ ] Additional attachments on lessons
- [ ] Course completion certificate/popup
- [x] **Dark mode** across ALL new pages
- [ ] Mobile responsive polish on all new pages
- [ ] Chatbot / AI feature (J's optional task)

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

## 7. What's Done & What Remains

### ✅ Completed
1. Full Express + PostgreSQL backend (all 3 roles)
2. React Router with role-based routes
3. AuthContext with real JWT auth (no mock)
4. AppContext with API integration (optimistic UI)
5. All learner pages (browse, detail, player, quiz, my courses)
6. All instructor pages (dashboard, course form, lessons, quiz builder, reporting)
7. Login page with DomeGallery + forgot-password flow
8. Points/badges system with auto-award
9. Ratings & reviews
10. Admin user management (seeded admin only)
11. Database schema, indexes, admin seed
12. Full API client (services/api.ts)

### 🔲 Remaining / Polish
- Course visibility/access rules (everyone vs signed-in, open/invite/paid)
- Mobile responsive polish on inner pages
- SettingsPage may need re-checking (teammate branch may have broken it)
- `backendOnline` indicator in UI (boolean exposed but not shown)
- AppContext still has mock courses as initial seed (merges with backend data)
- Course completion certificate/popup
- Chatbot / AI feature

---

*This file should be updated as tasks are completed.*
