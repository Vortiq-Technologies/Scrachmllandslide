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
    DEVICE_INGEST_API_KEY: process.env.DEVICE_INGEST_API_KEY || 'hw_ingest_secret_token_secure_gateway_2026',
    PYTHON_ML_SERVICE_URL: process.env.PYTHON_ML_SERVICE_URL || 'http://localhost:8000',
    PYTHON_ML_API_KEY: process.env.PYTHON_ML_API_KEY || 'internal_ml_service_access_token_2026',
    ML_REQUEST_TIMEOUT_MS: parseInt(process.env.ML_REQUEST_TIMEOUT_MS, 10) || 5000,
    WEATHER_API_URL: process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5',
    WEATHER_API_KEY: process.env.WEATHER_API_KEY || 'demo_weather_api_key',
    GENAI_API_URL: process.env.GENAI_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
    GENAI_API_KEY: process.env.GENAI_API_KEY || 'demo_genai_api_key',
    GENAI_MODEL_NAME: process.env.GENAI_MODEL_NAME || 'gemini-1.5-flash',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
  };
};

const env = validateEnv();

module.exports = env;
