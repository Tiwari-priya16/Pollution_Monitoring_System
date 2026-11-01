const Complaint = require('../models/Complaint');

/**
 * Generates a unique complaint ID in the format PMS-YYYYMM-XXXX.
 * Retries up to maxRetries times if a duplicate is found in the DB.
 */
async function generateComplaintId(maxRetries = 10) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `PMS-${year}${month}`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const random = String(Math.floor(1000 + Math.random() * 9000)); // 1000–9999
    const complaintId = `${prefix}-${random}`;

    // eslint-disable-next-line no-await-in-loop
    const exists = await Complaint.exists({ complaintId });
    if (!exists) {
      return complaintId;
    }
  }

  throw new Error('Failed to generate a unique complaint ID after multiple retries. Please try again.');
}

module.exports = { generateComplaintId };

