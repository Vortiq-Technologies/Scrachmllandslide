const mongoose = require('mongoose');

const knowledgeDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      index: true,
    },
    documentCode: {
      type: String,
      required: [true, 'Document code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        'sop',
        'geotechnical_standard',
        'evacuation_plan',
        'hazard_zoning_guideline',
        'mitigation_manual',
      ],
      required: [true, 'Document category is required'],
      index: true,
    },
    summary: {
      type: String,
      required: [true, 'Document summary is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Document content is required'],
    },
    applicableRiskZones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RiskZone',
      },
    ],
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    version: {
      type: String,
      default: '1.0',
    },
    authorAgency: {
      type: String,
      trim: true,
      default: 'National Disaster Management Authority (NDMA)',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'knowledge_documents',
  }
);

knowledgeDocumentSchema.index({ category: 1, isActive: 1 });

const KnowledgeDocument = mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);

module.exports = KnowledgeDocument;
