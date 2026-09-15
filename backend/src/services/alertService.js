const Alert = require('../models/Alert');
const RiskZone = require('../models/RiskZone');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class AlertService {
  /**
   * Create an early warning alert (by authority or system)
   */
  async createAlert(data, user = null) {
    const zone = data.zoneId ? await RiskZone.findById(data.zoneId) : null;
    const alertCode = `ALT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const alert = await Alert.create({
      ...data,
      alertCode,
      zoneName: data.zoneName || zone?.name || 'Monitored Region',
      affectedArea: data.affectedArea || zone?.boundary,
      issuedBy: user ? user._id : null,
      broadcastChannels: [
        { channel: 'WEB_DASHBOARD', status: 'SENT' },
        { channel: 'MOBILE_PUSH', status: 'SENT' },
      ],
    });

    if (zone) {
      await RiskZone.findByIdAndUpdate(zone._id, { $inc: { activeAlertCount: 1 } });
    }

    logger.info(`Alert issued: [${alert.severity}] ${alert.title} (Code: ${alert.alertCode})`);
    return alert;
  }

  /**
   * Automated trigger when ML model predicts high or critical slope instability
   */
  async triggerAutomatedMlAlert(zone, prediction) {
    // Check if there is already an active alert for this zone to avoid duplicate flood
    const existingActive = await Alert.findOne({
      zoneId: zone.id || zone._id,
      status: { $in: ['ACTIVE', 'ACKNOWLEDGED'] },
    });

    if (existingActive) {
      logger.info(`Active alert already exists for zone ${zone.name}. Skipping auto-duplicate.`);
      return existingActive;
    }

    const severity = prediction.riskLevel === 'CRITICAL' ? 'EMERGENCY_EVACUATION' : 'WARNING';
    const title = `Automated Early Warning: Elevated Landslide Risk in ${zone.name}`;
    const description =
      `Real-time sensor telemetry and ML inference indicate a ${prediction.riskLevel} probability ` +
      `(${Math.round(prediction.probability * 100)}%) of slope failure within the next 24 hours. ` +
      `Immediate geotechnical assessment and public precaution advised.`;

    const instructions =
      severity === 'EMERGENCY_EVACUATION'
        ? [
            'Trigger local audible warning sirens.',
            'Initiate precautionary evacuation along vulnerable downslope settlements.',
            'Suspend heavy transit along adjacent highway cuts.',
          ]
        : [
            'Alert rapid response teams and ground observers.',
            'Advise residents to inspect surroundings for tension cracks or sudden seepage.',
            'Prepare emergency shelter facilities.',
          ];

    return this.createAlert({
      zoneId: zone.id || zone._id,
      zoneName: zone.name,
      severity,
      triggerSource: 'ML_MODEL',
      title,
      description,
      instructions,
      riskScore: prediction.riskScore,
      affectedArea: zone.boundary,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  /**
   * Query alerts with pagination and filters
   */
  async listAlerts(filters = {}, page = 1, limit = 20) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.severity) query.severity = filters.severity;
    if (filters.zoneId) query.zoneId = filters.zoneId;

    const skip = (page - 1) * limit;

    const [alerts, total] = await Promise.all([
      Alert.find(query)
        .populate('issuedBy', 'name email role')
        .populate('acknowledgedBy', 'name email role')
        .populate('resolvedBy', 'name email role')
        .sort({ issuedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Alert.countDocuments(query),
    ]);

    return { alerts, total, page, limit };
  }

  /**
   * Get single alert by ID or Code
   */
  async getAlertById(id) {
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { alertCode: id.toUpperCase() };

    const alert = await Alert.findOne(query)
      .populate('zoneId')
      .populate('issuedBy', 'name role')
      .populate('acknowledgedBy', 'name role')
      .populate('resolvedBy', 'name role');

    if (!alert) {
      throw ApiError.notFound(`Alert with identifier '${id}' not found`);
    }

    return alert;
  }

  /**
   * Acknowledge alert by operational officer
   */
  async acknowledgeAlert(id, user) {
    const alert = await this.getAlertById(id);

    if (alert.status !== 'ACTIVE') {
      throw ApiError.badRequest(`Cannot acknowledge alert in '${alert.status}' state`);
    }

    alert.status = 'ACKNOWLEDGED';
    alert.acknowledgedBy = user._id;
    alert.acknowledgedAt = new Date();
    await alert.save();

    logger.info(`Alert ${alert.alertCode} acknowledged by ${user.name}`);
    return alert;
  }

  /**
   * Resolve alert and update active alert counts
   */
  async resolveAlert(id, user, resolutionNotes = '') {
    const alert = await this.getAlertById(id);

    if (alert.status === 'RESOLVED') {
      throw ApiError.badRequest('Alert is already resolved');
    }

    alert.status = 'RESOLVED';
    alert.resolvedBy = user._id;
    alert.resolvedAt = new Date();
    alert.resolutionNotes = resolutionNotes;
    await alert.save();

    if (alert.zoneId) {
      await RiskZone.findByIdAndUpdate(alert.zoneId, {
        $inc: { activeAlertCount: -1 },
      });
    }

    logger.info(`Alert ${alert.alertCode} resolved by ${user.name}`);
    return alert;
  }
}

module.exports = new AlertService();
