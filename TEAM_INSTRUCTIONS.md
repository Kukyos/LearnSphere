# LearnSphere — Team Instructions

> Read this FULLY before writing a single line of code.  
> **Deadline: ~23 hours from now.**  
> **No excuses. No freelancing. Follow this.**

---

## Team Roster

| Name | Role | Responsibilities |
|------|------|-----------------|
| **A** | Architect + Repo Owner + Integrator | Repo setup, branch rules, DB schema design, API contracts, final merges, last-mile debugging, keeping everyone unblocked |
| **D** | Backend + DB Implementer | Database schema, CRUD APIs, Auth, backend debugging |
| **S** | Frontend Implementation | UI components, hooking frontend to backend, UI bugs, dark/light mode |
| **J** | Product + Presentation + UX | Problem statement doc, user flow diagrams, PPT/demo story, Q&A prep, optional AI/chatbot feature |

---

## Git Workflow (READ THIS. FOLLOW THIS.)

### Branches
| Branch | Purpose | Who pushes |
|--------|---------|-----------|
| `main` | Stable, demo-ready code ONLY | A merges from `dev` |
| `dev` | Integration branch | A merges feature branches here |
| `feat-*` / `fix-*` | Your working branches | Everyone |

### ⛔ Rules
1. **Nobody pushes directly to `main`. Not even A.**
2. **Nobody pushes directly to `dev`.** You push your feature branch → tell A → A merges.
3. **Commit often.** Small commits > one giant commit.
4. **Pull before you branch.** Always.

### Your Workflow (Every. Single. Time.)
```bash
# 1. Make sure you're on dev and up to date
git checkout dev
git pull origin dev

# 2. Create your feature branch
git checkout -b feat-your-feature-name

# 3. Do your work. Commit often.
git add .
git commit -m "feat: short description of what you did"

# 4. Push your branch
git push origin feat-your-feature-name

# 5. Tell A in the group chat: "feat-your-feature-name is ready to merge"
# A will review and merge into dev.
```

### Branch Naming Convention
```
feat-ui-course-list       ← new feature, frontend
feat-api-courses          ← new feature, backend
feat-db-schema            ← database work
fix-navbar-mobile         ← bug fix
feat-quiz-builder         ← feature work
```

### Commit Message Format
```
feat: add course listing page
fix: navbar not scrolling on mobile  
style: update card hover animation
refactor: extract auth context
docs: update team instructions
```

---

## Tech Stack

| What | Tech | Notes |
|------|------|-------|
| Frontend | React 19 + TypeScript | Already set up |
| Styling | Tailwind CSS (CDN) | Colors defined in index.html |
| Icons | lucide-react | `import { IconName } from 'lucide-react'` |
| Routing | react-router-dom | **NEEDS TO BE INSTALLED** |
| State | React Context API | For auth + global state |
| Build | Vite | `npm run dev` → localhost:3000 |
| Backend | TBD (D decides) | Supabase recommended for speed |

### To run the project locally:
```bash
# 1. Clone the repo
git clone <repo-url>
cd LearnSphere

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

---

## Design System (EVERYONE MUST FOLLOW THIS)

**Do NOT invent your own colors or spacing.** Use these:

### Colors
```
Primary (Sage Green):
  brand-500: #5c7f4c  ← main brand color
  brand-600: #46623a  ← hover states
  brand-700: #384e2f  ← dark buttons
  brand-800: #2f3e29  ← card bg (dark mode)
  brand-900: #263323  ← text / dark bg

Backgrounds:
  nature-light: #E6E8D6  ← main page bg (light mode)
  nature-card:  #F3F4ED  ← card bg (light mode)

Dark mode: use dark: prefix with brand-800/900/950
```

### Typography
- **Font:** Inter (already loaded)
- **Headings:** `font-bold` or `font-extrabold`
- **Body:** `text-sm` or `text-base`
- **Labels:** `text-xs font-bold uppercase tracking-wider`

### Components
- **Buttons:** `rounded-full` or `rounded-xl`, `bg-brand-700 text-white hover:bg-brand-600`
- **Cards:** `rounded-xl` or `rounded-2xl`, `bg-nature-card dark:bg-brand-800`
- **Inputs:** `rounded-xl border border-brand-200 dark:border-brand-700`
- **Modals:** `rounded-3xl` with `backdrop-blur-sm` overlay

### Dark Mode
Every component MUST have dark mode variants. Example:
```tsx
<div className="bg-nature-card text-brand-900 dark:bg-brand-800 dark:text-white">
```

---

## Task Assignments

### D — Backend + DB (Start IMMEDIATELY)

**Hour 0–3: Database**
- [ ] Set up Supabase project (or chosen backend)
- [ ] Create database schema (tables below)
- [ ] Seed with test data (at least 5 courses, 10 lessons, 2 quizzes)
- [ ] Share connection credentials with A

**Hour 3–8: Core APIs**
- [ ] Auth: signup, login, get current user, role check
- [ ] Courses: CRUD (create, read, update, delete, list published)
- [ ] Lessons: CRUD (create, read, update, delete per course)
- [ ] Enrollments: enroll user, get user enrollments, update progress

**Hour 8–14: Advanced APIs**
- [ ] Quizzes: CRUD for quizzes + questions + options
- [ ] Quiz attempts: submit attempt, calculate score, award points
- [ ] Reviews: add review, list reviews per course
- [ ] Reporting: get enrollment stats per course

**Database Tables You Need:**
```
users, courses, lessons, lesson_attachments, quizzes, 
quiz_questions, quiz_options, quiz_rewards, enrollments, 
lesson_progress, quiz_attempts, reviews
```

> Ask A for the full schema — it's in PROJECT_PLAN.md

---

### S — Frontend (Start after initial commit)

**Hour 0–2: Setup**
- [ ] Pull repo, run `npm install`, verify `npm run dev` works
- [ ] Install `react-router-dom`: tell A or install on your branch
- [ ] Set up basic routing in App.tsx (A will guide the structure)

**Hour 2–6: Learner Pages (most visible for demo)**
- [ ] Course listing page (`/courses`) — grid of cards with search
- [ ] Course detail page (`/courses/:id`) — overview + lesson list + progress bar
- [ ] My Courses page (`/my-courses`) — learner dashboard with profile panel

**Hour 6–10: More Learner Pages**
- [ ] Full-screen lesson player (`/courses/:id/learn`) — sidebar + viewer area
- [ ] Quiz flow inside player — intro screen + one question per page
- [ ] Ratings & Reviews tab on course detail page

**Hour 10–14: Instructor/Admin Pages**
- [ ] Instructor dashboard (`/admin/courses`) — course list (table/cards)
- [ ] Course form (`/admin/courses/:id`) — edit fields + tabs
- [ ] Lesson editor popup (add/edit lesson inside course form)

**Hour 14+: Polish**
- [ ] Wire everything to real API (when D has them ready)
- [ ] Dark mode on all new pages
- [ ] Mobile responsive fixes
- [ ] Points/Badges display on learner profile

**Important for S:**
- Use mock data from `constants.ts` until D's APIs are ready
- Match the existing design system EXACTLY (see colors above)
- Every component needs `dark:` variants
- Ask A before creating new top-level files — follow the folder structure

---

### J — Product + Presentation

**Hour 0–4: Documentation**
- [ ] Write problem statement interpretation (your words, not copy-paste)
- [ ] Create user flow diagrams (can use Figma, draw.io, or even hand-drawn)
  - Learner flow: Browse → Enroll → Learn → Quiz → Complete
  - Instructor flow: Create Course → Add Lessons → Add Quiz → Publish → View Reports
- [ ] Start PPT skeleton (title slide, problem, solution, architecture, demo, Q&A)

**Hour 4–10: Demo Story**
- [ ] Write the demo script: what screens we show, in what order, what we say
- [ ] Prepare for judge Q&A:
  - "Why this architecture?"
  - "How does progress tracking work?"
  - "How does the quiz scoring/badge system work?"
  - "What would you do differently with more time?"
- [ ] Optional: Wire up a chatbot/AI feature (using Gemini API — key is in .env.local)

**Hour 10+: Polish**
- [ ] Final PPT with screenshots of working app
- [ ] Practice the demo walkthrough
- [ ] Prepare backup talking points in case something breaks during demo

---

## Communication Rules

1. **Use the group chat for everything.** No DMs for project stuff.
2. **When you finish a feature:** Post in chat → `"feat-branch-name ready to merge — does X, Y, Z"`
3. **When you're blocked:** Post IMMEDIATELY. Don't sit on it for an hour.
4. **When you break something:** Tell A. Don't try to hide it.
5. **Every 3 hours:** Quick status update in chat. What you did, what you're doing next, any blockers.

---

## Folder Structure (Where to put things)

```
LearnSphere/
├── components/           → Reusable UI components
│   ├── ui/               → Buttons, Inputs, Modals (shared)
│   ├── layout/           → Navbar, Footer, Sidebar, AdminShell
│   ├── Navbar.tsx         (exists)
│   ├── Hero.tsx           (exists)
│   ├── CourseCard.tsx     (exists)
│   └── ...
├── pages/                → Full page components (one per route)
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── CourseList.tsx
│   ├── CourseDetail.tsx
│   ├── LessonPlayer.tsx
│   └── admin/
│       ├── Dashboard.tsx
│       ├── CourseForm.tsx
│       └── Reporting.tsx
├── context/              → React Context providers
│   └── AuthContext.tsx
├── hooks/                → Custom React hooks
├── lib/                  → Utilities, API client, Supabase init
├── types.ts              → ALL TypeScript types go here
├── constants.ts          → Mock data
├── App.tsx               → Router setup
└── index.tsx             → Entry point (don't touch)
```

**Rule: If you're not sure where a file goes, ASK A.**

---

## Emergency Protocols

### "The backend isn't ready"
→ Use mock data. The frontend should NEVER be blocked by backend. Build with fake data, swap later.

### "Git merge conflict"
→ Don't panic. Tell A. A will resolve it. Do NOT force push.

### "Something is broken and I don't know why"
→ `git stash` your changes. `git checkout dev`. `git pull`. See if dev is clean. Tell A.

### "We're running out of time"
→ A decides what gets cut. Priority: working learner flow > working instructor flow > polish > nice-to-haves.

---

## The One Rule That Matters Most

**A working demo with 60% of features beats a broken demo with 100% of features.**

Ship what works. Cut what doesn't. Demo confidently.

Let's go. 🚀
