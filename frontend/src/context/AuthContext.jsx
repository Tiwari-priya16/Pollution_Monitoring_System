import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hydrate user on application load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await getCurrentUser();
          if (res?.success && res.user) {
            setUser(res.user);
            setToken(storedToken);
          } else {
            // Token invalidated or invalid
            handleClientLogout();
          }
        } catch (err) {
          console.warn('[Auth] Session validation failed:', err.response?.data?.message || err.message);
          handleClientLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleClientLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      if (res?.success && res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        setLoading(false);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Login failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to authenticate';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(userData);
      if (res?.success && res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        setLoading(false);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Registration failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to register';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('[Auth] Server logout notification error:', err.message);
    } finally {
      handleClientLogout();
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    register,
    logout,
    clearError
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
