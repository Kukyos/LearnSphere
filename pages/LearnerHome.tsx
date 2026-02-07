import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import FilterPanel from '../components/FilterPanel';
import { MOCK_COURSES } from '../constants';
import { Course, FilterState } from '../types';
import { ChevronRight } from 'lucide-react';

const LearnerHome: React.FC = () => {
  const navigate = useNavigate();
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
    return MOCK_COURSES.filter(course => {
      // Search filter
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !course.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filterState.categories.length > 0 && !filterState.categories.includes(course.category)) {
        return false;
      }

      // Difficulty filter
      if (filterState.difficulties.length > 0 && !filterState.difficulties.includes(course.difficulty)) {
        return false;
      }

      // Price filter
      if (filterState.priceRange === 'free' && course.price !== 0) {
        return false;
      }
      if (filterState.priceRange === 'paid' && course.price === 0) {
        return false;
      }

      // Rating filter
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

  const popularCourses = useMemo(() => [...MOCK_COURSES].sort((a, b) => b.enrollmentCount - a.enrollmentCount), []);
  const newCourses = useMemo(() => [...MOCK_COURSES].reverse(), []);
  const devCourses = useMemo(() => MOCK_COURSES.filter(c => c.category === 'Development' || c.category === 'Data Science'), []);

  return (
    <div className="min-h-screen bg-nature-light transition-colors duration-300 dark:bg-brand-900 font-sans overflow-x-hidden">

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
                <h2 className="text-2xl font-bold text-brand-900 dark:text-white mb-2">
                  Browse All Courses
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredCourses.length} courses available
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div key={course.id} className="h-full">
                    <CourseCard course={course} onPreview={handlePreview} />
                  </div>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No courses found. Try adjusting your filters.</p>
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
