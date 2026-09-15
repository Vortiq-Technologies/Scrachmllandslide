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
      enum: [
        'CRACK_FORMATION',
        'ROCKFALL',
        'WATER_SEEPAGE',
        'GROUND_SUBSIDENCE',
        'DEBRIS_FLOW',
        'LEANING_TREES_OR_POLES',
        'OTHER',
      ],
      required: [true, 'Report type is required'],
      index: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MODERATE', 'SEVERE', 'CRITICAL'],
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
