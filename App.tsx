import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AccessibilityChatbot from './src/components/AccessibilityChatbot';
import ClickSpark from './components/ClickSpark';
import FaultyTerminal from './components/visuals/FaultyTerminal';
import Grainient from './components/visuals/Grainient';

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
  const isAdminPage = ['/courses', '/course-form', '/reporting', '/quiz-builder'].some(p => location.pathname.startsWith(p));
  const isAdminOrInstructor = user?.role === 'instructor' || user?.role === 'admin';

  return (
    <ClickSpark sparkColor="#5c7f4c" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
    <div className="min-h-screen">
      {/* Grainient background — shown on all pages except login & lesson player */}
      {!isLoginPage && !isPlayerPage && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
          <Grainient
            color1="#b8ccaa"
            color2="#5c7f4c"
            color3="#e8f0e4"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>
      )}
      {/* FaultyTerminal — only on admin/instructor dashboard pages */}
      {!isLoginPage && isAdminOrInstructor && isAdminPage && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-15" style={{ mixBlendMode: 'screen' }}>
          <FaultyTerminal
            tint="#b8ccaa"
            brightness={0.8}
            scale={1}
            gridMul={[2, 1]}
            digitSize={1.5}
            timeScale={0.15}
            scanlineIntensity={0.1}
            glitchAmount={0.5}
            flickerAmount={0.2}
            noiseAmp={0.3}
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

      {/* Accessibility Chatbot — only for learner/guest students */}
      {!isLoginPage && isLoggedIn && (user?.role === 'learner' || user?.role === 'guest') && (
        <AccessibilityChatbot />
      )}
      {/* Footer is included in some pages directly, or we can add it globally here if removed from pages. 
          Given the provided files, Landing/LearnerHome have their own footer, so we skip global footer 
          to avoid double rendering. */}
    </div>
    </ClickSpark>
  );
};

export default App;