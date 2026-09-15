const mongoose = require('mongoose');

const terrainDataSchema = new mongoose.Schema(
  {
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      required: [true, 'RiskZone reference is required'],
      index: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ['Polygon', 'MultiPolygon', 'Point'],
        default: 'Polygon',
        required: true,
      },
      coordinates: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    elevationMinMeters: {
      type: Number,
    },
    elevationMaxMeters: {
      type: Number,
    },
    slopeAngleMeanDegrees: {
      type: Number,
      required: [true, 'Slope angle is required'],
    },
    aspectCompassDegrees: {
      type: Number,
      min: 0,
      max: 360,
    },
    curvature: {
      type: Number, // Profile / Planform curvature
    },
    lithology: {
      type: String,
      trim: true,
    },
    soilType: {
      type: String,
      trim: true,
    },
    soilThicknessMeters: {
      type: Number,
    },
    drainageDistanceMeters: {
      type: Number,
    },
    faultDistanceMeters: {
      type: Number,
    },
    roadCutPresence: {
      type: Boolean,
      default: false,
    },
    sourceAgency: {
      type: String,
      trim: true,
      default: 'Geological Survey of India (GSI)',
    },
    surveyDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'terrain_data',
  }
);

terrainDataSchema.index({ geometry: '2dsphere' });

const TerrainData = mongoose.model('TerrainData', terrainDataSchema);

module.exports = TerrainData;
