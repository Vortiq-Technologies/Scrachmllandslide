const app = require('./app');
const env = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');

let server = null;

const startServer = async () => {
  try {
    console.log(`[Server] Initializing backend foundation in [${env.NODE_ENV}] mode...`);

    // 1. Attempt MongoDB connection
    try {
      await connectDB();
    } catch (dbErr) {
      console.warn(`[Server Warning] Initial MongoDB connection failed: ${dbErr.message}`);
      console.warn('[Server Warning] Server will start, but readiness endpoint /api/v1/ready will report 503 SERVICE_UNAVAILABLE until database is reachable.');
    }

    // 2. Start HTTP listener
    server = app.listen(env.PORT, () => {
      console.log(`[Server] Landslide Monitoring API listening on port ${env.PORT}`);
      console.log(`[Server] Canonical Health URL: http://localhost:${env.PORT}/api/v1/health`);
      console.log(`[Server] Canonical Ready URL:  http://localhost:${env.PORT}/api/v1/ready`);
    });

    return server;
  } catch (error) {
    console.error(`[Server Fatal] Initialization failed: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown procedure
const shutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('[Server] Closed HTTP listener.');
      try {
        await disconnectDB();
        console.log('[Server] Graceful shutdown completed cleanly.');
        process.exit(0);
      } catch (err) {
        console.error(`[Server Error] Error closing database during shutdown: ${err.message}`);
        process.exit(1);
      }
    });

    // Enforce shutdown timeout
    setTimeout(() => {
      console.error('[Server Error] Graceful shutdown timed out. Forcing process exit.');
      process.exit(1);
    }, 10000).unref();
  } else {
    process.exit(0);
  }
};

// Process-level signal listeners
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Process-level exception and rejection handlers
process.on('uncaughtException', (error) => {
  console.error('[Server Fatal] Uncaught Exception:', error.stack || error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Server Fatal] Unhandled Promise Rejection:', reason);
});

// Auto-start if run directly
if (require.main === module || env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, startServer, shutdown };
