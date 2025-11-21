// src/utils/api.js

// 1. Define the URLs directly here
const LOCAL_URL = 'http://127.0.0.1:4000/api';
const PROD_URL = 'https://trackbudget-api.onrender.com/api';

// 2. Check where the website is running
// If the browser says "localhost", use the Local URL.
// If it says anything else (like "vercel.app"), use the Render URL.
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? LOCAL_URL
  : PROD_URL;

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