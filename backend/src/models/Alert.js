const mongoose = require('mongoose');

/**
 * Alert - Early Warning Alert document.
 *
 * Represents an issued early-warning alert for a geographic risk zone.
 * Alerts can be triggered by ML predictions, sensor thresholds, manual
 * authority decisions, or clusters of citizen reports.
 *
 * Uses 'zoneId' as the primary foreign key (alertService uses zoneId).
 * Also stores zoneName directly for denormalized fast reads.
 */
const alertSchema = new mongoose.Schema(
  {
    alertCode: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    // Primary risk zone reference (zoneId)
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    zoneName: {
      type: String,
      required: [true, 'Zone name is required'],
      trim: true,
    },
    affectedArea: {
      type: mongoose.Schema.Types.Mixed, // GeoJSON Polygon or MultiPolygon
    },
    severity: {
      type: String,
      enum: {
        values: [
          'low', 'moderate', 'high', 'critical', 'warning',
          'LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'WARNING',
          'EMERGENCY_EVACUATION',
        ],
        message: 'Invalid severity: {VALUE}',
      },
      required: [true, 'Severity is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'acknowledged', 'resolved', 'cancelled', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'CANCELLED'],
        message: 'Invalid alert status: {VALUE}',
      },
      default: 'ACTIVE',
      index: true,
    },
    triggerSource: {
      type: String,
      enum: [
        'ml_prediction', 'sensor_threshold', 'manual_authority', 'citizen_report_cluster',
        'ML_MODEL', 'SENSOR_THRESHOLD', 'MANUAL_AUTHORITY', 'CITIZEN_REPORT_CLUSTER',
      ],
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
    broadcastChannels: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'alerts',
  }
);

alertSchema.index({ status: 1, severity: 1, issuedAt: -1 });
alertSchema.index({ zoneId: 1, status: 1 });
alertSchema.index({ affectedArea: '2dsphere' });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
