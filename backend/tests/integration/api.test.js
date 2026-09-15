const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../src/app');
const env = require('../../src/config/env');

let mongoServer;
let adminToken;
let createdZoneId;
let createdAlertId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('End-to-End API Integration Suite', () => {
  describe('GET /api/v1/health', () => {
    it('should return 200 OK with system status and integration info', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('HEALTHY');
      expect(res.body.data.service).toBe('Landslide Early Warning & Risk Monitoring API');
    });
  });

  describe('Authentication Flow (/api/v1/auth)', () => {
    it('should register a new administrator user', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Dr. System Admin',
        email: 'sysadmin@landslide.gov.in',
        password: 'AdminPassword123!',
        role: 'admin',
        assignedRegions: ['Himalayan Basin'],
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('sysadmin@landslide.gov.in');
      expect(res.body.data.token).toBeDefined();
    });

    it('should authenticate admin user and return JWT', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'sysadmin@landslide.gov.in',
        password: 'AdminPassword123!',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();

      adminToken = res.body.data.token;
    });

    it('should retrieve current user profile with valid JWT', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe('Dr. System Admin');
      expect(res.body.data.role).toBe('admin');
    });
  });

  describe('Risk Zones Management (/api/v1/risk/zones)', () => {
    it('should create a new RiskZone with GeoJSON boundary', async () => {
      const zonePayload = {
        name: 'Upper Mandakini Gorge',
        code: 'ZONE-UM-01',
        boundary: {
          type: 'Polygon',
          coordinates: [
            [
              [79.0, 30.0],
              [79.1, 30.0],
              [79.1, 30.1],
              [79.0, 30.1],
              [79.0, 30.0],
            ],
          ],
        },
        baselineSlopeAngle: 41,
        soilType: 'Fissured Quartzite',
      };

      const res = await request(app)
        .post('/api/v1/risk/zones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(zonePayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.code).toBe('ZONE-UM-01');
      createdZoneId = res.body.data._id;
    });

    it('should list all risk zones', async () => {
      const res = await request(app).get('/api/v1/risk/zones');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Hardware Telemetry Ingestion (/api/v1/telemetry/ingest)', () => {
    it('should ingest telemetry observation using device API key', async () => {
      const telemetryPayload = {
        deviceId: 'NODE-TEST-01',
        readings: {
          rainfall_mm: 14.2,
          pore_pressure_kpa: 32.5,
          soil_moisture_pct: 78.0,
          tilt_degrees_x: 1.8,
          tilt_degrees_y: 0.5,
          vibration_intensity: 0.05,
        },
        location: {
          type: 'Point',
          coordinates: [79.05, 30.05],
        },
        batteryPct: 95,
      };

      const res = await request(app)
        .post('/api/v1/telemetry/ingest')
        .set('x-device-key', env.DEVICE_INGEST_API_KEY)
        .send(telemetryPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.deviceId).toBe('NODE-TEST-01');
      expect(res.body.data.qcStatus).toBe('VALID');
    });

    it('should query historical telemetry', async () => {
      const res = await request(app)
        .get('/api/v1/telemetry?deviceId=NODE-TEST-01')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GIS GeoJSON Endpoints (/api/v1/gis)', () => {
    it('should return risk zones as a standard GeoJSON FeatureCollection', async () => {
      const res = await request(app).get('/api/v1/gis/zones');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.type).toBe('FeatureCollection');
      expect(Array.isArray(res.body.data.features)).toBe(true);
      expect(res.body.data.features[0].geometry.type).toBe('Polygon');
    });
  });

  describe('Alerts & Early Warning Lifecycle (/api/v1/alerts)', () => {
    it('should create an early warning alert', async () => {
      const alertPayload = {
        zoneId: createdZoneId,
        zoneName: 'Upper Mandakini Gorge',
        severity: 'WARNING',
        triggerSource: 'MANUAL_AUTHORITY',
        title: 'Accelerating Slope Creep Alert',
        description: 'Tension crack widening detected along northern flank.',
        instructions: ['Suspend transit', 'Deploy inspection crew'],
      };

      const res = await request(app)
        .post('/api/v1/alerts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(alertPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.status).toBe('ACTIVE');
      createdAlertId = res.body.data._id;
    });

    it('should acknowledge the active alert', async () => {
      const res = await request(app)
        .post(`/api/v1/alerts/${createdAlertId}/acknowledge`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('ACKNOWLEDGED');
    });

    it('should resolve the alert with notes', async () => {
      const res = await request(app)
        .post(`/api/v1/alerts/${createdAlertId}/resolve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ resolutionNotes: 'Slope stabilized after drainage trench clearance.' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('RESOLVED');
    });
  });

  describe('Citizen Ground Reports (/api/v1/reports)', () => {
    it('should allow submitting a ground observation', async () => {
      const reportPayload = {
        reportType: 'CRACK_FORMATION',
        severity: 'SEVERE',
        description: 'Visible 10-meter ground fissure crossing trail.',
        location: {
          type: 'Point',
          coordinates: [79.04, 30.04],
        },
        addressOrLandmark: 'Near Trail Post 8',
      };

      const res = await request(app).post('/api/v1/reports').send(reportPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.reportType).toBe('CRACK_FORMATION');
      expect(res.body.data.verificationStatus).toBe('PENDING');
    });
  });
});
