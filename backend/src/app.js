const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const env = require('./config/env');
const CONSTANTS = require('./config/constants');
const db = require('./config/db');
const requestLogger = require('./middleware/requestLogger.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const asyncHandler = require('./utils/asyncHandler');
const { sendSuccess, sendError } = require('./utils/response');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true,
  })
);

// 3. Request Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. HTTP Request Logging
app.use(requestLogger());

// 5. Root Welcome Route
app.get('/', (req, res) => {
  return sendSuccess(res, {
    message: 'AI-Based Landslide Risk Monitoring & Early Warning System API',
    data: {
      version: '1.0.0',
      canonicalApiPrefix: CONSTANTS.API_PREFIX,
      documentation: `${CONSTANTS.API_PREFIX}/health`,
    },
  });
});

// 6. Versioned Foundation Routes (/api/v1)
const v1Router = express.Router();

/**
 * Health Check Endpoint
 * GET /api/v1/health
 * Indicates whether the application server process is alive.
 */
v1Router.get(
  '/health',
  asyncHandler(async (req, res) => {
    return sendSuccess(res, {
      message: 'Service is healthy',
      data: {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        environment: env.NODE_ENV,
      },
    });
  })
);

/**
 * Readiness Check Endpoint
 * GET /api/v1/ready
 * Indicates whether the application and its critical dependencies (MongoDB) are ready to serve traffic.
 */
v1Router.get(
  '/ready',
  asyncHandler(async (req, res) => {
    const dbStatus = db.getDatabaseStatus();

    if (!dbStatus.isConnected) {
      return sendError(res, {
        statusCode: 503,
        message: 'Service is not ready: Database connection unavailable',
        code: CONSTANTS.ERROR_CODES.SERVICE_UNAVAILABLE,
        details: {
          database: dbStatus,
        },
      });
    }

    return sendSuccess(res, {
      message: 'Service is ready to handle traffic',
      data: {
        status: 'READY',
        timestamp: new Date().toISOString(),
        database: dbStatus,
      },
    });
  })
);

// Authentication Routes (/api/v1/auth)
v1Router.use('/auth', authRoutes);

// Mount canonical v1 prefix
app.use(CONSTANTS.API_PREFIX, v1Router);

// 7. 404 Route Not Found Handler
app.use(notFoundHandler);

// 8. Centralized Error Handler
app.use(errorHandler);

module.exports = app;
