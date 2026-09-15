const axios = require('axios');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * GenAI Assistance & Explanation Integration Client
 *
 * STRICT ARCHITECTURAL CONSTRAINTS:
 * 1. Must receive ONLY pre-sanitized, controlled backend data.
 * 2. Has ZERO direct access to MongoDB.
 * 3. Does NOT issue evacuation or emergency decisions independently.
 * 4. All generated texts are marked as AI-assisted drafts requiring human authority approval.
 */
class GenAiClient {
  constructor() {
    this.apiUrl = env.GENAI_API_URL;
    this.apiKey = env.GENAI_API_KEY;
    this.modelName = env.GENAI_MODEL_NAME;
  }

  /**
   * Generate an intelligible natural-language explanation of a landslide risk assessment
   *
   * @param {Object} structuredData Pre-processed context (risk level, telemetry stats, features, weather)
   * @returns {Promise<Object>} Natural language explanation and recommendation draft
   */
  async generateRiskExplanation(structuredData) {
    const prompt = this._buildExplanationPrompt(structuredData);

    if (!this.apiKey || this.apiKey === 'demo_genai_api_key') {
      return this._generateTemplateBasedExplanation(structuredData);
    }

    try {
      // Standard Google Gemini API call
      const url = `${this.apiUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      const response = await axios.post(
        url,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 600,
          },
        },
        { timeout: 7000 }
      );

      const generatedText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Unable to synthesize explanation from LLM response.';

      return {
        explanation: generatedText.trim(),
        modelUsed: this.modelName,
        isAiGenerated: true,
        requiresHumanConfirmation: true,
        disclaimer:
          'NOTICE: This analysis is an AI-assisted explanation for decision support only. All operational warnings and evacuation directives require human authority approval.',
      };
    } catch (error) {
      logger.warn(`GenAI API call failed: ${error.message}. Returning structured fallback explanation.`);
      return this._generateTemplateBasedExplanation(structuredData);
    }
  }

  /**
   * Generate a draft public advisory for incident commanders
   *
   * @param {Object} alertContext Alert parameters and affected demographics
   */
  async draftPublicAdvisory(alertContext) {
    const prompt = `
You are an Emergency Warning Communication Assistant.
Draft a clear, concise public advisory bulletin for the following incident context:
Zone: ${alertContext.zoneName}
Severity: ${alertContext.severity}
Risk Score: ${alertContext.riskScore}
Trigger Source: ${alertContext.triggerSource}
Weather Condition: ${alertContext.weatherSummary || 'Heavy precipitation'}
Key Factors: ${JSON.stringify(alertContext.factors || [])}

RULES:
- Provide 3 distinct sections: (1) Situation Summary, (2) Recommended Actions for Citizens, (3) Emergency Contact Guidance.
- Do NOT declare an official order on your own authority. Use language: "Proposed Advisory Draft for Incident Commander Review".
- Keep it under 250 words, urgent yet calm.
`;

    if (!this.apiKey || this.apiKey === 'demo_genai_api_key') {
      return this._generateTemplateBasedAdvisory(alertContext);
    }

    try {
      const url = `${this.apiUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      const response = await axios.post(
        url,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
        },
        { timeout: 7000 }
      );

      const draftText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Unable to draft advisory from LLM.';

      return {
        advisoryDraft: draftText.trim(),
        modelUsed: this.modelName,
        isAiGenerated: true,
        requiresHumanConfirmation: true,
        disclaimer:
          'DRAFT ONLY: Incident commander signature required before transmission to public channels.',
      };
    } catch (error) {
      logger.warn(`GenAI advisory draft call failed: ${error.message}. Returning template advisory.`);
      return this._generateTemplateBasedAdvisory(alertContext);
    }
  }

  _buildExplanationPrompt(data) {
    return `
You are an expert geotechnical and hydro-meteorological early-warning analyst.
Analyze the following controlled slope monitoring data:
- Zone Code/Name: ${data.zoneName} (${data.zoneCode})
- Current Risk Level: ${data.riskLevel} (Score: ${data.riskScore}/1.0)
- 72-Hour Cumulative Rainfall: ${data.rainfall72hMm} mm
- Pore Water Pressure: ${data.porePressureKpa} kPa
- Tilt Rate: ${data.tiltRateDegPerHr} deg/hr
- Contributing Factors: ${JSON.stringify(data.contributingFactors || [])}
- Recent Citizen Ground Observations: ${data.recentCitizenReportsCount || 0} reports

Explain in 2 short paragraphs:
1. The physical geotechnical mechanism driving this risk level (e.g. soil saturation, loss of shear strength, water table elevation).
2. The recommended monitoring focus for ground engineers and field officers over the next 12-24 hours.

Do NOT issue mandatory evacuation orders. All suggestions must be addressed to the reviewing engineer.
`;
  }

  _generateTemplateBasedExplanation(data) {
    const riskLevel = data.riskLevel || 'MODERATE';
    const rainfall = data.rainfall72hMm || 45;
    const porePressure = data.porePressureKpa || 15;

    const explanation =
      `Based on multi-sensor telemetry, Zone '${data.zoneName || 'Monitored Sector'}' is currently at ${riskLevel} risk. ` +
      `The primary geotechnical driver is cumulative precipitation (${rainfall} mm in 72h) leading to elevated pore water pressure (${porePressure} kPa), which decreases the effective normal stress along potential slip surfaces. ` +
      `Field officers should monitor inclinometer displacement rates and inspect slope toes for fresh tension cracks or turbid water seepage.`;

    return {
      explanation,
      modelUsed: 'template-deterministic-v1.0',
      isAiGenerated: true,
      requiresHumanConfirmation: true,
      disclaimer:
        'NOTICE: This analysis is an AI-assisted explanation for decision support only. All operational warnings and evacuation directives require human authority approval.',
    };
  }

  _generateTemplateBasedAdvisory(data) {
    const draft =
      `[DRAFT FOR AUTHORITY REVIEW]\n\n` +
      `SITUATION SUMMARY:\n` +
      `Due to sustained precipitation and geological slope movement, early-warning sensors in ${data.zoneName || 'the monitored area'} have triggered a ${data.severity || 'WARNING'} state.\n\n` +
      `RECOMMENDED CITIZEN ACTIONS:\n` +
      `1. Residents along steep slopes and drainage channels should stay alert and avoid non-essential travel along vulnerable road cuts.\n` +
      `2. Prepare emergency go-bags with essentials, documents, and medical supplies.\n` +
      `3. Report any visible ground cracks, falling debris, or sudden mudflows to local emergency response immediately.\n\n` +
      `EMERGENCY CONTACT:\n` +
      `State Disaster Management Control Room: 1070 / 108.`;

    return {
      advisoryDraft: draft,
      modelUsed: 'template-deterministic-v1.0',
      isAiGenerated: true,
      requiresHumanConfirmation: true,
      disclaimer:
        'DRAFT ONLY: Incident commander signature required before transmission to public channels.',
    };
  }
}

module.exports = new GenAiClient();
