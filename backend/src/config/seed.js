const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('./db');
const User = require('../models/User');
const RiskZone = require('../models/RiskZone');
const Device = require('../models/Device');
const Sensor = require('../models/Sensor');
const SensorReading = require('../models/SensorReading');
const Alert = require('../models/Alert');
const Report = require('../models/Report');
const TerrainData = require('../models/TerrainData');
const WeatherData = require('../models/WeatherData');
const SatelliteData = require('../models/SatelliteData');
const HistoricalEvent = require('../models/HistoricalEvent');
const logger = require('../utils/logger');

const seedDatabase = async () => {
  try {
    await connectDB();
    logger.info('Purging existing records for fresh seed...');

    await Promise.all([
      User.deleteMany({}),
      RiskZone.deleteMany({}),
      Device.deleteMany({}),
      Sensor.deleteMany({}),
      SensorReading.deleteMany({}),
      Alert.deleteMany({}),
      Report.deleteMany({}),
      TerrainData.deleteMany({}),
      WeatherData.deleteMany({}),
      SatelliteData.deleteMany({}),
      HistoricalEvent.deleteMany({}),
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
            [79.06, 30.73],
            [79.08, 30.73],
            [79.08, 30.75],
            [79.06, 30.75],
            [79.06, 30.73],
          ],
        ],
      },
      center: {
        type: 'Point',
        coordinates: [79.07, 30.74],
      },
      currentRiskLevel: 'HIGH',
      currentRiskScore: 0.76,
      assignedOfficers: [officerUser._id],
    });

    const zone2 = await RiskZone.create({
      name: 'Chamoli Girthi Catchment',
      code: 'ZONE-CH-02',
      boundary: {
        type: 'Polygon',
        coordinates: [
          [
            [79.55, 30.55],
            [79.58, 30.55],
            [79.58, 30.58],
            [79.55, 30.58],
            [79.55, 30.55],
          ],
        ],
      },
      center: {
        type: 'Point',
        coordinates: [79.565, 30.565],
      },
      currentRiskLevel: 'MODERATE',
      currentRiskScore: 0.45,
      assignedOfficers: [officerUser._id],
    });

    // 3. Seed Devices & Sensors
    logger.info('Seeding Monitoring Hardware Devices & Sensors...');
    const device1 = await Device.create({
      deviceId: 'GW-KD-SLOPE-01',
      name: 'Kedarnath Upper Slope Gateway',
      type: 'gateway',
      status: 'ONLINE',
      zoneId: zone1._id,
      location: {
        type: 'Point',
        coordinates: [79.068, 30.738],
      },
      elevationMeters: 3580,
      batteryPct: 92,
      firmwareVersion: 'v2.4.1',
      sensors: ['rainfall', 'tilt', 'soil_moisture', 'pore_pressure'],
      installationDate: new Date('2024-05-10'),
    });

    const sensor1 = await Sensor.create({
      deviceId: device1._id,
      sensorId: 'SN-RAIN-01',
      sensorType: 'rainfall',
      unit: 'mm',
      rangeMin: 0,
      rangeMax: 500,
      samplingRateSeconds: 60,
    });

    // 4. Seed 24 Hours of Time-Series Observations
    logger.info('Seeding 24-hour Telemetry Observations...');
    const now = Date.now();
    const readings = [];

    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now - i * 60 * 60 * 1000);
      readings.push({
        deviceId: device1.deviceId,
        deviceRef: device1._id,
        sensorId: sensor1._id,
        value: Number((3.5 + Math.random() * 4).toFixed(1)),
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
        quality: 'valid',
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
    await Report.create({
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

    // 7. Seed Terrain, Weather, Satellite, and Historical Events
    logger.info('Seeding Terrain, Weather, Satellite, and Historical Events...');
    await TerrainData.create({
      riskZoneId: zone1._id,
      geometry: zone1.boundary,
      elevationMinMeters: 3100,
      elevationMaxMeters: 4200,
      slopeAngleMeanDegrees: 38.5,
      aspectCompassDegrees: 210,
      soilType: 'Colluvial Scree over Schist',
    });

    await WeatherData.create({
      zoneId: zone1._id,
      location: zone1.center,
      rainfallHourlyMm: 8.5,
      rainfallAccumulated24hMm: 92.4,
      temperatureCelsius: 11.2,
      humidityPct: 94,
      windSpeedKmh: 24,
    });

    await SatelliteData.create({
      zoneId: zone1._id,
      boundary: zone1.boundary,
      ndvi: 0.28,
      soilMoistureIndex: 0.78,
      insarDisplacementMm: 14.5,
      opticalChangeDetected: true,
      satelliteSource: 'Sentinel-1 InSAR / Sentinel-2 MSI',
    });

    await HistoricalEvent.create({
      name: 'Kedarnath Debris Flow 2013',
      location: {
        type: 'Point',
        coordinates: [79.067, 30.734],
      },
      eventDate: new Date('2013-06-16'),
      triggerType: 'cloudburst_extreme_rainfall',
      severity: 'catastrophic',
      damageSummary: 'Major valley scouring and catastrophic infrastructure damage downslope.',
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
