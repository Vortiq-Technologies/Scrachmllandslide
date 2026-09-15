# AI-Based Landslide Risk Monitoring & Early Warning System - Backend

## Phase 1: Production-Quality Backend Foundation

This repository contains the backend service for the **AI-Based Early Warning and Landslide Risk Monitoring System**. Phase 1 establishes a production-grade Node.js + Express foundation with MongoDB/Mongoose connection management, structured logging, centralized error handling, environment validation, security headers, and canonical API versioning.

---

## 1. Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── constants.js               # System error codes, MongoDB states, API prefix
│   │   ├── db.js                      # MongoDB connection manager & status introspection
│   │   └── env.js                     # Environment variable validation & defaults
│   │
│   ├── middleware/
│   │   ├── error.middleware.js        # Centralized error handler (production-safe)
│   │   ├── notFound.middleware.js     # Centralized 404 route handler
│   │   └── requestLogger.middleware.js # Development-friendly & production request logger
│   │
│   ├── utils/
│   │   ├── ApiError.js                # Custom operational error class
│   │   ├── asyncHandler.js            # Async route handler error wrapper
│   │   └── response.js                # Standardized response envelopes (success & error)
│   │
│   ├── app.js                         # Express application setup & middleware stack
│   └── server.js                      # HTTP server lifecycle, connection bootstrap & graceful shutdown
│
├── tests/
│   └── foundation.test.js             # Automated test suite for Phase 1 requirements
├── .env                               # Local runtime configuration
├── .env.example                       # Environment configuration template
├── .gitignore                         # Exclusions (node_modules, .env, logs)
├── package.json                       # Package manifest and test scripts
└── README.md                          # Foundation documentation
```

---

## 2. Technology Contract

* **Runtime**: Node.js (>= 18.x)
* **Web Framework**: Express.js
* **Database**: MongoDB via Mongoose
* **Configuration**: dotenv with startup validation
* **Security**: Helmet security headers, CORS origin management
* **Logging**: Morgan HTTP logger with development-friendly output
* **Error Handling**: Centralized operational `ApiError` with async wrappers
* **API Versioning**: Canonical `/api/v1` prefix

---

## 3. Standard Response Contracts

### Success Response Format
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "UP",
    "timestamp": "2026-09-15T06:09:06.746Z",
    "uptimeSeconds": 1427,
    "environment": "development"
  },
  "meta": {}
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Endpoint not found: GET /api/v1/not-found",
  "error": {
    "code": "NOT_FOUND",
    "details": {}
  }
}
```

---

## 4. Canonical Foundation Endpoints (`/api/v1`)

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/` | Root service descriptor | `200` |
| `GET` | `/api/v1/health` | Process liveness check (uptime, environment) | `200` |
| `GET` | `/api/v1/ready` | Dependency readiness check (MongoDB state) | `200` (Ready) / `503` (Not Ready) |

---

## 5. Verification Commands

### Run Unit and Foundation Tests
```bash
npx jest tests/foundation.test.js
```

### Start Server in Development Mode
```bash
npm run dev
# or
node src/server.js
```

### Test Endpoints via HTTP
```bash
# Health Check
curl -i http://localhost:5000/api/v1/health

# Readiness Check
curl -i http://localhost:5000/api/v1/ready

# 404 Route Test
curl -i http://localhost:5000/api/v1/unknown
```
