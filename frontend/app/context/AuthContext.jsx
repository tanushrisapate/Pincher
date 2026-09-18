"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_USER } from '@/app/lib/demoUserConstants';

const AuthContext = createContext({
  user: DEMO_USER,
  isLoading: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEMO_USER);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    setUser(DEMO_USER);
    setIsLoading(false);
    return DEMO_USER;
  }, []);

  useEffect(() => {
    setUser(DEMO_USER);
    setIsLoading(false);
  }, [refreshUser]);

  const login = async (email, password) => {
    setUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  };

  const signup = async (name, email, password, persona) => {
    setUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  };

  const logout = async () => {
    setUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
