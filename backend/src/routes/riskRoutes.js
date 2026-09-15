const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.post(
  '/zones',
  authenticate,
  authorizeRoles('admin', 'analyst'),
  (req, res, next) => riskController.createRiskZone(req, res, next)
);

router.get('/zones', (req, res, next) => riskController.listRiskZones(req, res, next));

router.get('/zones/:id', (req, res, next) => riskController.getRiskZoneById(req, res, next));

router.patch(
  '/zones/:id',
  authenticate,
  authorizeRoles('admin', 'analyst'),
  (req, res, next) => riskController.updateRiskZone(req, res, next)
);

// Trigger Python ML inference pipeline for a risk zone
router.post(
  '/zones/:id/evaluate',
  authenticate,
  authorizeRoles('admin', 'analyst'),
  (req, res, next) => riskController.evaluateRisk(req, res, next)
);

router.get('/zones/:id/prediction', (req, res, next) =>
  riskController.getLatestPrediction(req, res, next)
);

module.exports = router;
