const mongoose = require('mongoose');
const CONSTANTS = require('../config/constants');

const historicalEventSchema = new mongoose.Schema(
  {
    eventCode: {
      type: String,
      required: [true, 'Event code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point', 'Polygon'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    severity: {
      type: String,
      enum: {
        values: CONSTANTS.RISK_LEVELS.LIST,
        message: 'Invalid severity level: {VALUE}',
      },
      default: CONSTANTS.RISK_LEVELS.MODERATE,
      index: true,
    },
    triggerType: {
      type: String,
      enum: ['rainfall', 'earthquake', 'snowmelt', 'cloudburst', 'anthropogenic', 'unknown'],
      default: 'rainfall',
      index: true,
    },
    rainfallAntecedentMm: {
      type: Number,
      min: 0,
    },
    estimatedVolumeCubicMeters: {
      type: Number,
    },
    runoutDistanceMeters: {
      type: Number,
    },
    casualtiesCount: {
      type: Number,
      default: 0,
    },
    infrastructureDamage: {
      type: [String],
      default: [],
    },
    geologicalNotes: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'Historical record source is required'],
      trim: true,
      default: 'State Disaster Management Authority Historical Catalog',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'historical_events',
  }
);

historicalEventSchema.index({ location: '2dsphere' });
historicalEventSchema.index({ eventDate: -1, severity: 1 });

const HistoricalEvent = mongoose.model('HistoricalEvent', historicalEventSchema);

module.exports = HistoricalEvent;
