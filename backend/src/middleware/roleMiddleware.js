const ApiError = require('../utils/apiError');

/**
 * Role-Based Access Control (RBAC) middleware
 *
 * @param  {...string} allowedRoles Allowed roles (e.g. 'admin', 'analyst', 'field_officer')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required before checking permissions'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `User role '${req.user.role}' is not authorized to access this resource. Required: [${allowedRoles.join(
            ', '
          )}]`
        )
      );
    }

    next();
  };
};

module.exports = authorizeRoles;
