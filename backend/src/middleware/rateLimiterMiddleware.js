const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

/**
 * Standard API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many requests from this IP. Please try again later.'));
  },
});

/**
 * Stricter rate limiter for authentication endpoints to mitigate brute force
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many login attempts. Please try again in 15 minutes.'));
  },
});

/**
 * High-throughput rate limiter for hardware telemetry ingestion
 */
const ingestionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // 300 batches per minute
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  ingestionLimiter,
};
