const gisService = require('../services/gisService');
const ApiResponse = require('../utils/apiResponse');

class GisController {
  async getRiskZonesLayer(req, res, next) {
    try {
      const featureCollection = await gisService.getRiskZonesGeoJson();
      return ApiResponse.success(res, featureCollection, 'Risk zones GeoJSON layer retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getDevicesLayer(req, res, next) {
    try {
      const featureCollection = await gisService.getDevicesGeoJson();
      return ApiResponse.success(res, featureCollection, 'Monitoring devices GeoJSON layer retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getReportsLayer(req, res, next) {
    try {
      const { status } = req.query;
      const featureCollection = await gisService.getCitizenReportsGeoJson(status);
      return ApiResponse.success(res, featureCollection, 'Citizen reports GeoJSON layer retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getNearbyOverview(req, res, next) {
    try {
      const { longitude, latitude, maxDistanceMeters } = req.query;
      const overview = await gisService.getSpatialOverviewNearby(
        Number(longitude),
        Number(latitude),
        maxDistanceMeters ? Number(maxDistanceMeters) : undefined
      );
      return ApiResponse.success(res, overview, 'Nearby spatial hazard overview retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getBboxOverview(req, res, next) {
    try {
      const { minLon, minLat, maxLon, maxLat } = req.query;
      const overview = await gisService.getSpatialOverviewBbox(
        Number(minLon),
        Number(minLat),
        Number(maxLon),
        Number(maxLat)
      );
      return ApiResponse.success(res, overview, 'Bounding box spatial hazard overview retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GisController();
