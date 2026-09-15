/**
 * Standardized API Response Builders
 *
 * Success format:
 * {
 *   "success": true,
 *   "message": "...",
 *   "data": {},
 *   "meta": {}
 * }
 *
 * Error format:
 * {
 *   "success": false,
 *   "message": "...",
 *   "error": {
 *     "code": "...",
 *     "details": {}
 *   }
 * }
 */

const sendSuccess = (res, { statusCode = 200, message = 'Success', data = {}, meta = {} } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

const sendCreated = (res, { message = 'Resource created successfully', data = {}, meta = {} } = {}) => {
  return sendSuccess(res, { statusCode: 201, message, data, meta });
};

const sendError = (res, { statusCode = 500, message = 'Internal Server Error', code = 'INTERNAL_ERROR', details = {} } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details,
    },
  });
};

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
};
