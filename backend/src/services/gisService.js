const RiskZone = require('../models/RiskZone');
const Device = require('../models/Device');
const CitizenReport = require('../models/CitizenReport');
const geoUtils = require('../utils/geoUtils');

class GisService {
  /**
   * Return all Risk Zones as a standard GeoJSON FeatureCollection
   */
  async getRiskZonesGeoJson() {
    const zones = await RiskZone.find().lean();
    return geoUtils.toFeatureCollection(zones, 'boundary', '_id');
  }

  /**
   * Return all Monitoring Devices as a standard GeoJSON FeatureCollection
   */
  async getDevicesGeoJson() {
    const devices = await Device.find().lean();
    return geoUtils.toFeatureCollection(devices, 'location', 'deviceId');
  }

  /**
   * Return all Citizen Ground Observations as a standard GeoJSON FeatureCollection
   */
  async getCitizenReportsGeoJson(statusFilter = null) {
    const query = statusFilter ? { verificationStatus: statusFilter } : {};
    const reports = await CitizenReport.find(query).lean();
    return geoUtils.toFeatureCollection(reports, 'location', '_id');
  }

  /**
   * Spatial query to fetch all hazard layers near a geographic point
   */
  async getSpatialOverviewNearby(longitude, latitude, maxDistanceMeters = 5000) {
    const pointGeoJson = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    const [devices, reports, zones] = await Promise.all([
      Device.find({
        location: {
          $near: {
            $geometry: pointGeoJson,
            $maxDistance: maxDistanceMeters,
          },
        },
      }).lean(),
      CitizenReport.find({
        location: {
          $near: {
            $geometry: pointGeoJson,
            $maxDistance: maxDistanceMeters,
          },
        },
      }).lean(),
      RiskZone.find({
        boundary: {
          $geoIntersects: {
            $geometry: pointGeoJson,
          },
        },
      }).lean(),
    ]);

    return {
      center: [longitude, latitude],
      radiusMeters: maxDistanceMeters,
      intersectingRiskZones: zones,
      nearbyDevices: devices,
      nearbyCitizenReports: reports,
    };
  }

  /**
   * Spatial query to fetch all hazard layers within a bounding box (view extent)
   */
  async getSpatialOverviewBbox(minLon, minLat, maxLon, maxLat) {
    const bboxPolygon = {
      type: 'Polygon',
      coordinates: [
        [
          [minLon, minLat],
          [maxLon, minLat],
          [maxLon, maxLat],
          [minLon, maxLat],
          [minLon, minLat],
        ],
      ],
    };

    const [devices, reports, zones] = await Promise.all([
      Device.find({
        location: {
          $geoWithin: { $geometry: bboxPolygon },
        },
      }).lean(),
      CitizenReport.find({
        location: {
          $geoWithin: { $geometry: bboxPolygon },
        },
      }).lean(),
      RiskZone.find({
        boundary: {
          $geoIntersects: { $geometry: bboxPolygon },
        },
      }).lean(),
    ]);

    return {
      bbox: [minLon, minLat, maxLon, maxLat],
      riskZones: geoUtils.toFeatureCollection(zones, 'boundary', '_id'),
      devices: geoUtils.toFeatureCollection(devices, 'location', 'deviceId'),
      reports: geoUtils.toFeatureCollection(reports, 'location', '_id'),
    };
  }
}

module.exports = new GisService();
