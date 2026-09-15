const RiskZone = require('../models/RiskZone');
const Prediction = require('../models/Prediction');
const CitizenReport = require('../models/CitizenReport');
const mlPipelineService = require('./mlPipelineService');
const genAiClient = require('../integrations/genAiClient');
const weatherClient = require('../integrations/weatherClient');
const ApiError = require('../utils/apiError');

/**
 * Service to assemble controlled backend data and interface with GenAI explanation layer
 */
class GenAiService {
  /**
   * Produce an intelligible explanation of landslide risk for a zone
   */
  async explainRiskForZone(zoneId) {
    const zone = await RiskZone.findById(zoneId);
    if (!zone) {
      throw ApiError.notFound(`RiskZone with ID '${zoneId}' not found`);
    }

    // Get latest prediction or calculate normalized features
    let prediction = await Prediction.findOne({ zoneId: zone._id }).sort({ timestamp: -1 });
    const features = await mlPipelineService.buildNormalizedFeatures(zone);

    // Count recent citizen reports in this zone over the past 48 hours
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const recentReportsCount = await CitizenReport.countDocuments({
      zoneId: zone._id,
      submittedAt: { $gte: fortyEightHoursAgo },
    });

    // Controlled structured data payload
    const structuredContext = {
      zoneName: zone.name,
      zoneCode: zone.code,
      riskLevel: zone.currentRiskLevel,
      riskScore: zone.currentRiskScore,
      rainfall72hMm: features.cumulative_rainfall_72h_mm,
      porePressureKpa: features.pore_pressure_kpa,
      tiltRateDegPerHr: features.tilt_rate_deg_per_hr,
      contributingFactors: prediction?.contributingFactors || [
        { factor: 'Sustained Precipitation', importance: 0.45 },
        { factor: 'Pore Pressure Infiltration', importance: 0.35 },
      ],
      recentCitizenReportsCount: recentReportsCount,
      soilType: zone.soilType,
      slopeAngle: zone.baselineSlopeAngle,
    };

    const aiResult = await genAiClient.generateRiskExplanation(structuredContext);

    return {
      zone: {
        id: zone._id,
        name: zone.name,
        code: zone.code,
        currentRiskLevel: zone.currentRiskLevel,
        currentRiskScore: zone.currentRiskScore,
      },
      structuredDataProvided: structuredContext,
      aiExplanation: aiResult.explanation,
      modelUsed: aiResult.modelUsed,
      disclaimer: aiResult.disclaimer,
      requiresHumanConfirmation: true,
    };
  }

  /**
   * Produce a draft public advisory bulletin for emergency incident commanders
   */
  async draftAdvisoryForZone(zoneId, severity = 'WARNING') {
    const zone = await RiskZone.findById(zoneId);
    if (!zone) {
      throw ApiError.notFound(`RiskZone with ID '${zoneId}' not found`);
    }

    const centerCoords = zone.center?.coordinates || [78.5, 30.5];
    const weather = await weatherClient.getWeatherForCoordinates(centerCoords[1], centerCoords[0]);

    const alertContext = {
      zoneName: zone.name,
      zoneCode: zone.code,
      severity,
      riskScore: zone.currentRiskScore,
      triggerSource: 'EARLY_WARNING_DECISION_SUPPORT',
      weatherSummary: `${weather.weatherCondition}, ${weather.temperatureC}°C, Rainfall last 3h: ${weather.rainfallLast3hMm}mm`,
      demographics: zone.demographics,
    };

    const draftResult = await genAiClient.draftPublicAdvisory(alertContext);

    return {
      zone: {
        id: zone._id,
        name: zone.name,
        code: zone.code,
      },
      advisoryDraft: draftResult.advisoryDraft,
      modelUsed: draftResult.modelUsed,
      disclaimer: draftResult.disclaimer,
      requiresHumanConfirmation: true,
    };
  }

  /**
   * Conversational Q&A Grounded Chat with Landslide Decision Support Context
   */
  async chat(message, zoneId, conversationHistory = []) {
    let zone = null;
    if (zoneId) {
      zone = await RiskZone.findById(zoneId).catch(() => null);
    }
    if (!zone) {
      zone = await RiskZone.findOne().sort({ currentRiskScore: -1 }).catch(() => null);
    }

    const structuredContext = {
      userQuery: message,
      zoneName: zone ? zone.name : 'Regional High-Risk Slopes',
      zoneCode: zone ? zone.code : 'ZONE-NER-ALL',
      riskLevel: zone ? zone.currentRiskLevel : 'HIGH',
      riskScore: zone ? zone.currentRiskScore : 0.78,
      soilType: zone?.soilType || 'Colluvial Scree',
      slopeAngle: zone?.baselineSlopeAngle || 38.5,
    };

    const aiResult = await genAiClient.generateRiskExplanation(structuredContext);

    return {
      reply: aiResult.explanation,
      explanation: aiResult.explanation,
      modelUsed: aiResult.modelUsed,
      disclaimer: aiResult.disclaimer,
      contextUsed: {
        zoneName: structuredContext.zoneName,
        riskLevel: structuredContext.riskLevel,
        riskScore: structuredContext.riskScore,
      },
      requiresHumanConfirmation: true,
    };
  }

  /**
   * Generate situation summary report
   */
  async generateReport(zoneId, reportType = 'situation_summary') {
    return this.explainRiskForZone(zoneId);
  }

  /**
   * Generate alert communication bulletin
   */
  async generateAlert(alertContext) {
    return genAiClient.draftPublicAdvisory(alertContext);
  }
}

module.exports = new GenAiService();

