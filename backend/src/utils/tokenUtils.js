const jwt = require('jsonwebtoken');

/**
 * Generate a cryptographically signed JWT token with user identity and token version
 * @param {Object} user 
 * @returns {string} Signed JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion || 0
    },
    process.env.JWT_SECRET || 'ecowatch_dev_secret_fallback_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

/**
 * Send HTTP response with HttpOnly cookie and JSON body containing the token and user
 * @param {Object} user 
 * @param {number} statusCode 
 * @param {Object} res 
 * @param {string} message 
 */
const sendTokenResponse = (user, statusCode, res, message = 'Authentication successful') => {
  const token = generateToken(user);

  const cookieOptions = {
    httpOnly: true, // Prevents XSS script access to token
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: user.toJSON()
  });
};

module.exports = { generateToken, sendTokenResponse };

