const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

async function runFullE2ETest() {
  console.log('================================================================');
  console.log('   AI-BASED LANDSLIDE MONITORING - FULL SYSTEM INTEGRATION TEST  ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, extraInfo = '') {
    if (condition) {
      passed++;
      console.log(`  ✓ [PASS] ${name} ${extraInfo ? '(' + extraInfo + ')' : ''}`);
    } else {
      failed++;
      console.error(`  ✗ [FAIL] ${name} ${extraInfo ? '- ' + extraInfo : ''}`);
    }
  }

  try {
    await db.connectDB();

    // 1. Check API Liveness and Readiness
    console.log('[Phase 1] Health & Readiness Endpoints');
    const health = await request(app).get('/api/v1/health');
    assert('Health endpoint status 200', health.status === 200 && health.body.data?.status === 'HEALTHY');

    const ready = await request(app).get('/api/v1/ready');
    assert('Readiness endpoint status 200', ready.status === 200 && ready.body.data?.status === 'READY');

    // 2. Authentication flow for Seeded Demo Accounts
    console.log('\n[Phase 2] Authentication & Token Verification');
    const roles = [
      { role: 'admin', email: 'admin@landslide.gov.in', password: 'Password123!' },
      { role: 'field_officer', email: 'officer@landslide.gov.in', password: 'Password123!' },
      { role: 'citizen', email: 'citizen@example.com', password: 'Password123!' },
    ];

    const tokens = {};
    for (const user of roles) {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: user.password });
      
      const ok = loginRes.status === 200 && loginRes.body.data?.token;
      tokens[user.role] = loginRes.body.data?.token;
      assert(`Login for ${user.role} (${user.email})`, ok, `Status: ${loginRes.status}`);

      if (ok) {
        const meRes = await request(app)
          .get('/api/v1/auth/me')
          .set('Authorization', `Bearer ${tokens[user.role]}`);
        assert(`Verify /auth/me for ${user.role}`, meRes.status === 200 && meRes.body.data?.email === user.email);
      }
    }

    // 3. Dashboard API Endpoints
    console.log('\n[Phase 3] Dashboard Data Aggregation');
    const overviewRes = await request(app)
      .get('/api/v1/dashboard/overview')
      .set('Authorization', `Bearer ${tokens.admin}`);
    assert('Dashboard /overview returns zone and device counts', 
      overviewRes.status === 200 && typeof overviewRes.body.data?.zones?.total === 'number');

    const zonesRes = await request(app).get('/api/v1/risk/zones');
    assert('Risk Zones /risk/zones returns array', 
      zonesRes.status === 200 && Array.isArray(zonesRes.body.data));
    const activeZone = zonesRes.body.data[0];
    const zoneId = activeZone?._id || activeZone?.id;

    const activeAlertsRes = await request(app).get('/api/v1/alerts/active');
    assert('Active Alerts /alerts/active returns array', 
      activeAlertsRes.status === 200 && Array.isArray(activeAlertsRes.body.data));

    // 4. Alerts Lifecycle (Filter -> Acknowledge -> Resolve)
    console.log('\n[Phase 4] Alerts Management Lifecycle');
    const allAlertsRes = await request(app).get('/api/v1/alerts');
    assert('Fetch all alerts /alerts', allAlertsRes.status === 200 && Array.isArray(allAlertsRes.body.data));

    // Create a fresh alert to test acknowledge and resolve
    const newAlertRes = await request(app)
      .post('/api/v1/alerts')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        zoneId: (typeof zoneId === 'string' && zoneId.length === 24) ? zoneId : undefined,
        zoneName: 'Chamoli High-Risk Sector',
        severity: 'HIGH',
        triggerSource: 'ML_MODEL',
        title: 'Rainfall Spike Alert Test',
        description: 'Automated test alert for system verification.',
        riskScore: 0.85,
      });
    const testAlertId = newAlertRes.body.data?._id;
    assert('Create new alert via POST /alerts', newAlertRes.status === 201 && !!testAlertId);

    if (testAlertId) {
      const ackRes = await request(app)
        .patch(`/api/v1/alerts/${testAlertId}/acknowledge`)
        .set('Authorization', `Bearer ${tokens.field_officer}`);
      assert('Acknowledge alert via PATCH /alerts/:id/acknowledge', 
        ackRes.status === 200 && ackRes.body.data?.status === 'ACKNOWLEDGED');

      const resolveRes = await request(app)
        .patch(`/api/v1/alerts/${testAlertId}/resolve`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send({ resolutionNotes: 'Resolved during end-to-end integration testing.' });
      assert('Resolve alert via PATCH /alerts/:id/resolve', 
        resolveRes.status === 200 && resolveRes.body.data?.status === 'RESOLVED');
    }

    // 5. Citizen Incident Reports (Submit -> List -> Verify)
    console.log('\n[Phase 5] Incident Reporting Workflow');
    const newReportRes = await request(app)
      .post('/api/v1/reports')
      .set('Authorization', `Bearer ${tokens.citizen}`)
      .send({
        reporterName: 'Test Citizen User',
        reporterPhone: '+919876543210',
        reportType: 'ROCKFALL',
        severity: 'MODERATE',
        description: 'Small boulders observed rolling onto the lower access road.',
        location: {
          type: 'Point',
          coordinates: [79.52, 29.38],
        },
      });
    const testReportId = newReportRes.body.data?._id;
    assert('Citizen submit incident report POST /reports', 
      newReportRes.status === 201 && testReportId && newReportRes.body.data?.verificationStatus === 'PENDING');

    const getReportsRes = await request(app).get('/api/v1/reports');
    assert('Get all incident reports GET /reports', 
      getReportsRes.status === 200 && Array.isArray(getReportsRes.body.data));

    if (testReportId) {
      const verifyReportRes = await request(app)
        .patch(`/api/v1/reports/${testReportId}/verify`)
        .set('Authorization', `Bearer ${tokens.field_officer}`)
        .send({
          verificationStatus: 'VERIFIED',
          officerNotes: 'Inspected by field patrol. Road cleared of debris.',
        });
      assert('Field officer verifies incident PATCH /reports/:id/verify', 
        verifyReportRes.status === 200 && verifyReportRes.body.data?.verificationStatus === 'VERIFIED');
    }

    // 6. AI Copilot Capabilities
    console.log('\n[Phase 6] AI Copilot Decision Support');
    const aiChatRes = await request(app)
      .post('/api/v1/ai/chat')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        message: 'What are the top risk factors in the Chamoli region today?',
        context: { zone: 'Chamoli' },
      });
    assert('AI Copilot Chat POST /ai/chat', 
      aiChatRes.status === 200 && !!(aiChatRes.body.data?.reply || aiChatRes.body.data?.message));

    const aiReportRes = await request(app)
      .post('/api/v1/ai/generate-report')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        zoneId: (typeof zoneId === 'string' && zoneId.length === 24) ? zoneId : undefined,
        reportType: 'WEEKLY_RISK_ASSESSMENT',
      });
    assert('AI Copilot Generate Report POST /ai/generate-report', 
      aiReportRes.status === 200 && !!(aiReportRes.body.data?.aiExplanation || aiReportRes.body.data?.reportContent || aiReportRes.body.data?.summary));

    const aiAlertDraftRes = await request(app)
      .post('/api/v1/ai/generate-alert')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        zoneId: (typeof zoneId === 'string' && zoneId.length === 24) ? zoneId : undefined,
        anomalyType: 'EXCESSIVE_SOIL_SATURATION',
      });
    assert('AI Copilot Generate Alert Draft POST /ai/generate-alert', 
      aiAlertDraftRes.status === 200 && !!(aiAlertDraftRes.body.data?.advisoryDraft || aiAlertDraftRes.body.data?.advisoryText || aiAlertDraftRes.body.data?.alertDraft));

    // Summary
    console.log('\n================================================================');
    console.log(`RESULT: ${passed} PASSED | ${failed} FAILED`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('Fatal test exception:', err);
  } finally {
    await db.disconnectDB();
  }
}

runFullE2ETest();
