import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/Api'

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // User state will store user info (id, name, age, email, sex) if logged in
  const [user, setUser] = useState(null);
  
  const [loading, setLoading] = useState(true);

  // This useEffect runs once on app load to check for a valid cookie
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await API.get('/auth/verify');
        // If the request is successful, the cookie is valid.
        // The backend returns the user data.
        setUser(response.data.user);
      } catch (err) {
        console.log('No valid session found.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []); // The empty dependency array ensures this runs only once


  const register = async (name, age, email, password) => {
    try {
      const response = await API.post('/auth/register', { name, age, email, password });
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err.response?.data?.message || err.message);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user, // True if user object exists
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
