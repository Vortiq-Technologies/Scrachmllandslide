const alertService = require('../services/alertService');
const ApiResponse = require('../utils/apiResponse');

class AlertController {
  async createAlert(req, res, next) {
    try {
      const alert = await alertService.createAlert(req.body, req.user);
      return ApiResponse.created(res, alert, 'Early warning alert issued successfully');
    } catch (error) {
      next(error);
    }
  }

  async listAlerts(req, res, next) {
    try {
      const { status, severity, zoneId, page = 1, limit = 20 } = req.query;
      const result = await alertService.listAlerts(
        { status, severity, zoneId },
        Number(page),
        Number(limit)
      );

      return ApiResponse.paginated(
        res,
        result.alerts,
        result.page,
        result.limit,
        result.total,
        'Alerts retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async getAlertById(req, res, next) {
    try {
      const alert = await alertService.getAlertById(req.params.id);
      return ApiResponse.success(res, alert, 'Alert retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async acknowledgeAlert(req, res, next) {
    try {
      const alert = await alertService.acknowledgeAlert(req.params.id, req.user);
      return ApiResponse.success(res, alert, 'Alert acknowledged successfully');
    } catch (error) {
      next(error);
    }
  }

  async resolveAlert(req, res, next) {
    try {
      const { resolutionNotes } = req.body;
      const alert = await alertService.resolveAlert(req.params.id, req.user, resolutionNotes);
      return ApiResponse.success(res, alert, 'Alert resolved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AlertController();
