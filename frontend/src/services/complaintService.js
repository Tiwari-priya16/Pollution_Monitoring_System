import api from './api';

/**
 * Submit a new pollution complaint with image evidence.
 * @param {FormData} formData - multipart/form-data payload
 */
export const submitComplaint = async (formData) => {
  const response = await api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

/**
 * Get the authenticated citizen's own complaints.
 * @param {string} [status] - optional status filter
 * @param {number} [page=1]
 * @param {number} [limit=10]
 */
export const getMyComplaints = async (status = '', page = 1, limit = 10) => {
  const params = { page, limit };
  if (status) params.status = status;
  const response = await api.get('/complaints/my', { params });
  return response.data;
};

/**
 * Get a single complaint by its tracking ID.
 * @param {string} complaintId - e.g. PMS-202611-1042
 */
export const getComplaintById = async (complaintId) => {
  const response = await api.get(`/complaints/${complaintId}`);
  return response.data;
};
