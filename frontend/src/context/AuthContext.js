import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      setIsAuthenticated(true);
      setUsername(res.data.username);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  const register = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      setIsAuthenticated(true);
      setUsername(res.data.username);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Registration failed:', err.response ? err.response.data : err.message);
      setLoading(false);
      return false;
    }
  };

  const value = {
    isAuthenticated,
    loading,
    username,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
