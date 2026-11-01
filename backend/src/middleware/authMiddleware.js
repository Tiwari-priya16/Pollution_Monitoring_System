const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes: verify JWT, validate token version & account status, attach user
 */
const protect = async (req, res, next) => {
  let token = null;

  // 1. Check Authorization Bearer header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback to HttpOnly cookie if header is not present
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token is missing.'
    });
  }

  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'ecowatch_dev_secret_fallback_key_2026'
    );

    // Fetch user from DB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. The user belonging to this token no longer exists.'
      });
    }

    // Check if account has been deactivated
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact an administrator.'
      });
    }

    // Server-side token invalidation: verify tokenVersion matches current user state
    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'This session has expired or been logged out. Please log in again.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token.'
    });
  }
};

module.exports = { protect };

