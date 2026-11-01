const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public authentication routes
router.post('/register', register);
router.post('/login', login);

// Protected authentication routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Verification and RBAC test routes
router.get('/test/citizen', protect, authorize('citizen', 'officer', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Citizen access granted', role: req.user.role });
});

router.get('/test/officer', protect, authorize('officer', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Officer access granted', role: req.user.role });
});

router.get('/test/admin', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Admin access granted', role: req.user.role });
});

module.exports = router;
