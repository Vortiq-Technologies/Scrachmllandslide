const ApiError = require('../utils/apiError');

/**
 * Higher-order middleware to validate incoming request data using Joi schemas.
 *
 * @param {Object} schema Joi validation schema
 * @param {'body' | 'query' | 'params'} source Request property to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true, // Remove unallowed properties
    });

    if (error) {
      const details = {};
      error.details.forEach((d) => {
        const field = d.path.join('.') || 'root';
        details[field] = d.message.replace(/"/g, '');
      });
      return next(ApiError.validation('Validation failed for request payload', details));
    }

    // Replace request payload with sanitized, type-cast value
    req[source] = value;
    return next();
  };
};

module.exports = validate;
