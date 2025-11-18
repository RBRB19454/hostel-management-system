import React, { createContext, useState, useEffect } from 'react';
import { User, LoginResponse } from '../types.ts';
import { apiLogin, getSelfProfile } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<LoginResponse>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('hostel-token');
      if (token) {
        try {
          const selfProfile = await getSelfProfile();
          setUser(selfProfile);
        } catch (error) {
          console.error('Session validation failed', error);
          localStorage.removeItem('hostel-token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email: string, pass: string): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const response = await apiLogin(email, pass);

      if (!response?.token || !response?.user) {
        const msg = (response as any)?.message || 'Invalid credentials';
        setLoading(false);
        throw new Error(msg);
      }

      localStorage.setItem('hostel-token', response.token);
      setUser(response.user);
      setLoading(false);
      return response;
    } catch (error: any) {
      console.error('Login failed', error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Invalid credentials';
      setLoading(false);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hostel-token');
  };

  const value = { user, login, logout, loading };

  // IMPORTANT: always render children so error state in LoginPage is not wiped.
  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Optional: a simple loading overlay; keeps children mounted */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white px-4 py-2 rounded shadow text-sm">Loading…</div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
