import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import FilterPanel from '../components/FilterPanel';
import FadeContent from '../components/FadeContent';
import { useApp, toDisplayCourse } from '../src/contexts/AppContext';
import { Course, FilterState } from '../types';
import { ChevronRight } from 'lucide-react';

const LearnerHome: React.FC = () => {
  const navigate = useNavigate();
  const { courses: appCourses } = useApp();
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
      <section className="mb-12 relative hover:z-10">
        <div className="mb-4 flex items-end justify-between px-4 sm:px-8 group">
          <h2 className="text-xl font-bold text-brand-900 sm:text-2xl group-hover:text-brand-600 transition-colors cursor-pointer">
            {title}
          </h2>
          <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-500 hover:text-brand-700 transition-colors">
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4 pb-44 pt-28 sm:gap-4 sm:px-8 scroll-pl-8 -mb-28 -mt-20">
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

  return (
    <div className="min-h-screen bg-nature-light font-sans overflow-x-hidden">

      {/* Top Padding for Navbar */}
      <div className="h-32"></div>

      {/* Main Content Area */}
      <main className="pb-12">
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
