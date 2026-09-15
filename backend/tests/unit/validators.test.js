const { registerSchema, loginSchema } = require('../../src/validators/authValidator');
const { ingestTelemetrySchema } = require('../../src/validators/telemetryValidator');
const { createAlertSchema } = require('../../src/validators/alertValidator');

describe('Validators Unit Tests', () => {
  describe('Auth Validators', () => {
    it('should validate correct registration payload', () => {
      const validPayload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'SecurePassword123',
        role: 'field_officer',
      };
      const { error } = registerSchema.validate(validPayload);
      expect(error).toBeUndefined();
    });

    it('should reject registration with invalid email', () => {
      const invalidPayload = {
        name: 'Jane Doe',
        email: 'not-an-email',
        password: 'SecurePassword123',
      };
      const { error } = registerSchema.validate(invalidPayload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Valid email is required');
    });

    it('should reject registration with short password', () => {
      const invalidPayload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123',
      };
      const { error } = registerSchema.validate(invalidPayload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('at least 6 characters');
    });

    it('should validate valid login payload', () => {
      const { error } = loginSchema.validate({
        email: 'user@example.com',
        password: 'password',
      });
      expect(error).toBeUndefined();
    });
  });

  describe('Telemetry Ingestion Validators', () => {
    it('should validate single telemetry reading', () => {
      const reading = {
        deviceId: 'NODE-01',
        readings: {
          rainfall_mm: 12.5,
          pore_pressure_kpa: 28.4,
        },
        batteryPct: 92,
      };
      const { error } = ingestTelemetrySchema.validate(reading);
      expect(error).toBeUndefined();
    });

    it('should reject telemetry reading without any readings metrics', () => {
      const emptyReading = {
        deviceId: 'NODE-01',
        readings: {},
      };
      const { error } = ingestTelemetrySchema.validate(emptyReading);
      expect(error).toBeDefined();
    });

    it('should validate batch telemetry payload', () => {
      const batch = [
        { deviceId: 'NODE-01', readings: { rainfall_mm: 2 } },
        { deviceId: 'NODE-02', readings: { soil_moisture_pct: 45 } },
      ];
      const { error } = ingestTelemetrySchema.validate(batch);
      expect(error).toBeUndefined();
    });
  });

  describe('Alert Validators', () => {
    it('should validate emergency alert payload', () => {
      const alert = {
        zoneName: 'North Slope Valley',
        severity: 'EMERGENCY_EVACUATION',
        title: 'Imminent Slope Debris Failure',
        description: 'Deep tension crack expanding at 2cm per hour.',
        triggerSource: 'MANUAL_AUTHORITY',
      };
      const { error } = createAlertSchema.validate(alert);
      expect(error).toBeUndefined();
    });

    it('should reject alert with invalid severity', () => {
      const alert = {
        zoneName: 'North Slope Valley',
        severity: 'SUPER_CRITICAL_UNKNOWN',
        title: 'Imminent Failure',
        description: 'Description here',
      };
      const { error } = createAlertSchema.validate(alert);
      expect(error).toBeDefined();
    });
  });
});
