const mongoose = require('mongoose');
const CONSTANTS = require('../config/constants');

const alertSchema = new mongoose.Schema(
  {
    alertCode: {
      type: String,
      required: [true, 'Alert code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      required: [true, 'RiskZone reference is required'],
      index: true,
    },
    zoneName: {
      type: String,
      required: [true, 'Zone name is required'],
      trim: true,
    },
    affectedArea: {
      type: {
        type: String,
        enum: ['Polygon', 'MultiPolygon'],
        default: 'Polygon',
        required: true,
      },
      coordinates: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    severity: {
      type: String,
      enum: {
        values: CONSTANTS.RISK_LEVELS.LIST,
        message: 'Invalid severity: {VALUE}',
      },
      required: [true, 'Severity is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: CONSTANTS.ALERT_STATUS.LIST,
        message: 'Invalid alert status: {VALUE}',
      },
      default: CONSTANTS.ALERT_STATUS.ACTIVE,
      index: true,
    },
    triggerSource: {
      type: String,
      enum: ['ml_prediction', 'sensor_threshold', 'manual_authority', 'citizen_report_cluster'],
      required: [true, 'Trigger source is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Alert description is required'],
    },
    instructions: {
      type: [String],
      default: [],
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    acknowledgedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'alerts',
  }
);

alertSchema.index({ affectedArea: '2dsphere' });
alertSchema.index({ status: 1, severity: 1, issuedAt: -1 });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
