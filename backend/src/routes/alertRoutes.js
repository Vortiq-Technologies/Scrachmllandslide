const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const validate = require('../middleware/validateMiddleware');
const {
  createAlertSchema,
  updateAlertStatusSchema,
  alertQuerySchema,
} = require('../validators/alertValidator');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'analyst', 'field_officer'),
  validate(createAlertSchema),
  (req, res, next) => alertController.createAlert(req, res, next)
);

router.get(
  '/',
  validate(alertQuerySchema, 'query'),
  (req, res, next) => alertController.listAlerts(req, res, next)
);

router.get('/:id', (req, res, next) => alertController.getAlertById(req, res, next));

router.post(
  '/:id/acknowledge',
  authenticate,
  authorizeRoles('admin', 'analyst', 'field_officer'),
  (req, res, next) => alertController.acknowledgeAlert(req, res, next)
);

router.post(
  '/:id/resolve',
  authenticate,
  authorizeRoles('admin', 'analyst'),
  validate(updateAlertStatusSchema),
  (req, res, next) => alertController.resolveAlert(req, res, next)
);

module.exports = router;
