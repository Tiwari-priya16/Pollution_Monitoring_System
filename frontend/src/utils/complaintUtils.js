/**
 * Constructs the full URL for a complaint evidence image stored in the backend uploads folder.
 * @param {string} imageUrl - relative path like /uploads/filename.jpg
 * @returns {string} absolute URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  // If already absolute, return as-is
  if (imageUrl.startsWith('http')) return imageUrl;
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');
  return `${base}${imageUrl}`;
};

/**
 * Formats a date string into a human-readable form.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formats a date+time string.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Returns a short category label with icon character.
 * @param {string} category
 * @returns {string}
 */
export const categoryIcon = (category) => {
  const map = {
    'Air Pollution': '💨',
    'Water Pollution': '💧',
    'Land Pollution': '🌿',
    'Noise Pollution': '🔊'
  };
  return map[category] || '🌍';
};

