import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('eduqr_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('eduqr_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists, verify with /api/auth/me
    if (token) {
      api.auth.me()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('eduqr_user', JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await api.auth.login(username, password);
      localStorage.setItem('eduqr_token', data.token);
      const userObj = {
        id: data.id,
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      };
      localStorage.setItem('eduqr_user', JSON.stringify(userObj));
      setToken(data.token);
      setUser(userObj);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('eduqr_token');
    localStorage.removeItem('eduqr_user');
    setToken(null);
    setUser(null);
  };

  const quickLogin = async (targetRole) => {
    if (targetRole === 'ADMIN') {
      return login('admin', 'admin123');
    } else {
      return login('faculty', 'faculty123');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'ROLE_ADMIN',
    isFaculty: user?.role === 'ROLE_FACULTY',
    login,
    logout,
    quickLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
