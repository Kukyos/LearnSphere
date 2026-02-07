import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Moon, Sun, User, BookOpen } from 'lucide-react';
import ProfileDrawer from './ProfileDrawer';

const Navbar: React.FC = () => {
  const { user, theme, toggleTheme, logout } = useApp();
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className={`sticky top-0 z-40 ${theme === 'dark' ? 'bg-brand-950 border-brand-800' : 'bg-white border-brand-100'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className={`${theme === 'dark' ? 'text-brand-400' : 'text-brand-600'}`} size={28} />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                LearnSphere
              </span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/courses"
                className={`font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'text-brand-200 hover:text-brand-50'
                    : 'text-brand-700 hover:text-brand-900'
                }`}
              >
                Courses
              </Link>
              {user && (
                <Link
                  to="/my-courses"
                  className={`font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'text-brand-200 hover:text-brand-50'
                      : 'text-brand-700 hover:text-brand-900'
                  }`}
                >
                  My Courses
                </Link>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-brand-800 text-brand-300'
                    : 'hover:bg-brand-100 text-brand-600'
                }`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <button
                  onClick={() => setShowProfileDrawer(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-brand-800 hover:bg-brand-700 text-brand-50'
                      : 'bg-brand-500 hover:bg-brand-600 text-white'
                  }`}
                >
                  {user.avatar && (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="hidden sm:inline">{user.name}</span>
                  <User size={18} className="sm:hidden" />
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-4 pb-3">
            <Link
              to="/courses"
              className={`flex-1 text-center py-2 rounded-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-brand-900 text-brand-200'
                  : 'bg-brand-50 text-brand-700'
              }`}
            >
              Courses
            </Link>
            {user && (
              <Link
                to="/my-courses"
                className={`flex-1 text-center py-2 rounded-lg font-semibold ${
                  theme === 'dark'
                    ? 'bg-brand-900 text-brand-200'
                    : 'bg-brand-50 text-brand-700'
                }`}
              >
                My Courses
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Drawer */}
      {showProfileDrawer && (
        <ProfileDrawer onClose={() => setShowProfileDrawer(false)} />
      )}

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
};

const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { login, theme } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`max-w-md w-full rounded-lg p-8 ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'} shadow-2xl`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
          Sign In to LearnSphere
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-brand-800 border-brand-700 text-brand-50'
                  : 'bg-white border-brand-300 text-brand-900'
              } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-brand-800 border-brand-700 text-brand-50'
                  : 'bg-white border-brand-300 text-brand-900'
              } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              required
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-brand-800 hover:bg-brand-700 text-brand-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-brand-900'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Navbar;
