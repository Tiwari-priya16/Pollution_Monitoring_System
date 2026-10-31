import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is unreachable
    if (!error.response) {
      console.error('[API Network Error] Unable to connect to backend server:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

