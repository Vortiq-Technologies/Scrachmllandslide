const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * JWT Authentication Middleware for Web and Mobile clients
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('No authentication token provided. Format: Bearer <token>'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(ApiError.unauthorized('User associated with this token no longer exists'));
    }

    if (!user.isActive) {
      return next(ApiError.forbidden('User account is deactivated. Contact an administrator.'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Hardware Ingestion Authentication Middleware
 * Supports either:
 * 1. Hardware gateway API key via `x-device-key` header
 * 2. Or standard operator JWT
 */
const authenticateHardwareOrUser = async (req, res, next) => {
  const deviceKey = req.headers['x-device-key'];

  if (deviceKey && deviceKey === env.DEVICE_INGEST_API_KEY) {
    req.isHardwareAuth = true;
    return next();
  }

  // Otherwise check user token
  return authenticate(req, res, next);
};

module.exports = {
  authenticate,
  authenticateHardwareOrUser,
};
