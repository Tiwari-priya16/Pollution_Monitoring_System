const { getDBStatus } = require('../config/db');
/**
 * @desc   Check API and Database health
 * @route  GET /api/health
 * @access Public
 */
const getHealthStatus = (req, res) => {
  const dbStatus = getDBStatus();
  return res.status(200).json({
    success: true,
    status: 'operational',
    service: 'Pollution Monitoring System API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus.status,
      host: dbStatus.host,
      database: dbStatus.database,
      error: dbStatus.error
    },
    environment: process.env.NODE_ENV || 'development'
  });
};
module.exports = { getHealthStatus };
