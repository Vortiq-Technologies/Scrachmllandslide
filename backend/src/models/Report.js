const mongoose = require('mongoose');
const CONSTANTS = require('../config/constants');

const reportSchema = new mongoose.Schema(
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
    reporterContact: {
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
    landmark: {
      type: String,
      trim: true,
    },
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    reportType: {
      type: String,
      enum: [
        'crack_formation',
        'rockfall',
        'water_seepage',
        'ground_subsidence',
        'debris_flow',
        'leaning_structures',
        'other',
      ],
      required: [true, 'Report type is required'],
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
    description: {
      type: String,
      required: [true, 'Observation description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: CONSTANTS.REPORT_STATUS.LIST,
        message: 'Invalid report status: {VALUE}',
      },
      default: CONSTANTS.REPORT_STATUS.PENDING,
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
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'reports',
  }
);

reportSchema.index({ location: '2dsphere' });
reportSchema.index({ status: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
