const mongoose = require('mongoose');
const CONSTANTS = require('../config/constants');

const riskPredictionSchema = new mongoose.Schema(
  {
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      required: [true, 'RiskZone reference is required'],
      index: true,
    },
    timestamp: {
      type: Date,
      required: [true, 'Prediction timestamp is required'],
      default: Date.now,
      index: true,
    },
    riskScore: {
      type: Number,
      required: [true, 'Risk score is required'],
      min: [0, 'Risk score cannot be less than 0'],
      max: [1, 'Risk score cannot exceed 1'],
    },
    riskLevel: {
      type: String,
      required: [true, 'Risk level is required'],
      enum: {
        values: CONSTANTS.RISK_LEVELS.LIST,
        message: 'Invalid risk level: {VALUE}',
      },
      index: true,
    },
    probability: {
      type: Number,
      required: [true, 'Probability is required'],
      min: 0,
      max: 1,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.85,
    },
    predictionWindowHours: {
      type: Number,
      default: 24,
    },
    validUntil: {
      type: Date,
      index: true,
    },
    contributingFactors: [
      {
        factor: { type: String, required: true },
        importance: { type: Number, required: true },
        direction: { type: String, enum: ['increasing', 'decreasing', 'neutral'], default: 'increasing' },
      },
    ],
    featuresSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Features snapshot is required for reproducibility'],
    },
    modelVersion: {
      type: String,
      trim: true,
      default: 'v1.0.0',
    },
    provenance: {
      modelEndpoint: { type: String },
      executionDurationMs: { type: Number },
      isFallback: { type: Boolean, default: false },
      inferredByService: { type: String, default: 'python_ml_service' },
    },
  },
  {
    timestamps: true,
    collection: 'risk_predictions',
  }
);

riskPredictionSchema.index({ riskZoneId: 1, timestamp: -1 });
riskPredictionSchema.index({ riskLevel: 1, validUntil: -1 });

const RiskPrediction = mongoose.model('RiskPrediction', riskPredictionSchema);

module.exports = RiskPrediction;
