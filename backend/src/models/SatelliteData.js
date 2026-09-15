const mongoose = require('mongoose');

const satelliteDataSchema = new mongoose.Schema(
  {
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    satelliteName: {
      type: String,
      required: [true, 'Satellite name is required'],
      trim: true,
      index: true,
    },
    acquisitionDate: {
      type: Date,
      required: [true, 'Acquisition date is required'],
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
        required: true,
      },
    },
    indices: {
      sarDisplacementMmPerYear: { type: Number }, // InSAR line-of-sight velocity
      ndviMean: { type: Number, min: -1, max: 1 }, // Vegetation Index
      ndwiMean: { type: Number, min: -1, max: 1 }, // Water / Soil Saturation Index
      soilMoistureIndex: { type: Number, min: 0, max: 1 },
      cloudCoverPct: { type: Number, min: 0, max: 100 },
      resolutionMeters: { type: Number },
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    provenance: {
      provider: { type: String, trim: true, default: 'ISRO / ESA Copernicus' },
      sceneId: { type: String, trim: true },
      processingLevel: { type: String, trim: true, default: 'L2A' },
    },
  },
  {
    timestamps: true,
    collection: 'satellite_data',
  }
);

satelliteDataSchema.index({ boundary: '2dsphere' });
satelliteDataSchema.index({ satelliteName: 1, acquisitionDate: -1 });

const SatelliteData = mongoose.model('SatelliteData', satelliteDataSchema);

module.exports = SatelliteData;
