import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseCard from './components/CourseCard';
import ExpandedCourseCard from './components/ExpandedCourseCard';
import LessonPlayer from './components/LessonPlayer';
import StatsSection from './components/StatsSection';
import Footer from './components/Footer';
import { MOCK_COURSES } from './constants';
import { Course } from './types';
import { BookOpen, ChevronRight, X } from 'lucide-react';

type ViewState = 'landing' | 'player';

interface HoverState {
  course: Course;
  rect: DOMRect;
}

const App: React.FC = () => {
  // Theme State
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // Hover Overlay State
  const [hoveredCourse, setHoveredCourse] = useState<HoverState | null>(null);

  // Initialize Theme
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
    const isDarkNow = document.documentElement.classList.contains('dark');
    const root = document.documentElement;

    if (!(document as any).startViewTransition) {
        if (isDarkNow) {
            root.classList.remove('dark');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            setIsDark(true);
        }
        return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
        if (isDarkNow) {
            root.classList.remove('dark');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            setIsDark(true);
        }
    });

    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        
        document.documentElement.animate(
            {
                clipPath: isDarkNow ? [...clipPath].reverse() : clipPath,
            },
            {
                duration: 400,
                easing: 'ease-in-out',
                pseudoElement: isDarkNow
                    ? '::view-transition-old(root)'
                    : '::view-transition-new(root)',
            }
        );
    });
  };

  const handleHover = (course: Course, rect: DOMRect) => {
    // Only set hover if we are not already hovering this course to prevent loops/jitters
    if (hoveredCourse?.course.id !== course.id) {
        setHoveredCourse({ course, rect });
    }
  };

  const handlePlay = (course: Course) => {
      setHoveredCourse(null);
      setActiveCourse(course);
      setCurrentView('player');
      window.scrollTo(0,0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Navigating to search results for: ${searchQuery}`);
  };

  // Group Courses Logic
  const popularCourses = useMemo(() => [...MOCK_COURSES].sort((a, b) => b.enrollmentCount - a.enrollmentCount), []);
  const newCourses = useMemo(() => [...MOCK_COURSES].reverse(), []);
  const devCourses = useMemo(() => MOCK_COURSES.filter(c => c.category === 'Development' || c.category === 'Data Science'), []);
  const creativeCourses = useMemo(() => MOCK_COURSES.filter(c => c.category === 'Design' || c.category === 'Photography'), []);
  const businessCourses = useMemo(() => MOCK_COURSES.filter(c => c.category === 'Business' || c.category === 'Marketing'), []);

  // Generic Row Component
  const CourseRow = ({ title, courses }: { title: string, courses: Course[] }) => {
    if (courses.length === 0) return null;
    return (
        <section className="mb-12 relative z-0"> 
            <div className="mb-4 flex items-end justify-between px-4 sm:px-8 group">
                <h2 className="text-xl font-bold text-brand-900 dark:text-white sm:text-2xl group-hover:text-brand-600 transition-colors cursor-pointer">{title}</h2>
                <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-400 hover:text-brand-600 dark:hover:text-white transition-colors">
                    View all <ChevronRight size={14} />
                </button>
            </div>
            
            {/* Added extra padding-y to avoid clipping if we were using scale, but we use portal now so it's safer */}
            <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4 pb-4 pt-2 sm:gap-4 sm:px-8 scroll-pl-8">
                {courses.map(course => (
                    <CourseCard 
                        key={course.id} 
                        course={course} 
                        onHover={handleHover}
                    />
                ))}
            </div>
        </section>
    );
  };

  if (currentView === 'player' && activeCourse) {
      return (
          <LessonPlayer 
            course={activeCourse} 
            onExit={() => setCurrentView('landing')} 
          />
      );
  }

  return (
    <div className="min-h-screen bg-nature-light transition-colors duration-300 dark:bg-brand-900 font-sans overflow-x-hidden">
      
      <Navbar onLoginClick={() => setShowLoginModal(true)} isDark={isDark} toggleTheme={toggleTheme} />
      
      <Hero 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Content Area */}
      <main className="pb-12 -mt-10 relative z-20">
         <CourseRow title="Popular on Lumina" courses={popularCourses} />
         <CourseRow title="New Releases" courses={newCourses} />
         <CourseRow title="Tech & Data" courses={devCourses} />
         <CourseRow title="Creative Arts" courses={creativeCourses} />
         <CourseRow title="Business & Marketing" courses={businessCourses} />
      </main>

      <StatsSection />
      
      <Footer />

      {/* Expanded Course Card Overlay (Portal) */}
      {hoveredCourse && (
        <ExpandedCourseCard
            course={hoveredCourse.course}
            rect={hoveredCourse.rect}
            onLeave={() => setHoveredCourse(null)}
            onPlay={handlePlay}
        />
      )}

      {/* Guest Login Gate Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-nature-card shadow-2xl dark:bg-brand-800 border border-brand-100 dark:border-brand-700">
            <div className="relative p-8 text-center">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-brand-400 hover:bg-brand-100 hover:text-brand-900 dark:hover:bg-brand-700 dark:hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-700 dark:text-white shadow-inner">
                <BookOpen size={32} />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-brand-900 dark:text-white">Unlock full access</h2>
              <p className="mb-8 text-sm text-brand-600 dark:text-brand-300">Join 250k+ learners. Create a free account to track your progress and save courses.</p>
              
              <div className="space-y-3">
                <button className="w-full rounded-xl bg-brand-800 py-3.5 font-bold text-white transition-transform active:scale-95 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500">
                  Sign up with Email
                </button>
                <button className="w-full rounded-xl border border-brand-200 bg-white py-3.5 font-bold text-brand-700 transition-colors hover:bg-brand-50 dark:border-brand-600 dark:bg-transparent dark:text-white dark:hover:bg-brand-700">
                  Continue with Google
                </button>
              </div>
              
              <p className="mt-6 text-xs text-brand-500">
                Already have an account? <button onClick={() => setShowLoginModal(false)} className="font-bold text-brand-700 hover:underline dark:text-brand-300">Log in</button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;