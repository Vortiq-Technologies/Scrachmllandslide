const ApiError = require('../utils/ApiError');
const { sendError } = require('../utils/response');
const CONSTANTS = require('../config/constants');
const env = require('../config/env');

// Centralized error handling middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || CONSTANTS.ERROR_CODES.INTERNAL_ERROR;
  let details = err.details || {};

  // Handle JSON Syntax Error in request body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    code = CONSTANTS.ERROR_CODES.BAD_REQUEST;
    message = 'Malformed JSON payload in request body';
    details = { originalError: err.message };
  }

  // Handle Mongoose CastError (invalid ObjectId or format)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = CONSTANTS.ERROR_CODES.BAD_REQUEST;
    message = `Invalid value '${err.value}' provided for field '${err.path}'`;
    details = { field: err.path, value: err.value };
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    code = CONSTANTS.ERROR_CODES.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate resource conflict on field: '${field}'`;
    details = { field, value: err.keyValue?.[field] };
  }

  // Handle Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    code = CONSTANTS.ERROR_CODES.VALIDATION_ERROR;
    message = 'Validation failed';
    const validationErrors = {};
    for (const key in err.errors) {
      validationErrors[key] = err.errors[key].message;
    }
    details = validationErrors;
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = CONSTANTS.ERROR_CODES.UNAUTHORIZED;
    message = 'Invalid authentication token provided';
    details = {};
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = CONSTANTS.ERROR_CODES.UNAUTHORIZED;
    message = 'Authentication token has expired. Please log in again.';
    details = { expiredAt: err.expiredAt };
  }

  // Log error in development or server errors in production
  if (statusCode >= 500) {
    console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err);
  } else if (env.NODE_ENV === 'development') {
    console.warn(`[Client Error] (${statusCode} - ${code}) ${req.method} ${req.originalUrl}: ${message}`);
  }

  // Production-safe response masking
  if (env.NODE_ENV === 'production' && statusCode >= 500) {
    message = 'An unexpected internal server error occurred';
    details = {};
  } else if (env.NODE_ENV === 'development' && statusCode >= 500) {
    details = { ...details, stack: err.stack };
  }

  return sendError(res, {
    statusCode,
    message,
    code,
    details,
  });
};

module.exports = errorHandler;
