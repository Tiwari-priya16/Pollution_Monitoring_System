const fs = require('fs');
const path = require('path');
const Complaint = require('../models/Complaint');
const { generateComplaintId } = require('../utils/generateId');

// ── Helper: build image path relative to uploads ──────────────────────────────
const buildImageUrl = (filename) => `/uploads/${filename}`;

// ── Helper: safely delete an orphaned upload file ─────────────────────────────
const deleteUploadedFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('[Upload] Failed to remove orphaned file:', err.message);
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/complaints
// Access: citizen only (protected + authorize)
// Body: multipart/form-data
// ─────────────────────────────────────────────────────────────────────────────
const submitComplaint = async (req, res, next) => {
  // Multer places the uploaded file at req.file
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Evidence image is required. Please upload a JPEG, PNG or WebP image.'
    });
  }

  const { title, description, category, address, city, landmark } = req.body;

  // ── Field validation ──────────────────────────────────────────────────────
  const missingFields = [];
  if (!title || !title.trim()) missingFields.push('title');
  if (!description || !description.trim()) missingFields.push('description');
  if (!category || !category.trim()) missingFields.push('category');
  if (!address || !address.trim()) missingFields.push('address');
  if (!city || !city.trim()) missingFields.push('city');

  if (missingFields.length > 0) {
    deleteUploadedFile(req.file.path);
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}.`
    });
  }

  // ── Category validation ───────────────────────────────────────────────────
  const validCategories = ['Air Pollution', 'Water Pollution', 'Land Pollution', 'Noise Pollution'];
  if (!validCategories.includes(category)) {
    deleteUploadedFile(req.file.path);
    return res.status(400).json({
      success: false,
      message: `Invalid category. Must be one of: ${validCategories.join(', ')}.`
    });
  }

  // ── Title length ──────────────────────────────────────────────────────────
  if (title.trim().length > 120) {
    deleteUploadedFile(req.file.path);
    return res.status(400).json({
      success: false,
      message: 'Complaint title must not exceed 120 characters.'
    });
  }

  try {
    // ── Generate unique complaint ID ─────────────────────────────────────────
    const complaintId = await generateComplaintId();

    // ── citizenId ALWAYS comes from authenticated user — never from body ─────
    const citizenId = req.user._id;

    // ── Build complaint document ─────────────────────────────────────────────
    const complaint = new Complaint({
      complaintId,
      citizenId,
      title: title.trim(),
      description: description.trim(),
      category,
      location: {
        address: address.trim(),
        city: city.trim(),
        landmark: landmark ? landmark.trim() : ''
      },
      imageUrl: buildImageUrl(req.file.filename),
      status: 'SUBMITTED', // ALWAYS server-set
      statusHistory: [
        {
          status: 'SUBMITTED',
          updatedBy: citizenId,
          remarks: 'Complaint submitted by citizen.',
          timestamp: new Date()
        }
      ]
    });

    await complaint.save();

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint: {
        complaintId: complaint.complaintId,
        title: complaint.title,
        category: complaint.category,
        status: complaint.status,
        location: complaint.location,
        imageUrl: complaint.imageUrl,
        createdAt: complaint.createdAt
      }
    });
  } catch (err) {
    // If DB save fails, remove the orphaned uploaded file
    deleteUploadedFile(req.file.path);
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/complaints/my
// Access: citizen only
// Query: ?status=SUBMITTED&page=1&limit=10
// ─────────────────────────────────────────────────────────────────────────────
const getMyComplaints = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const citizenId = req.user._id;

    const filter = { citizenId };

    if (status) {
      const validStatuses = ['SUBMITTED', 'UNDER REVIEW', 'VERIFIED', 'IN PROGRESS', 'RESOLVED', 'REJECTED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter: ${status}.`
        });
      }
      filter.status = status.toUpperCase();
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-statusHistory -resolutionDetails -__v');

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      complaints
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/complaints/:complaintId
// Access: citizen only — can only view own complaints
// ─────────────────────────────────────────────────────────────────────────────
const getComplaintById = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const citizenId = req.user._id;

    const complaint = await Complaint.findOne({ complaintId })
      .populate('citizenId', 'name email')
      .populate('assignedOfficerId', 'name email department')
      .populate('statusHistory.updatedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint with ID '${complaintId}' not found.`
      });
    }

    // ── Ownership check: prevent cross-citizen access ─────────────────────
    if (complaint.citizenId._id.toString() !== citizenId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not authorized to view this complaint.'
      });
    }

    return res.status(200).json({
      success: true,
      complaint
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitComplaint, getMyComplaints, getComplaintById };

