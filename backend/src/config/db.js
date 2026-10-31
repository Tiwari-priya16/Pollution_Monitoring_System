const mongoose = require('mongoose');

let connectionState = {
  status: 'disconnected',
  host: null,
  database: null,
  error: null
};

// Register real-time Mongoose connection events
mongoose.connection.on('connected', () => {
  connectionState = {
    status: 'connected',
    host: mongoose.connection.host,
    database: mongoose.connection.name,
    error: null
  };
  console.log(`[Database Event] Mongoose connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
});

mongoose.connection.on('disconnected', () => {
  connectionState = {
    status: 'disconnected',
    host: null,
    database: null,
    error: connectionState.error || 'Connection closed'
  };
  console.log('[Database Event] Mongoose disconnected.');
});

mongoose.connection.on('error', (err) => {
  connectionState = {
    status: 'disconnected',
    host: null,
    database: null,
    error: err.message
  };
  console.warn(`[Database Event] Mongoose error: ${err.message}`);
});

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pollution_monitoring_db';
  
  try {
    connectionState.status = 'connecting';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000 // Prevents hanging if local DB daemon is not running
    });

    connectionState = {
      status: 'connected',
      host: conn.connection.host,
      database: conn.connection.name,
      error: null
    };

    console.log(`[Database] MongoDB connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    connectionState = {
      status: 'disconnected',
      host: null,
      database: null,
      error: error.message
    };

    console.warn(`[Database Warning] MongoDB connection could not be established: ${error.message}`);
    console.warn(`[Database Warning] Backend will remain operational; set MONGODB_URI in backend/.env to connect.`);
  }
};

const getDBStatus = () => {
  // Check live mongoose readyState
  const readyStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  const currentStatus = readyStates[mongoose.connection.readyState] || connectionState.status;

  return {
    status: currentStatus,
    host: mongoose.connection.host || connectionState.host || null,
    database: mongoose.connection.name || connectionState.database || null,
    error: currentStatus === 'connected' ? null : connectionState.error
  };
};

module.exports = { connectDB, getDBStatus };

