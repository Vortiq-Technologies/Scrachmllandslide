const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const Sensor = require('../models/Sensor');
const SensorReading = require('../models/SensorReading');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

/**
 * POST /api/v1/sensors
 * Register a new sensor device
 */
router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'analyst'),
  asyncHandler(async (req, res) => {
    const sensor = await Sensor.create(req.body);
    return ApiResponse.created(res, sensor, 'Sensor registered successfully');
  })
);

/**
 * GET /api/v1/sensors
 * List sensors with optional deviceId filter
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.deviceId) query.deviceId = req.query.deviceId;
    if (req.query.type) query.type = req.query.type;
    const sensors = await Sensor.find(query).populate('deviceId', 'deviceId name status').lean();
    return ApiResponse.success(res, sensors, 'Sensors retrieved successfully');
  })
);

/**
 * GET /api/v1/sensors/:sensorId
 * Get single sensor metadata
 */
router.get(
  '/:sensorId',
  authenticate,
  asyncHandler(async (req, res) => {
    const sensor = await Sensor.findById(req.params.sensorId).populate('deviceId');
    if (!sensor) throw ApiError.notFound(`Sensor with ID '${req.params.sensorId}' not found`);
    return ApiResponse.success(res, sensor, 'Sensor details retrieved');
  })
);

/**
 * GET /api/v1/sensors/:sensorId/readings
 * Time-series readings for a sensor with from/to date filters
 */
router.get(
  '/:sensorId/readings',
  authenticate,
  asyncHandler(async (req, res) => {
    const { from, to, limit = 100 } = req.query;
    const query = { sensorId: req.params.sensorId };
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }
    const readings = await SensorReading.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .lean();
    return ApiResponse.success(res, readings, 'Sensor readings retrieved');
  })
);

module.exports = router;
