const Joi = require('joi');

const createDeviceSchema = Joi.object({
  deviceId: Joi.string().trim().uppercase().min(3).max(50).required(),
  name: Joi.string().trim().min(2).max(100).required(),
  type: Joi.string().trim().default('gateway'),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array()
      .items(Joi.number().min(-180).max(180), Joi.number().min(-90).max(90))
      .length(2)
      .required()
      .messages({
        'array.length': 'Location coordinates must be [longitude, latitude]',
      }),
  }).required(),
  zoneId: Joi.string().hex().length(24).allow(null, ''),
  status: Joi.string()
    .valid(
      'ACTIVE', 'OFFLINE', 'MAINTENANCE', 'FAULT',
      'online', 'offline', 'warning', 'maintenance',
      'ONLINE', 'WARNING'
    )
    .default('ACTIVE'),
  elevationMeters: Joi.number().allow(null),
  batteryPct: Joi.number().min(0).max(100).default(100),
  signalRssi: Joi.number().allow(null),
  sensors: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.string(),
        Joi.object({
          sensorType: Joi.string().required(),
          unit: Joi.string().allow(''),
          minNormal: Joi.number().default(0),
          maxNormal: Joi.number().default(100),
          warningThreshold: Joi.number().allow(null),
          criticalThreshold: Joi.number().allow(null),
        })
      )
    )
    .default([]),
  firmwareVersion: Joi.string().trim().default('1.0.0'),
  installationDate: Joi.date().allow(null),
  metadata: Joi.object().default({}),
});

const updateDeviceSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  status: Joi.string().valid(
    'ACTIVE', 'OFFLINE', 'MAINTENANCE', 'FAULT',
    'online', 'offline', 'warning', 'maintenance',
    'ONLINE', 'WARNING'
  ),
  zoneId: Joi.string().hex().length(24).allow(null, ''),
  batteryPct: Joi.number().min(0).max(100),
  signalRssi: Joi.number().allow(null),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }),
  sensors: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.object())),
  firmwareVersion: Joi.string().trim(),
  metadata: Joi.object(),
});

module.exports = {
  createDeviceSchema,
  updateDeviceSchema,
};
