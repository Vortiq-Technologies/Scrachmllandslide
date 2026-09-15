const CONSTANTS = require('../config/constants');


class ApiError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error', details = {}, code = CONSTANTS.ERROR_CODES.INTERNAL_ERROR, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details = {}) {
    return new ApiError(400, message, details, CONSTANTS.ERROR_CODES.BAD_REQUEST);
  }

  static unauthorized(message = 'Unauthorized access', details = {}) {
    return new ApiError(401, message, details, CONSTANTS.ERROR_CODES.UNAUTHORIZED);
  }

  static forbidden(message = 'Forbidden access', details = {}) {
    return new ApiError(403, message, details, CONSTANTS.ERROR_CODES.FORBIDDEN);
  }

  static notFound(message = 'Resource not found', details = {}) {
    return new ApiError(404, message, details, CONSTANTS.ERROR_CODES.NOT_FOUND);
  }

  static conflict(message = 'Conflict detected', details = {}) {
    return new ApiError(409, message, details, CONSTANTS.ERROR_CODES.CONFLICT);
  }

  static validation(message = 'Validation failed', details = {}) {
    return new ApiError(422, message, details, CONSTANTS.ERROR_CODES.VALIDATION_ERROR);
  }

  static serviceUnavailable(message = 'Service temporarily unavailable', details = {}) {
    return new ApiError(503, message, details, CONSTANTS.ERROR_CODES.SERVICE_UNAVAILABLE);
  }

  static internal(message = 'Internal server error', details = {}) {
    return new ApiError(500, message, details, CONSTANTS.ERROR_CODES.INTERNAL_ERROR, false);
  }
}

module.exports = ApiError;
