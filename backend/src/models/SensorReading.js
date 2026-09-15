const mongoose = require('mongoose');
const CONSTANTS = require('../config/constants');

const sensorReadingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.Mixed, // Supports ObjectId or String
      required: [true, 'Device identifier is required'],
      index: true,
    },
    sensorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sensor',
      index: true,
    },
    deviceRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      index: true,
    },
    timestamp: {
      type: Date,
      required: [true, 'Observation timestamp is required'],
      default: Date.now,
      index: true,
    },
    value: {
      type: Number,
    },
    unit: {
      type: String,
      trim: true,
    },
    readings: {
      type: mongoose.Schema.Types.Mixed,
    },
    quality: {
      type: String,
      enum: {
        values: CONSTANTS.SENSOR_QUALITY.LIST,
        message: 'Invalid sensor quality value: {VALUE}',
      },
      default: CONSTANTS.SENSOR_QUALITY.VALID,
      index: true,
    },
    qualityNotes: {
      type: String,
      trim: true,
    },
    qcStatus: {
      type: String,
      enum: ['VALID', 'OUT_OF_RANGE', 'ANOMALOUS', 'MISSING', 'INVALID', 'valid', 'out_of_range', 'anomalous', 'missing', 'invalid'],
      default: 'VALID',
      index: true,
    },
    qcFlags: {
      type: [String],
      default: [],
    },
    batteryPct: {
      type: Number,
      min: 0,
      max: 100,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (val) {
            return (
              Array.isArray(val) &&
              val.length === 2 &&
              val[0] >= -180 &&
              val[0] <= 180 &&
              val[1] >= -90 &&
              val[1] <= 90
            );
          },
          message: 'Invalid GeoJSON Point coordinates: [longitude (-180 to 180), latitude (-90 to 90)]',
        },
      },
    },
    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    collection: 'sensor_readings',
  }
);

// High-performance time-series and spatial query indexes
sensorReadingSchema.index({ sensorId: 1, timestamp: -1 });
sensorReadingSchema.index({ deviceId: 1, timestamp: -1 });
sensorReadingSchema.index({ location: '2dsphere' });
sensorReadingSchema.index({ quality: 1, timestamp: -1 });
sensorReadingSchema.index({ qcStatus: 1, timestamp: -1 });

const SensorReading = mongoose.model('SensorReading', sensorReadingSchema);

module.exports = SensorReading;
