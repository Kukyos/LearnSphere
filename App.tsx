import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '/src/contexts/AppContext';
import Navbar from '/src/components/Navbar';
import ChatbotIcon from '/src/components/ChatbotIcon';
import CoursesPage from '/src/pages/CoursesPage';
import MyCoursesPage from '/src/pages/MyCoursesPage';
import CourseDetailPage from '/src/pages/CourseDetailPage';
import LessonPlayerPage from '/src/pages/LessonPlayerPage';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/courses" replace />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />
            <Route path="/lesson/:courseId/:lessonId" element={<LessonPlayerPage />} />
          </Routes>
          <ChatbotIcon />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;