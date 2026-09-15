const mongoose = require('mongoose');
const CONSTANTS = require('../config/constants');

const riskZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Zone name is required'],
      trim: true,
      maxlength: [150, 'Zone name cannot exceed 150 characters'],
    },
    code: {
      type: String,
      required: [true, 'Zone code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    district: {
      type: String,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
      index: true,
    },
    boundary: {
      type: {
        type: String,
        enum: ['Polygon', 'MultiPolygon'],
        default: 'Polygon',
        required: true,
      },
      coordinates: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Boundary coordinates are required'],
      },
    },
    centroid: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
    currentRiskLevel: {
      type: String,
      enum: {
        values: CONSTANTS.RISK_LEVELS.LIST,
        message: 'Invalid risk level: {VALUE}',
      },
      default: CONSTANTS.RISK_LEVELS.LOW,
      index: true,
    },
    currentRiskScore: {
      type: Number,
      min: [0, 'Risk score cannot be less than 0'],
      max: [1, 'Risk score cannot exceed 1'],
      default: 0.0,
      index: true,
    },
    baselineSlopeAngle: {
      type: Number, // In degrees (e.g. 38.5)
      default: 30,
    },
    soilType: {
      type: String,
      trim: true,
    },
    vegetationCover: {
      type: String,
      trim: true,
    },
    historicalEventsCount: {
      type: Number,
      default: 0,
    },
    activeAlertCount: {
      type: Number,
      default: 0,
      index: true,
    },
    lastEvaluatedAt: {
      type: Date,
      default: Date.now,
    },
    assignedOfficers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    demographics: {
      estimatedPopulation: { type: Number, default: 0 },
      criticalInfrastructure: [{ type: String }],
    },
  },
  {
    timestamps: true,
    collection: 'risk_zones',
  }
);

// GeoJSON 2dsphere index for polygon spatial containment and intersection queries
riskZoneSchema.index({ boundary: '2dsphere' });
riskZoneSchema.index({ district: 1, currentRiskLevel: 1 });

const RiskZone = mongoose.model('RiskZone', riskZoneSchema);

module.exports = RiskZone;
