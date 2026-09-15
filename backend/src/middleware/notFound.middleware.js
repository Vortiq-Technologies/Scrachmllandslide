const ApiError = require('../utils/apiError');

/**
 * Centralized 404 Route Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFoundHandler;
