const mongoose = require('mongoose');
const {
  User,
  Device,
  Sensor,
  SensorReading,
  RiskZone,
  RiskPrediction,
  WeatherData,
  SatelliteData,
  TerrainData,
  HistoricalEvent,
  Report,
  Alert,
  NotificationLog,
  AiConversation,
  KnowledgeDocument,
  SystemLog,
} = require('../src/models');

describe('Phase 2 Data Layer & Mongoose Models Test Suite', () => {
  describe('1. Model Registration Verification', () => {
    it('should register all 16 required models in Mongoose', () => {
      const requiredModels = [
        'User',
        'Device',
        'Sensor',
        'SensorReading',
        'RiskZone',
        'RiskPrediction',
        'WeatherData',
        'SatelliteData',
        'TerrainData',
        'HistoricalEvent',
        'Report',
        'Alert',
        'NotificationLog',
        'AiConversation',
        'KnowledgeDocument',
        'SystemLog',
      ];

      requiredModels.forEach((modelName) => {
        expect(mongoose.models[modelName]).toBeDefined();
        expect(mongoose.models[modelName].modelName).toBe(modelName);
      });
    });
  });

  describe('2. User Model Validation', () => {
    it('should reject User without required fields (name, email, password)', async () => {
      const user = new User({});
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.password).toBeDefined();
    });

    it('should reject invalid user role enum', () => {
      const user = new User({
        name: 'Test Officer',
        email: 'officer@example.com',
        password: 'Password123',
        role: 'invalid_role_astronaut',
      });
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.role).toBeDefined();
    });

    it('should accept valid user role enum (super_admin, district_admin, field_officer, citizen)', () => {
      const roles = ['super_admin', 'district_admin', 'field_officer', 'citizen'];
      roles.forEach((role) => {
        const user = new User({
          name: 'Test Officer',
          email: `${role}@example.com`,
          password: 'Password123',
          role,
        });
        const err = user.validateSync();
        expect(err).toBeUndefined();
      });
    });
  });

  describe('3. Device Model Validation', () => {
    it('should reject device with invalid coordinates', () => {
      const device = new Device({
        deviceId: 'NODE-01',
        name: 'North Ridge Station',
        location: {
          type: 'Point',
          coordinates: [200, 30], // Longitude > 180 is invalid
        },
      });
      const err = device.validateSync();
      expect(err).toBeDefined();
      expect(err.errors['location.coordinates']).toBeDefined();
    });

    it('should reject invalid device status', () => {
      const device = new Device({
        deviceId: 'NODE-01',
        name: 'North Ridge Station',
        location: { type: 'Point', coordinates: [79.0, 30.0] },
        status: 'exploding',
      });
      const err = device.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.status).toBeDefined();
    });

    it('should accept valid device status enums (online, offline, warning, maintenance)', () => {
      ['online', 'offline', 'warning', 'maintenance'].forEach((status) => {
        const device = new Device({
          deviceId: `NODE-${status.toUpperCase()}`,
          name: `${status} Station`,
          location: { type: 'Point', coordinates: [79.0, 30.0] },
          status,
        });
        const err = device.validateSync();
        expect(err).toBeUndefined();
      });
    });
  });

  describe('4. Sensor Model Validation', () => {
    it('should accept valid sensor types (rainfall, soil_moisture, temperature, humidity, tilt, slope_movement)', () => {
      const dummyDeviceId = new mongoose.Types.ObjectId();
      const validTypes = ['rainfall', 'soil_moisture', 'temperature', 'humidity', 'tilt', 'slope_movement'];

      validTypes.forEach((sensorType) => {
        const sensor = new Sensor({
          sensorId: `SN-${sensorType.toUpperCase()}-01`,
          deviceId: dummyDeviceId,
          sensorType,
          unit: 'unit',
        });
        const err = sensor.validateSync();
        expect(err).toBeUndefined();
      });
    });

    it('should reject invalid sensor type', () => {
      const sensor = new Sensor({
        sensorId: 'SN-INVALID',
        deviceId: new mongoose.Types.ObjectId(),
        sensorType: 'gamma_ray_burster',
        unit: 'rad',
      });
      const err = sensor.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.sensorType).toBeDefined();
    });
  });

  describe('5. SensorReading Model Validation', () => {
    it('should accept valid sensor quality enums (valid, suspect, invalid, missing)', () => {
      const dummyDeviceId = new mongoose.Types.ObjectId();
      const dummySensorId = new mongoose.Types.ObjectId();
      const qualities = ['valid', 'suspect', 'invalid', 'missing'];

      qualities.forEach((quality) => {
        const reading = new SensorReading({
          deviceId: dummyDeviceId,
          sensorId: dummySensorId,
          value: 42.5,
          quality,
          location: { type: 'Point', coordinates: [79.0, 30.0] },
        });
        const err = reading.validateSync();
        expect(err).toBeUndefined();
      });
    });

    it('should reject invalid sensor quality enum', () => {
      const reading = new SensorReading({
        deviceId: new mongoose.Types.ObjectId(),
        sensorId: new mongoose.Types.ObjectId(),
        value: 12.3,
        quality: 'dubious_rumor',
        location: { type: 'Point', coordinates: [79.0, 30.0] },
      });
      const err = reading.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.quality).toBeDefined();
    });
  });

  describe('6. RiskZone Model Validation', () => {
    it('should accept valid risk level enums (low, moderate, high, critical)', () => {
      ['low', 'moderate', 'high', 'critical'].forEach((currentRiskLevel) => {
        const zone = new RiskZone({
          name: 'Valley Sector',
          code: `ZONE-${currentRiskLevel.toUpperCase()}`,
          boundary: {
            type: 'Polygon',
            coordinates: [[[79.0, 30.0], [79.1, 30.0], [79.1, 30.1], [79.0, 30.1], [79.0, 30.0]]],
          },
          currentRiskLevel,
        });
        const err = zone.validateSync();
        expect(err).toBeUndefined();
      });
    });

    it('should reject risk score out of range [0, 1]', () => {
      const zone = new RiskZone({
        name: 'Valley Sector',
        code: 'ZONE-OVERFLOW',
        boundary: {
          type: 'Polygon',
          coordinates: [[[79.0, 30.0], [79.1, 30.0], [79.1, 30.1], [79.0, 30.1], [79.0, 30.0]]],
        },
        currentRiskScore: 1.5,
      });
      const err = zone.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.currentRiskScore).toBeDefined();
    });
  });

  describe('7. RiskPrediction Model Validation', () => {
    it('should validate RiskPrediction required fields and risk level', () => {
      const prediction = new RiskPrediction({
        riskZoneId: new mongoose.Types.ObjectId(),
        riskScore: 0.78,
        riskLevel: 'high',
        probability: 0.78,
        featuresSnapshot: { rainfall24h: 45 },
      });
      const err = prediction.validateSync();
      expect(err).toBeUndefined();
    });

    it('should reject invalid risk level in RiskPrediction', () => {
      const prediction = new RiskPrediction({
        riskZoneId: new mongoose.Types.ObjectId(),
        riskScore: 0.78,
        riskLevel: 'extreme_danger_unknown',
        probability: 0.78,
        featuresSnapshot: {},
      });
      const err = prediction.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.riskLevel).toBeDefined();
    });
  });

  describe('8. HistoricalEvent Model Validation', () => {
    it('should validate HistoricalEvent with trigger type and severity', () => {
      const event = new HistoricalEvent({
        eventCode: 'HE-2023-01',
        name: 'Rudraprayag Slope Slide',
        eventDate: new Date('2023-08-14'),
        severity: 'critical',
        triggerType: 'rainfall',
        location: {
          type: 'Point',
          coordinates: [78.98, 30.28],
        },
      });
      const err = event.validateSync();
      expect(err).toBeUndefined();
    });
  });

  describe('9. Geospatial 2dsphere Indexes Verification', () => {
    it('should configure 2dsphere indexes on geospatial models', () => {
      const spatialModels = [
        { model: Device, field: 'location' },
        { model: SensorReading, field: 'location' },
        { model: RiskZone, field: 'boundary' },
        { model: WeatherData, field: 'location' },
        { model: SatelliteData, field: 'boundary' },
        { model: TerrainData, field: 'geometry' },
        { model: HistoricalEvent, field: 'location' },
        { model: Report, field: 'location' },
        { model: Alert, field: 'affectedArea' },
      ];

      spatialModels.forEach(({ model, field }) => {
        const indexes = model.schema.indexes();
        const has2dsphere = indexes.some(
          ([fields]) => fields[field] === '2dsphere'
        );
        expect(has2dsphere).toBe(true);
      });
    });
  });
});
