import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinedDate: string;
  booksRead: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface SignupData {
  name: string;
  identifier: string; // email or phone
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'libra_auth_user';
const USERS_KEY = 'libra_users';

// Simulate stored users
const getStoredUsers = (): Record<string, any> => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    const users = stored ? JSON.parse(stored) : {};
    // Pre-seed demo user
    if (!users['demo@libra.app']) {
      users['demo@libra.app'] = {
        id: 'demo_user',
        name: 'Alex Rivera',
        email: 'demo@libra.app',
        joinedDate: new Date().toISOString(),
        booksRead: 7,
        password: btoa('demo123')
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch { return {}; }
};

const saveUser = (identifier: string, userData: any) => {
  const users = getStoredUsers();
  users[identifier.toLowerCase()] = userData;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { localStorage.removeItem(STORAGE_KEY); }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    const users = getStoredUsers();
    const storedUser = users[identifier.toLowerCase()];

    if (!storedUser) {
      return { success: false, error: 'No account found with this email/phone' };
    }

    if (storedUser.password !== btoa(password)) {
      return { success: false, error: 'Incorrect password' };
    }

    const { password: _, ...userWithoutPassword } = storedUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 1000));

    const users = getStoredUsers();
    if (users[data.identifier.toLowerCase()]) {
      return { success: false, error: 'An account with this email/phone already exists' };
    }

    const isPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(data.identifier);
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: isPhone ? '' : data.identifier,
      phone: isPhone ? data.identifier : undefined,
      joinedDate: new Date().toISOString(),
      booksRead: 0,
    };

    saveUser(data.identifier, { ...newUser, password: btoa(data.password) });
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
