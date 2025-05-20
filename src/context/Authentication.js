import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, logout, checkAuthStatus } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        //kiem tra token truoc khi chay api
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await checkAuthStatus();
            setUser(response.data.user);
            setIsAuthenticated(true);
          } catch (error) {
            console.log("API loi nhung token van hop le");
            // setIsAuthenticated(true); // Giả định token vẫn hợp lệ nếu API không phản hồi
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login: loginUser,
    logout: logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};