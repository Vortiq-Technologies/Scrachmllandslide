const Joi = require('joi');

const singleTelemetrySchema = Joi.object({
  deviceId: Joi.string().trim().uppercase().required(),
  timestamp: Joi.date().iso().default(() => new Date()),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array()
      .items(Joi.number().min(-180).max(180), Joi.number().min(-90).max(90))
      .length(2)
      .required(),
  }).optional(),
  readings: Joi.object({
    rainfall_mm: Joi.number().min(0).allow(null),
    pore_pressure_kpa: Joi.number().allow(null),
    soil_moisture_pct: Joi.number().min(0).max(100).allow(null),
    tilt_degrees_x: Joi.number().allow(null),
    tilt_degrees_y: Joi.number().allow(null),
    vibration_intensity: Joi.number().min(0).allow(null),
    surface_displacement_mm: Joi.number().allow(null),
    temperature_c: Joi.number().allow(null),
    humidity_pct: Joi.number().min(0).max(100).allow(null),
  })
    .required()
    .min(1)
    .messages({
      'object.min': 'At least one sensor reading metric must be provided in readings object',
    }),
  batteryPct: Joi.number().min(0).max(100).optional(),
  rawPayload: Joi.object().optional(),
});

// Can accept either a single reading object or an array of readings for batch ingestion
const ingestTelemetrySchema = Joi.alternatives().try(
  singleTelemetrySchema,
  Joi.array().items(singleTelemetrySchema).min(1).max(100)
);

const telemetryQuerySchema = Joi.object({
  deviceId: Joi.string().trim().uppercase(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  limit: Joi.number().integer().min(1).max(1000).default(100),
  page: Joi.number().integer().min(1).default(1),
  qcStatus: Joi.string().valid('VALID', 'ANOMALOUS', 'SUSPICIOUS_SPIKE', 'OUT_OF_RANGE'),
});

module.exports = {
  ingestTelemetrySchema,
  telemetryQuerySchema,
};
