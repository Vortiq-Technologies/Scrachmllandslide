const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Phase 1 Foundation Test Suite', () => {
  describe('GET /api/v1/health', () => {
    it('should return 200 with standard success response envelope', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Service is healthy');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('status');
      expect(['UP', 'HEALTHY']).toContain(res.body.data.status);
      expect(res.body.data).toHaveProperty('uptimeSeconds');
      expect(res.body.data).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('meta');
    });
  });

  describe('GET /api/v1/ready', () => {
    let dbStatusSpy;

    afterEach(() => {
      if (dbStatusSpy) {
        dbStatusSpy.mockRestore();
      }
    });

    it('should return 200 READY when database connection is connected', async () => {
      dbStatusSpy = jest.spyOn(db, 'getDatabaseStatus').mockReturnValue({
        isConnected: true,
        readyState: 1,
        statusText: 'CONNECTED',
        host: '127.0.0.1',
        databaseName: 'landslide_monitoring',
      });

      const res = await request(app).get('/api/v1/ready');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('status', 'READY');
      expect(res.body.data.database).toHaveProperty('isConnected', true);
      expect(res.body.data.database).toHaveProperty('statusText', 'CONNECTED');
    });

    it('should return 503 SERVICE_UNAVAILABLE when database is disconnected', async () => {
      dbStatusSpy = jest.spyOn(db, 'getDatabaseStatus').mockReturnValue({
        isConnected: false,
        readyState: 0,
        statusText: 'DISCONNECTED',
        host: null,
        databaseName: null,
      });

      const res = await request(app).get('/api/v1/ready');

      expect(res.status).toBe(503);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
      expect(res.body.error).toHaveProperty('code', 'SERVICE_UNAVAILABLE');
      expect(res.body.error.details.database).toHaveProperty('isConnected', false);
      expect(res.body.error.details.database).toHaveProperty('statusText', 'DISCONNECTED');
    });
  });

  describe('Root Welcome Route GET /', () => {
    it('should return welcome payload with canonical API prefix', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('canonicalApiPrefix', '/api/v1');
    });
  });

  describe('404 Route Not Found Handling', () => {
    it('should return standard error response for undefined route', async () => {
      const res = await request(app).get('/api/v1/unknown-endpoint');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: 'Endpoint not found: GET /api/v1/unknown-endpoint',
        error: {
          code: 'NOT_FOUND',
          details: {},
        },
      });
    });
  });

  describe('Security & Middleware Verification', () => {
    it('should include Helmet security headers', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(res.headers).toHaveProperty('x-dns-prefetch-control', 'off');
    });

    it('should reject malformed JSON bodies gracefully via error handler', async () => {
      const res = await request(app)
        .post('/api/v1/health')
        .set('Content-Type', 'application/json')
        .send('{"invalidJson:');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'BAD_REQUEST');
      expect(res.body.message).toContain('Malformed JSON payload');
    });
  });
});
