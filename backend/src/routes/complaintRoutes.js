const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { upload } = require('../config/multer');
const {
  submitComplaint,
  getMyComplaints,
  getComplaintById
} = require('../controllers/complaintController');

// Multer error handler (for file size / type rejections from multer itself)
const handleMulterError = (err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Evidence image is too large. Maximum allowed size is 5 MB.'
    });
  }
  if (err && err.message && err.message.startsWith('Unsupported file type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next(err);
};

// IMPORTANT: /my must be registered BEFORE /:complaintId to avoid route conflict
router.get('/my', protect, authorize('citizen'), getMyComplaints);

router.post(
  '/',
  protect,
  authorize('citizen'),
  upload.single('image'),
  handleMulterError,
  submitComplaint
);

router.get('/:complaintId', protect, authorize('citizen'), getComplaintById);

module.exports = router;
