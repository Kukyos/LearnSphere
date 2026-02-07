import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingHome from './pages/LandingHome';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nature-light">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Login page as homepage */}
      <Route path="/" element={isLoggedIn ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Lumina landing page - protected route */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <LandingHome />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
