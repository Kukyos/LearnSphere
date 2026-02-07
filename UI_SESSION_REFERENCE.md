# LearnSphere — UI Session Reference

> **Created:** 2026-02-07  
> **Purpose:** Complete reference for next UI update session  
> **Last Session:** DomeGallery implementation, theme unification, admin removal

---

## 1. Recent Changes Summary

### What Was Implemented
1. **DomeGallery Component** — Replaced WorldGlobe on login page
2. **Theme Unification** — Removed dual light/dark theme system, kept single light theme
3. **Admin Role Removal** — Removed admin from login role selector
4. **Login Page Refinements** — Smooth gradient transitions, light-themed backgrounds

### Branch Status
- **Feature Branch:** `feat/noAdmin/globe/theme`
  - 26 files changed (+1,265 -382)
  - Pushed to remote: [Create PR](https://github.com/Kukyos/LearnSphere/pull/new/feat/noAdmin/globe/theme)
- **Current Branch:** `main` (synced with remote)
- **Backend Added:** Server infrastructure (Node.js/Express, PostgreSQL schema, controllers, routes)

---

## 2. DomeGallery Component

### Location & Files
- **Component:** [components/visuals/DomeGallery.tsx](components/visuals/DomeGallery.tsx) (709 lines)
- **Styles:** [components/visuals/DomeGallery.css](components/visuals/DomeGallery.css) (236 lines)
- **Integration:** Used in [pages/Login.tsx](pages/Login.tsx)

### Component Details

**Purpose:** Interactive 3D dome displaying 12 course thumbnail images in a spherical tiled layout

**Current Configuration:**
```tsx
<DomeGallery
  overlayBlurColor="#e3e8dc"  // Light sage overlay
  grayscale={true}             // B&W images
  fit={0.32}                   // Dome size (was 0.55, reduced to 0.32)
  imageBorderRadius="12px"     // Rounded tile corners
  dragDampening={2}            // Drag resistance
  segments={25}                // Number of sphere segments (was 35)
/>
```

**Key Features:**
- **Auto-rotation:** Spins slowly when idle (0.0015 rad/frame on X/Y axes)
- **Drag interaction:** User can drag to rotate, with inertia physics
- **NO click interaction:** Removed click-to-enlarge feature (was in original implementation)
- **Tiles:** 12 default course thumbnails, separated with visible gaps

**Technical Architecture:**
```typescript
// Tile Grid Generation (buildItems function)
- X columns: [-37, -34, -31, -28, -25, -22, -19, -16] (x-step = 3)
- Y rows: Alternating between:
  - Even x: [-5, -2, 1, 4]
  - Odd x: [-3.5, -0.5, 2.5, 5.5]
- Total: ~32 tiles with visible spacing
- Tile size factor: 0.13 (--tile-w: calc(var(--radius) * 0.13 * var(--item-size-x)))
```

**Gesture Handling:**
```typescript
useGesture({
  onDrag: ({ offset: [x, y] }) => {
    rotRef.current = [
      -y / 300,
      x / 300,
      rotRef.current[2]
    ];
  }
}, { target: containerRef, drag: { filterTaps: true } });
```

**CSS Theming:**
```css
--overlay-blur-color: #e3e8dc; /* Light sage */
.dome-gallery { background: var(--background-color, #F9FAFA); }
.item__image { filter: grayscale(100%); cursor: default; }
```

**Removed Features:**
- ❌ `onClick` handler (no click-to-enlarge)
- ❌ `onPointerUp` handler
- ❌ `role="button"` attribute
- ❌ `tabIndex={0}` for keyboard navigation
- ❌ Cursor pointer (now `cursor: default`)

---

## 3. Theme System Changes

### What Was Removed
1. **Tailwind Configuration:**
   - Removed `darkMode: 'class'` from [index.html](index.html) script config
   
2. **Theme Toggle UI:**
   - Removed Sun/Moon button from [components/Navbar.tsx](components/Navbar.tsx)
   - Removed `handleThemeToggle` function with View Transition API
   
3. **App Context State:**
   - Removed `theme: 'light' | 'dark'` from [src/contexts/AppContext.tsx](src/contexts/AppContext.tsx)
   - Removed `toggleTheme: () => void` function
   - Removed theme sync `useEffect` (DOM class management)
   
4. **Dark Mode CSS:**
   - Removed View Transition CSS from [index.html](index.html):
     ```css
     /* REMOVED */
     ::view-transition-old(root),
     ::view-transition-new(root) { animation-duration: 0.35s; }
     html::view-transition-group(root) { animation-duration: 0.35s; }
     ```
   
5. **Dark Classes (Bulk Removal):**
   - **~350+ `dark:` classes removed** from 20 files via PowerShell regex
   - Pattern: `\s+dark:[a-zA-Z0-9_\-\[\]\/\.#%:]+`
   - Files affected:
     - [components/Navbar.tsx](components/Navbar.tsx)
     - [components/Hero.tsx](components/Hero.tsx)
     - [components/StatsSection.tsx](components/StatsSection.tsx)
     - [pages/Landing.tsx](pages/Landing.tsx)
     - [pages/LearnerHome.tsx](pages/LearnerHome.tsx)
     - [pages/Login.tsx](pages/Login.tsx)
     - [src/pages/ReportingDashboard.tsx](src/pages/ReportingDashboard.tsx)
     - [src/pages/QuizBuilder.tsx](src/pages/QuizBuilder.tsx)
     - [src/pages/LessonPlayerPage.tsx](src/pages/LessonPlayerPage.tsx)
     - [src/pages/CourseDetailPage.tsx](src/pages/CourseDetailPage.tsx)
     - [src/pages/MyCoursesPage.tsx](src/pages/MyCoursesPage.tsx)
     - [src/pages/course/CourseForm.tsx](src/pages/course/CourseForm.tsx)
     - [src/components/ProfileDrawer.tsx](src/components/ProfileDrawer.tsx)
     - [src/components/course-form/tabs/ContentTab.tsx](src/components/course-form/tabs/ContentTab.tsx)
     - [src/components/course-form/tabs/DescriptionTab.tsx](src/components/course-form/tabs/DescriptionTab.tsx)
     - [src/components/course-form/tabs/OptionsTab.tsx](src/components/course-form/tabs/OptionsTab.tsx)
     - [src/components/course-form/tabs/QuizTab.tsx](src/components/course-form/tabs/QuizTab.tsx)
     - [src/components/course-form/modals/PreviewModal.tsx](src/components/course-form/modals/PreviewModal.tsx)
     - [src/components/course-form/modals/ContactAttendeeModal.tsx](src/components/course-form/modals/ContactAttendeeModal.tsx)
     - [src/components/course-form/modals/AddAttendeeModal.tsx](src/components/course-form/modals/AddAttendeeModal.tsx)

### Current Theme Approach
**Unified Light Theme ONLY** — Blended sage/olive green palette

**Color Tokens:**
```css
/* Primary Brand (Sage Green) */
brand-50:  #f4f6f0   /* Lightest */
brand-100: #e3e8dc   /* Card backgrounds, overlays */
brand-200: #c8d4be   /* Light sage */
brand-300: #a3b896
brand-400: #7e9a6e
brand-500: #5c7f4c   /* Primary green */
brand-600: #46623a
brand-700: #384e2f   /* Button hovers */
brand-800: #2f3e29
brand-900: #263323   /* Dark text */
brand-950: #131b11

/* Semantic Colors */
nature-light:  #E6E8D6  /* Main background */
nature-card:   #F3F4ED  /* Card backgrounds */
nature-accent: #D9DCD6  /* Accents */
nature-dark:   #1F2922   /* Dark elements */
```

**Usage Examples:**
```tsx
// Backgrounds
<div className="bg-nature-light">        {/* Main page */}
<div className="bg-nature-card">         {/* Cards */}
<div className="bg-brand-100/60">        {/* Subtle overlay */}

// Text
<h1 className="text-brand-900">          {/* Headings */}
<p className="text-brand-700">           {/* Body text */}
<span className="text-brand-500">        {/* Muted text */}

// Buttons
<button className="bg-brand-700 hover:bg-brand-600 text-white">
<button className="bg-brand-200/60 text-brand-900 hover:bg-brand-200">

// Borders
<div className="border border-brand-200">
<input className="border-brand-300 focus:border-brand-500">
```

---

## 4. Login Page Changes

### Location
[pages/Login.tsx](pages/Login.tsx) (340 lines)

### Changes Made

**1. Admin Role Removed:**
```typescript
// OLD
const roles = ['learner', 'instructor', 'admin'];

// NEW
const roles = ['learner', 'instructor'];

// Removed admin-specific signup conditional
```

**2. DomeGallery Integration:**
```tsx
// OLD
import WorldGlobe from '../components/visuals/WorldGlobe';
<WorldGlobe />

// NEW
import DomeGallery from '../components/visuals/DomeGallery';
<DomeGallery
  overlayBlurColor="#e3e8dc"
  grayscale={true}
  fit={0.32}
  imageBorderRadius="12px"
  dragDampening={2}
  segments={25}
/>
```

**3. Light Theme Throughout:**
```tsx
// Main container
<div className="min-h-screen bg-nature-light">

// Left panel (form)
<div className="bg-nature-light/50 backdrop-blur-sm">

// Right panel (dome)
<div className="bg-gradient-to-r from-nature-light/50 via-brand-100 to-brand-200">
  {/* Smooth gradient overlay - removes vertical line */}
  <div className="absolute inset-0 bg-gradient-to-r from-nature-light/95 via-nature-light/40 via-30% to-transparent to-50%"></div>
  <DomeGallery ... />
</div>
```

**4. Gradient Refinements:**
- **Problem:** Hard vertical color line between form and dome sections
- **Solution:** Two-layer gradient approach:
  1. Base gradient on right panel: `from-nature-light/50 via-brand-100 to-brand-200`
  2. Overlay gradient for smooth transition: `from-nature-light/95 via-nature-light/40 via-30% to-transparent to-50%`
- **Result:** Seamless blend from form area to dome area

**Current Layout Structure:**
```tsx
<div className="grid lg:grid-cols-2">
  {/* Left: Form Section (50% width on large screens) */}
  <div className="bg-nature-light/50">
    <div className="max-w-md mx-auto">
      {/* Logo, title, form inputs, role selector */}
    </div>
  </div>

  {/* Right: DomeGallery Section (50% width) */}
  <div className="relative bg-gradient-to-r from-nature-light/50 via-brand-100 to-brand-200">
    {/* Gradient overlay for smooth transition */}
    <div className="absolute inset-0 bg-gradient-to-r from-nature-light/95 via-nature-light/40 via-30% to-transparent to-50%"></div>
    {/* DomeGallery container */}
    <div className="relative">
      <DomeGallery ... />
    </div>
  </div>
</div>
```

---

## 5. Component Architecture Reference

### Current File Structure
```
d:\OdooSNS\
├── components/
│   ├── Navbar.tsx                  # Main nav (no theme toggle)
│   ├── Hero.tsx                    # Landing hero
│   ├── CourseCard.tsx              # Course display card
│   ├── FilterPanel.tsx             # Course filters
│   ├── StatsSection.tsx            # Stats display
│   ├── Footer.tsx                  # Site footer
│   ├── PixelBlast.tsx              # 3D pixel effect
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── visuals/
│       ├── WorldGlobe.tsx          # OLD - not used
│       ├── DomeGallery.tsx         # NEW - login page
│       └── DomeGallery.css         # Styling for dome
├── pages/
│   ├── Landing.tsx                 # Public homepage
│   ├── LearnerHome.tsx             # Learner dashboard
│   └── Login.tsx                   # Auth page (DomeGallery here)
├── src/
│   ├── components/
│   │   ├── ChatbotIcon.tsx
│   │   ├── ProfileDrawer.tsx
│   │   ├── course-form/
│   │   │   ├── modals/
│   │   │   │   ├── AddAttendeeModal.tsx
│   │   │   │   ├── ContactAttendeeModal.tsx
│   │   │   │   └── PreviewModal.tsx
│   │   │   └── tabs/
│   │   │       ├── ContentTab.tsx
│   │   │       ├── DescriptionTab.tsx
│   │   │       ├── OptionsTab.tsx
│   │   │       └── QuizTab.tsx
│   │   └── courses/
│   │       ├── CourseCard.tsx
│   │       ├── CourseTable.tsx
│   │       └── CreateCourseModal.tsx
│   ├── contexts/
│   │   └── AppContext.tsx          # Global state (no theme)
│   └── pages/
│       ├── CourseDetailPage.tsx
│       ├── CoursesDashboard.tsx
│       ├── CoursesPage.tsx
│       ├── LessonPlayerPage.tsx
│       ├── MyCoursesPage.tsx
│       ├── QuizBuilder.tsx
│       ├── ReportingDashboard.tsx
│       └── course/
│           └── CourseForm.tsx
├── context/
│   └── AuthContext.tsx
└── server/                         # NEW - Backend
    ├── controllers/
    ├── routes/
    └── schema.sql
```

### Navbar Component
**Location:** [components/Navbar.tsx](components/Navbar.tsx) (169 lines)

**Current State:**
- Floating pill navigation
- Role-based links (learner/instructor)
- Mobile responsive menu
- **NO theme toggle** (removed)

**Key Classes:**
```tsx
// Nav container
className="fixed top-4 left-1/2 -translate-x-1/2 bg-nature-card/80 backdrop-blur-md rounded-full px-6 py-3 border border-brand-200"

// Active link
className="bg-brand-200/60 text-brand-900 px-4 py-2 rounded-full"

// Inactive link
className="text-brand-700 hover:bg-brand-200/50 px-4 py-2 rounded-full"
```

### AppContext Component
**Location:** [src/contexts/AppContext.tsx](src/contexts/AppContext.tsx) (629 lines)

**Current State:**
- Global course management
- CRUD operations for courses, lessons, quizzes
- Progress tracking
- **NO theme state** (removed)

**Interface (Relevant Parts):**
```typescript
interface AppContextType {
  // Courses
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  // Lessons
  addLesson: (courseId: string, lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (courseId: string, lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, lessonId: string) => void;
  
  // Quiz (with reward rules)
  quizzes: Quiz[];
  // Quiz has: rewardRules: { attempt: number; points: number }[]
  
  // NO theme, NO toggleTheme
}
```

---

## 6. TypeScript Types Reference

### Course Type
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  websiteUrl?: string;
  responsibleUser?: string;
  visibility: 'everyone' | 'signed-in';
  accessRule: 'open' | 'invite-only' | 'paid';
  price?: number;
  isPublished: boolean;
  lessons?: Lesson[];
  progress?: number;
  rating?: number;
  reviewCount?: number;
}
```

### Lesson Type
```typescript
interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'image' | 'quiz';
  contentUrl: string;
  duration?: string;
  description?: string;
  allowDownload?: boolean;
  additionalAttachments?: Array<{
    type: 'file' | 'link';
    url: string;
    name: string;
  }>;
  completed?: boolean;
}
```

### Quiz Type
```typescript
interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  rewardRules: {
    attempt: number;
    points: number;
  }[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}
```

---

## 7. Known Issues & Improvements Needed

### Current Errors
1. **CoursesDashboard.tsx TypeScript Error:**
   - Pre-existing error (unrelated to recent changes)
   - Location: [src/pages/CoursesDashboard.tsx](src/pages/CoursesDashboard.tsx)
   - Status: Not blocking, needs investigation

### Potential UI Improvements
1. **DomeGallery:**
   - Consider adding custom course images (currently 12 defaults)
   - Possible dynamic image loading from actual course data
   - Performance optimization for large image sets

2. **Login Page:**
   - Consider adding forgot password flow
   - Social login integration (Google, GitHub)
   - Instructor/Learner onboarding tour

3. **Theme System:**
   - If dark mode needed in future, would require:
     - Re-adding `darkMode: 'class'` to Tailwind config
     - Re-adding theme state to AppContext
     - Re-adding ~350+ dark: classes across 20 files
   - Current decision: **Light theme only** for consistency

4. **Mobile Responsiveness:**
   - DomeGallery tested on desktop, needs mobile optimization
   - Login page grid switches to single column on mobile (already working)
   - Navbar mobile menu tested and working

---

## 8. Backend Infrastructure (New)

### What Was Added
After pulling from remote, the following backend structure appeared:

```
server/
├── controllers/          # API endpoint handlers
├── routes/               # Express route definitions
├── schema.sql            # PostgreSQL database schema
├── seed.js               # Database seeding script
└── (other backend files)
```

### Database Schema (PostgreSQL)
Located in [server/schema.sql](server/schema.sql)

**Tables:**
- `users` — User accounts (learner, instructor, admin)
- `courses` — Course information
- `lessons` — Lesson content
- `quizzes` — Quiz definitions
- `quiz_questions` — Individual questions
- `quiz_options` — Answer choices
- `enrollments` — User-course relationships
- `lesson_progress` — Completion tracking
- `reviews` — Course ratings/reviews

### API Service Layer
**Location:** [src/services/api.ts](src/services/api.ts)

**Purpose:** Frontend-to-backend communication layer

**Example Usage:**
```typescript
import { api } from '../services/api';

// Fetch courses
const courses = await api.getCourses();

// Get specific course
const course = await api.getCourse(courseId);

// Create course (instructor)
await api.createCourse(courseData);
```

---

## 9. Development Commands

### Running the Application
```bash
# Frontend dev server (Vite)
npm run dev
# Runs on: http://localhost:3002

# Backend server (if separate)
cd server
npm start
# Runs on: http://localhost:3001 (typical)
```

### Git Workflow
```bash
# Current branch
git branch
# Should show: * main

# Check feature branch
git branch -a
# Should show: remotes/origin/feat/noAdmin/globe/theme

# Create new feature branch
git checkout -b feat/your-feature-name

# View recent commits
git log --oneline -5
```

### Build & Preview
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 10. Next Session Action Items

### Immediate Tasks
1. **Review DomeGallery Performance:**
   - Test on different screen sizes
   - Check mobile rendering
   - Verify smooth drag/rotation

2. **Consider Backend Integration:**
   - Replace mock MOCK_COURSES data with API calls
   - Wire up course fetching in DomeGallery
   - Implement real authentication flow

3. **UI Polish Opportunities:**
   - Landing page refinements
   - Course card hover animations
   - Lesson player full-screen experience
   - Quiz builder UX improvements

4. **Responsive Design:**
   - Mobile navigation tweaks
   - Tablet layout optimizations
   - Touch gesture support for DomeGallery

### Future Features
- **Settings Page:** User preferences, profile editing
- **Notifications:** Course updates, quiz results
- **Search:** Global course search with filters
- **Analytics:** Learner progress charts, instructor insights
- **Accessibility:** ARIA labels, keyboard navigation improvements

---

## 11. Design System Quick Reference

### Spacing
```css
p-2:  8px    p-4:  16px   p-6:  24px   p-8:  32px
mb-2: 8px    mb-4: 16px   mb-8: 32px   mb-12: 48px
gap-4: 16px  gap-6: 24px  gap-8: 32px
```

### Border Radius
```css
rounded-lg:   8px    /* Small elements */
rounded-xl:   12px   /* Cards, inputs */
rounded-2xl:  16px   /* Large cards */
rounded-3xl:  24px   /* Modals */
rounded-full: 9999px /* Pills, buttons */
```

### Typography
```css
text-xs:   12px  (captions, labels)
text-sm:   14px  (small body)
text-base: 16px  (standard body)
text-lg:   18px  (large body)
text-xl:   20px  (card titles)
text-2xl:  24px  (small headings)
text-3xl:  30px  (medium headings)
text-4xl:  36px  (large headings)
text-5xl:  48px  (section headers)
text-6xl:  64px  (hero titles)
```

### Font Weights
```css
font-light:     300  (emphasis)
font-normal:    400  (body text)
font-medium:    500  (semi-bold)
font-semibold:  600  (buttons, labels)
font-bold:      700  (headings)
font-extrabold: 800  (hero text)
```

---

## 12. Critical File Paths

### Components
- **DomeGallery:** [components/visuals/DomeGallery.tsx](components/visuals/DomeGallery.tsx)
- **DomeGallery CSS:** [components/visuals/DomeGallery.css](components/visuals/DomeGallery.css)
- **Navbar:** [components/Navbar.tsx](components/Navbar.tsx)
- **Login Page:** [pages/Login.tsx](pages/Login.tsx)

### Context
- **App Context:** [src/contexts/AppContext.tsx](src/contexts/AppContext.tsx)
- **Auth Context:** [context/AuthContext.tsx](context/AuthContext.tsx)

### Config
- **Tailwind Config:** Embedded in [index.html](index.html) `<script>` tag
- **Vite Config:** [vite.config.ts](vite.config.ts)
- **TypeScript Config:** [tsconfig.json](tsconfig.json)

### Backend
- **API Service:** [src/services/api.ts](src/services/api.ts)
- **Database Schema:** [server/schema.sql](server/schema.sql)

---

## 13. Session Continuation Checklist

Before starting UI work, verify:
- [ ] On `main` branch and synced (`git status`, `git pull origin main`)
- [ ] Dev server running (`npm run dev` → localhost:3002)
- [ ] No TypeScript errors blocking development (`npm run build` or check VS Code)
- [ ] DomeGallery renders correctly on login page
- [ ] No dark: classes remain in codebase (`grep -r "dark:" --include="*.tsx"`)
- [ ] Admin role not in login selector
- [ ] Smooth gradient on login page (no vertical line)

When resuming work:
- [ ] Review this document fully
- [ ] Check [DEVELOPMENT_REFERENCE.md](DEVELOPMENT_REFERENCE.md) for design system
- [ ] Check [PROJECT_PLAN.md](PROJECT_PLAN.md) for feature roadmap
- [ ] Read recent commits: `git log --oneline -10`
- [ ] Create new feature branch for UI work: `git checkout -b feat/ui-{feature-name}`

---

## 14. Communication Protocol

### For Next Session
- **Start with:** "I'm continuing UI work from the last session. What should I focus on?"
- **Reference:** "Check UI_SESSION_REFERENCE.md for context"
- **Status updates:** Provide after each major UI change
- **Blocking issues:** Report immediately with file paths and error messages

### Key Phrases
- "DomeGallery" → 3D course thumbnail dome on login page
- "Theme unification" → Removed dark mode, light theme only
- "Admin removal" → No admin role in login/signup
- "Gradient refinement" → Smooth transition on login page

---

*This document contains everything needed to continue UI development exactly where the last session ended. Keep it updated as new UI features are implemented.*
