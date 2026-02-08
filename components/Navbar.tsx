import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileDrawer from '../src/components/ProfileDrawer';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `rounded-full px-5 py-2 text-xs font-semibold transition-all ${
      isActive(path)
        ? 'bg-brand-700 text-white'
        : 'text-brand-700 hover:bg-brand-100 hover:text-brand-900'
    }`;

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-brand-200 bg-white/80 p-1.5 pl-5 shadow-lg shadow-brand-900/8 backdrop-blur-xl transition-all duration-300">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-2 flex-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-md">
              <BookOpen size={16} strokeWidth={3} />
            </div>
            <span className="text-sm font-bold tracking-tight text-brand-900 hidden sm:block">LearnSphere</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 whitespace-nowrap">
            {isLoggedIn ? (
              <>
                <Link to="/explore" className={linkClass('/explore')}>
                  Explore
                </Link>
                <Link to="/my-courses" className={linkClass('/my-courses')}>
                  My Courses
                </Link>
                {(user?.role === 'instructor' || user?.role === 'admin') && (
                  <Link to="/courses" className={linkClass('/courses')}>
                    Dashboard
                  </Link>
                )}
                {(user?.role === 'instructor' || user?.role === 'admin') && (
                  <Link to="/reporting" className={linkClass('/reporting')}>
                    Reporting
                  </Link>
                )}
                <Link to="/settings" className={linkClass('/settings')}>
                  <Settings size={14} className="inline -mt-0.5" />
                </Link>
              </>
            ) : (
              <Link to="/" className={linkClass('/')}>
                Home
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 ml-1">
                <button 
                  onClick={() => setShowProfile(true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-600 truncate max-w-[120px] hover:text-brand-900 transition-colors cursor-pointer"
                >
                  <User size={14} />
                  {user?.name}
                </button>
                <button 
                  onClick={handleLogout}
                  className="rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand-500 hover:shadow-lg flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="ml-1 rounded-full bg-brand-600 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-brand-500 hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
            
            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden ml-1 p-2 text-brand-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-2xl bg-white p-4 shadow-2xl border border-brand-200">
              <div className="flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <Link to="/explore" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50" onClick={() => setIsMobileMenuOpen(false)}>
                      Explore Courses
                    </Link>
                    <Link to="/my-courses" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50" onClick={() => setIsMobileMenuOpen(false)}>
                      My Courses
                    </Link>
                    {(user?.role === 'instructor' || user?.role === 'admin') && (
                      <Link to="/courses" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50" onClick={() => setIsMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                    )}
                    {(user?.role === 'instructor' || user?.role === 'admin') && (
                      <Link to="/reporting" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50" onClick={() => setIsMobileMenuOpen(false)}>
                        Reporting
                      </Link>
                    )}
                    <Link to="/settings" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50" onClick={() => setIsMobileMenuOpen(false)}>
                      Settings
                    </Link>
                    <button 
                      onClick={() => { setShowProfile(true); setIsMobileMenuOpen(false); }}
                      className="block text-left w-full rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="block text-left w-full rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50" onClick={() => setIsMobileMenuOpen(false)}>
                      Home
                    </Link>
                    <Link to="/explore" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50" onClick={() => setIsMobileMenuOpen(false)}>
                      Explore Courses
                    </Link>
                    <Link to="/login" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </>
                )}
              </div>
           </div>
        </div>
      )}

      {/* Profile Drawer */}
      {showProfile && <ProfileDrawer onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Navbar;
