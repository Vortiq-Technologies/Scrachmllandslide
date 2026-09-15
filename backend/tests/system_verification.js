const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
const env = require('../src/config/env');

async function runLiveVerification() {
  console.log('===============================================================');
  console.log('   AI-BASED LANDSLIDE EARLY WARNING SYSTEM - LIVE RUNTIME TEST ');
  console.log('===============================================================\n');

  const report = {
    timestamp: new Date().toISOString(),
    testsPassed: 0,
    testsFailed: 0,
    results: [],
  };

  function record(name, passed, details) {
    if (passed) {
      report.testsPassed++;
      console.log(`  [PASS] ${name}`);
    } else {
      report.testsFailed++;
      console.error(`  [FAIL] ${name} - Details:`, details);
    }
    report.results.push({ name, passed, details });
  }

  try {
    // 1. Connect to Live MongoDB
    console.log('[Step 1] Connecting to MongoDB Cluster...');
    await db.connectDB();
    const dbStatus = db.getDatabaseStatus();
    record('MongoDB Database Connection', dbStatus.isConnected, { db: dbStatus.databaseName, host: dbStatus.host });

    // 2. Health & Readiness Probes
    console.log('\n[Step 2] Verifying System Probes & Health Checks...');
    const healthRes = await request(app).get('/api/v1/health');
    record('GET /api/v1/health (Liveness Probe)', healthRes.status === 200 && healthRes.body.data?.status === 'HEALTHY', {
      statusCode: healthRes.status,
      service: healthRes.body.data?.service,
    });

    const readyRes = await request(app).get('/api/v1/ready');
    record('GET /api/v1/ready (Readiness Probe)', readyRes.status === 200 && readyRes.body.data?.status === 'READY', {
      statusCode: readyRes.status,
      database: readyRes.body.data?.database?.statusText,
    });

    // 3. User Authentication & Multi-Role Authorization
    console.log('\n[Step 3] Verifying Multi-Role Auth (Admin + Field Officer)...');
    const adminEmail = `admin_${Date.now()}@landslide.gov.in`;
    const adminRegRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Dr. System Administrator',
        email: adminEmail,
        password: 'Password123!',
        role: 'admin',
        phone: '+919876543210',
      });
    record('POST /api/v1/auth/register (Create Admin User)', adminRegRes.status === 201, {
      userId: adminRegRes.body.data?.user?.id,
    });

    const adminLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: adminEmail, password: 'Password123!' });
    const adminToken = adminLoginRes.body.data?.token;
    record('POST /api/v1/auth/login (JWT Issue)', adminLoginRes.status === 200 && !!adminToken, {
      tokenLength: adminToken ? adminToken.length : 0,
    });

    const officerEmail = `officer_${Date.now()}@landslide.gov.in`;
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Inspector Rajesh Negi',
        email: officerEmail,
        password: 'Password123!',
        role: 'field_officer',
      });
    const officerLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: officerEmail, password: 'Password123!' });
    const officerToken = officerLoginRes.body.data?.token;
    record('POST /api/v1/auth/login (Field Officer JWT)', officerLoginRes.status === 200 && !!officerToken, {
      officerEmail,
    });

    // 4. Geospatial Risk Zone Management
    console.log('\n[Step 4] Verifying Risk Zone Management & Spatial Polygons...');
    const zoneCode = `ZONE-VALLEY-${Date.now().toString().slice(-4)}`;
    const createZoneRes = await request(app)
      .post('/api/v1/risk/zones')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Pithoragarh Critical Valley Cut',
        code: zoneCode,
        boundary: {
          type: 'Polygon',
          coordinates: [
            [
              [80.21, 29.58],
              [80.24, 29.58],
              [80.24, 29.61],
              [80.21, 29.61],
              [80.21, 29.58],
            ],
          ],
        },
        currentRiskLevel: 'HIGH',
        currentRiskScore: 0.79,
      });
    const zoneId = createZoneRes.body.data?._id || createZoneRes.body.data?.id;
    record('POST /api/v1/risk/zones (Create Polygon Risk Zone)', createZoneRes.status === 201 && !!zoneId, {
      zoneId,
      code: zoneCode,
    });

    const listZonesRes = await request(app).get('/api/v1/risk/zones');
    record('GET /api/v1/risk/zones (List All Active Zones)', listZonesRes.status === 200 && Array.isArray(listZonesRes.body.data), {
      totalZones: listZonesRes.body.data?.length,
    });

    // 5. Hardware Device & Sensor Registration
    console.log('\n[Step 5] Verifying Edge Monitoring Gateways & Sensors...');
    const deviceId = `GW-VALLEY-${Date.now().toString().slice(-4)}`;
    const regDeviceRes = await request(app)
      .post('/api/v1/devices')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        deviceId,
        name: 'Pithoragarh Valley Solar Gateway',
        type: 'gateway',
        location: {
          type: 'Point',
          coordinates: [80.225, 29.595],
        },
        status: 'online',
        zoneId,
        elevationMeters: 1850,
        batteryPct: 98,
        sensors: ['rainfall', 'tilt', 'soil_moisture', 'pore_pressure'],
      });
    record('POST /api/v1/devices (Register Gateway)', regDeviceRes.status === 201, {
      deviceId,
      status: regDeviceRes.body.data?.status,
    });

    // 6. Hardware Telemetry Ingestion (API Key Auth + Quality Control Checks)
    console.log('\n[Step 6] Verifying Hardware Telemetry Ingestion & Real-Time QC...');
    const telemetryRes = await request(app)
      .post('/api/v1/telemetry/ingest')
      .set('x-device-key', env.DEVICE_INGEST_API_KEY)
      .send({
        deviceId,
        location: {
          type: 'Point',
          coordinates: [80.225, 29.595],
        },
        timestamp: new Date().toISOString(),
        readings: {
          rainfall_mm: 52.4,
          soil_moisture_pct: 88.0,
          pore_pressure_kpa: 55.2,
          tilt_degrees_x: 3.12,
          tilt_degrees_y: 1.45,
          vibration_intensity: 0.12,
        },
        batteryPct: 96,
      });
    record('POST /api/v1/telemetry/ingest (Valid Ingestion - QC: VALID)', telemetryRes.status === 201 && telemetryRes.body.data?.qcStatus === 'VALID', {
      qcStatus: telemetryRes.body.data?.qcStatus,
      readingId: telemetryRes.body.data?._id,
    });

    // Anomaly Detection: Negative Rainfall
    const anomalousRes = await request(app)
      .post('/api/v1/telemetry/ingest')
      .set('x-device-key', env.DEVICE_INGEST_API_KEY)
      .send({
        deviceId,
        readings: {
          rainfall_mm: -25.0, // Negative rainfall
          soil_moisture_pct: 120.0, // Out of bounds
        },
      });
    record('POST /api/v1/telemetry/ingest (Anomaly Flagging - QC: OUT_OF_RANGE)', anomalousRes.status === 201 && (anomalousRes.body.data?.qcStatus === 'OUT_OF_RANGE' || anomalousRes.body.data?.qcStatus === 'ANOMALOUS'), {
      qcStatus: anomalousRes.body.data?.qcStatus,
      flags: anomalousRes.body.data?.qcFlags,
    });

    // 7. Early Warning Alert Lifecycle (Create -> Ack -> Resolve)
    console.log('\n[Step 7] Verifying Early Warning Alert Lifecycle...');
    const alertRes = await request(app)
      .post('/api/v1/alerts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        zoneId: zoneId,
        zoneName: 'Pithoragarh Critical Valley Cut',
        severity: 'EMERGENCY_EVACUATION',
        triggerSource: 'SENSOR_THRESHOLD',
        title: 'Imminent Slope Failure: Tilt Exceeded 3.1°',
        description: 'Multi-parameter threshold breach: Heavy rainfall (52mm/h) + accelerated tilt displacement.',
        instructions: ['Sound local sirens', 'Evacuate downstream settlement', 'Halt highway traffic'],
        riskScore: 0.94,
      });
    const alertId = alertRes.body.data?._id;
    record('POST /api/v1/alerts (Issue Emergency Warning)', alertRes.status === 201 && alertRes.body.data?.status === 'ACTIVE', {
      alertCode: alertRes.body.data?.alertCode,
      severity: alertRes.body.data?.severity,
    });

    const ackAlertRes = await request(app)
      .post(`/api/v1/alerts/${alertId}/acknowledge`)
      .set('Authorization', `Bearer ${officerToken}`);
    record('POST /api/v1/alerts/:id/acknowledge (Field Officer Acknowledges)', ackAlertRes.status === 200 && ackAlertRes.body.data?.status === 'ACKNOWLEDGED', {
      status: ackAlertRes.body.data?.status,
    });

    const resolveAlertRes = await request(app)
      .post(`/api/v1/alerts/${alertId}/resolve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ resolutionNotes: 'Retaining buttress completed and pore pressure stabilized.' });
    record('POST /api/v1/alerts/:id/resolve (Admin Resolves with Notes)', resolveAlertRes.status === 200 && resolveAlertRes.body.data?.status === 'RESOLVED', {
      status: resolveAlertRes.body.data?.status,
      resolutionNotes: resolveAlertRes.body.data?.resolutionNotes,
    });

    // 8. GIS Spatial Queries
    console.log('\n[Step 8] Verifying GIS GeoJSON Features & Spatial Search...');
    const gisZonesRes = await request(app).get('/api/v1/gis/zones');
    record('GET /api/v1/gis/zones (GeoJSON FeatureCollection)', gisZonesRes.status === 200 && gisZonesRes.body.data?.type === 'FeatureCollection', {
      featureCount: gisZonesRes.body.data?.features?.length,
    });

    const gisNearbyRes = await request(app)
      .get('/api/v1/gis/nearby')
      .query({ longitude: 80.225, latitude: 29.595, maxDistanceMeters: 15000 });
    record('GET /api/v1/gis/nearby (Radius Spatial Query)', gisNearbyRes.status === 200 && Array.isArray(gisNearbyRes.body.data?.nearbyDevices), {
      nearbyDevices: gisNearbyRes.body.data?.nearbyDevices?.length,
    });

    // 9. Citizen Ground Observations & Verification
    console.log('\n[Step 9] Verifying Citizen Incident Submission & Field Verification...');
    const citizenReportRes = await request(app)
      .post('/api/v1/reports')
      .send({
        reporterName: 'Village Pradhan',
        reporterPhone: '+919760011223',
        reportType: 'CRACK_FORMATION',
        severity: 'SEVERE',
        description: 'New 4-inch deep ground cracks visible across hillside footpath above the school.',
        location: {
          type: 'Point',
          coordinates: [80.226, 29.596],
        },
      });
    const reportId = citizenReportRes.body.data?._id;
    record('POST /api/v1/reports (Citizen Incident Report Submitted)', citizenReportRes.status === 201 && citizenReportRes.body.data?.verificationStatus === 'PENDING', {
      reportId,
      status: citizenReportRes.body.data?.verificationStatus,
    });

    const verifyReportRes = await request(app)
      .patch(`/api/v1/reports/${reportId}/verify`)
      .set('Authorization', `Bearer ${officerToken}`)
      .send({
        verificationStatus: 'VERIFIED',
        officerNotes: 'Inspected on-site: tension cracks verified. Sandbag reinforcement initiated.',
      });
    record('PATCH /api/v1/reports/:id/verify (Officer Verifies On-Site)', verifyReportRes.status === 200 && verifyReportRes.body.data?.verificationStatus === 'VERIFIED', {
      status: verifyReportRes.body.data?.verificationStatus,
    });

    // 10. Dashboard Overview Metrics
    console.log('\n[Step 10] Verifying Operational Dashboard Overview...');
    const dashRes = await request(app).get('/api/v1/dashboard/overview');
    record('GET /api/v1/dashboard/overview (Live Metrics Aggregation)', dashRes.status === 200 && typeof dashRes.body.data?.zones?.total === 'number', {
      totalZones: dashRes.body.data?.zones?.total,
      devicesHealthPct: `${dashRes.body.data?.devices?.healthPct}%`,
      systemStatus: dashRes.body.data?.systemStatus,
    });

    // 11. External Data Caching / Proxy (Historical, Weather, Terrain)
    console.log('\n[Step 11] Verifying Historical Events & External Data Endpoints...');
    const histRes = await request(app).get('/api/v1/historical-events');
    record('GET /api/v1/historical-events (Query Historical Landslides)', histRes.status === 200 && Array.isArray(histRes.body.data), {
      totalRecords: histRes.body.data?.length,
    });

    const weatherForecastRes = await request(app).get(`/api/v1/weather/${zoneId}/forecast`);
    record('GET /api/v1/weather/:zoneId/forecast (Cached Forecast Proxy)', weatherForecastRes.status === 200, {
      forecastStatus: 'OK',
    });

    // 12. Generative AI Copilot & Risk Explanation
    console.log('\n[Step 12] Verifying Generative AI Decision Copilot...');
    const aiExplainRes = await request(app)
      .post('/api/v1/ai/explain-risk')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        zoneId: zoneId,
        includeWeather: true,
      });
    record('POST /api/v1/ai/explain-risk (GenAI Contextual Risk Explanation)', aiExplainRes.status === 200 && (!!aiExplainRes.body.data?.aiExplanation || !!aiExplainRes.body.data?.explanation), {
      status: aiExplainRes.status,
      explanationGenerated: !!(aiExplainRes.body.data?.aiExplanation || aiExplainRes.body.data?.explanation),
      modelUsed: aiExplainRes.body.data?.modelUsed,
    });

    console.log('\n===============================================================');
    console.log(`FINAL LIVE RESULT: ${report.testsPassed} PASSED | ${report.testsFailed} FAILED`);
    console.log('===============================================================\n');

  } catch (err) {
    console.error('Fatal verification error:', err);
  } finally {
    await db.disconnectDB();
  }
}

runLiveVerification();
