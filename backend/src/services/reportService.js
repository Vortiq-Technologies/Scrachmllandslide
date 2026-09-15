const CitizenReport = require('../models/CitizenReport');
const RiskZone = require('../models/RiskZone');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class ReportService {
  /**
   * Submit citizen or field observation
   */
  async createReport(data, user = null) {
    let zoneId = data.zoneId;

    // If zoneId is not provided, perform spatial lookup
    if (!zoneId && data.location?.coordinates) {
      const intersectingZone = await RiskZone.findOne({
        boundary: {
          $geoIntersects: {
            $geometry: data.location,
          },
        },
      });
      if (intersectingZone) {
        zoneId = intersectingZone._id;
      }
    }

    const report = await CitizenReport.create({
      ...data,
      zoneId,
      reporterId: user ? user._id : null,
      reporterName: data.isAnonymous ? 'Anonymous Citizen' : data.reporterName || user?.name || 'Citizen Reporter',
      reporterPhone: data.isAnonymous ? undefined : data.reporterPhone || user?.phone,
    });

    logger.info(`Citizen report submitted: Type=${report.reportType}, Severity=${report.severity}`);
    return report;
  }

  /**
   * Query reports with pagination
   */
  async listReports(filters = {}, page = 1, limit = 20) {
    const query = {};
    if (filters.verificationStatus) query.verificationStatus = filters.verificationStatus;
    if (filters.reportType) query.reportType = filters.reportType;
    if (filters.zoneId) query.zoneId = filters.zoneId;

    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      CitizenReport.find(query)
        .populate('zoneId', 'name code currentRiskLevel')
        .populate('verifiedBy', 'name role')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CitizenReport.countDocuments(query),
    ]);

    return { reports, total, page, limit };
  }

  async getReportById(id) {
    const report = await CitizenReport.findById(id)
      .populate('zoneId')
      .populate('reporterId', 'name email phone')
      .populate('verifiedBy', 'name role');

    if (!report) {
      throw ApiError.notFound(`Citizen report with ID '${id}' not found`);
    }

    return report;
  }

  /**
   * Field officer verification of crowdsourced observation
   */
  async verifyReport(id, verificationStatus, officerNotes, officerUser) {
    const report = await CitizenReport.findById(id);
    if (!report) {
      throw ApiError.notFound(`Citizen report with ID '${id}' not found`);
    }

    report.verificationStatus = verificationStatus;
    report.officerNotes = officerNotes;
    report.verifiedBy = officerUser._id;
    report.verifiedAt = new Date();
    await report.save();

    logger.info(`Citizen report ${id} marked as ${verificationStatus} by officer ${officerUser.name}`);
    return report;
  }

  /**
   * Aggregated report statistics
   */
  async getReportStatistics() {
    const [byStatus, byType, bySeverity] = await Promise.all([
      CitizenReport.aggregate([{ $group: { _id: '$verificationStatus', count: { $sum: 1 } } }]),
      CitizenReport.aggregate([{ $group: { _id: '$reportType', count: { $sum: 1 } } }]),
      CitizenReport.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
    ]);

    return {
      byStatus,
      byType,
      bySeverity,
    };
  }
}

module.exports = new ReportService();
