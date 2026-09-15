const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const HistoricalEvent = require('../models/HistoricalEvent');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

/**
 * GET /api/v1/historical-events
 * List historical landslide events with filters and pagination
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { riskZoneId, triggerType, severity, page = 1, limit = 50 } = req.query;
    const query = {};
    if (riskZoneId) query.riskZoneId = riskZoneId;
    if (triggerType) query.triggerType = triggerType;
    if (severity) query.severity = severity;

    const skip = (Number(page) - 1) * Number(limit);
    const [events, total] = await Promise.all([
      HistoricalEvent.find(query).sort({ eventDate: -1 }).skip(skip).limit(Number(limit)).lean(),
      HistoricalEvent.countDocuments(query),
    ]);

    return ApiResponse.paginated(res, events, Number(page), Number(limit), total, 'Historical events retrieved');
  })
);

/**
 * GET /api/v1/historical-events/nearby
 * Spatial query for past events near coordinates
 */
router.get(
  '/nearby',
  asyncHandler(async (req, res) => {
    const { longitude, latitude, maxDistance = 50000 } = req.query;
    if (!longitude || !latitude) {
      throw ApiError.badRequest('longitude and latitude are required');
    }

    const events = await HistoricalEvent.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: Number(maxDistance),
        },
      },
    }).limit(20).lean();

    return ApiResponse.success(res, events, 'Nearby historical events retrieved');
  })
);

/**
 * GET /api/v1/historical-events/:id
 * Get single historical landslide event
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const event = await HistoricalEvent.findById(req.params.id);
    if (!event) throw ApiError.notFound(`Historical event '${req.params.id}' not found`);
    return ApiResponse.success(res, event, 'Historical event details retrieved');
  })
);

/**
 * POST /api/v1/historical-events
 * Record a new historical event (Admin / Analyst)
 */
router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'analyst', 'super_admin'),
  asyncHandler(async (req, res) => {
    const event = await HistoricalEvent.create(req.body);
    return ApiResponse.created(res, event, 'Historical event recorded successfully');
  })
);

module.exports = router;
