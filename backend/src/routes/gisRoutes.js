const express = require('express');
const router = express.Router();
const gisController = require('../controllers/gisController');
const validate = require('../middleware/validateMiddleware');
const { nearbyQuerySchema, bboxQuerySchema } = require('../validators/gisValidator');

// GeoJSON spatial vector layers for Web and Mobile maps
router.get('/zones', (req, res, next) => gisController.getRiskZonesLayer(req, res, next));

router.get('/devices', (req, res, next) => gisController.getDevicesLayer(req, res, next));

router.get('/reports', (req, res, next) => gisController.getReportsLayer(req, res, next));

router.get(
  '/nearby',
  validate(nearbyQuerySchema, 'query'),
  (req, res, next) => gisController.getNearbyOverview(req, res, next)
);

router.get(
  '/bbox',
  validate(bboxQuerySchema, 'query'),
  (req, res, next) => gisController.getBboxOverview(req, res, next)
);

module.exports = router;
