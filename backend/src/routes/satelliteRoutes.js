const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const SatelliteData = require('../models/SatelliteData');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * GET /api/v1/satellite/:zoneId/latest
 * Returns the latest satellite-derived features for a zone
 */
router.get(
  '/:zoneId/latest',
  asyncHandler(async (req, res) => {
    const record = await SatelliteData.findOne({ zoneId: req.params.zoneId })
      .sort({ acquisitionDate: -1 })
      .lean();
    if (!record) {
      throw ApiError.notFound(`No satellite data found for zone '${req.params.zoneId}'`);
    }
    return ApiResponse.success(res, record, 'Latest satellite data retrieved');
  })
);

/**
 * GET /api/v1/satellite/:zoneId/history
 * Returns historical satellite records for a zone
 */
router.get(
  '/:zoneId/history',
  authenticate,
  asyncHandler(async (req, res) => {
    const { limit = 30 } = req.query;
    const records = await SatelliteData.find({ zoneId: req.params.zoneId })
      .sort({ acquisitionDate: -1 })
      .limit(Number(limit))
      .lean();
    return ApiResponse.success(res, records, 'Satellite data history retrieved');
  })
);

module.exports = router;
