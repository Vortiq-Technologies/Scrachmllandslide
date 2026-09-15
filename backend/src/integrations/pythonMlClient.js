const axios = require('axios');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * HTTP Integration Client for external Python AI/ML Inference Microservice.
 *
 * Contract:
 * - Backend normalizes raw sensor time-series into a structured feature vector.
 * - Sends POST /predict to Python ML service.
 * - Receives riskScore (0-1), probability, riskLevel, confidence, contributingFactors.
 * - ML training is completely owned by Python; backend ONLY consumes the inference API.
 */
class PythonMlClient {
  constructor() {
    this.client = axios.create({
      baseURL: env.PYTHON_ML_SERVICE_URL,
      timeout: env.ML_REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        ...(env.PYTHON_ML_API_KEY && { 'x-api-key': env.PYTHON_ML_API_KEY }),
      },
    });
  }

  /**
   * Health check for Python ML service
   */
  async checkHealth() {
    try {
      const response = await this.client.get('/health');
      return {
        online: true,
        status: response.data?.status || 'OK',
        modelVersion: response.data?.modelVersion || 'unknown',
      };
    } catch (error) {
      logger.warn(`Python ML service health check failed: ${error.message}`);
      return {
        online: false,
        error: error.message,
      };
    }
  }

  /**
   * Send normalized feature vector to Python ML HTTP API for inference
   *
   * @param {Object} featureVector Normalized input features
   * @returns {Promise<Object>} ML prediction result
   */
  async predictLandslideRisk(featureVector) {
    const startTime = Date.now();

    try {
      logger.info(`Dispatching feature vector to Python ML service (${env.PYTHON_ML_SERVICE_URL}/predict)`);

      const response = await this.client.post('/predict', {
        features: featureVector,
        timestamp: new Date().toISOString(),
      });

      const durationMs = Date.now() - startTime;
      logger.info(`Received Python ML prediction successfully in ${durationMs}ms`);

      const result = response.data;

      return {
        isFallback: false,
        riskScore: Number(result.riskScore ?? result.risk_score ?? 0.0),
        riskLevel: (result.riskLevel ?? result.risk_level ?? 'LOW').toUpperCase(),
        probability: Number(result.probability ?? 0.0),
        confidenceScore: Number(result.confidenceScore ?? result.confidence ?? 0.85),
        contributingFactors: result.contributingFactors || result.factors || [],
        mlModelVersion: result.modelVersion || 'py-ml-v1.0.0',
        durationMs,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      logger.error(
        `Python ML HTTP API call failed (${durationMs}ms): ${error.response?.data?.message || error.message}`
      );

      // Graceful degraded mode when external ML service is unreachable
      // This is explicitly flagged as isFallback: true so the system and logs distinguish it
      return this._generateResilientFallback(featureVector, error.message);
    }
  }

  /**
   * Resilient fallback heuristic when external ML service is unreachable.
   * Explicitly marked as fallback.
   */
  _generateResilientFallback(features, failureReason) {
    logger.warn(`Engaging fallback risk assessment due to ML service failure: ${failureReason}`);

    // Standard geotechnical physical threshold heuristic as safe fallback
    const rainfall72h = features.cumulative_rainfall_72h_mm || 0;
    const porePressure = features.pore_pressure_kpa || 0;
    const slopeAngle = features.slope_angle_deg || 30;
    const tiltRate = features.tilt_rate_deg_per_hr || 0;

    let score = 0.1;
    if (rainfall72h > 150) score += 0.35;
    else if (rainfall72h > 70) score += 0.2;

    if (porePressure > 40) score += 0.3;
    else if (porePressure > 20) score += 0.15;

    if (tiltRate > 0.05) score += 0.25;
    if (slopeAngle > 40) score += 0.1;

    score = Math.min(Math.max(score, 0.0), 0.99);

    let riskLevel = 'LOW';
    if (score >= 0.8) riskLevel = 'CRITICAL';
    else if (score >= 0.6) riskLevel = 'HIGH';
    else if (score >= 0.35) riskLevel = 'MODERATE';

    return {
      isFallback: true,
      fallbackReason: `External Python ML unreachable: ${failureReason}`,
      riskScore: Number(score.toFixed(3)),
      riskLevel,
      probability: Number(score.toFixed(3)),
      confidenceScore: 0.5, // Low confidence flagged for fallback
      contributingFactors: [
        { factor: 'Cumulative Rainfall 72h', importance: 0.4, direction: 'INCREASING' },
        { factor: 'Pore Water Pressure', importance: 0.3, direction: 'INCREASING' },
        { factor: 'Slope Angle & Tilt Rate', importance: 0.3, direction: 'INCREASING' },
      ],
      mlModelVersion: 'fallback-heuristic-v1.0',
    };
  }
}

module.exports = new PythonMlClient();
