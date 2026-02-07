import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';
import { MOCK_COURSES } from '../constants';
import { Course } from '../types';
import { BookOpen, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handlePreview = () => {
    setShowLoginModal(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Navigating to search results for: ${searchQuery}`);
  };

  const popularCourses = useMemo(
    () => [...MOCK_COURSES].sort((a, b) => b.enrollmentCount - a.enrollmentCount),
    []
  );
  const newCourses = useMemo(() => [...MOCK_COURSES].reverse(), []);
  const devCourses = useMemo(
    () => MOCK_COURSES.filter(c => c.category === 'Development' || c.category === 'Data Science'),
    []
  );
  const creativeCourses = useMemo(
    () => MOCK_COURSES.filter(c => c.category === 'Design' || c.category === 'Photography'),
    []
  );
  const businessCourses = useMemo(
    () => MOCK_COURSES.filter(c => c.category === 'Business' || c.category === 'Marketing'),
    []
  );

  const CourseRow = ({ title, courses }: { title: string; courses: Course[] }) => {
    if (courses.length === 0) return null;
    return (
      <section className="mb-12 relative z-0">
        <div className="mb-4 flex items-end justify-between px-4 sm:px-8 group">
          <h2 className="text-xl font-bold text-brand-900 dark:text-white sm:text-2xl group-hover:text-brand-600 transition-colors cursor-pointer">
            {title}
          </h2>
          <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-400 hover:text-brand-600 dark:hover:text-white transition-colors">
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4 pb-12 pt-4 sm:gap-4 sm:px-8 scroll-pl-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} onPreview={handlePreview} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-nature-light transition-colors duration-300 dark:bg-brand-900 font-sans overflow-x-hidden">
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="pb-12 -mt-10 relative z-20">
        <CourseRow title="Popular on LearnSphere" courses={popularCourses} />
        <CourseRow title="New Releases" courses={newCourses} />
        <CourseRow title="Tech & Data" courses={devCourses} />
        <CourseRow title="Creative Arts" courses={creativeCourses} />
        <CourseRow title="Business & Marketing" courses={businessCourses} />
      </main>

      <StatsSection />
      <Footer />

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
              <p className="mb-8 text-sm text-brand-600 dark:text-brand-300">
                Join 250k+ learners. Create a free account to track your progress and save courses.
              </p>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full rounded-xl bg-brand-800 py-3.5 font-bold text-white transition-transform active:scale-95 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 text-center"
                >
                  Sign in with Email
                </Link>
                <button
                  onClick={() => {
                    loginAsGuest();
                    navigate('/home');
                  }}
                  className="w-full rounded-xl border border-brand-200 bg-white py-3.5 font-bold text-brand-700 transition-colors hover:bg-brand-50 dark:border-brand-600 dark:bg-transparent dark:text-white dark:hover:bg-brand-700"
                >
                  Continue as Guest
                </button>
              </div>

              <p className="mt-6 text-xs text-brand-500">
                Want to try first?{' '}
                <button
                  onClick={() => {
                    loginAsGuest();
                    navigate('/home');
                  }}
                  className="font-bold text-brand-700 hover:underline dark:text-brand-300"
                >
                  Browse as guest
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
