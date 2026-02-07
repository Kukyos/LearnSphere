import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Search, TrendingUp, Award, ArrowLeft } from 'lucide-react';

const MyCoursesPage: React.FC = () => {
  const { courses, user, userProgress, theme, enrollInCourse } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
        <div className="text-center">
          <p className={`text-xl ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
            Please sign in to access your courses
          </p>
        </div>
      </div>
    );
  }

  const enrolledCourses = courses.filter(c => 
    user.enrolledCourses.includes(c.id) && c.published
  );

  const completedCourses = enrolledCourses.filter(c => 
    user.completedCourses.includes(c.id)
  );

  const inProgressCourses = enrolledCourses.filter(c => 
    !user.completedCourses.includes(c.id)
  );

  const availableCourses = courses.filter(c => {
    if (!c.published) return false;
    if (c.visibility === 'Everyone' || (c.visibility === 'Signed In' && user)) {
      return !user.enrolledCourses.includes(c.id);
    }
    return false;
  }).filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const getCourseProgress = (courseId: string) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    if (!progress) return 0;
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    
    const completedLessons = progress.lessonsProgress.filter(l => l.completed).length;
    return (completedLessons / course.lessons.length) * 100;
  };

  const getActionButtonText = (course: typeof courses[0]) => {
    if (!user.enrolledCourses.includes(course.id)) {
      if (course.access === 'Paid' && course.price) {
        return `Buy Course - $${course.price}`;
      }
      return 'Join Course';
    }
    
    const progress = getCourseProgress(course.id);
    if (progress === 0) return 'Start';
    if (progress === 100) return 'Review';
    return 'Continue';
  };

  const handleCourseAction = (course: typeof courses[0]) => {
    if (!user.enrolledCourses.includes(course.id)) {
      if (course.access === 'Paid') {
        // In real app, would handle payment
        alert(`Payment for ${course.title} - $${course.price}`);
        enrollInCourse(course.id);
      } else {
        enrollInCourse(course.id);
      }
    }
    navigate(`/course/${course.id}`);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-brand-300 hover:bg-brand-800 hover:text-white'
              : 'text-brand-600 hover:bg-brand-100 hover:text-brand-900'
          }`}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        {/* Profile Summary */}
        <div className={`rounded-lg p-6 mb-8 ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-brand-500"
              />
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                  {user.name}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-brand-500" size={20} />
                    <span className={theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}>
                      {user.points} Points
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="text-yellow-500" size={20} />
                    <span className={theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}>
                      {user.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                Courses Completed
              </p>
              <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                {completedCourses.length}
              </p>
            </div>
          </div>
        </div>

        {/* Courses In Progress */}
        {inProgressCourses.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
              In Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className={`rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' ? 'bg-brand-900' : 'bg-white'
                  }`}
                >
                  <img src={course.coverImage} alt={course.title} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                      {course.title}
                    </h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getCourseProgress(course.id)}%` }}
                      />
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                      {Math.round(getCourseProgress(course.id))}% Complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
              Available Courses
            </h3>
            <div className="relative w-64">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`} size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-brand-900 border-brand-700 text-brand-50'
                    : 'bg-white border-brand-200 text-brand-900'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map(course => (
              <div
                key={course.id}
                className={`rounded-lg overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'}`}
              >
                <img src={course.coverImage} alt={course.title} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                    {course.title}
                  </h4>
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                    {course.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded-full ${
                          theme === 'dark' ? 'bg-brand-800 text-brand-200' : 'bg-brand-100 text-brand-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleCourseAction(course)}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      course.access === 'Paid'
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-brand-900'
                        : 'bg-brand-500 hover:bg-brand-600 text-white'
                    }`}
                  >
                    {getActionButtonText(course)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;
