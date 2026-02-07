# LearnSphere — Development Reference Guide

> **Single Source of Truth** for all technical and design references.  
> **AI assistants: Reference this document** when generating code.  
> **Teammates: Keep this updated** as decisions are made.  
> **Last Updated:** 2026-02-07 — Theme unification, DomeGallery added

---

## 🚨 CRITICAL UPDATES (Feb 7, 2026)

### Theme System Changed
**Dark mode has been REMOVED.** The app now uses a **unified light theme only**.

**What this means for development:**
- ❌ **DO NOT** add `dark:` classes to any components
- ❌ **DO NOT** reference theme state or toggleTheme
- ✅ **USE** only light theme color classes (brand-*, nature-*)
- ✅ **ENSURE** all new components work with light background

### New Components
- **DomeGallery** — 3D interactive course thumbnail dome (components/visuals/)
- **Backend API** — Node.js/Express server with PostgreSQL (server/)
- **API Service** — Frontend API client (src/services/api.ts)

---

## 1. Package Dependencies

### Core Framework & Build
| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| `react` | ^19.2.4 | Core React framework | Use hooks, functional components |
| `react-dom` | ^19.2.4 | React DOM renderer | Client-side rendering |
| `react-router-dom` | ^6.x.x | Client-side routing | BrowserRouter, Routes, Route |
| `typescript` | ~5.8.2 | TypeScript compiler | Strict mode enabled |
| `vite` | ^6.2.0 | Build tool & dev server | `npm run dev` → localhost:3000 |

### UI & Styling
| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| `lucide-react` | ^0.563.0 | Icon library | All icons from here (BookOpen, Search, etc.) |
| `tailwindcss` | CDN | Utility-first CSS | Loaded via `<script>` in index.html, **NO darkMode config** |
| `three` | 0.160.0 | 3D graphics | For PixelBlast (Hero) and DomeGallery (Login) |
| `@use-gesture/react` | Latest | Gesture handling | Drag interactions for DomeGallery |
| `framer-motion` | ^12.x | Animation library | Page transitions, role selector animation |

### Development Tools
| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| `@types/node` | ^22.14.0 | Node.js types | For build scripts |
| `@vitejs/plugin-react` | ^5.0.0 | Vite React plugin | JSX/TSX compilation |

---

**⚠️ CRITICAL: Dark mode has been REMOVED. Use LIGHT theme colors ONLY.**

## 2. Color Scheme (MANDATORY)

### Brand Palette (Sage Green)
```css
/* Primary Brand Colors */
brand-50:  #f4f6f0   /* Lightest - card backgrounds, subtle elements */
brand-100: #e3e8dc   /* Light sage - secondary backgrounds */
brand-200: #c8d4be   /* Medium light - borders, accents */
brand-300: #a3b896   /* Light sage green */
brand-400: #7e9a6e   /* Medium sage */
brand-500: #5c7f4c   /* Primary brand color - main buttons, links */
brand-600: #46623a   /* Hover states - button hovers */
brand-700: #384e2f   /* Dark buttons - primary button hovers */
brand-800: #2f3e29   /* Dark backgrounds - cards in dark mode */
brand-900: #263323   /* Darkest - text, dark mode backgrounds */
brand-950: #131b11   /* Deep dark - darkest backgrounds */
```

### Semantic Colors
```css
/* Backgrounds */
nature-light: #E6E8D6   /* Main page background (light mode) */
nature-card:  #F3F4ED   /* Card backgrounds (light mode) */
nature-accent: #D9DCD6  /* Subtle accents */
nature-dark:   #1F2922   /* Dark mode main background */

/* Text Colors */
text-primary:   brand-900 dark:brand-50     /* Main headings */
text-secondary: brand-600 dark:brand-300   /* Body text */
text-muted:     brand-500 dark:brand-400   /* Muted text */
```NO dark mode variants** — do NOT use `dark:` prefix classes
- **Primary actions**: `bg-brand-700 hover:bg-brand-600 text-white`
- **Secondary actions**: `border border-brand-200 bg-white hover:bg-brand-50 text-brand-700`
- **Success states**: Use brand greens
- **Error states**: `text-red-600`
- **Backgrounds**: `bg-nature-light` for pages, `bg-nature-card` for cardsand-800 dark:text-white`
- **Primary actions**: `bg-brand-700 hover:bg-brand-600 text-white`
- **Secondary actions**: `border border-brand-200 bg-white hover:bg-brand-50 text-brand-700`
- **Success states**: Use brand greens
- **Error states**: `text-red-600 dark:text-red-400`

---

## 3. Typography System

### Font Family
- **Primary**: `font-sans` (Inter from Google Fonts)
- **Fallback**: System font stack

### Font Sizes & Weights
```css
/* Headings */
text-6xl: 4rem (64px)   /* Hero titles */
text-5xl: 3rem (48px)   /* Section headers */
text-4xl: 2.25rem (36px) /* Large headings */
text-3xl: 1.875rem (30px) /* Medium headings */
text-2xl: 1.5rem (24px)  /* Small headings */
text-xl: 1.25rem (20px)  /* Card titles */

/* Body Text */
text-lg: 1.125rem (18px) /* Large body */
text-base: 1rem (16px)   /* Standard body */
text-sm: 0.875rem (14px) /* Small body */
text-xs: 0.75rem (12px)  /* Captions, labels */
```

### Font Weights
- `font-light`: 300 (serif elements, emphasis)
- `font-normal`: 400 (body text)
- `font-medium`: 500 (semi-bold text)
- `font-semibold`: 600 (buttons`
- **Body**: `text-brand-700`
- **Muted**: `text-brand-500`
- **Links**: `text-brand-600 hover:text-brand-7
### Text Color Rules
- **Headings**: `text-brand-900 dark:text-white`
- **Body**: `text-brand-700 dark:text-brand-200`
- **Muted**: `text-brand-500 dark:text-brand-400`
- **Links**: `text-brand-600 hover:text-brand-700 dark:text-brand-300`

---

## 4. Component Patterns

### Button Variants
```tsx
// Primary Button
<button className="bg-brand-700 hover:bg-brand-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">
  Action
</button>

// Secondary Button
<button className="border border-brand-200 bg-white hover:bg-brand-50 text-brand-700 font-bold py-3 px-6 rounded-xl transition-colors">
  Action
</button>

// Small Button
<button className="bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2 px-4 rounded-lg text-sm">
  Action
</button>
```

### Card Patternsrounded-xl p-6 shadow-sm border border-brand-100">
  <h3 className="text-xl font-bold text-brand-900 mb-4">Title</h3>
  <p className="text-brand-700">Content</p>
</div>

// Hover Card
<div className="bg-nature-card rounded-xl p-6 shadow-sm hover:shadow-md border border-brand-100 transition-shadow">
  {/* Content */}
</div>
```

### Form Elements
```tsx
// Input Field
<input
  type="text"
  className="w-full px-4 py-3 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder-brand-400 focus:ring-2 focus:ring-brand-300 focus:border-transparent transition-colors"
  placeholder="Enter text..."
/>

// Select Dropdown
<select className="w-full px-4 py-3 rounded-xl border border-brand-200 bg-white text-brand-900 focus:ring-2 focus:ring-brand-300 focus:border-transparent">
  <option>Option 1</option>
</select>
```

### Modal/Dialog Pattern
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
  <div className="w-full max-w-md rounded-3xl bg-nature-card border border-brand-100 shadow-2xl">
    <div className="p-8">
      {/* Modal content */}
    </div>
  </div>
</div>
```

### DomeGallery Pattern (NEW)
```tsx
import DomeGallery from '../components/visuals/DomeGallery';
import '../components/visuals/DomeGallery.css';

// In component
<DomeGallery
  overlayBlurColor="#e3e8dc"  // Light sage overlay
  grayscale={true}             // B&W images
  fit={0.32}                   // Dome size (0-1 range)
  imageBorderRadius="12px"     // Tile border radius
  dragDampening={2}            // Drag resistance
  segments={25}                // Sphere segments (detail level)
/>
```

**DomeGallery Features:**
- Auto-rotation when idle
- Drag-to-rotate with physics
- 12 default course thumbnails in spherical layout
- Light theme CSS variables
- No click interaction (drag-only) </div>
  </div>
</div>
```

---

## 5. Layout & Spacing

### Container Widths
- **Full width**: No container (hero sections)
- **Standard**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Narrow**: `max-w-4xl mx-auto px-4 sm:px-6`
- **Card**: `max-w-md` or `max-w-lg`

### Spacing Scale
- `p-2`: 0.5rem (8px) — tight padding
- `p-4`: 1rem (16px) — standard padding
- `p-6`: 1.5rem (24px) — card padding
- `p-8`: 2rem (32px) — section padding
- `mb-4`: 1rem (16px) — standard margin
- `mb-8`: 2rem (32px) — section spacing
- `mb-12`: 3rem (48px) — large spacing

### Grid Systems
```tsx
// 2-column grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

// 3-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Sidebar + Content
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  <aside className="lg:col-span-1">Sidebar</aside>
  <main className="lg:col-span-3">Content</main>
</div>
```

---

## 6. File Structure (MANDATORY)

```
/ (root)
├── components/           # Shared/reusable components
│   ├── ui/               # Design system components (Button, Input, Modal)
│   ├── layout/           # Layout components (Navbar, Footer, Sidebar)
│   └── ...               # Feature-specific components
├── pages/                # Route-level page components
│   ├── Landing.tsx       # / route
│   ├── Login.tsx         # /login route
│   ├── CourseList.tsx    # /courses route (learner)
│   └── admin/            # Admin pages
│       ├── Dashboard.tsx # /admin/courses
│       └── ...
├── context/              # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   └── CourseContext.tsx # Course-related state
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, API client, constants
│   ├── api.ts            # API functions
│   ├── supabase.ts       # Database client
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
├── constants.ts          # App-wide constants
├── App.tsx               # Router setup only
└── index.tsx             # React root render
```

### File Naming Conventions
- **Components**: `PascalCase.tsx` (CourseCard, UserProfile)
- **Pages**: `PascalCase.tsx` (Landing, CourseDetail)
- **Hooks**: `useCamelCase.ts` (useAuth, useCourses)
- **Utils**: `camelCase.ts` (apiClient, formatDate)
- **Types**: `PascalCase.ts` (User, Course)

---

## 7. State Management Patterns

### Local State (useState)
```tsx
const [isLoading, setIsLoading] = useState(false);
const [courses, setCourses] = useState<Course[]>([]);
const [searchQuery, setSearchQuery] = useState('');
```

### Context Pattern (Global State)
```tsx
// AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // API call
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Custom Hooks
```tsx
// hooks/useCourses.ts
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, refetch: fetchCourses };
};
```

---

## 8. API Patterns (When Backend Ready)

### API Client Structure
```tsx
// lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Courses
  async getCourses() {
    return this.request<Course[]>('/courses');
  }

  async getCourse(id: string) {
    return this.request<Course>(`/courses/${id}`);
  }

  async createCourse(course: Partial<Course>) {
    return this.request<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  }

  // Auth
  async login(credentials: { email: string; password: string }) {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}

export const api = new ApiClient(API_BASE);
```

### React Query/SWR Pattern (Future)
```tsx
// When we add React Query
import { useQuery, useMutation } from '@tanstack/react-query';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: api.getCourses,
  });
};

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: api.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
```

---

## 9. Error Handling

### Component Error Boundaries
```tsx
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling
```tsx
const handleApiCall = async () => {
  try {
    setLoading(true);
    const result = await api.someCall();
    // Handle success
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        // Redirect to login
        navigate('/login');
      } else {
        setError(error.message);
      }
    }
  } finally {
    setLoading(false);
  }
};
```

---

## 10. Testing Patterns (Future)

### Component Testing (Jest + React Testing Library)
```tsx
// __tests__/CourseCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CourseCard from '../components/CourseCard';

const mockCourse = {
  id: '1',
  title: 'Test Course',
  description: 'A test course',
  // ... other properties
};

describe('CourseCard', () => {
  it('renders course information', () => {
    render(<CourseCard course={mockCourse} onPreview={() => {}} />);
    
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('A test course')).toBeInTheDocument();
  });

  it('calls onPreview when preview button is clicked', () => {
    const mockOnPreview = jest.fn();
    render(<CourseCard course={mockCourse} onPreview={mockOnPreview} />);
    
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);
    
    expect(mockOnPreview).toHaveBeenCalledWith(mockCourse);
  });
});
```

---

## 11. Performance Guidelines

### Image Optimization
```tsx
// Use responsive images with proper sizing
<img
  src={`/images/course-${course.id}.jpg`}
  srcSet={`/images/course-${course.id}-small.jpg 480w, /images/course-${course.id}-medium.jpg 768w, /images/course-${course.id}-large.jpg 1024w`}
  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
  alt={course.title}
  className="w-full h-48 object-cover rounded-lg"
  loading="lazy"
/>
```

### Code Splitting
```tsx
// Lazy load route components
const CourseDetail = lazy(() => import('../pages/CourseDetail'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));

// In router
<Route path="/courses/:id" element={
  <Suspense fallback={<div>Loading...</div>}>
    <CourseDetail />
  </Suspense>
} />
```

### Memoization
```tsx
// Memoize expensive computations
const filteredCourses = useMemo(() => {
  return courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [courses, searchQuery]);

// Memoize components
const CourseCard = memo(({ course, onPreview }: CourseCardProps) => {
  // Component logic
});
```

---

## 12. Accessibility Guidelines

### Semantic HTML
```tsx
// Use proper heading hierarchy
<h1>Main Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// Use semantic elements
<main>        {/* Main content */}
<section>     {/* Content sections */}
<article>     {/* Independent content */}
<aside>       {/* Sidebar content */}
<nav>         {/* Navigation */}
<header>      {/* Page/section header */}
<footer>      {/* Page/section footer */}
```

### ARIA Labels
```tsx
// Add labels for screen readers
<button aria-label="Close modal" onClick={closeModal}>
  <X size={20} />
</button>

// Describe form fields
<input
  type="email"
  aria-describedby="email-help"
  placeholder="Enter your email"
/>
<p id="email-help" className="sr-only">
  We'll use this email to send you course updates
</p>
```

### Keyboard Navigation
```tsx
// Ensure focus management
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      {children}
    </div>
  );
};
```

---

## 13. Deployment & Environment

### Environment Variables
```bash
# .env.local (local development)
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# .env.production (production)
VITE_API_URL=https://api.learnsphere.com
VITE_SUPABASE_URL=your-prod-supabase-url
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
```

### Build Commands
```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "type-check": "tsc --noEmit"
  }
}
```

### Deployment Checklist
- [ ] Run `npm run build` successfully
- [ ] Test build output locally with `npm run preview`
- [ ] Ensure all environment variables are set
- [ ] Check that API endpoints work in production
- [ ] Verify responsive design on different screen sizes
- [ ] Test accessibility with screen reader
- [ ] Check loading performance (Lighthouse)

---

## 14. Code Quality Standards

### ESLint Configuration (Future)
```json
// .eslintrc.json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

### Pre-commit Hooks (Future)
```json
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run type-check
npm run lint
npm run test
```

---

## 15. Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Core functionality works without JavaScript
- CSS Grid and Flexbox fallbacks for older browsers
- View Transitions API with fallback (already implemented in theme toggle)

---

## 16. Security Considerations

### Input Validation
```tsx
// Client-side validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize user input
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
```

### Authentication Security
- Never store sensitive data in localStorage
- Use HTTP-only cookies for tokens (when backend ready)
- Implement proper logout on token expiry
- Validate all API responses

---

## Quick Reference Commands

### Development
```bash
npm install          # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Git Workflow
```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-feature
# Work on feature
git add .
git commit -m "feat: description"
git push origin feat/your-feature
# Tell A to merge
```

### File Structure Check
- Components in `components/`
- Pages in `pages/`
- Types in `types/`
- Utils in `lib/`

---

*This document is the single source of truth. Update it as decisions are made. AI assistants must reference this for all code generation.*
