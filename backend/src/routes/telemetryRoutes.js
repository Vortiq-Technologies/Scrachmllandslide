const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');
const validate = require('../middleware/validateMiddleware');
const {
  ingestTelemetrySchema,
  telemetryQuerySchema,
} = require('../validators/telemetryValidator');
const { authenticate, authenticateHardwareOrUser } = require('../middleware/authMiddleware');
const { ingestionLimiter } = require('../middleware/rateLimiterMiddleware');

// Ingestion endpoint accepts hardware API key (x-device-key) or JWT
router.post(
  '/ingest',
  ingestionLimiter,
  authenticateHardwareOrUser,
  validate(ingestTelemetrySchema),
  (req, res, next) => telemetryController.ingest(req, res, next)
);

router.get(
  '/',
  authenticate,
  validate(telemetryQuerySchema, 'query'),
  (req, res, next) => telemetryController.query(req, res, next)
);

router.get('/devices/:deviceId/latest', authenticate, (req, res, next) =>
  telemetryController.getLatestByDevice(req, res, next)
);

module.exports = router;
