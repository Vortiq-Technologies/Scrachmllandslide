const Joi = require('joi');

const nearbyQuerySchema = Joi.object({
  longitude: Joi.number().min(-180).max(180).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  maxDistanceMeters: Joi.number().min(100).max(100000).default(5000),
});

const bboxQuerySchema = Joi.object({
  minLon: Joi.number().min(-180).max(180).required(),
  minLat: Joi.number().min(-90).max(90).required(),
  maxLon: Joi.number().min(-180).max(180).required(),
  maxLat: Joi.number().min(-90).max(90).required(),
});

module.exports = {
  nearbyQuerySchema,
  bboxQuerySchema,
};
