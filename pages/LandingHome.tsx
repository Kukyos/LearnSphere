import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import ExpandedCourseCard from '../components/ExpandedCourseCard';
import LessonPlayer from '../components/LessonPlayer';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';
import { MOCK_COURSES } from '../constants';
import { Course } from '../types';
import { BookOpen, ChevronRight, X } from 'lucide-react';

type ViewState = 'landing' | 'player';

interface HoverState {
  course: Course;
  rect: DOMRect;
}

const LandingHome: React.FC = () => {
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
    if (hoveredCourse?.course.id !== course.id) {
        setHoveredCourse({ course, rect });
    }
  };

  const handlePlay = (course: Course) => {
      setHoveredCourse(null);
      setActiveCourse(course);
      setCurrentView('player');
  };

  const handleClosePlayer = () => {
    setCurrentView('landing');
    setActiveCourse(null);
  };

  const recommendedCourses = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return MOCK_COURSES.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Render Player View
  if (currentView === 'player' && activeCourse) {
    return (
      <LessonPlayer
        course={activeCourse}
        onClose={handleClosePlayer}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    );
  }

  // Render Main Landing View
  return (
    <div className="min-h-screen bg-nature-light dark:bg-brand-950 transition-colors duration-300">
      <Navbar 
        onLoginClick={() => setShowLoginModal(true)} 
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
      
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={(e) => e.preventDefault()}
      />

      {/* Courses Section */}
      <div className="container mx-auto px-4 mt-16 relative z-20 pb-32">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-brand-900 dark:text-white mb-2">
              {searchQuery ? 'Search Results' : 'Recommended for You'}
            </h2>
            <p className="text-brand-700 dark:text-brand-300">
              {searchQuery ? `${recommendedCourses.length} courses found` : 'Handpicked courses to start your journey'}
            </p>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recommendedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onHover={handleHover}
              onPlay={handlePlay}
            />
          ))}
        </div>

        {searchQuery && recommendedCourses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-brand-600 dark:text-brand-400 text-lg">
              No courses found for "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      <StatsSection />
      <Footer />

      {/* Expanded Course Overlay */}
      {hoveredCourse && (
        <ExpandedCourseCard
          course={hoveredCourse.course}
          rect={hoveredCourse.rect}
          onClose={() => setHoveredCourse(null)}
          onPlay={handlePlay}
        />
      )}
    </div>
  );
};

export default LandingHome;
