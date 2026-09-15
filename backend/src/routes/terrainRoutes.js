const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const TerrainData = require('../models/TerrainData');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * GET /api/v1/terrain/:zoneId
 * Returns terrain metadata for a risk zone
 */
router.get(
  '/:zoneId',
  asyncHandler(async (req, res) => {
    const record = await TerrainData.findOne({ zoneId: req.params.zoneId }).lean();
    if (!record) {
      throw ApiError.notFound(`No terrain data found for zone '${req.params.zoneId}'`);
    }
    return ApiResponse.success(
      res,
      {
        elevation: record.elevation,
        slope: record.slope,
        aspect: record.aspect,
        terrainRuggedness: record.terrainRuggedness,
        soilType: record.soilType,
        vegetationDensity: record.vegetationDensity,
        zoneId: req.params.zoneId,
      },
      'Terrain information retrieved'
    );
  })
);

module.exports = router;
