const Joi = require('joi');

const createAlertSchema = Joi.object({
  zoneId: Joi.string().hex().length(24).optional(),
  zoneName: Joi.string().trim().required(),
  severity: Joi.string()
    .valid(
      'ADVISORY', 'WATCH', 'WARNING', 'EMERGENCY_EVACUATION',
      'low', 'moderate', 'high', 'critical', 'warning',
      'LOW', 'MODERATE', 'HIGH', 'CRITICAL'
    )
    .required(),
  triggerSource: Joi.string()
    .valid(
      'ML_MODEL', 'SENSOR_THRESHOLD', 'MANUAL_AUTHORITY', 'CITIZEN_REPORT_CLUSTER', 'AI_MODEL',
      'ml_prediction', 'sensor_threshold', 'manual_authority', 'citizen_report_cluster', 'ai_model'
    )
    .default('MANUAL_AUTHORITY'),
  title: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().trim().min(5).max(2000).required(),
  instructions: Joi.array().items(Joi.string().trim()).default([]),
  riskScore: Joi.number().min(0).max(1).optional(),
  expiresAt: Joi.date().iso().greater('now').optional(),
  affectedArea: Joi.object({
    type: Joi.string().valid('Polygon', 'MultiPolygon').default('Polygon'),
    coordinates: Joi.array().required(),
  }).optional(),
});

const updateAlertStatusSchema = Joi.object({
  status: Joi.string()
    .valid('ACKNOWLEDGED', 'RESOLVED', 'CANCELLED', 'acknowledged', 'resolved', 'cancelled')
    .default('RESOLVED'),
  resolutionNotes: Joi.string().trim().max(1000).allow('', null),
});

const alertQuerySchema = Joi.object({
  status: Joi.string().valid(
    'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'EXPIRED', 'CANCELLED',
    'active', 'acknowledged', 'resolved', 'expired', 'cancelled'
  ),
  severity: Joi.string().valid(
    'ADVISORY', 'WATCH', 'WARNING', 'EMERGENCY_EVACUATION',
    'low', 'moderate', 'high', 'critical', 'warning',
    'LOW', 'MODERATE', 'HIGH', 'CRITICAL'
  ),
  zoneId: Joi.string().hex().length(24),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = {
  createAlertSchema,
  updateAlertStatusSchema,
  alertQuerySchema,
};
