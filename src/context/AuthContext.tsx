'use client';

import React, { createContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { authAPI } from '@/services/auth.api';
import { mockAuthAPI } from '@/lib/mock-api';
import { handleApiError } from '@/lib/error-handler';

const useMockAPI = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(
      process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!
    );
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      let response: any;
      if (useMockAPI) {
        response = await mockAuthAPI.login(username, password);
        if (!response.success) {
          throw new Error(response.error || 'Login gagal');
        }
      } else {
        response = await authAPI.login({ username, password });
      }

      const { user: userData, token: newToken, refresh_token } = response.data;

      // Store tokens
      localStorage.setItem(
        process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!,
        newToken
      );
      if (refresh_token) {
        localStorage.setItem(
          process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!,
          refresh_token
        );
      }
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
    } catch (error: any) {
      const errorResponse = handleApiError(error);
      throw errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!);
    localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!);
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

