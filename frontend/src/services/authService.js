import api from './api';

/**
 * Register a new citizen account
 * @param {Object} userData { name, email, password, phone }
 */
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Log in with email and password
 * @param {Object} credentials { email, password }
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Log out active session
 */
export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Get current authenticated user session
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
