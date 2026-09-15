const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const env = require('./config/env');
const CONSTANTS = require('./config/constants');
const db = require('./config/db');
const requestLogger = require('./middleware/requestLogger.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const mainRouter = require('./routes/index');

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

// 3. Response Compression
app.use(compression());

// 4. Request Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. HTTP Request Logging
app.use(requestLogger());

// 6. Root Welcome Route
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'AI-Based Landslide Risk Monitoring & Early Warning System API',
    data: {
      version: '1.0.0',
      canonicalApiPrefix: CONSTANTS.API_PREFIX,
      documentation: `${CONSTANTS.API_PREFIX}/health`,
    },
  });
});

// 7. Mount all versioned API routes at /api/v1
app.use(CONSTANTS.API_PREFIX, mainRouter);

// 8. Also mount at /api for convenience (same router)
app.use('/api', mainRouter);

// 9. 404 Route Not Found Handler
app.use(notFoundHandler);

// 10. Centralized Error Handler
app.use(errorHandler);

module.exports = app;
