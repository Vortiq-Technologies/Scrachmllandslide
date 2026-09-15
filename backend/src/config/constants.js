/**
 * System and Application Constants
 */
const CONSTANTS = {
  API_PREFIX: '/api/v1',

  NODE_ENV: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
  },

  USER_ROLES: {
    SUPER_ADMIN: 'super_admin',
    DISTRICT_ADMIN: 'district_admin',
    FIELD_OFFICER: 'field_officer',
    CITIZEN: 'citizen',
    LIST: ['super_admin', 'district_admin', 'field_officer', 'citizen', 'admin', 'analyst'],
  },

  RISK_LEVELS: {
    LOW: 'low',
    MODERATE: 'moderate',
    HIGH: 'high',
    CRITICAL: 'critical',
    WARNING: 'warning',
    LIST: ['low', 'moderate', 'high', 'critical', 'warning', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'WARNING'],
  },

  SENSOR_TYPES: {
    RAINFALL: 'rainfall',
    SOIL_MOISTURE: 'soil_moisture',
    TEMPERATURE: 'temperature',
    HUMIDITY: 'humidity',
    TILT: 'tilt',
    SLOPE_MOVEMENT: 'slope_movement',
    LIST: ['rainfall', 'soil_moisture', 'temperature', 'humidity', 'tilt', 'slope_movement', 'pore_pressure', 'vibration', 'displacement', 'RAINFALL', 'SOIL_MOISTURE', 'TEMPERATURE', 'HUMIDITY', 'TILT'],
  },

  SENSOR_QUALITY: {
    VALID: 'valid',
    SUSPECT: 'suspect',
    INVALID: 'invalid',
    MISSING: 'missing',
    LIST: ['valid', 'suspect', 'invalid', 'missing', 'VALID', 'SUSPECT', 'INVALID', 'MISSING'],
  },

  DEVICE_STATUS: {
    ONLINE: 'online',
    OFFLINE: 'offline',
    WARNING: 'warning',
    MAINTENANCE: 'maintenance',
    LIST: ['online', 'offline', 'warning', 'maintenance', 'ONLINE', 'OFFLINE', 'WARNING', 'MAINTENANCE'],
  },

  ALERT_STATUS: {
    ACTIVE: 'active',
    ACKNOWLEDGED: 'acknowledged',
    RESOLVED: 'resolved',
    CANCELLED: 'cancelled',
    LIST: ['active', 'acknowledged', 'resolved', 'cancelled', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'CANCELLED'],
  },

  REPORT_STATUS: {
    PENDING: 'pending',
    VERIFIED: 'verified',
    DISMISSED: 'dismissed',
    RESOLVED: 'resolved',
    LIST: ['pending', 'verified', 'dismissed', 'resolved', 'PENDING', 'VERIFIED', 'FALSE_ALARM', 'DISMISSED', 'RESOLVED'],
  },

  ERROR_CODES: {
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  },

  MONGOOSE_STATES: {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING',
  },
};

module.exports = CONSTANTS;
