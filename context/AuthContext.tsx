import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  isBackendAvailable,
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
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
  backendOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/** Convert API user (id: number) → local user (id: string) */
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

  // ── Bootstrap: restore session from localStorage / JWT ─────
  useEffect(() => {
    const bootstrap = async () => {
      const online = await isBackendAvailable();
      setBackendOnline(online);

      // If we have a JWT, try to fetch the real profile
      if (online && getToken()) {
        const res = await apiGetProfile();
        if (res.success && res.data?.user) {
          const u = toLocalUser(res.data.user);
          setUser(u);
          localStorage.setItem('learnsphere_user', JSON.stringify(u));
          return;
        }
        // Token expired / invalid — fall through to localStorage
        removeToken();
      }

      // Fallback: saved mock session
      const saved = localStorage.getItem('learnsphere_user');
      if (saved) setUser(JSON.parse(saved));
    };
    bootstrap();
  }, []);

  // ── Login ──────────────────────────────────────────────────
  const login = async (email: string, password: string, role?: UserRole) => {
    // Try real backend first
    if (backendOnline) {
      const res = await apiLogin(email, password);
      if (res.success && res.data) {
        saveToken(res.data.token);
        const u = toLocalUser(res.data.user);
        setUser(u);
        localStorage.setItem('learnsphere_user', JSON.stringify(u));
        return;
      }
      // If backend rejected credentials, throw so the UI can show the error
      throw new Error(res.message || 'Invalid email or password');
    }

    // Mock fallback (no DB)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'u1',
          name: email.split('@')[0] || 'User',
          email,
          role: role || 'learner',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`,
        };
        setUser(mockUser);
        localStorage.setItem('learnsphere_user', JSON.stringify(mockUser));
        resolve();
      }, 400);
    });
  };

  // ── Register ───────────────────────────────────────────────
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    if (backendOnline) {
      const res = await apiRegister(name, email, password, role);
      if (res.success && res.data) {
        saveToken(res.data.token);
        const u = toLocalUser(res.data.user);
        setUser(u);
        localStorage.setItem('learnsphere_user', JSON.stringify(u));
        return;
      }
      throw new Error(res.message || 'Registration failed');
    }

    // Mock fallback
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'u-' + Date.now(),
          name,
          email,
          role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5c7f4c&color=fff`,
        };
        setUser(mockUser);
        localStorage.setItem('learnsphere_user', JSON.stringify(mockUser));
        resolve();
      }, 400);
    });
  };

  // ── Guest ──────────────────────────────────────────────────
  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'guest',
      avatar: 'https://ui-avatars.com/api/?name=Guest&background=e3e8dc&color=5c7f4c',
    };
    setUser(guestUser);
  };

  // ── Logout ─────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem('learnsphere_user');
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, register, logout, loginAsGuest, backendOnline }}
    >
      {children}
    </AuthContext.Provider>
  );
};