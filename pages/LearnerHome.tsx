import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import FilterPanel from '../components/FilterPanel';
import FadeContent from '../components/FadeContent';
import { useApp, toDisplayCourse } from '../src/contexts/AppContext';
import { useAuth } from '../context/AuthContext';
import { Course, FilterState } from '../types';
import { ChevronRight, BookOpen, TrendingUp, Award, Sparkles } from 'lucide-react';

const LearnerHome: React.FC = () => {
  const navigate = useNavigate();
  const { courses: appCourses, user } = useApp();
  const { user: authUser } = useAuth();
  const displayCourses = useMemo(() => appCourses.filter(c => c.published).map(toDisplayCourse), [appCourses]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    categories: [],
    difficulties: [],
    priceRange: 'all',
    minRating: null,
    duration: 'all',
  });

  // Filter Logic
  const filteredCourses = useMemo(() => {
    return displayCourses.filter(course => {
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !course.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterState.categories.length > 0 && !filterState.categories.includes(course.category)) {
        return false;
      }
      if (filterState.difficulties.length > 0 && !filterState.difficulties.includes(course.difficulty)) {
        return false;
      }
      if (filterState.priceRange === 'free' && course.price !== 0) {
        return false;
      }
      if (filterState.priceRange === 'paid' && course.price === 0) {
        return false;
      }
      if (filterState.minRating !== null && course.rating < filterState.minRating) {
        return false;
      }
      return true;
    });
  }, [searchQuery, filterState]);

  const handlePreview = (course: Course) => {
    navigate(`/course/${course.id}`);
  };

  const CourseRow = ({ title, courses }: { title: string; courses: Course[] }) => {
    if (courses.length === 0) return null;
    return (
      <section className="mb-6 relative hover:z-10">
        <div className="mb-3 flex items-end justify-between px-4 sm:px-8 group">
          <h2 className="text-lg font-bold text-brand-900 sm:text-xl group-hover:text-brand-600 transition-colors cursor-pointer">
            {title}
          </h2>
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-500 hover:text-brand-700 transition-colors"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4 pb-40 pt-24 sm:gap-4 sm:px-8 scroll-pl-8 -mb-28 -mt-16">
          {courses.map((course, i) => (
            <FadeContent key={course.id} delay={i * 80} duration={600} threshold={0.05}>
              <CourseCard course={course} onPreview={handlePreview} />
            </FadeContent>
          ))}
        </div>
      </section>
    );
  };

  const popularCourses = useMemo(() => [...displayCourses].sort((a, b) => b.enrollmentCount - a.enrollmentCount), [displayCourses]);
  const newCourses = useMemo(() => [...displayCourses].reverse(), [displayCourses]);
  const devCourses = useMemo(() => displayCourses.filter(c => c.category === 'Development' || c.category === 'Data Science'), [displayCourses]);

  const enrolledCount = user?.enrolledCourses?.length || 0;
  const completedCount = user?.completedCourses?.length || 0;
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();
  const firstName = (authUser?.name || 'Learner').split(' ')[0];

  return (
    <div className="min-h-screen bg-nature-light/60 font-sans overflow-x-hidden relative">

      {/* Decorative floating shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Large soft circle top-right */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-200/20 blur-3xl" />
        {/* Small circle mid-left */}
        <div className="absolute top-1/3 -left-16 w-64 h-64 rounded-full bg-brand-300/15 blur-2xl" />
        {/* Dot grid pattern top-left */}
        <svg className="absolute top-28 left-8 opacity-[0.06]" width="120" height="120">
          {Array.from({ length: 36 }).map((_, i) => (
            <circle key={i} cx={(i % 6) * 22 + 8} cy={Math.floor(i / 6) * 22 + 8} r="2" fill="#5c7f4c" />
          ))}
        </svg>
        {/* Dot grid pattern bottom-right */}
        <svg className="absolute bottom-48 right-12 opacity-[0.06]" width="100" height="100">
          {Array.from({ length: 25 }).map((_, i) => (
            <circle key={i} cx={(i % 5) * 22 + 8} cy={Math.floor(i / 5) * 22 + 8} r="2" fill="#5c7f4c" />
          ))}
        </svg>
        {/* Thin diagonal line accent */}
        <div className="absolute top-64 right-1/4 w-px h-48 bg-brand-400/10 rotate-[30deg]" />
        <div className="absolute bottom-96 left-1/3 w-px h-32 bg-brand-400/10 -rotate-[20deg]" />
      </div>

      {/* Top Padding for Navbar */}
      <div className="h-28"></div>

      {/* Welcome Banner */}
      <div className="relative z-10 px-4 sm:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-brand-900/15">
            {/* Decorative shapes inside banner */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />
            <svg className="absolute top-4 right-8 opacity-10" width="80" height="80">
              {Array.from({ length: 16 }).map((_, i) => (
                <circle key={i} cx={(i % 4) * 22 + 8} cy={Math.floor(i / 4) * 22 + 8} r="2" fill="white" />
              ))}
            </svg>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={18} className="text-brand-200" />
                  <span className="text-brand-200 text-sm font-medium">{greeting}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                  Welcome back, {firstName}!
                </h1>
                <p className="text-brand-200 text-sm">
                  {enrolledCount > 0
                    ? `You have ${enrolledCount} course${enrolledCount > 1 ? 's' : ''} in progress. Keep it up!`
                    : 'Start your learning journey today.'}
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <BookOpen size={18} className="text-brand-200" />
                  <div>
                    <p className="text-lg font-bold leading-none">{enrolledCount}</p>
                    <p className="text-[10px] text-brand-200 uppercase tracking-wider">Enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <Award size={18} className="text-brand-200" />
                  <div>
                    <p className="text-lg font-bold leading-none">{completedCount}</p>
                    <p className="text-[10px] text-brand-200 uppercase tracking-wider">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                  <TrendingUp size={18} className="text-brand-200" />
                  <div>
                    <p className="text-lg font-bold leading-none">{user?.points || 0}</p>
                    <p className="text-[10px] text-brand-200 uppercase tracking-wider">Points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="pb-8 relative z-10">
        <CourseRow title="Popular Courses" courses={popularCourses.slice(0, 6)} />
        <CourseRow title="New Releases" courses={newCourses.slice(0, 6)} />
        <CourseRow title="Tech & Data" courses={devCourses.slice(0, 6)} />

        {/* Search & Browse Section */}
        <section className="px-4 sm:px-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel filters={filterState} onChange={setFilterState} />
            </div>

            {/* Courses Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-brand-900 mb-2">
                  Browse All Courses
                </h2>
                <p className="text-brand-500">
                  {filteredCourses.length} courses available
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, i) => (
                  <FadeContent key={course.id} delay={i * 60} duration={500} threshold={0.05} className="h-full">
                    <CourseCard course={course} onPreview={handlePreview} />
                  </FadeContent>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-brand-500">No courses found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LearnerHome;
