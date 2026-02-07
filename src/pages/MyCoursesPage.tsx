import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const MyCoursesPage: React.FC = () => {
  const { user, courses, userProgress, theme, enrollInCourse } = useApp();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    return (
      <div className={`min-h-screen pt-28 flex items-center justify-center ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-brand-400" size={64} />
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>Sign in to view your courses</h2>
          <button onClick={() => navigate('/login')} className="mt-4 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const enrolledCoursesList = courses.filter(c => user.enrolledCourses.includes(c.id));
  const completedCoursesList = courses.filter(c => user.completedCourses.includes(c.id));
  const inProgressCourses = enrolledCoursesList.filter(c => !user.completedCourses.includes(c.id));
  const availableCourses = courses.filter(c => c.published && !user.enrolledCourses.includes(c.id));

  const getCourseProgress = (courseId: string) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    if (!progress) return 0;
    const course = courses.find(c => c.id === courseId);
    if (!course || course.lessons.length === 0) return 0;
    const completed = progress.lessonsProgress.filter(l => l.completed).length;
    return Math.round((completed / course.lessons.length) * 100);
  };

  const CourseSection = ({ title, icon, courseList, showProgress = false, showEnroll = false }: {
    title: string; icon: React.ReactNode; courseList: typeof courses; showProgress?: boolean; showEnroll?: boolean;
  }) => {
    if (courseList.length === 0) return null;
    return (
      <div className="mb-10">
        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>
          {icon} {title} ({courseList.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseList.map(course => {
            const pct = getCourseProgress(course.id);
            return (
              <div
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className={`cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${
                  theme === 'dark' ? 'bg-brand-900' : 'bg-white'
                }`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                  {showProgress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
                      <div className="h-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>{course.title}</h3>
                  <p className={`text-sm mb-3 line-clamp-1 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>{course.shortDescription}</p>
                  {showProgress && (
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>{pct}% complete</p>
                  )}
                  {showEnroll && (
                    <button
                      onClick={(e) => { e.stopPropagation(); enrollInCourse(course.id); }}
                      className="mt-2 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg font-semibold hover:bg-brand-700 transition-colors flex items-center gap-1"
                    >
                      Enroll <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen pt-28 pb-12 px-4 sm:px-8 ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>My Courses</h1>
        <p className={`mb-8 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>Track your learning progress</p>

        <CourseSection title="In Progress" icon={<Clock className="text-blue-500" size={24} />} courseList={inProgressCourses} showProgress />
        <CourseSection title="Completed" icon={<CheckCircle className="text-green-500" size={24} />} courseList={completedCoursesList} />
        <CourseSection title="Available Courses" icon={<BookOpen className="text-brand-500" size={24} />} courseList={availableCourses} showEnroll />

        {enrolledCoursesList.length === 0 && availableCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className={`mx-auto mb-4 ${theme === 'dark' ? 'text-brand-600' : 'text-brand-300'}`} size={64} />
            <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>No courses yet</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>Start exploring our course catalog!</p>
            <button onClick={() => navigate('/explore')} className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
              Explore Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
