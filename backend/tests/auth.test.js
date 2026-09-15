const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const { connectDB, disconnectDB } = require('../src/config/db');

describe('Production-Grade Auth System Test Suite', () => {
  const testUser = {
    name: 'Inspector Vikram Singh',
    email: 'vikram.singh@landslide-early-warning.gov.in',
    password: 'P@ssword2026!Secure',
    role: 'field_officer',
    phone: '+919876543210',
    assignedRegions: ['Chamoli', 'Rudraprayag'],
  };

  let authToken = '';

  beforeAll(async () => {
    await connectDB();
    // Ensure clean state for test user
    await User.deleteMany({ email: testUser.email.toLowerCase() });
  });

  afterAll(async () => {
    await User.deleteMany({ email: testUser.email.toLowerCase() });
    await disconnectDB();
  });

  describe('1. Registration / Signup (POST /api/v1/auth/register)', () => {
    it('should register a new user with 201 Created and standard envelope', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('tokenType', 'Bearer');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.user.name).toBe(testUser.name);
      expect(res.body.data.user.role).toBe(testUser.role);
      expect(res.body.data.user).not.toHaveProperty('password'); // Password MUST be excluded
    });

    it('should reject duplicate email registration with 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'CONFLICT');
      expect(res.body.message).toContain('already exists');
    });

    it('should reject registration with invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Invalid Email User',
          email: 'not-a-valid-email',
          password: 'Password123!',
        });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(res.body.error.details).toHaveProperty('email');
    });

    it('should reject registration with password shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Short Pass User',
          email: 'shortpass@example.com',
          password: '123',
        });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(res.body.error.details).toHaveProperty('password');
    });

    it('should reject registration with missing name', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'noname@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(res.body.error.details).toHaveProperty('name');
    });
  });

  describe('2. Authentication / Login (POST /api/v1/auth/login)', () => {
    it('should authenticate valid credentials with 200 OK and return JWT', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('tokenType', 'Bearer');
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.user).not.toHaveProperty('password');

      authToken = res.body.data.token;
    });

    it('should reject login with wrong password (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword999!',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should reject login with non-existent email (401 Unauthorized)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'unknown-officer-999@landslide.gov.in',
          password: 'AnyPassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should reject login with missing credentials (422 Validation Error)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({});

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('3. Protected Profile Route (GET /api/v1/auth/me)', () => {
    it('should retrieve current user profile with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.name).toBe(testUser.name);
      expect(res.body.data.role).toBe(testUser.role);
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should reject request when Authorization header is missing (401 Unauthorized)', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should reject request with invalid / forged JWT token (401 Unauthorized)', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer forged.invalid.token');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
      expect(res.body.message).toContain('Invalid authentication token');
    });
  });
});
