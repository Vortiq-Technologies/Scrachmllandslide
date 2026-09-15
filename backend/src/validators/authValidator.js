const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Valid email is required',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters',
  }),
  role: Joi.string().valid('admin', 'analyst', 'field_officer', 'citizen').default('citizen'),
  phone: Joi.string().trim().allow('', null),
  assignedRegions: Joi.array().items(Joi.string().trim()).default([]),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
