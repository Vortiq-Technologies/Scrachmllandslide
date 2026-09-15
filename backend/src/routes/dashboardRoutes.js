const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const RiskZone = require('../models/RiskZone');
const Alert = require('../models/Alert');
const Device = require('../models/Device');
const Report = require('../models/Report');
const SensorReading = require('../models/SensorReading');
const ApiResponse = require('../utils/apiResponse');

/**
 * GET /api/v1/dashboard/overview
 * Executive / Operational high-level overview metrics (§38)
 */
router.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const [
      totalZones,
      zonesByRisk,
      activeAlertsCount,
      criticalAlertsCount,
      onlineDevices,
      totalDevices,
      recentReportsCount,
      latestAlerts,
    ] = await Promise.all([
      RiskZone.countDocuments(),
      RiskZone.aggregate([
        { $group: { _id: '$currentRiskLevel', count: { $sum: 1 } } },
      ]),
      Alert.countDocuments({ status: { $in: ['active', 'ACTIVE', 'acknowledged', 'ACKNOWLEDGED'] } }),
      Alert.countDocuments({
        status: { $in: ['active', 'ACTIVE'] },
        severity: { $in: ['critical', 'CRITICAL', 'high', 'HIGH', 'EMERGENCY_EVACUATION'] },
      }),
      Device.countDocuments({ status: { $in: ['online', 'ONLINE', 'active', 'ACTIVE'] } }),
      Device.countDocuments(),
      Report.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Alert.find({ status: { $in: ['active', 'ACTIVE'] } })
        .sort({ issuedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const riskDistribution = {
      low: 0,
      moderate: 0,
      high: 0,
      critical: 0,
    };
    zonesByRisk.forEach((item) => {
      const key = String(item._id || '').toLowerCase();
      if (key in riskDistribution) riskDistribution[key] = item.count;
    });

    return ApiResponse.success(
      res,
      {
        zones: {
          total: totalZones,
          distribution: riskDistribution,
        },
        alerts: {
          active: activeAlertsCount,
          critical: criticalAlertsCount,
          recent: latestAlerts,
        },
        devices: {
          total: totalDevices,
          online: onlineDevices,
          offline: Math.max(0, totalDevices - onlineDevices),
          healthPct: totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 100,
        },
        reports: {
          past7Days: recentReportsCount,
        },
        systemStatus: 'OPERATIONAL',
        timestamp: new Date().toISOString(),
      },
      'Dashboard overview retrieved successfully'
    );
  })
);

module.exports = router;
