const RiskZone = require('../models/RiskZone');
const Prediction = require('../models/Prediction');
const Alert = require('../models/Alert');
const mlPipelineService = require('./mlPipelineService');
const alertService = require('./alertService');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class RiskService {
  async createRiskZone(data) {
    const existing = await RiskZone.findOne({ code: data.code.toUpperCase() });
    if (existing) {
      throw ApiError.conflict(`RiskZone with code '${data.code}' already exists`);
    }

    // If center coordinates are not provided, estimate from first coordinate of polygon
    let center = data.center;
    if (!center && data.boundary?.coordinates?.[0]?.[0]) {
      const firstPoint = data.boundary.coordinates[0][0];
      center = { type: 'Point', coordinates: [firstPoint[0], firstPoint[1]] };
    }

    const zone = await RiskZone.create({
      ...data,
      code: data.code.toUpperCase(),
      center,
    });

    return zone;
  }

  async listRiskZones(filters = {}) {
    const query = {};
    if (filters.currentRiskLevel) {
      query.currentRiskLevel = filters.currentRiskLevel.toUpperCase();
    }

    const zones = await RiskZone.find(query)
      .populate('assignedOfficers', 'name email phone')
      .sort({ currentRiskScore: -1 })
      .lean();

    return zones;
  }

  async getRiskZoneById(id) {
    const zone = await RiskZone.findById(id).populate('assignedOfficers', 'name email phone');
    if (!zone) {
      throw ApiError.notFound(`RiskZone with ID '${id}' not found`);
    }

    // Attach latest prediction & active alerts
    const [latestPrediction, activeAlerts] = await Promise.all([
      Prediction.findOne({ zoneId: zone._id }).sort({ timestamp: -1 }).lean(),
      Alert.find({ zoneId: zone._id, status: 'ACTIVE' }).lean(),
    ]);

    const doc = zone.toObject();
    doc.latestPrediction = latestPrediction;
    doc.activeAlerts = activeAlerts;

    return doc;
  }

  async updateRiskZone(id, data) {
    const zone = await RiskZone.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!zone) {
      throw ApiError.notFound(`RiskZone with ID '${id}' not found`);
    }

    return zone;
  }

  /**
   * Run ML risk evaluation on a zone and automatically trigger alert if risk is elevated
   */
  async evaluateRisk(zoneId) {
    const result = await mlPipelineService.evaluateZoneRiskWithMl(zoneId);
    const { zone, prediction } = result;

    // Check if risk warrants automatic early warning alert
    if (prediction.riskLevel === 'HIGH' || prediction.riskLevel === 'CRITICAL') {
      try {
        await alertService.triggerAutomatedMlAlert(zone, prediction);
      } catch (err) {
        logger.error(`Failed to trigger automated alert for zone ${zone.code}: ${err.message}`);
      }
    }

    return result;
  }
}

module.exports = new RiskService();
