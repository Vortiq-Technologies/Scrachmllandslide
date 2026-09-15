const mongoose = require('mongoose');

const conversationMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    structuredContextSnapshot: {
      type: mongoose.Schema.Types.Mixed,
    },
    requiresHumanReview: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const aiConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    sessionTitle: {
      type: String,
      trim: true,
      default: 'Landslide Risk Explanation Session',
    },
    messages: [conversationMessageSchema],
    modelUsed: {
      type: String,
      trim: true,
      default: 'gemini-1.5-flash',
    },
    lastInteractedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'ai_conversations',
  }
);

aiConversationSchema.index({ userId: 1, lastInteractedAt: -1 });

const AiConversation = mongoose.model('AiConversation', aiConversationSchema);

module.exports = AiConversation;
