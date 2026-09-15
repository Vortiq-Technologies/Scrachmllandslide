/**
 * Wraps an async route handler to catch errors and forward them to next()
 *
 * @param {Function} fn Async route handler function (req, res, next)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
