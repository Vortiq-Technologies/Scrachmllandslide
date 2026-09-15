const riskService = require('../services/riskService');
const mlPipelineService = require('../services/mlPipelineService');
const ApiResponse = require('../utils/apiResponse');

class RiskController {
  async createRiskZone(req, res, next) {
    try {
      const zone = await riskService.createRiskZone(req.body);
      return ApiResponse.created(res, zone, 'Risk zone created successfully');
    } catch (error) {
      next(error);
    }
  }

  async listRiskZones(req, res, next) {
    try {
      const { currentRiskLevel } = req.query;
      const zones = await riskService.listRiskZones({ currentRiskLevel });
      return ApiResponse.success(res, zones, 'Risk zones retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getRiskZoneById(req, res, next) {
    try {
      const zone = await riskService.getRiskZoneById(req.params.id);
      return ApiResponse.success(res, zone, 'Risk zone details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateRiskZone(req, res, next) {
    try {
      const zone = await riskService.updateRiskZone(req.params.id, req.body);
      return ApiResponse.success(res, zone, 'Risk zone updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async evaluateRisk(req, res, next) {
    try {
      const evaluation = await riskService.evaluateRisk(req.params.id);
      return ApiResponse.success(res, evaluation, 'Risk zone evaluated via ML inference pipeline');
    } catch (error) {
      next(error);
    }
  }

  async getLatestPrediction(req, res, next) {
    try {
      const prediction = await mlPipelineService.getLatestPrediction(req.params.id);
      return ApiResponse.success(res, prediction, 'Latest ML prediction retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RiskController();
