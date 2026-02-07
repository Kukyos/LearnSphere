import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotIcon from './src/components/ChatbotIcon';
import ClickSpark from './components/ClickSpark';
import FaultyTerminal from './components/visuals/FaultyTerminal';

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
import ReportingDashboard from './src/pages/ReportingDashboard';
import QuizBuilder from './src/pages/QuizBuilder';
import SettingsPage from './src/pages/SettingsPage';

const App: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  // Determine if we should show the Navbar/Footer
  // Usually we hide them on the Player or Login page for focus
  const isPlayerPage = location.pathname.includes('/lesson/');
  const isLoginPage = location.pathname === '/login';

  return (
    <ClickSpark sparkColor="#5c7f4c" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
    <div className="min-h-screen">
      {/* Animated background — hidden on login */}
      {!isLoginPage && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30" style={{ mixBlendMode: 'screen' }}>
          <FaultyTerminal
            tint="#b8ccaa"
            brightness={1.0}
            scale={1}
            gridMul={[2, 1]}
            digitSize={1.5}
            timeScale={0.2}
            scanlineIntensity={0.15}
            glitchAmount={1}
            flickerAmount={0.3}
            noiseAmp={0.5}
            chromaticAberration={0}
            dither={0}
            curvature={0}
            mouseReact={false}
            pageLoadAnimation={true}
          />
        </div>
      )}
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

        <Route path="/reporting" element={
          user?.role === 'instructor' || user?.role === 'admin' ? <ReportingDashboard /> : <Navigate to="/" replace />
        } />

        <Route path="/quiz-builder/:courseId/:lessonId" element={
          user?.role === 'instructor' || user?.role === 'admin' ? <QuizBuilder /> : <Navigate to="/" replace />
        } />

        {/* Settings (all authenticated users) */}
        <Route path="/settings" element={
          isLoggedIn ? <SettingsPage /> : <Navigate to="/login" replace />
        } />

        {/* Guest Home redirect */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isPlayerPage && !isLoginPage && <ChatbotIcon />}
      {/* Footer is included in some pages directly, or we can add it globally here if removed from pages. 
          Given the provided files, Landing/LearnerHome have their own footer, so we skip global footer 
          to avoid double rendering. */}
    </div>
    </ClickSpark>
  );
};

export default App;