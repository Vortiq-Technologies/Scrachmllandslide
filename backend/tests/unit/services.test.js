const geoUtils = require('../../src/utils/geoUtils');
const telemetryService = require('../../src/services/telemetryService');
const pythonMlClient = require('../../src/integrations/pythonMlClient');

describe('Services and Utilities Unit Tests', () => {
  describe('geoUtils', () => {
    it('should validate valid coordinates correctly', () => {
      expect(geoUtils.isValidCoordinate(78.5, 30.5)).toBe(true);
      expect(geoUtils.isValidCoordinate(190, 30)).toBe(false); // Lon > 180
      expect(geoUtils.isValidCoordinate(78, -95)).toBe(false); // Lat < -90
    });

    it('should format GeoJSON Point', () => {
      const point = geoUtils.toGeoJsonPoint(79.05, 30.72);
      expect(point).toEqual({
        type: 'Point',
        coordinates: [79.05, 30.72],
      });
    });

    it('should convert array of documents into GeoJSON FeatureCollection', () => {
      const docs = [
        {
          _id: 'zone1',
          name: 'Sector 1',
          boundary: {
            type: 'Polygon',
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]],
          },
        },
      ];

      const fc = geoUtils.toFeatureCollection(docs, 'boundary', '_id');
      expect(fc.type).toBe('FeatureCollection');
      expect(fc.features.length).toBe(1);
      expect(fc.features[0].id).toBe('zone1');
      expect(fc.features[0].geometry.type).toBe('Polygon');
      expect(fc.features[0].properties.name).toBe('Sector 1');
    });

    it('should calculate realistic great-circle distance', () => {
      // Distance between two points ~111km apart (1 degree latitude at equator)
      const dist = geoUtils.haversineDistance(0, 0, 0, 1);
      expect(Math.round(dist / 1000)).toBe(111);
    });
  });

  describe('Telemetry Quality Control Checks', () => {
    it('should pass normal readings as VALID', () => {
      const readings = {
        rainfall_mm: 15.0,
        soil_moisture_pct: 65,
        pore_pressure_kpa: 30,
        tilt_degrees_x: 2.5,
      };
      const qc = telemetryService._performQcChecks(readings);
      expect(qc.qcStatus).toBe('VALID');
      expect(qc.qcFlags.length).toBe(0);
    });

    it('should flag negative rainfall as ANOMALOUS', () => {
      const readings = { rainfall_mm: -5.0 };
      const qc = telemetryService._performQcChecks(readings);
      expect(qc.qcStatus).toBe('ANOMALOUS');
      expect(qc.qcFlags).toContain('NEGATIVE_RAINFALL');
    });

    it('should flag out of bounds soil moisture as OUT_OF_RANGE', () => {
      const readings = { soil_moisture_pct: 120 };
      const qc = telemetryService._performQcChecks(readings);
      expect(qc.qcStatus).toBe('OUT_OF_RANGE');
      expect(qc.qcFlags).toContain('SOIL_MOISTURE_OUT_OF_BOUNDS');
    });
  });

  describe('Python ML Client Resilient Fallback', () => {
    it('should generate transparent fallback when ML service fails', () => {
      const features = {
        cumulative_rainfall_72h_mm: 180,
        pore_pressure_kpa: 45,
        slope_angle_deg: 42,
        tilt_rate_deg_per_hr: 0.08,
      };

      const fallback = pythonMlClient._generateResilientFallback(
        features,
        'Connection refused'
      );

      expect(fallback.isFallback).toBe(true);
      expect(fallback.confidenceScore).toBe(0.5);
      expect(fallback.riskLevel).toBe('CRITICAL');
      expect(fallback.riskScore).toBeGreaterThanOrEqual(0.8);
      expect(fallback.contributingFactors.length).toBeGreaterThan(0);
    });
  });
});
