const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const validate = require('../middleware/validateMiddleware');
const { createDeviceSchema, updateDeviceSchema } = require('../validators/deviceValidator');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.get('/status/health', authenticate, (req, res, next) =>
  deviceController.getHealthSummary(req, res, next)
);

router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'analyst'),
  validate(createDeviceSchema),
  (req, res, next) => deviceController.registerDevice(req, res, next)
);

router.get('/', authenticate, (req, res, next) => deviceController.listDevices(req, res, next));

router.get('/:id', authenticate, (req, res, next) => deviceController.getDeviceById(req, res, next));

router.patch(
  '/:id',
  authenticate,
  authorizeRoles('admin', 'analyst'),
  validate(updateDeviceSchema),
  (req, res, next) => deviceController.updateDevice(req, res, next)
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  (req, res, next) => deviceController.deleteDevice(req, res, next)
);

module.exports = router;
