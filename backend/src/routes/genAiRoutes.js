const express = require('express');
const router = express.Router();
const genAiController = require('../controllers/genAiController');
const validate = require('../middleware/validateMiddleware');
const { explainRiskSchema, draftAdvisorySchema } = require('../validators/genAiValidator');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Controlled GenAI explanation layer: requires authentication
router.post(
  '/explain-risk',
  authenticate,
  (req, res, next) => genAiController.explainRisk(req, res, next)
);

router.post(
  '/draft-advisory',
  authenticate,
  authorizeRoles('admin', 'analyst', 'field_officer'),
  (req, res, next) => genAiController.draftAdvisory(req, res, next)
);

router.post(
  '/chat',
  authenticate,
  (req, res, next) => genAiController.chat(req, res, next)
);

router.post(
  '/generate-report',
  authenticate,
  (req, res, next) => genAiController.generateReport(req, res, next)
);

router.post(
  '/generate-alert',
  authenticate,
  authorizeRoles('admin', 'analyst', 'field_officer'),
  (req, res, next) => genAiController.generateAlert(req, res, next)
);

module.exports = router;

