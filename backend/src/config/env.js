const dotenv = require('dotenv');
const path = require('path');

// Load .env file from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const validateEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = parseInt(process.env.PORT, 10) || 5000;
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/landslide_monitoring';

  const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_key_landslide_early_warning_system_2026';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (nodeEnv === 'production') {
    if (!process.env.MONGO_URI) {
      throw new Error('[FATAL] MONGO_URI must be provided in production mode');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('[FATAL] JWT_SECRET must be provided in production mode');
    }
  }

  return {
    NODE_ENV: nodeEnv,
    PORT: port,
    MONGO_URI: mongoUri,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: jwtExpiresIn,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    LOG_LEVEL: process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug'),
  };
};

const env = validateEnv();

module.exports = env;
