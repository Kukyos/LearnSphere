import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export type UserRole = 'guest' | 'learner' | 'instructor' | 'admin';

export interface User {
  id: string | number;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('learnsphere_user');
    const token = authAPI.getToken();
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('learnsphere_user');
        authAPI.removeToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      const userData: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role as UserRole,
      };

      setUser(userData);
      localStorage.setItem('learnsphere_user', JSON.stringify(userData));
      authAPI.saveToken(response.data.token);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const response = await authAPI.register(name, email, password, role);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }

      const userData: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role as UserRole,
      };

      setUser(userData);
      localStorage.setItem('learnsphere_user', JSON.stringify(userData));
      authAPI.saveToken(response.data.token);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learnsphere_user');
    authAPI.removeToken();
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: `guest_${Date.now()}`,
      email: 'guest@learnsphere.local',
      name: 'Guest User',
      role: 'guest',
    };
    setUser(guestUser);
    localStorage.setItem('learnsphere_user', JSON.stringify(guestUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        loading,
        login,
        logout,
        loginAsGuest,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

  return context;
};
