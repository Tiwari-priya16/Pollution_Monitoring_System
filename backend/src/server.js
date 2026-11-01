const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware: CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev to avoid CORS blockages
  },
  credentials: true
}));

// Middleware: Body Parsers & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static uploads directory (for Stage 3 evidence pictures)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Pollution Monitoring System API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Mount Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[Server] Pollution Monitoring System API running on port ${PORT}`);
  console.log(`[Server] Health check available at: http://localhost:${PORT}/api/health`);
});

// Handle Port Conflict and Server Errors Gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [Server Error] Port ${PORT} is already in use by another process.`);
    console.error(`👉 Action steps to resolve:`);
    console.error(`   1. If another instance of this backend is already running, you can reuse it.`);
    console.error(`   2. If you want to use a different port, update 'PORT=${PORT}' in 'backend/.env' (e.g. PORT=5001)`);
    console.error(`      and update 'VITE_API_BASE_URL=http://localhost:5001/api' in 'frontend/.env'.`);
    console.error(`   3. To free up port ${PORT}, terminate the process using: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess\n`);
    process.exit(1);
  } else {
    console.error(`[Server Error] Server failed to start:`, err.message);
    process.exit(1);
  }
});

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log('\n[Server] Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = { app, server };

