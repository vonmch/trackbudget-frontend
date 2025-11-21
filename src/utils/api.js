// src/utils/api.js

// --- THE FIX IS HERE ---
// Use the Vercel Environment Variable if it exists, otherwise localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api';

export const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/signup';
      throw new Error('Session expired');
    }

    return response;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};