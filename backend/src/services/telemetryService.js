const SensorReading = require('../models/SensorReading');
const Device = require('../models/Device');
const logger = require('../utils/logger');

class TelemetryService {
  /**
   * Process and store a single hardware sensor observation
   */
  async ingestReading(payload) {
    const deviceId = payload.deviceId.toUpperCase();

    // Verify or find linked device
    const device = await Device.findOne({ deviceId });

    // Use device location if not explicitly provided in payload
    let coordinates = payload.location?.coordinates;
    if (!coordinates && device) {
      coordinates = device.location.coordinates;
    }
    if (!coordinates) {
      coordinates = [0, 0]; // Fallback if device is not pre-registered
    }

    // Run Quality Control (QC) analysis
    const { qcStatus, qcFlags } = this._performQcChecks(payload.readings);

    const reading = await SensorReading.create({
      deviceId,
      deviceRef: device ? device._id : null,
      location: {
        type: 'Point',
        coordinates,
      },
      timestamp: payload.timestamp || new Date(),
      readings: payload.readings,
      batteryPct: payload.batteryPct ?? (device ? device.batteryPct : 100),
      qcStatus,
      qcFlags,
      rawPayload: payload.rawPayload || payload,
    });

    // Update device status and heartbeat asynchronously
    if (device) {
      const updateFields = {
        lastSeenAt: new Date(),
        status: 'ACTIVE',
      };
      if (payload.batteryPct !== undefined) {
        updateFields.batteryPct = payload.batteryPct;
      }
      if (payload.location?.coordinates) {
        updateFields.location = payload.location;
      }
      await Device.findByIdAndUpdate(device._id, updateFields);
    }

    return reading;
  }

  /**
   * Ingest a batch of telemetry packets from a gateway
   */
  async ingestBatch(batch) {
    const results = [];
    const errors = [];

    for (let i = 0; i < batch.length; i++) {
      try {
        const item = batch[i];
        const reading = await this.ingestReading(item);
        results.push(reading);
      } catch (err) {
        logger.error(`Error ingesting telemetry item at index ${i}: ${err.message}`);
        errors.push({ index: i, message: err.message });
      }
    }

    return {
      totalIngested: results.length,
      failedCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      readings: results,
    };
  }

  /**
   * Query historical telemetry readings with pagination & date filters
   */
  async queryTelemetry(filters = {}, page = 1, limit = 50) {
    const query = {};

    if (filters.deviceId) query.deviceId = filters.deviceId.toUpperCase();
    if (filters.qcStatus) query.qcStatus = filters.qcStatus;

    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
      if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }

    const skip = (page - 1) * limit;

    const [readings, total] = await Promise.all([
      SensorReading.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      SensorReading.countDocuments(query),
    ]);

    return { readings, total, page, limit };
  }

  /**
   * Get latest N observations for a device
   */
  async getLatestReadingsForDevice(deviceId, count = 20) {
    return SensorReading.find({ deviceId: deviceId.toUpperCase() })
      .sort({ timestamp: -1 })
      .limit(Number(count))
      .lean();
  }

  /**
   * Automated QC inspection for telemetry readings
   */
  _performQcChecks(readings = {}) {
    const flags = [];
    let qcStatus = 'VALID';

    if (readings.rainfall_mm !== undefined && readings.rainfall_mm < 0) {
      flags.push('NEGATIVE_RAINFALL');
    }
    if (readings.rainfall_mm !== undefined && readings.rainfall_mm > 300) {
      flags.push('IMPLAUSIBLE_HOURLY_RAINFALL_SPIKE');
    }

    if (readings.soil_moisture_pct !== undefined) {
      if (readings.soil_moisture_pct < 0 || readings.soil_moisture_pct > 100) {
        flags.push('SOIL_MOISTURE_OUT_OF_BOUNDS');
      }
    }

    if (readings.pore_pressure_kpa !== undefined) {
      if (readings.pore_pressure_kpa < -50 || readings.pore_pressure_kpa > 250) {
        flags.push('PORE_PRESSURE_EXTREME');
      }
    }

    if (readings.tilt_degrees_x !== undefined && Math.abs(readings.tilt_degrees_x) > 90) {
      flags.push('TILT_X_OUT_OF_RANGE');
    }
    if (readings.tilt_degrees_y !== undefined && Math.abs(readings.tilt_degrees_y) > 90) {
      flags.push('TILT_Y_OUT_OF_RANGE');
    }

    if (flags.length > 0) {
      qcStatus = flags.some((f) => f.includes('OUT_OF_') || f.includes('IMPLAUSIBLE'))
        ? 'OUT_OF_RANGE'
        : 'ANOMALOUS';
    }

    return { qcStatus, qcFlags: flags };
  }
}

module.exports = new TelemetryService();
