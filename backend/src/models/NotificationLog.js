const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema(
  {
    alertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alert',
      required: [true, 'Alert reference is required'],
      index: true,
    },
    channel: {
      type: String,
      enum: ['sms', 'push', 'email', 'siren', 'cap_feed', 'webhook'],
      required: [true, 'Notification channel is required'],
      index: true,
    },
    recipient: {
      type: String,
      required: [true, 'Recipient identifier is required'],
      trim: true,
    },
    recipientType: {
      type: String,
      enum: ['citizen', 'official', 'district_headquarters', 'broadcast'],
      default: 'citizen',
    },
    message: {
      type: String,
      required: [true, 'Dispatched message text is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed'],
      default: 'pending',
      index: true,
    },
    provider: {
      type: String,
      trim: true,
      default: 'SYSTEM_BROADCAST',
    },
    externalMessageId: {
      type: String,
      trim: true,
    },
    dispatchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    deliveredAt: {
      type: Date,
    },
    failureReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'notification_logs',
  }
);

notificationLogSchema.index({ alertId: 1, status: 1 });
notificationLogSchema.index({ channel: 1, dispatchedAt: -1 });

const NotificationLog = mongoose.model('NotificationLog', notificationLogSchema);

module.exports = NotificationLog;
