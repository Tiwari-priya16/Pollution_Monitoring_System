const User = require('../models/User');
const { sendTokenResponse } = require('../utils/tokenUtils');

/**
 * @desc   Register a new Citizen account (Public registration strictly restricted to citizen role)
 * @route  POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Basic Input Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Check for duplicate account
    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Role Security: Public registration MUST ALWAYS be 'citizen'
    const user = await User.create({
      name: name.trim(),
      email: emailNormalized,
      password,
      phone: phone ? phone.trim() : '',
      role: 'citizen', // Enforced server-side: overrides any client payload attempts
      isActive: true
    });

    return sendTokenResponse(
      user,
      201,
      res,
      'Registration successful. Welcome to EcoWatch Pollution Monitoring System!'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Authenticate user & return JWT token (all roles)
 * @route  POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Find user with password selected
    const user = await User.findOne({ email: emailNormalized }).select('+password');

    // Security practice: Generic error message to prevent account enumeration
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    return sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Log out user, clear cookie and invalidate active token server-side
 * @route  POST /api/auth/logout
 * @access Authenticated
 */
const logout = async (req, res, next) => {
  try {
    // Server-side token invalidation: Increment tokenVersion
    if (req.user) {
      req.user.tokenVersion = (req.user.tokenVersion || 0) + 1;
      await req.user.save();
    }

    // Clear HttpOnly auth cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000), // Expire in 5 seconds
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully. Active session invalidated.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get current logged-in user profile
 * @route  GET /api/auth/me
 * @access Authenticated
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user.toJSON()
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
