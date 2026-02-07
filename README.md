# LearnSphere

A full-stack Learning Management System (LMS) built with React, TypeScript, Express, and PostgreSQL. Supports three user roles — **Learner**, **Instructor**, and **Admin** — with course management, lesson delivery, quizzes, progress tracking, points/badges, ratings & reviews, and reporting dashboards.

---

## Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| Frontend | React 19 + TypeScript 5.8 | Vite 6 dev server, port 3000 |
| Styling | Tailwind CSS (CDN) | Custom sage green brand palette (`#5c7f4c`) |
| Icons | lucide-react | Used across all components |
| 3D/Visuals | Three.js, @use-gesture/react | PixelBlast hero + DomeGallery login |
| Animation | Framer Motion | Page transitions and UI animations |
| Backend | Express 4.21 + Node.js | REST API, port 5000 |
| Database | PostgreSQL 18 | 7 tables with full relational schema |
| Auth | JWT + bcrypt | 24h token expiry, 12 salt rounds |

---

## Features

### Learner
- Browse and search published courses
- Enroll in courses, track lesson progress
- Take quizzes and earn points/badges
- Leave star ratings and text reviews
- Personal dashboard with enrolled courses

### Instructor
- Create and manage courses with lessons
- Build quizzes with multiple-choice questions
- View reporting dashboard (enrollments, ratings, completion)
- Course visibility: draft, published, archived

### Admin
- Full platform management
- User management (list, update roles, delete)
- System-wide reporting dashboard
- Seeded account only (cannot register as admin)

---

## Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** 18 (or compatible version)
- **npm** (comes with Node.js)

---

## Setup & Installation

### 1. Clone & Install Frontend

```bash
git clone <repo-url>
cd LearnSphere
npm install
```

### 2. Set Up PostgreSQL Database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE learnsphere;"

# Run the schema (creates all 7 tables + indexes)
cd server
psql -U postgres -d learnsphere -f schema.sql
```

### 3. Configure Backend Environment

Create `server/.env` (or copy from `.env.example`):

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=learnsphere
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### 4. Install Backend Dependencies & Seed Admin

```bash
cd server
npm install
npm run seed    # Creates admin user: admin@learnsphere.com / Admin@123
```

### 5. Run the Application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

> **Important:** The backend must be running for login/register to work. There is no mock auth fallback.

---

## Default Admin Credentials

| Email | Password |
|-------|----------|
| `admin@learnsphere.com` | `Admin@123` |

---

## API Endpoints

### Auth (`/auth`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/auth/register` | Public | Register (learner/instructor only) |
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/forgot-password` | Public | Request password reset |
| POST | `/auth/reset-password` | Public | Reset password with token |
| GET | `/auth/profile` | Authenticated | Get current user profile |
| PUT | `/auth/profile` | Authenticated | Update profile (name, avatar) |
| PUT | `/auth/password` | Authenticated | Change password |
| GET | `/auth/users` | Admin | List all users |
| PUT | `/auth/users/:id/role` | Admin | Update user role |
| DELETE | `/auth/users/:id` | Admin | Delete user |

### Courses (`/courses`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/courses` | Public | List courses (role-scoped) |
| GET | `/courses/:id` | Public | Get course details + lessons |
| POST | `/courses` | Instructor/Admin | Create course |
| PUT | `/courses/:id` | Owner/Admin | Update course |
| DELETE | `/courses/:id` | Owner/Admin | Delete course |
| POST | `/courses/:id/lessons` | Instructor/Admin | Add lesson |
| PUT | `/courses/:id/lessons/:lid` | Instructor/Admin | Update lesson |
| DELETE | `/courses/:id/lessons/:lid` | Instructor/Admin | Delete lesson |
| PUT | `/courses/:id/quiz` | Instructor/Admin | Set quiz questions |

### Progress & Enrollment (`/api`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/enroll` | Authenticated | Enroll in course |
| GET | `/api/my-enrollments` | Authenticated | Get user's enrollments |
| POST | `/api/complete-lesson` | Authenticated | Mark lesson complete |
| GET | `/api/progress/:courseId` | Authenticated | Get course progress |
| POST | `/api/reviews` | Authenticated | Add review |
| GET | `/api/reviews/:courseId` | Public | Get course reviews |
| GET | `/api/reporting` | Instructor/Admin | Get reporting data |
| POST | `/api/award-points` | Authenticated | Award points to user |

---

## Project Structure

```
LearnSphere/
├── App.tsx                    # Main app with React Router
├── index.tsx                  # React entry point
├── index.html                 # HTML shell + Tailwind CDN config
├── constants.ts               # Mock course data (initial seed)
├── types.ts                   # TypeScript interfaces
├── vite.config.ts             # Vite configuration
├── package.json               # Frontend dependencies
│
├── components/                # Shared UI components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── CourseCard.tsx
│   ├── FilterPanel.tsx
│   ├── StatsSection.tsx
│   ├── Footer.tsx
│   ├── PixelBlast.tsx
│   ├── ui/                    # Design system (Button, Input)
│   └── visuals/               # DomeGallery, WorldGlobe
│
├── pages/                     # Top-level route pages
│   ├── Landing.tsx
│   ├── LearnerHome.tsx
│   └── Login.tsx
│
├── src/
│   ├── pages/                 # Feature pages
│   │   ├── course/            # Course form components
│   │   ├── CoursesDashboard.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── CourseDetailPage.tsx
│   │   ├── LessonPlayerPage.tsx
│   │   ├── MyCoursesPage.tsx
│   │   ├── QuizBuilder.tsx
│   │   ├── ReportingDashboard.tsx
│   │   └── SettingsPage.tsx
│   ├── contexts/
│   │   └── AppContext.tsx     # Global state + API integration
│   └── components/
│       ├── ChatbotIcon.tsx
│       ├── ProfileDrawer.tsx
│       └── courses/           # Course list sub-components
│
├── context/
│   └── AuthContext.tsx         # Authentication (JWT, no mock)
│
├── services/
│   └── api.ts                 # API client (all endpoints)
│
└── server/                    # Express backend
    ├── server.js              # Entry point
    ├── db.js                  # PostgreSQL pool
    ├── schema.sql             # Database schema (7 tables)
    ├── seed.js                # Admin seeder
    ├── .env                   # Environment config (not in git)
    ├── package.json           # Backend dependencies
    ├── controllers/
    │   ├── authController.js
    │   ├── courseController.js
    │   └── progressController.js
    ├── middleware/
    │   └── authMiddleware.js
    └── routes/
        ├── auth.js
        ├── courses.js
        └── progress.js
```

---

## Database Schema

7 tables: `users`, `password_reset_tokens`, `courses`, `lessons`, `quiz_questions`, `enrollments`, `lesson_progress`, `reviews`

See [server/schema.sql](server/schema.sql) for the full schema with indexes.

---

## Design System

- **Brand Color:** Sage green `#5c7f4c` with full 50–950 scale
- **Font:** Inter (Google Fonts)
- **Dark Mode:** Full support via Tailwind `dark:` prefix
- **Border Radius:** `rounded-full` (pills), `rounded-xl/2xl/3xl` (cards/modals)

See [DEVELOPMENT_REFERENCE.md](DEVELOPMENT_REFERENCE.md) for complete design tokens, component patterns, and usage rules.

---

## Team

| Name | Role |
|------|------|
| **A (Cleo)** | Architect, Tech Lead, Integrator |
| **D** | Backend & DB |
| **S** | Frontend Implementation |
| **J** | Product, UX, Presentation |

---

## License

MIT
