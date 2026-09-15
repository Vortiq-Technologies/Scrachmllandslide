const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('./db');
const User = require('../models/User');
const RiskZone = require('../models/RiskZone');
const Device = require('../models/Device');
const SensorReading = require('../models/SensorReading');
const Alert = require('../models/Alert');
const CitizenReport = require('../models/CitizenReport');
const logger = require('../utils/logger');

const seedDatabase = async () => {
  try {
    await connectDB();
    logger.info('Purging existing records for fresh seed...');

    await Promise.all([
      User.deleteMany({}),
      RiskZone.deleteMany({}),
      Device.deleteMany({}),
      SensorReading.deleteMany({}),
      Alert.deleteMany({}),
      CitizenReport.deleteMany({}),
    ]);

    // 1. Seed Users
    logger.info('Seeding users...');
    const adminUser = await User.create({
      name: 'Dr. Aarav Sharma',
      email: 'admin@landslide.gov.in',
      password: 'Password123!',
      role: 'admin',
      phone: '+919876543210',
      assignedRegions: ['Uttarakhand', 'Himachal Pradesh'],
    });

    const analystUser = await User.create({
      name: 'Pooja Verma',
      email: 'analyst@landslide.gov.in',
      password: 'Password123!',
      role: 'analyst',
      phone: '+919876543211',
      assignedRegions: ['Kedarnath Basin'],
    });

    const officerUser = await User.create({
      name: 'Rajesh Negi',
      email: 'officer@landslide.gov.in',
      password: 'Password123!',
      role: 'field_officer',
      phone: '+919876543212',
      assignedRegions: ['Rudraprayag Sector'],
    });

    const citizenUser = await User.create({
      name: 'Sunita Rawat',
      email: 'citizen@example.com',
      password: 'Password123!',
      role: 'citizen',
      phone: '+919876543213',
    });

    // 2. Seed Risk Zones (Polygon Coordinates in [longitude, latitude] format)
    logger.info('Seeding Risk Zones with GeoJSON polygons...');
    const zone1 = await RiskZone.create({
      name: 'Kedarnath Upper Valley Slope',
      code: 'ZONE-KD-01',
      boundary: {
        type: 'Polygon',
        coordinates: [
          [
            [79.05, 30.72],
            [79.08, 30.72],
            [79.08, 30.75],
            [79.05, 30.75],
            [79.05, 30.72], // Closes loop
          ],
        ],
      },
      center: {
        type: 'Point',
        coordinates: [79.065, 30.735],
      },
      baselineSlopeAngle: 42.5,
      soilType: 'Weathered Schist & Glacial Colluvium',
      vegetationCover: 'Sparse Alpine',
      historicalEventsCount: 5,
      currentRiskLevel: 'HIGH',
      currentRiskScore: 0.72,
      activeAlertCount: 1,
      assignedOfficers: [officerUser._id],
      demographics: {
        estimatedPopulation: 1200,
        criticalInfrastructure: ['Pilgrim Highway 107', 'Mandakini River Bridge'],
      },
    });

    const zone2 = await RiskZone.create({
      name: 'Chamoli Alaknanda Valley Cut',
      code: 'ZONE-CH-02',
      boundary: {
        type: 'Polygon',
        coordinates: [
          [
            [79.31, 30.38],
            [79.35, 30.38],
            [79.35, 30.41],
            [79.31, 30.41],
            [79.31, 30.38],
          ],
        ],
      },
      center: {
        type: 'Point',
        coordinates: [79.33, 30.395],
      },
      baselineSlopeAngle: 36.0,
      soilType: 'Loose Silt-Clay Matrix with Quartzite Boulders',
      vegetationCover: 'Moderate Shrub',
      historicalEventsCount: 2,
      currentRiskLevel: 'MODERATE',
      currentRiskScore: 0.44,
      activeAlertCount: 0,
      assignedOfficers: [officerUser._id],
      demographics: {
        estimatedPopulation: 3400,
        criticalInfrastructure: ['Badrinath National Highway 7'],
      },
    });

    // 3. Seed Monitoring Hardware Nodes (Devices)
    logger.info('Seeding IoT Devices...');
    const device1 = await Device.create({
      deviceId: 'NODE-KD-SLOPE-A',
      name: 'Kedarnath Ridge Inclinometer Station',
      location: {
        type: 'Point',
        coordinates: [79.062, 30.731],
      },
      zoneId: zone1._id,
      status: 'ACTIVE',
      batteryPct: 88,
      signalRssi: -68,
      sensors: [
        { sensorType: 'RAINFALL', unit: 'mm', minNormal: 0, maxNormal: 150 },
        { sensorType: 'PORE_PRESSURE', unit: 'kPa', minNormal: 5, maxNormal: 45 },
        { sensorType: 'TILT_X', unit: 'deg', minNormal: -5, maxNormal: 5 },
        { sensorType: 'SOIL_MOISTURE', unit: '%', minNormal: 10, maxNormal: 70 },
      ],
      firmwareVersion: '2.1.4',
    });

    const device2 = await Device.create({
      deviceId: 'NODE-CH-ALAK-B',
      name: 'Chamoli Toe Scour Acoustic Sensor',
      location: {
        type: 'Point',
        coordinates: [79.325, 30.392],
      },
      zoneId: zone2._id,
      status: 'ACTIVE',
      batteryPct: 94,
      signalRssi: -72,
      sensors: [
        { sensorType: 'RAINFALL', unit: 'mm', minNormal: 0, maxNormal: 100 },
        { sensorType: 'VIBRATION', unit: 'intensity', minNormal: 0, maxNormal: 1 },
      ],
      firmwareVersion: '2.1.4',
    });

    // 4. Seed Sensor Readings for last 48 hours
    logger.info('Seeding Time-series Telemetry Observations...');
    const now = Date.now();
    const readings = [];

    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now - i * 60 * 60 * 1000);
      readings.push({
        deviceId: device1.deviceId,
        deviceRef: device1._id,
        location: device1.location,
        timestamp,
        readings: {
          rainfall_mm: Number((3.5 + Math.random() * 4).toFixed(1)),
          pore_pressure_kpa: Number((24 + (24 - i) * 0.8 + Math.random() * 2).toFixed(1)),
          soil_moisture_pct: Number((65 + (24 - i) * 0.5).toFixed(1)),
          tilt_degrees_x: Number((1.2 + (24 - i) * 0.04).toFixed(2)),
          tilt_degrees_y: 0.8,
          vibration_intensity: 0.04,
        },
        batteryPct: Math.round(88 - (24 - i) * 0.1),
        qcStatus: 'VALID',
        processedForMl: false,
      });
    }

    await SensorReading.insertMany(readings);

    // 5. Seed Alert
    logger.info('Seeding Initial Alert...');
    await Alert.create({
      alertCode: 'ALT-20260915-101',
      zoneId: zone1._id,
      zoneName: zone1.name,
      severity: 'WARNING',
      status: 'ACTIVE',
      triggerSource: 'ML_MODEL',
      title: 'Elevated Saturation & Surface Creep in Kedarnath Upper Valley',
      description:
        'Cumulative precipitation has exceeded 90mm over 48h with simultaneous pore pressure rise and 0.9° tilt displacement.',
      instructions: [
        'Deploy geological survey team to inspect crown cracks.',
        'Issue advisory to Pilgrim Highway authority.',
        'Place emergency rescue shelters on standby.',
      ],
      riskScore: 0.72,
      issuedAt: new Date(now - 2 * 60 * 60 * 1000),
      expiresAt: new Date(now + 22 * 60 * 60 * 1000),
      issuedBy: adminUser._id,
      broadcastChannels: [
        { channel: 'WEB_DASHBOARD', status: 'SENT' },
        { channel: 'MOBILE_PUSH', status: 'SENT' },
      ],
    });

    // 6. Seed Citizen Ground Reports
    logger.info('Seeding Citizen Ground Reports...');
    await CitizenReport.create({
      reporterId: citizenUser._id,
      reporterName: citizenUser.name,
      reporterPhone: citizenUser.phone,
      location: {
        type: 'Point',
        coordinates: [79.064, 30.733],
      },
      zoneId: zone1._id,
      reportType: 'CRACK_FORMATION',
      severity: 'SEVERE',
      description: 'Noticed 2-inch wide continuous transverse tension cracks along the road shoulder near km stone 14.',
      verificationStatus: 'VERIFIED',
      verifiedBy: officerUser._id,
      verifiedAt: new Date(now - 1 * 60 * 60 * 1000),
      officerNotes: 'Confirmed 50m long tension crack. Road maintenance notified to seal fissures.',
    });

    logger.info('Database seeded successfully!');
    logger.info('--- Credentials ---');
    logger.info('Admin:   admin@landslide.gov.in / Password123!');
    logger.info('Analyst: analyst@landslide.gov.in / Password123!');
    logger.info('Officer: officer@landslide.gov.in / Password123!');
    logger.info('Citizen: citizen@example.com / Password123!');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    logger.error(`Database seeding failed: ${err.message}`, { stack: err.stack });
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
