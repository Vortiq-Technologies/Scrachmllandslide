const RiskZone = require('../models/RiskZone');
const Device = require('../models/Device');
const SensorReading = require('../models/SensorReading');
const Prediction = require('../models/Prediction');
const pythonMlClient = require('../integrations/pythonMlClient');
const weatherClient = require('../integrations/weatherClient');
const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');

class MlPipelineService {
  /**
   * Orchestrates feature normalization, Python ML HTTP inference, and prediction persistence
   *
   * @param {string} zoneId ObjectId of RiskZone
   */
  async evaluateZoneRiskWithMl(zoneId) {
    const zone = await RiskZone.findById(zoneId);
    if (!zone) {
      throw ApiError.notFound(`RiskZone with ID '${zoneId}' not found`);
    }

    // 1. Build and normalize feature vector
    const featureVector = await this.buildNormalizedFeatures(zone);

    // 2. Query external Python ML HTTP API
    const mlResult = await pythonMlClient.predictLandslideRisk(featureVector);

    // 3. Persist prediction record in MongoDB
    const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Valid for 24h
    const prediction = await Prediction.create({
      zoneId: zone._id,
      timestamp: new Date(),
      riskScore: mlResult.riskScore,
      riskLevel: mlResult.riskLevel,
      probability: mlResult.probability,
      confidenceScore: mlResult.confidenceScore,
      featureSnapshot: featureVector,
      contributingFactors: mlResult.contributingFactors,
      mlModelVersion: mlResult.mlModelVersion,
      predictionWindowHours: 24,
      validUntil,
    });

    // 4. Update RiskZone state
    zone.currentRiskScore = mlResult.riskScore;
    zone.currentRiskLevel = mlResult.riskLevel;
    zone.lastEvaluatedAt = new Date();
    await zone.save();

    // 5. Mark processed readings
    await SensorReading.updateMany(
      {
        location: {
          $geoWithin: {
            $geometry: zone.boundary,
          },
        },
        processedForMl: false,
      },
      { $set: { processedForMl: true } }
    );

    logger.info(
      `Zone '${zone.name}' (${zone.code}) evaluated: Risk=${mlResult.riskLevel} (Score=${mlResult.riskScore})`
    );

    return {
      zone: {
        id: zone._id,
        name: zone.name,
        code: zone.code,
        currentRiskLevel: zone.currentRiskLevel,
        currentRiskScore: zone.currentRiskScore,
      },
      prediction,
      isFallback: mlResult.isFallback || false,
      fallbackReason: mlResult.fallbackReason,
    };
  }

  /**
   * Gather sensor time-series, compute aggregates and build normalized feature payload
   */
  async buildNormalizedFeatures(zone) {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

    // Find devices in this zone
    const devices = await Device.find({
      $or: [
        { zoneId: zone._id },
        { location: { $geoWithin: { $geometry: zone.boundary } } },
      ],
    }).select('deviceId');

    const deviceIds = devices.map((d) => d.deviceId);

    // Fetch telemetry from the last 72 hours for these devices
    const readings72h = await SensorReading.find({
      deviceId: { $in: deviceIds },
      timestamp: { $gte: seventyTwoHoursAgo },
      qcStatus: { $in: ['VALID', 'ANOMALOUS'] },
    }).sort({ timestamp: 1 });

    const readings24h = readings72h.filter((r) => r.timestamp >= twentyFourHoursAgo);

    // Cumulative rainfall
    let rainfall24h = 0;
    let rainfall72h = 0;
    let porePressureSum = 0;
    let porePressureCount = 0;
    let soilMoistureSum = 0;
    let soilMoistureCount = 0;
    let maxTiltX = 0;
    let maxTiltY = 0;
    let vibrationSum = 0;
    let vibrationCount = 0;

    for (const r of readings72h) {
      if (r.readings?.rainfall_mm) rainfall72h += r.readings.rainfall_mm;
    }

    for (const r of readings24h) {
      if (r.readings?.rainfall_mm) rainfall24h += r.readings.rainfall_mm;
      if (r.readings?.pore_pressure_kpa !== undefined) {
        porePressureSum += r.readings.pore_pressure_kpa;
        porePressureCount++;
      }
      if (r.readings?.soil_moisture_pct !== undefined) {
        soilMoistureSum += r.readings.soil_moisture_pct;
        soilMoistureCount++;
      }
      if (r.readings?.tilt_degrees_x !== undefined) {
        maxTiltX = Math.max(maxTiltX, Math.abs(r.readings.tilt_degrees_x));
      }
      if (r.readings?.tilt_degrees_y !== undefined) {
        maxTiltY = Math.max(maxTiltY, Math.abs(r.readings.tilt_degrees_y));
      }
      if (r.readings?.vibration_intensity !== undefined) {
        vibrationSum += r.readings.vibration_intensity;
        vibrationCount++;
      }
    }

    // Tilt velocity (change between first and last reading in 24h)
    let tiltRate = 0;
    if (readings24h.length >= 2) {
      const first = readings24h[0].readings?.tilt_degrees_x || 0;
      const last = readings24h[readings24h.length - 1].readings?.tilt_degrees_x || 0;
      tiltRate = Math.abs((last - first) / 24);
    }

    // External weather forecast
    const centerCoords = zone.center?.coordinates || [78.5, 30.5];
    const weather = await weatherClient.getWeatherForCoordinates(centerCoords[1], centerCoords[0]);

    return {
      zone_id: zone._id.toString(),
      zone_code: zone.code,
      slope_angle_deg: zone.baselineSlopeAngle || 32,
      cumulative_rainfall_24h_mm: Number(rainfall24h.toFixed(2)),
      cumulative_rainfall_72h_mm: Number(rainfall72h.toFixed(2)),
      pore_pressure_kpa: porePressureCount > 0 ? Number((porePressureSum / porePressureCount).toFixed(2)) : 10.0,
      soil_moisture_pct: soilMoistureCount > 0 ? Number((soilMoistureSum / soilMoistureCount).toFixed(2)) : 45.0,
      tilt_max_deg: Number(Math.max(maxTiltX, maxTiltY).toFixed(2)),
      tilt_rate_deg_per_hr: Number(tiltRate.toFixed(4)),
      vibration_intensity_mean: vibrationCount > 0 ? Number((vibrationSum / vibrationCount).toFixed(3)) : 0.02,
      forecast_rainfall_next_24h_mm: Number((weather.rainfallLast3hMm * 8).toFixed(2)),
      temperature_c: weather.temperatureC,
      humidity_pct: weather.humidityPct,
      historical_events_count: zone.historicalEventsCount || 0,
    };
  }

  /**
   * Get latest prediction for a zone
   */
  async getLatestPrediction(zoneId) {
    return Prediction.findOne({ zoneId }).sort({ timestamp: -1 }).lean();
  }
}

module.exports = new MlPipelineService();
