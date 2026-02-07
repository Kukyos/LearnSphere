import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './src/contexts/AppContext';
import Navbar from './components/Navbar';
import ChatbotIcon from './src/components/ChatbotIcon';
import Landing from './pages/Landing';
import LearnerHome from './pages/LearnerHome';
import Login from './pages/Login';
import CoursesDashboard from './src/pages/CoursesDashboard';
import CoursesPage from './src/pages/CoursesPage';
import MyCoursesPage from './src/pages/MyCoursesPage';
import CourseDetailPage from './src/pages/CourseDetailPage';
import LessonPlayerPage from './src/pages/LessonPlayerPage';
import CourseForm from './src/pages/course/CourseForm';

// Loading Spinner
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-nature-light dark:bg-gray-900">
    <div className="text-center">
      <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Home Route - switches between Landing and LearnerHome based on auth
const HomeRoute: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? <LearnerHome /> : <Landing />;
};

const AppContent: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />

        {/* Learner routes */}
        <Route path="/explore" element={<CoursesPage />} />
        <Route path="/course/:courseId" element={<CourseDetailPage />} />
        <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
        <Route path="/lesson/:courseId/:lessonId" element={<ProtectedRoute><LessonPlayerPage /></ProtectedRoute>} />

        {/* Instructor routes */}
        <Route path="/courses" element={<ProtectedRoute><CoursesDashboard /></ProtectedRoute>} />
        <Route path="/course-form" element={<ProtectedRoute><CourseForm /></ProtectedRoute>} />
        <Route path="/course-form/:courseId" element={<ProtectedRoute><CourseForm /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatbotIcon />
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;