import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'manager' | 'staff';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isManager: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock JWT decode function
const decodeToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

// Mock token creation for demo
const createMockToken = (user: Omit<User, 'id'>): string => {
  const payload = {
    id: crypto.randomUUID(),
    ...user,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  return `header.${btoa(JSON.stringify(payload))}.signature`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      const decodedUser = decodeToken(storedToken);
      if (decodedUser) {
        setToken(storedToken);
        setUser(decodedUser);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock authentication - in production, this would call your API
      if (password.length < 4) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Demo users
      const isManager = email.toLowerCase().includes('manager');
      const mockToken = createMockToken({
        email,
        name: email.split('@')[0],
        role: isManager ? 'manager' : 'staff',
      });

      localStorage.setItem('auth_token', mockToken);
      setToken(mockToken);
      setUser(decodeToken(mockToken));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const mockToken = createMockToken({ email, name, role });
      localStorage.setItem('auth_token', mockToken);
      setToken(mockToken);
      setUser(decodeToken(mockToken));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during signup' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isManager: user?.role === 'manager',
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
