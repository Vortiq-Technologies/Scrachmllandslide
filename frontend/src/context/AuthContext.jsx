import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('lews_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('lews_auth_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on initial load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('lews_auth_token');
      if (savedToken) {
        try {
          const userData = await authApi.getMe();
          if (userData && userData.user) {
            setUser(userData.user);
            localStorage.setItem('lews_auth_user', JSON.stringify(userData.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out...', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    const authToken = response.token;
    const authUser = response.user;

    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('lews_auth_token', authToken);
    localStorage.setItem('lews_auth_user', JSON.stringify(authUser));
    return authUser;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    const authToken = response.token;
    const authUser = response.user;

    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('lews_auth_token', authToken);
    localStorage.setItem('lews_auth_user', JSON.stringify(authUser));
    return authUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lews_auth_token');
    localStorage.removeItem('lews_auth_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
