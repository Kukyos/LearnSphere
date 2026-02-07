import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useApp } from './src/contexts/AppContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotIcon from './src/components/ChatbotIcon';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import LearnerHome from './pages/LearnerHome';
import CoursesPage from './src/pages/CoursesPage';
import CourseDetailPage from './src/pages/CourseDetailPage';
import LessonPlayerPage from './src/pages/LessonPlayerPage';
import MyCoursesPage from './src/pages/MyCoursesPage';
import CoursesDashboard from './src/pages/CoursesDashboard';
import CourseForm from './src/pages/course/CourseForm';

const App: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const { theme } = useApp();
  const location = useLocation();

  // Determine if we should show the Navbar/Footer
  // Usually we hide them on the Player or Login page for focus
  const isPlayerPage = location.pathname.includes('/lesson/');
  const isLoginPage = location.pathname === '/login';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      {!isPlayerPage && !isLoginPage && <Navbar />}
      
      <Routes>
        {/* Public / Role-based Home */}
        <Route path="/" element={
          !isLoggedIn ? <Landing /> : 
          user?.role === 'instructor' || user?.role === 'admin' ? <Navigate to="/courses" replace /> :
          <LearnerHome />
        } />

        <Route path="/login" element={<Login />} />

        {/* Learner Routes */}
        <Route path="/explore" element={<CoursesPage />} />
        <Route path="/course/:courseId" element={<CourseDetailPage />} />
        <Route path="/my-courses" element={<MyCoursesPage />} />
        
        {/* Protected Lesson Player */}
        <Route path="/lesson/:courseId/:lessonId" element={
          isLoggedIn ? <LessonPlayerPage /> : <Navigate to="/login" replace />
        } />

        {/* Instructor Routes */}
        <Route path="/courses" element={
          user?.role === 'instructor' || user?.role === 'admin' ? <CoursesDashboard /> : <Navigate to="/" replace />
        } />
        
        <Route path="/course-form" element={
          user?.role === 'instructor' || user?.role === 'admin' ? <CourseForm /> : <Navigate to="/" replace />
        } />
        
        <Route path="/course-form/:courseId" element={
          user?.role === 'instructor' || user?.role === 'admin' ? <CourseForm /> : <Navigate to="/" replace />
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isPlayerPage && !isLoginPage && <ChatbotIcon />}
      {/* Footer is included in some pages directly, or we can add it globally here if removed from pages. 
          Given the provided files, Landing/LearnerHome have their own footer, so we skip global footer 
          to avoid double rendering. */}
    </div>
  );
};

export default App;