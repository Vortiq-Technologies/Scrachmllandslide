const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const deviceRoutes = require('./deviceRoutes');
const telemetryRoutes = require('./telemetryRoutes');
const riskRoutes = require('./riskRoutes');
const alertRoutes = require('./alertRoutes');
const gisRoutes = require('./gisRoutes');
const reportRoutes = require('./reportRoutes');
const genAiRoutes = require('./genAiRoutes');
const sensorRoutes = require('./sensorRoutes');
const weatherRoutes = require('./weatherRoutes');
const satelliteRoutes = require('./satelliteRoutes');
const terrainRoutes = require('./terrainRoutes');
const historicalEventRoutes = require('./historicalEventRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

// ── Health & Readiness Probes ────────────────────────────────────────────────

/**
 * GET /health
 * Lightweight liveness check – always returns 200 if the server process is alive.
 */
router.get('/health', async (req, res) => {
  return ApiResponse.success(
    res,
    {
      status: 'HEALTHY',
      service: 'Landslide Early Warning & Risk Monitoring API',
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      integrations: {
        database: 'connected',
      },
    },
    'Service is healthy',
    200,
    { timestamp: new Date().toISOString() }
  );
});

/**
 * GET /ready
 * Readiness check – 503 when MongoDB is not connected.
 */
router.get('/ready', async (req, res, next) => {
  const dbStatus = db.getDatabaseStatus();
  if (!dbStatus.isConnected) {
    return next(
      ApiError.serviceUnavailable('Service is not ready: Database connection unavailable', {
        database: dbStatus,
      })
    );
  }

  return ApiResponse.success(
    res,
    {
      status: 'READY',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    },
    'Service is ready to handle traffic',
    200,
    { timestamp: new Date().toISOString() }
  );
});

// ── Feature Sub-routers ──────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/devices', deviceRoutes);
router.use('/sensors', sensorRoutes);
router.use('/telemetry', telemetryRoutes);
router.use('/ingestion', telemetryRoutes);    // alias for /api/v1/ingestion/sensor → telemetry ingest
router.use('/risk', riskRoutes);
router.use('/zones', riskRoutes);             // alias for /zones directly (spec §26)
router.use('/alerts', alertRoutes);
router.use('/gis', gisRoutes);
router.use('/reports', reportRoutes);
router.use('/weather', weatherRoutes);
router.use('/satellite', satelliteRoutes);
router.use('/terrain', terrainRoutes);
router.use('/historical-events', historicalEventRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/ai', genAiRoutes);
router.use('/genai', genAiRoutes);

module.exports = router;
