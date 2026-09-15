const mongoose = require('mongoose');
const CONSTANTS = require('../config/constants');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
      maxlength: [120, 'Device name cannot exceed 120 characters'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates [longitude, latitude] are required'],
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
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: CONSTANTS.DEVICE_STATUS.LIST,
        message: 'Invalid device status: {VALUE}',
      },
      default: CONSTANTS.DEVICE_STATUS.OFFLINE,
      index: true,
    },
    batteryLevelPct: {
      type: Number,
      min: [0, 'Battery cannot be below 0%'],
      max: [100, 'Battery cannot exceed 100%'],
      default: 100,
    },
    signalStrengthRssi: {
      type: Number, // dBm, e.g. -70
    },
    firmwareVersion: {
      type: String,
      trim: true,
      default: '1.0.0',
    },
    installationDate: {
      type: Date,
      default: Date.now,
    },
    lastCommunicationAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    hardwareSpecs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'devices',
  }
);

// 2dsphere index for geospatial proximity queries
deviceSchema.index({ location: '2dsphere' });
deviceSchema.index({ status: 1, lastCommunicationAt: -1 });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
