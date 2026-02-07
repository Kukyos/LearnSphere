import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'guest' | 'learner' | 'instructor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('learnsphere_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('learnsphere_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simple mock login - just validate basic format
      if (!email.includes('@') || password.length < 3) {
        throw new Error('Invalid credentials');
      }

      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
      };

      setUser(mockUser);
      localStorage.setItem('learnsphere_user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learnsphere_user');
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
