const mongoose = require('mongoose');
const env = require('./env');
const CONSTANTS = require('./constants');

let isConnecting = false;

const connectDB = async (customUri = null) => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return;
  }

  const uri = customUri || env.MONGO_URI;

  try {
    isConnecting = true;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: env.NODE_ENV !== 'production',
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  } finally {
    isConnecting = false;
  }
};

// Event listeners for connection monitoring
mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] Runtime error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[Database Warning] MongoDB disconnected. Waiting for reconnection...');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected successfully.');
});

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Database] MongoDB connection closed.');
  }
};

const getDatabaseStatus = () => {
  const readyState = mongoose.connection.readyState;
  return {
    isConnected: readyState === 1,
    readyState,
    statusText: CONSTANTS.MONGOOSE_STATES[readyState] || 'UNKNOWN',
    host: mongoose.connection.host || null,
    databaseName: mongoose.connection.name || null,
  };
};

module.exports = {
  connectDB,
  disconnectDB,
  getDatabaseStatus,
};
