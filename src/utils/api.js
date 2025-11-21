// src/utils/api.js

// We force IPv4 (127.0.0.1) instead of 'localhost' to prevent Windows network errors
const BASE_URL = 'http://127.0.0.1:4000/api';

export const authFetch = async (endpoint, options = {}) => {
  // 1. Get the token from storage
  const token = localStorage.getItem('token');

  // 2. Set up the headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 3. Add the token if it exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 4. Make the actual request
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 5. Handle "Unauthorized" (token expired or invalid)
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/signup'; // Redirect to sign up/login
      throw new Error('Session expired');
    }

    return response;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};