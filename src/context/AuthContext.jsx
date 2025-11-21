// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// We define the URL here for Auth actions to ensure consistency
const API_URL = 'http://127.0.0.1:4000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a token exists in local storage on load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // For MVP, we trust the token means the user is logged in.
      // In a production app, you would verify this token with an API call here.
      setUser({ email: 'User' }); 
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Attempting Login...");
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success! Save user data and token
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        // Server returned a specific error (e.g. "Invalid password")
        console.error("Login Failed:", data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      // Network error (Server offline, wrong URL, etc)
      console.error("Login Network Error:", error);
      return { success: false, error: 'Network error: Could not reach server.' };
    }
  };

  const signup = async (email, password, fullName) => {
    try {
      console.log("Attempting Signup...");
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success!
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        console.error("Signup Failed:", data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Signup Network Error:", error);
      return { success: false, error: 'Network error: Could not reach server.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    window.location.href = '/signup'; 
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);