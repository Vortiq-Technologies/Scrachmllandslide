const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    deviceId: {
      type: String,
      trim: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      required: true,
      index: true,
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.85,
    },
    featureSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    contributingFactors: [
      {
        factor: { type: String, required: true },
        importance: { type: Number, required: true },
        direction: { type: String, enum: ['INCREASING', 'DECREASING', 'NEUTRAL'], default: 'INCREASING' },
      },
    ],
    mlModelVersion: {
      type: String,
      default: 'v1.0.0',
    },
    predictionWindowHours: {
      type: Number,
      default: 24,
    },
    validUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

predictionSchema.index({ zoneId: 1, timestamp: -1 });

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;
