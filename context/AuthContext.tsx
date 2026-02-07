import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'learner' | 'instructor' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lumina_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'u1',
          name: email.split('@')[0] || 'User',
          email: email,
          role: role || 'learner',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`
        };
        setUser(mockUser);
        localStorage.setItem('lumina_user', JSON.stringify(mockUser));
        resolve();
      }, 500);
    });
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'u-' + Date.now(),
          name,
          email,
          role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5c7f4c&color=fff`
        };
        setUser(mockUser);
        localStorage.setItem('lumina_user', JSON.stringify(mockUser));
        resolve();
      }, 500);
    });
  };

  const loginAsGuest = () => {
    // Create a temporary guest session
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'guest',
      avatar: 'https://ui-avatars.com/api/?name=Guest&background=e3e8dc&color=5c7f4c'
    };
    setUser(guestUser);
    // We don't save guest to localStorage so session is ephemeral
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lumina_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      login,       register,      logout, 
      loginAsGuest 
    }}>
      {children}
    </AuthContext.Provider>
  );
};