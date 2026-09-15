const telemetryService = require('../services/telemetryService');
const ApiResponse = require('../utils/apiResponse');

class TelemetryController {
  async ingest(req, res, next) {
    try {
      if (Array.isArray(req.body)) {
        const batchResult = await telemetryService.ingestBatch(req.body);
        return ApiResponse.created(res, batchResult, 'Batch telemetry processed successfully');
      }

      const reading = await telemetryService.ingestReading(req.body);
      return ApiResponse.created(res, reading, 'Sensor reading ingested successfully');
    } catch (error) {
      next(error);
    }
  }

  async query(req, res, next) {
    try {
      const { page = 1, limit = 50, deviceId, qcStatus, startDate, endDate } = req.query;
      const result = await telemetryService.queryTelemetry(
        { deviceId, qcStatus, startDate, endDate },
        Number(page),
        Number(limit)
      );

      return ApiResponse.paginated(
        res,
        result.readings,
        result.page,
        result.limit,
        result.total,
        'Telemetry records retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async getLatestByDevice(req, res, next) {
    try {
      const { limit = 20 } = req.query;
      const readings = await telemetryService.getLatestReadingsForDevice(req.params.deviceId, limit);
      return ApiResponse.success(res, readings, 'Latest device readings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TelemetryController();
