import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  isBackendAvailable,
  resetBackendCheck,
  apiLogin,
  apiRegister,
  apiGetProfile,
  saveToken,
  removeToken,
  getToken,
} from '../services/api';

export type UserRole = 'learner' | 'instructor' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  points?: number;
  badge?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
  backendOnline: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

/** Convert API user → local user */
const toLocalUser = (apiUser: any): User => ({
  id: String(apiUser.id),
  name: apiUser.name,
  email: apiUser.email,
  role: (apiUser.role || 'learner') as UserRole,
  avatar:
    apiUser.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(apiUser.name)}&background=5c7f4c&color=fff`,
  points: apiUser.points || 0,
  badge: apiUser.badge || 'Beginner',
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // ── Bootstrap: restore session from JWT ────────────────────
  useEffect(() => {
    const bootstrap = async () => {
      const online = await isBackendAvailable();
      setBackendOnline(online);

      // If we have a JWT and backend is up, restore session
      if (online && getToken()) {
        try {
          const res = await apiGetProfile();
          if (res.success && res.data?.user) {
            const u = toLocalUser(res.data.user);
            setUser(u);
            localStorage.setItem('learnsphere_user', JSON.stringify(u));
            return;
          }
        } catch {
          // Token invalid
        }
        removeToken();
        localStorage.removeItem('learnsphere_user');
      }

      // Check for guest session only
      const saved = localStorage.getItem('learnsphere_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'guest') {
          setUser(parsed);
        } else if (!online) {
          // Backend is down — don't restore non-guest sessions
          localStorage.removeItem('learnsphere_user');
        }
      }
    };
    bootstrap();
  }, []);

  // ── Login (REAL auth only — no mock) ───────────────────────
  const login = async (email: string, password: string) => {
    resetBackendCheck();
    const online = await isBackendAvailable();
    setBackendOnline(online);

    if (!online) {
      throw new Error('Cannot connect to the server. Please make sure the backend is running (npm run dev in the server folder).');
    }

    const res = await apiLogin(email, password);
    if (res.success && res.data) {
      saveToken(res.data.token);
      const u = toLocalUser(res.data.user);
      setUser(u);
      localStorage.setItem('learnsphere_user', JSON.stringify(u));
      return;
    }

    throw new Error(res.message || 'Invalid email or password');
  };

  // ── Register (REAL auth only — no mock) ────────────────────
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    resetBackendCheck();
    const online = await isBackendAvailable();
    setBackendOnline(online);

    if (!online) {
      throw new Error('Cannot connect to the server. Please make sure the backend is running.');
    }

    if (role === 'admin') {
      throw new Error('Admin accounts cannot be registered. Contact the system administrator.');
    }

    const res = await apiRegister(name, email, password, role);
    if (res.success && res.data) {
      saveToken(res.data.token);
      const u = toLocalUser(res.data.user);
      setUser(u);
      localStorage.setItem('learnsphere_user', JSON.stringify(u));
      return;
    }

    throw new Error(res.message || 'Registration failed');
  };

  // ── Guest (no backend needed) ──────────────────────────────
  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'guest',
      avatar: 'https://ui-avatars.com/api/?name=Guest&background=e3e8dc&color=5c7f4c',
    };
    setUser(guestUser);
    localStorage.setItem('learnsphere_user', JSON.stringify(guestUser));
  };

  // ── Refresh profile from backend ───────────────────────────
  const refreshProfile = async () => {
    if (!getToken()) return;
    try {
      const res = await apiGetProfile();
      if (res.success && res.data?.user) {
        const u = toLocalUser(res.data.user);
        setUser(u);
        localStorage.setItem('learnsphere_user', JSON.stringify(u));
      }
    } catch {
      // silently fail
    }
  };

  // ── Logout ─────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem('learnsphere_user');
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, register, logout, loginAsGuest, backendOnline, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};