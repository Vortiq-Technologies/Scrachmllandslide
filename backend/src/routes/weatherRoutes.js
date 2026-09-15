const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const WeatherData = require('../models/WeatherData');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { authenticate } = require('../middleware/authMiddleware');
const env = require('../config/env');
const axios = require('axios');

/**
 * GET /api/v1/weather/:zoneId/current
 * Returns latest weather data for a zone (from cache/DB)
 */
router.get(
  '/:zoneId/current',
  asyncHandler(async (req, res) => {
    const record = await WeatherData.findOne({ zoneId: req.params.zoneId })
      .sort({ timestamp: -1 })
      .lean();
    if (!record) {
      throw ApiError.notFound(`No weather data found for zone '${req.params.zoneId}'`);
    }
    return ApiResponse.success(res, record, 'Current weather data retrieved');
  })
);

/**
 * GET /api/v1/weather/:zoneId/history
 * Returns historical weather records for a zone
 */
router.get(
  '/:zoneId/history',
  authenticate,
  asyncHandler(async (req, res) => {
    const { limit = 48 } = req.query;
    const records = await WeatherData.find({ zoneId: req.params.zoneId })
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .lean();
    return ApiResponse.success(res, records, 'Weather history retrieved');
  })
);

/**
 * GET /api/v1/weather/:zoneId/forecast
 * Returns weather forecast (from cached forecast field or external provider stub)
 */
router.get(
  '/:zoneId/forecast',
  asyncHandler(async (req, res) => {
    // In production: call external weather provider for forecast
    // For prototype: return stub forecast from latest record metadata
    const latest = await WeatherData.findOne({ zoneId: req.params.zoneId })
      .sort({ timestamp: -1 })
      .lean();

    return ApiResponse.success(
      res,
      {
        zoneId: req.params.zoneId,
        forecastSource: 'stub',
        note: 'External weather data is ingested directly by the Python ML service. This endpoint serves cached values for client dashboards.',
        latestObservation: latest || null,
      },
      'Weather forecast retrieved'
    );
  })
);

module.exports = router;
