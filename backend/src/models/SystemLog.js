const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'critical', 'debug'],
      default: 'info',
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action identifier is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Log message is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      index: true,
    },
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'system_logs',
  }
);

systemLogSchema.index({ action: 1, timestamp: -1 });
systemLogSchema.index({ level: 1, timestamp: -1 });

const SystemLog = mongoose.model('SystemLog', systemLogSchema);

module.exports = SystemLog;
