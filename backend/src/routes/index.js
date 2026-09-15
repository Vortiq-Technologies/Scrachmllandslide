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
const pythonMlClient = require('../integrations/pythonMlClient');
const ApiResponse = require('../utils/apiResponse');

// Health Check Endpoint
router.get('/health', async (req, res) => {
  const mlHealth = await pythonMlClient.checkHealth();

  const healthData = {
    service: 'Landslide Early Warning & Risk Monitoring API',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    status: 'HEALTHY',
    integrations: {
      pythonMlService: mlHealth,
    },
  };

  return ApiResponse.success(res, healthData, 'System operational');
});

// Mount Sub-routers
router.use('/auth', authRoutes);
router.use('/devices', deviceRoutes);
router.use('/telemetry', telemetryRoutes);
router.use('/risk', riskRoutes);
router.use('/alerts', alertRoutes);
router.use('/gis', gisRoutes);
router.use('/reports', reportRoutes);
router.use('/genai', genAiRoutes);

module.exports = router;
