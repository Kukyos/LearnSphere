import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, Sun, Moon, LogOut, Compass, BookMarked, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../src/contexts/AppContext';
import ProfileDrawer from '../src/components/ProfileDrawer';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleThemeToggle = (e: React.MouseEvent) => {
    const root = document.documentElement;
    if (!(document as any).startViewTransition) {
      toggleTheme();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );
    const isDarkNow = theme === 'dark';

    const transition = (document as any).startViewTransition(() => {
      toggleTheme();
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        { clipPath: isDarkNow ? [...clipPath].reverse() : clipPath },
        {
          duration: 400,
          easing: 'ease-in-out',
          pseudoElement: isDarkNow
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      );
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `rounded-full px-5 py-2 text-xs font-semibold transition-all ${
      isActive(path)
        ? 'bg-brand-200/60 text-brand-900 dark:bg-brand-700 dark:text-white'
        : 'text-brand-700 hover:bg-brand-200/50 hover:text-brand-900 dark:text-brand-200 dark:hover:bg-brand-800 dark:hover:text-white'
    }`;

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex w-full max-w-2xl items-center justify-between rounded-full border border-brand-200/50 bg-nature-card/80 dark:bg-brand-900/80 p-1.5 pl-6 shadow-lg shadow-brand-900/5 backdrop-blur-xl transition-all duration-300 dark:border-brand-700">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white shadow-md">
              <BookOpen size={16} strokeWidth={3} />
            </div>
            <span className="text-sm font-bold tracking-tight text-brand-900 dark:text-white hidden sm:block">LearnSphere</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
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
              </>
            ) : (
              <Link to="/" className={linkClass('/')}>
                Home
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Theme Toggle */}
            <button 
              onClick={handleThemeToggle}
              className="group flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-brand-500 hover:bg-brand-200/50 hover:text-brand-800 transition-all dark:text-brand-400 dark:hover:bg-brand-800 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 ml-1">
                <button 
                  onClick={() => setShowProfile(true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-700 dark:text-brand-200 truncate max-w-[120px] hover:text-brand-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <User size={14} />
                  {user?.name}
                </button>
                <button 
                  onClick={handleLogout}
                  className="rounded-full bg-brand-800 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand-900 hover:shadow-lg dark:bg-brand-600 dark:hover:bg-brand-500 flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="ml-1 rounded-full bg-brand-800 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-brand-900 hover:shadow-lg dark:bg-brand-600 dark:hover:bg-brand-500"
              >
                Sign In
              </Link>
            )}
            
            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden ml-1 p-2 text-brand-700 dark:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-brand-950/60 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-2xl bg-nature-card dark:bg-brand-900 p-4 shadow-2xl border border-brand-200 dark:border-brand-700">
              <div className="flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <Link to="/explore" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-800" onClick={() => setIsMobileMenuOpen(false)}>
                      Explore Courses
                    </Link>
                    <Link to="/my-courses" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-800" onClick={() => setIsMobileMenuOpen(false)}>
                      My Courses
                    </Link>
                    {(user?.role === 'instructor' || user?.role === 'admin') && (
                      <Link to="/courses" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-800" onClick={() => setIsMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                    )}
                    {(user?.role === 'instructor' || user?.role === 'admin') && (
                      <Link to="/reporting" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-800" onClick={() => setIsMobileMenuOpen(false)}>
                        Reporting
                      </Link>
                    )}
                    <button 
                      onClick={() => { setShowProfile(true); setIsMobileMenuOpen(false); }}
                      className="block text-left w-full rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-800"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="block text-left w-full rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-800" onClick={() => setIsMobileMenuOpen(false)}>
                      Home
                    </Link>
                    <Link to="/explore" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-800" onClick={() => setIsMobileMenuOpen(false)}>
                      Explore Courses
                    </Link>
                    <Link to="/login" className="block rounded-xl px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-100 dark:text-brand-100 dark:hover:bg-brand-800" onClick={() => setIsMobileMenuOpen(false)}>
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