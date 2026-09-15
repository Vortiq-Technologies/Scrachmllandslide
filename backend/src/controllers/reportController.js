const reportService = require('../services/reportService');
const ApiResponse = require('../utils/apiResponse');

class ReportController {
  async createReport(req, res, next) {
    try {
      const report = await reportService.createReport(req.body, req.user || null);
      return ApiResponse.created(res, report, 'Ground observation report submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  async listReports(req, res, next) {
    try {
      const { page = 1, limit = 20, verificationStatus, reportType, zoneId } = req.query;
      const result = await reportService.listReports(
        { verificationStatus, reportType, zoneId },
        Number(page),
        Number(limit)
      );

      return ApiResponse.paginated(
        res,
        result.reports,
        result.page,
        result.limit,
        result.total,
        'Reports retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async getReportById(req, res, next) {
    try {
      const report = await reportService.getReportById(req.params.id);
      return ApiResponse.success(res, report, 'Report retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyReport(req, res, next) {
    try {
      const { verificationStatus, officerNotes } = req.body;
      const report = await reportService.verifyReport(
        req.params.id,
        verificationStatus,
        officerNotes,
        req.user
      );
      return ApiResponse.success(res, report, 'Report verified successfully');
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const stats = await reportService.getReportStatistics();
      return ApiResponse.success(res, stats, 'Report statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
