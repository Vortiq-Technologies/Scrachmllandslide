const Joi = require('joi');

const explainRiskSchema = Joi.object({
  zoneId: Joi.string().hex().length(24).required().messages({
    'any.required': 'zoneId is required to generate contextual risk explanation',
  }),
  includeWeather: Joi.boolean().default(true),
});

const draftAdvisorySchema = Joi.object({
  zoneId: Joi.string().hex().length(24).required(),
  severity: Joi.string()
    .valid('ADVISORY', 'WATCH', 'WARNING', 'EMERGENCY_EVACUATION')
    .default('WARNING'),
  customDirectives: Joi.string().trim().max(500).allow('', null),
});

module.exports = {
  explainRiskSchema,
  draftAdvisorySchema,
};
