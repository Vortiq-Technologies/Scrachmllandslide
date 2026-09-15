const genAiService = require('../services/genAiService');
const ApiResponse = require('../utils/apiResponse');

class GenAiController {
  async explainRisk(req, res, next) {
    try {
      const { zoneId } = req.body;
      const result = await genAiService.explainRiskForZone(zoneId);
      return ApiResponse.success(res, result, 'AI risk explanation generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async draftAdvisory(req, res, next) {
    try {
      const { zoneId, severity } = req.body;
      const result = await genAiService.draftAdvisoryForZone(zoneId, severity);
      return ApiResponse.success(res, result, 'AI public advisory draft generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async chat(req, res, next) {
    try {
      const { message, zoneId, conversationHistory } = req.body;
      const result = await genAiService.chat(message, zoneId, conversationHistory);
      return ApiResponse.success(res, result, 'AI response generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async generateReport(req, res, next) {
    try {
      const { zoneId, reportType } = req.body;
      const result = await genAiService.generateReport(zoneId, reportType);
      return ApiResponse.success(res, result, 'AI report generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async generateAlert(req, res, next) {
    try {
      const result = await genAiService.generateAlert(req.body);
      return ApiResponse.success(res, result, 'AI alert bulletin generated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GenAiController();

