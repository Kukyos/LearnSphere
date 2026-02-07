import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Search, Star } from 'lucide-react';

const CoursesPage: React.FC = () => {
  const { courses, user, theme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const visibleCourses = courses.filter(course => {
    if (!course.published) return false;
    if (course.visibility === 'Signed In' && !user) return false;
    return course.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
            Explore Courses
          </h1>
          <div className="relative max-w-xl">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`} size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-brand-900 border-brand-700 text-brand-50 placeholder-brand-400'
                  : 'bg-white border-brand-200 text-brand-900 placeholder-brand-500'
              } focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCourses.map(course => (
            <div
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              className={`rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                theme === 'dark' ? 'bg-brand-900' : 'bg-white'
              }`}
            >
              <img
                src={course.coverImage}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                  {course.title}
                </h3>
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                  {course.shortDescription}
                </p>
                <div className="flex items-center mb-3">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
                    {course.rating} / 5.0
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <span
                      key={tag}
                      className={`text-xs px-3 py-1 rounded-full ${
                        theme === 'dark'
                          ? 'bg-brand-800 text-brand-200'
                          : 'bg-brand-100 text-brand-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCourses.length === 0 && (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
            <p className="text-xl">No courses found</p>
            <p className="mt-2">Try adjusting your search or {!user && 'sign in to see more courses'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
