const mongoose = require('mongoose');

const { Schema, Types } = mongoose;

// ── Status History Entry ──────────────────────────────────────────────────────
const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER REVIEW', 'VERIFIED', 'IN PROGRESS', 'RESOLVED', 'REJECTED'],
      required: true
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    remarks: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

// ── Resolution Details ────────────────────────────────────────────────────────
const resolutionDetailsSchema = new Schema(
  {
    remarks: { type: String, default: '' },
    proofImageUrl: { type: String, default: '' },
    resolvedAt: { type: Date, default: null }
  },
  { _id: false }
);

// ── Main Complaint Schema ─────────────────────────────────────────────────────
const complaintSchema = new Schema(
  {
    complaintId: {
      type: String,
      required: [true, 'Complaint ID is required'],
      unique: true,
      index: true,
      trim: true
    },
    citizenId: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Citizen reference is required'],
      index: true
    },
    assignedOfficerId: {
      type: Types.ObjectId,
      ref: 'User',
      default: null
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: [120, 'Title must not exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Pollution category is required'],
      enum: {
        values: ['Air Pollution', 'Water Pollution', 'Land Pollution', 'Noise Pollution'],
        message:
          'Category must be one of: Air Pollution, Water Pollution, Land Pollution, Noise Pollution'
      }
    },
    location: {
      address: {
        type: String,
        required: [true, 'Location address is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      landmark: {
        type: String,
        default: '',
        trim: true
      }
    },
    imageUrl: {
      type: String,
      required: [true, 'Evidence image is required']
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER REVIEW', 'VERIFIED', 'IN PROGRESS', 'RESOLVED', 'REJECTED'],
      default: 'SUBMITTED'
    },
    rejectionReason: {
      type: String,
      default: null
    },
    resolutionDetails: {
      type: resolutionDetailsSchema,
      default: () => ({})
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: []
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
