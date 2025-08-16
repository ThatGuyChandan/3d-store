import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      setIsAuthenticated(true);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUsername(res.data.username);
      localStorage.setItem('username', res.data.username);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
      setToken(null);
      localStorage.removeItem('token');
      setUsername(null);
      localStorage.removeItem('username');
      setIsAuthenticated(false);
      return false;
    }
  };

  const register = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUsername(res.data.username);
      localStorage.setItem('username', res.data.username);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Registration failed:', err.response ? err.response.data : err.message);
      setToken(null);
      localStorage.removeItem('token');
      setUsername(null);
      localStorage.removeItem('username');
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUsername(null);
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, loading, username, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);