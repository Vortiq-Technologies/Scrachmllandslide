const mongoose = require('mongoose');
const CONSTANTS = require('../config/constants');

const sensorSchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: [true, 'Sensor ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: [true, 'Device reference is required'],
      index: true,
    },
    sensorType: {
      type: String,
      required: [true, 'Sensor type is required'],
      enum: {
        values: CONSTANTS.SENSOR_TYPES.LIST,
        message: 'Invalid sensor type: {VALUE}',
      },
      index: true,
    },
    unit: {
      type: String,
      required: [true, 'Measurement unit is required'],
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    minNormalValue: {
      type: Number,
    },
    maxNormalValue: {
      type: Number,
    },
    warningThreshold: {
      type: Number,
    },
    criticalThreshold: {
      type: Number,
    },
    depthMeters: {
      type: Number, // Subsurface sensor depth, if applicable
      default: 0,
    },
    calibrationDate: {
      type: Date,
    },
    nextCalibrationDue: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'sensors',
  }
);

sensorSchema.index({ deviceId: 1, sensorType: 1 });

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
