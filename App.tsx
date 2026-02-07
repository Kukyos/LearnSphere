import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import CoursesDashboard from './src/pages/CoursesDashboard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<CoursesDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;