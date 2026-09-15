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
}

module.exports = new GenAiController();
