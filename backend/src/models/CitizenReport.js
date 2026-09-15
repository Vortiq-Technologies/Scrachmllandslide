const mongoose = require('mongoose');

const citizenReportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    reporterName: {
      type: String,
      trim: true,
      default: 'Anonymous Citizen',
    },
    reporterPhone: {
      type: String,
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
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
        required: true,
      },
    },
    addressOrLandmark: {
      type: String,
      trim: true,
    },
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    reportType: {
      type: String,
      set: (v) => (typeof v === 'string' ? v.toUpperCase().replace(/\s+/g, '_') : v),
      enum: [
        'CRACK_FORMATION',
        'ROCKFALL',
        'WATER_SEEPAGE',
        'GROUND_SUBSIDENCE',
        'DEBRIS_FLOW',
        'LEANING_TREES_OR_POLES',
        'LANDSLIDE',
        'SLOPE_CRACK',
        'SOIL_MOVEMENT',
        'ROAD_BLOCKED',
        'WATER_ACCUMULATION',
        'OTHER',
      ],
      required: [true, 'Report type is required'],
      index: true,
    },
    severity: {
      type: String,
      set: (v) => (typeof v === 'string' ? v.toUpperCase() : v),
      enum: ['LOW', 'MODERATE', 'MEDIUM', 'HIGH', 'SEVERE', 'CRITICAL'],
      default: 'MODERATE',
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'FALSE_ALARM', 'RESOLVED'],
      default: 'PENDING',
      index: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    officerNotes: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

citizenReportSchema.index({ location: '2dsphere' });
citizenReportSchema.index({ verificationStatus: 1, submittedAt: -1 });

const CitizenReport = mongoose.model('CitizenReport', citizenReportSchema);

module.exports = CitizenReport;
