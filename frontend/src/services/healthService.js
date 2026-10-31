import api from './api';

/**
 * Checks the operational status of the backend API and database connection.
 * @returns {Promise<Object>}
 */
export const checkSystemHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      connected: true,
      data: response.data,
      error: null
    };
  } catch (error) {
    return {
      connected: false,
      data: null,
      error: error.response?.data?.message || error.message || 'Backend server is unreachable'
    };
  }
};

