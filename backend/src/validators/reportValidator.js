const Joi = require('joi');

const createReportSchema = Joi.object({
  reportType: Joi.string()
    .valid(
      'CRACK_FORMATION',
      'ROCKFALL',
      'WATER_SEEPAGE',
      'GROUND_SUBSIDENCE',
      'DEBRIS_FLOW',
      'LEANING_TREES_OR_POLES',
      'OTHER'
    )
    .required(),
  severity: Joi.string().valid('LOW', 'MODERATE', 'SEVERE', 'CRITICAL').default('MODERATE'),
  description: Joi.string().trim().min(5).max(1000).required(),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array()
      .items(Joi.number().min(-180).max(180), Joi.number().min(-90).max(90))
      .length(2)
      .required(),
  }).required(),
  addressOrLandmark: Joi.string().trim().allow('', null),
  imageUrls: Joi.array().items(Joi.string().uri()).default([]),
  isAnonymous: Joi.boolean().default(false),
  reporterName: Joi.string().trim().allow('', null),
  reporterPhone: Joi.string().trim().allow('', null),
});

const verifyReportSchema = Joi.object({
  verificationStatus: Joi.string().valid('VERIFIED', 'FALSE_ALARM', 'RESOLVED').required(),
  officerNotes: Joi.string().trim().max(1000).allow('', null),
});

const reportQuerySchema = Joi.object({
  verificationStatus: Joi.string().valid('PENDING', 'VERIFIED', 'FALSE_ALARM', 'RESOLVED'),
  reportType: Joi.string(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = {
  createReportSchema,
  verifyReportSchema,
  reportQuerySchema,
};
