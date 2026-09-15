# DATABASE + API SPECIFICATION
## Integrated AI-Based Landslide Early Warning & Risk Monitoring System

**Project Type:** SIH-Style Integrated Hardware + Software Disaster Management System  
**Software PS:** 26001 — AI-Based Early Warning and Landslide Risk Monitoring System in NER  
**Hardware PS:** 26223 — Student Innovation: Disaster Management  
**Architecture:** MERN + React Native + Python AI/ML + GenAI  
**Database:** MongoDB  
**Backend:** Node.js + Express.js  
**ML Service:** Python  
**Clients:** React Web Dashboard + React Native Android Application

---

# 1. Document Purpose

This document defines the database structure and API contracts for the integrated landslide disaster-management platform.

It establishes how information moves between:

- Hardware sensors
- Edge devices
- Backend server
- MongoDB
- AI/ML prediction service
- GIS dashboard
- React web application
- React Native Android application
- Alert system
- GenAI Disaster Management Copilot

The objective is to ensure that every team member works against the same data structures and API contracts.

The database and APIs directly support the core requirements of PS 26001:

- rainfall monitoring
- soil moisture monitoring
- satellite imagery-derived information
- terrain/slope information
- historical landslide records
- AI/ML-based high-risk zone identification
- possible landslide-event prediction
- GIS visualization
- geo-tagged field/citizen reports
- alerts and emergency response support

The hardware layer additionally supports the disaster-management innovation requirement of PS 26223 through physical sensing and local warning capabilities.

---

# 2. Architecture Overview

The system follows a shared-backend architecture where external data is ingested directly by the Python ML service.

```text
┌─────────────────┐
│ Hardware / IoT  │
│ Sensors         │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐                     ┌──────────────────────┐
│ Node.js + Express    │                     │ External Data Sources│
│ Backend API          │                     │                      │
└────────┬─────────────┘                     │ Weather / Satellite  │
         │                                   │ Terrain / Historical │
         │                                   └──────────┬───────────┘
         ├──────────────────────┐                       │
         ▼                      ▼                       ▼
  ┌─────────────┐        ┌──────────────────────────────────────┐
  │  MongoDB    │◄──────►│ Python ML Service                    │
  │             │        │  ├── Direct External Data Ingestion  │
  │             │        │  │   (Weather, Satellite, Terrain)   │
  │             │        │  │                 │                 │
  │             │        │  │                 ▼                 │
  │             │        │  └── AI/ML Risk Prediction Engine    │
  └──────┬──────┘        └──────────────────────────────────────┘
         │
    ┌────┴────────────────────────┐
    ▼              ▼              ▼
React Web     React Native   Alert Engine
Dashboard        Android
    │               │
    └───────┬───────┘
            ▼
   GenAI Disaster Copilot
```

The Node.js backend serves as the core application API and sensor ingestion layer. External data feeds directly into the Python ML service, which then routes the data into AI/ML for feature processing and risk prediction.

Clients do not communicate directly with MongoDB or the ML service.

---

# 3. Database Design Principles

The database follows these principles:

1. MongoDB is the primary application database.
2. All clients access data through the backend API.
3. GeoJSON is used for geographic information.
4. MongoDB geospatial indexes are used for spatial queries.
5. Sensor readings are stored separately from sensor/device metadata.
6. ML predictions are stored independently from raw measurements.
7. Historical events remain distinguishable from current predictions.
8. User-generated reports are stored with geographic coordinates.
9. Alert records maintain an audit trail.
10. Every important record contains timestamps.
11. Data-source provenance is retained where practical.
12. Prototype architecture avoids unnecessary database systems.

---

# 4. Core MongoDB Collections

The initial database contains the following collections:

```text
users
devices
sensors
sensor_readings
risk_zones
risk_predictions
weather_data
satellite_data
terrain_data
historical_events
reports
alerts
notification_logs
ai_conversations
knowledge_documents
system_logs
```

Not every collection needs to be fully populated for the prototype.

The mandatory operational collections are:

```text
users
devices
sensors
sensor_readings
risk_zones
risk_predictions
historical_events
reports
alerts
```

---

# 5. Users Collection

## Collection

```text
users
```

## Purpose

Stores authenticated platform users and their roles.

## Document Structure

```json
{
  "_id": "ObjectId",
  "name": "Officer Name",
  "email": "officer@example.com",
  "passwordHash": "hashed-password",
  "role": "district_admin",
  "phone": "+91XXXXXXXXXX",
  "preferredLanguage": "en",
  "isActive": true,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

## Supported Roles

```text
super_admin
district_admin
field_officer
citizen
```

Additional roles may be added later.

## Role Purpose

| Role | Purpose |
|---|---|
| super_admin | Full system administration |
| district_admin | Monitor zones, alerts and reports |
| field_officer | Field monitoring and reporting |
| citizen | Submit geo-tagged hazard reports |

---

# 6. Devices Collection

## Collection

```text
devices
```

## Purpose

Represents physical hardware/edge units deployed for environmental monitoring.

## Example

```json
{
  "_id": "ObjectId",
  "deviceId": "EDGE-001",
  "name": "Landslide Monitoring Unit 01",
  "location": {
    "type": "Point",
    "coordinates": [92.7123, 26.1845]
  },
  "zoneId": "ZONE-001",
  "status": "online",
  "firmwareVersion": "1.0.0",
  "lastSeenAt": "ISODate",
  "batteryLevel": 87,
  "signalStrength": 76,
  "createdAt": "ISODate"
}
```

## Device Status

```text
online
offline
warning
maintenance
```

---

# 7. Sensors Collection

## Collection

```text
sensors
```

## Purpose

Stores sensor metadata.

A device can contain multiple sensors.

## Example

```json
{
  "_id": "ObjectId",
  "sensorId": "SENSOR-SM-001",
  "deviceId": "EDGE-001",
  "type": "soil_moisture",
  "unit": "%",
  "status": "active",
  "samplingIntervalSeconds": 60,
  "createdAt": "ISODate"
}
```

## Supported Sensor Types

```text
rainfall
soil_moisture
temperature
humidity
tilt
slope_movement
```

Exact physical components remain an implementation decision and are not locked by this specification.

---

# 8. Sensor Readings Collection

## Collection

```text
sensor_readings
```

## Purpose

Stores time-series sensor observations.

## Example

```json
{
  "_id": "ObjectId",
  "sensorId": "SENSOR-SM-001",
  "deviceId": "EDGE-001",
  "zoneId": "ZONE-001",
  "sensorType": "soil_moisture",
  "value": 72.4,
  "unit": "%",
  "timestamp": "ISODate",
  "quality": "valid"
}
```

## Rainfall Example

```json
{
  "sensorType": "rainfall",
  "value": 42.8,
  "unit": "mm",
  "timestamp": "ISODate"
}
```

## Quality States

```text
valid
suspect
invalid
missing
```

---

# 9. Risk Zones Collection

## Collection

```text
risk_zones
```

## Purpose

Represents geographic monitoring zones used by the GIS system and ML pipeline.

## Example

```json
{
  "_id": "ObjectId",
  "zoneId": "ZONE-001",
  "name": "Monitoring Zone A",
  "district": "Example District",
  "state": "Assam",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [92.70, 26.18],
        [92.72, 26.18],
        [92.72, 26.20],
        [92.70, 26.20],
        [92.70, 26.18]
      ]
    ]
  },
  "currentRiskScore": 78,
  "currentRiskLevel": "critical",
  "updatedAt": "ISODate"
}
```

## Risk Levels

```text
low
moderate
high
critical
```

Initial score mapping:

```text
0–25     → Low
26–50    → Moderate
51–75    → High
76–100   → Critical
```

These thresholds remain configurable and can be recalibrated after model evaluation.

---

# 10. Risk Predictions Collection

## Collection

```text
risk_predictions
```

## Purpose

Stores outputs generated by the Python AI/ML service.

## Example

```json
{
  "_id": "ObjectId",
  "zoneId": "ZONE-001",
  "eventProbability": 0.81,
  "riskScore": 81,
  "riskLevel": "critical",
  "confidence": 0.87,
  "dataCompleteness": 0.94,
  "modelVersion": "xgb-v1",
  "predictionTimestamp": "ISODate",
  "validUntil": "ISODate",
  "features": {
    "rainfall24h": 142.5,
    "rainfall72h": 238.1,
    "soilMoisture": 76.2,
    "slope": 34.8,
    "historicalEvents": 5,
    "satelliteChangeIndex": 0.73
  },
  "explanations": [
    {
      "feature": "rainfall72h",
      "impact": 0.31
    },
    {
      "feature": "soilMoisture",
      "impact": 0.24
    }
  ]
}
```

The `features` object contains the relevant model input/derived features used for explanation and debugging.

Sensitive or unnecessarily large raw datasets should not be duplicated here.

---

# 11. Weather Data Collection

## Collection

```text
weather_data
```

## Purpose

Stores weather information obtained directly from external weather sources via the Python ML service.

## Example

```json
{
  "_id": "ObjectId",
  "zoneId": "ZONE-001",
  "source": "weather_api",
  "rainfall": {
    "1h": 12.5,
    "3h": 27.4,
    "6h": 54.2,
    "24h": 142.5,
    "72h": 238.1
  },
  "temperature": 23.4,
  "humidity": 91,
  "timestamp": "ISODate"
}
```

The external provider remains configurable.

---

# 12. Satellite Data Collection

## Collection

```text
satellite_data
```

## Purpose

Stores satellite-derived information ingested directly by the Python ML service for the AI/ML pipeline.

The prototype should prefer derived numerical features instead of storing large raw satellite images inside MongoDB.

## Example

```json
{
  "_id": "ObjectId",
  "zoneId": "ZONE-001",
  "source": "satellite_provider",
  "acquisitionDate": "ISODate",
  "vegetationIndex": 0.42,
  "surfaceChangeIndex": 0.73,
  "moistureIndex": 0.68,
  "landCoverChange": 0.17,
  "dataQuality": "good"
}
```

Raw imagery can remain in external/object storage if required.

---

# 13. Terrain Data Collection

## Collection

```text
terrain_data
```

## Purpose

Stores terrain and slope characteristics ingested directly by the Python ML service for the AI/ML system.

## Example

```json
{
  "_id": "ObjectId",
  "zoneId": "ZONE-001",
  "elevation": 842.4,
  "slope": 34.8,
  "aspect": 176.2,
  "terrainRuggedness": 0.61,
  "timestamp": "ISODate"
}
```

---

# 14. Historical Events Collection

## Collection

```text
historical_events
```

## Purpose

Stores historical landslide records.

Historical records perform two functions in the ML pipeline:

1. They provide supervised-learning labels.
2. They provide historical features such as event frequency and time since the last event.

## Example

```json
{
  "_id": "ObjectId",
  "eventId": "LANDSLIDE-2024-001",
  "zoneId": "ZONE-001",
  "location": {
    "type": "Point",
    "coordinates": [92.7123, 26.1845]
  },
  "eventDate": "ISODate",
  "severity": "high",
  "trigger": "heavy_rainfall",
  "description": "Slope failure after prolonged rainfall",
  "source": "historical_record"
}
```

---

# 15. Reports Collection

## Collection

```text
reports
```

## Purpose

Stores geo-tagged reports submitted by citizens and field officials.

Reports may include:

- cracks
- slope movement
- blocked roads
- falling rocks
- visible instability
- water accumulation
- other hazards

## Example

```json
{
  "_id": "ObjectId",
  "submittedBy": "ObjectId",
  "reportType": "slope_crack",
  "description": "Large crack observed near road",
  "location": {
    "type": "Point",
    "coordinates": [92.7123, 26.1845]
  },
  "zoneId": "ZONE-001",
  "media": [
    {
      "type": "image",
      "url": "media-reference"
    }
  ],
  "status": "pending",
  "severity": "high",
  "createdAt": "ISODate",
  "verifiedAt": null,
  "verifiedBy": null
}
```

## Report Status

```text
pending
verified
rejected
resolved
```

---

# 16. Alerts Collection

## Collection

```text
alerts
```

## Purpose

Stores generated alerts and their delivery state.

## Example

```json
{
  "_id": "ObjectId",
  "alertId": "ALERT-001",
  "zoneId": "ZONE-001",
  "riskLevel": "critical",
  "riskScore": 81,
  "title": "Critical Landslide Risk",
  "message": "Critical landslide risk detected in the monitored zone.",
  "generatedFrom": "ml_prediction",
  "channels": [
    "dashboard",
    "android"
  ],
  "status": "active",
  "createdAt": "ISODate",
  "expiresAt": "ISODate"
}
```

The system should not treat a generated alert as an automatic evacuation order.

Emergency decisions remain under authorized human authorities.

---

# 17. Notification Logs

## Collection

```text
notification_logs
```

## Purpose

Maintains delivery history.

## Example

```json
{
  "_id": "ObjectId",
  "alertId": "ALERT-001",
  "userId": "ObjectId",
  "channel": "sms",
  "status": "sent",
  "sentAt": "ISODate",
  "deliveryReference": "provider-reference"
}
```

---

# 18. AI Conversations Collection

## Collection

```text
ai_conversations
```

## Purpose

Stores relevant GenAI interaction history.

## Example

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "messages": [
    {
      "role": "user",
      "content": "Why is Zone 001 at critical risk?",
      "timestamp": "ISODate"
    },
    {
      "role": "assistant",
      "content": "The current risk is primarily influenced by...",
      "timestamp": "ISODate"
    }
  ],
  "createdAt": "ISODate"
}
```

API keys and provider credentials must never be stored in this collection.

---

# 19. Knowledge Documents

## Collection

```text
knowledge_documents
```

## Purpose

Stores metadata for documents used by the GenAI RAG system.

Examples:

- disaster-management SOPs
- landslide-management guidelines
- emergency procedures
- preparedness guidelines

The actual document/vector implementation may use MongoDB-compatible vector search or another lightweight vector mechanism if required.

---

# 20. Geospatial Indexing

The following fields should use MongoDB `2dsphere` indexes:

```text
risk_zones.geometry
devices.location
reports.location
historical_events.location
```

Example:

```javascript
db.reports.createIndex({
  location: "2dsphere"
});
```

This enables queries such as:

- reports near a risk zone
- nearby field reports
- historical landslides near a location
- nearby monitoring devices

---

# 21. API Design Principles

The backend exposes REST APIs.

Base path:

```text
/api
```

All protected APIs require authentication.

Example:

```text
Authorization: Bearer <JWT>
```

Responses should follow a consistent structure.

## Success

```json
{
  "success": true,
  "data": {},
  "message": "Request successful"
}
```

## Error

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid zone ID"
  }
}
```

---

# 22. Authentication APIs

## Register

```http
POST /api/auth/register
```

## Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "officer@example.com",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "USER_ID",
      "name": "Officer",
      "role": "field_officer"
    }
  }
}
```

## Current User

```http
GET /api/auth/me
```

---

# 23. Device APIs

## Register Device

```http
POST /api/devices
```

## Get Devices

```http
GET /api/devices
```

## Get Device

```http
GET /api/devices/:deviceId
```

## Device Heartbeat

```http
POST /api/devices/:deviceId/heartbeat
```

Example:

```json
{
  "batteryLevel": 87,
  "signalStrength": 76,
  "timestamp": "ISODate"
}
```

---

# 24. Sensor APIs

## Register Sensor

```http
POST /api/sensors
```

## List Sensors

```http
GET /api/sensors
```

## Sensor Details

```http
GET /api/sensors/:sensorId
```

## Sensor Readings

```http
GET /api/sensors/:sensorId/readings
```

Optional parameters:

```text
from
to
limit
```

Example:

```http
GET /api/sensors/SENSOR-001/readings?from=...&to=...
```

---

# 25. Hardware Data Ingestion API

This is one of the most important integration APIs.

```http
POST /api/ingestion/sensor
```

Example:

```json
{
  "deviceId": "EDGE-001",
  "timestamp": "ISODate",
  "readings": [
    {
      "sensorId": "SENSOR-R-001",
      "type": "rainfall",
      "value": 42.8,
      "unit": "mm"
    },
    {
      "sensorId": "SENSOR-SM-001",
      "type": "soil_moisture",
      "value": 76.4,
      "unit": "%"
    },
    {
      "sensorId": "SENSOR-T-001",
      "type": "tilt",
      "value": 4.2,
      "unit": "degrees"
    }
  ]
}
```

Backend responsibilities:

1. Authenticate device.
2. Validate payload.
3. Validate sensor IDs.
4. Store readings.
5. Update device heartbeat.
6. Trigger risk evaluation where appropriate.
7. Return acknowledgement.

Response:

```json
{
  "success": true,
  "message": "Sensor data accepted"
}
```

---

# 26. Risk Zone APIs

## List Risk Zones

```http
GET /api/zones
```

## Zone Details

```http
GET /api/zones/:zoneId
```

## Nearby Zones

```http
GET /api/zones/nearby?lat=26.18&lng=92.71&radius=5000
```

## Zone Risk

```http
GET /api/zones/:zoneId/risk
```

## Zone Risk History

```http
GET /api/zones/:zoneId/risk/history
```

---

# 27. ML Prediction API

The Node backend communicates with the Python ML service.

Internal endpoint:

```http
POST /ml/predict
```

Example request:

```json
{
  "zoneId": "ZONE-001",
  "timestamp": "ISODate",
  "features": {
    "rainfall1h": 12.4,
    "rainfall24h": 142.5,
    "rainfall72h": 238.1,
    "soilMoisture": 76.4,
    "soilMoistureChange": 8.7,
    "slope": 34.8,
    "elevation": 842.4,
    "historicalEvents": 5,
    "daysSinceLastEvent": 312,
    "satelliteChangeIndex": 0.73
  }
}
```

Response:

```json
{
  "zoneId": "ZONE-001",
  "eventProbability": 0.81,
  "riskScore": 81,
  "riskLevel": "critical",
  "confidence": 0.87,
  "dataCompleteness": 0.94,
  "modelVersion": "xgb-v1"
}
```

The exact model may ultimately be XGBoost, LightGBM, Random Forest, or another empirically selected model.

---

# 28. Risk Calculation Flow

The operational flow is:

```text
External Data Sources                     Hardware Sensors
(Weather / Satellite / Terrain)                  │
           │                                     ▼
           │                              Node.js Backend
           ▼                                     │
    Python ML Service                            ▼
(External Data Ingestion)                     MongoDB
           │                                     │
           ▼                                     │
         AI/ML ◄─────────────────────────────────┘
 (Data Processing &                              (Live Sensor Data)
Feature Engineering)
           │
           ▼
   Event Probability
           │
           ▼
    Risk Score 0–100
           │
           ▼
   Risk Classification
           │
     ┌─────┴─────┐
     ▼           ▼
    GIS     Alert Engine
     │           │
     └─────┬─────┘
           ▼
         GenAI
           │
           ▼
   Human Authority
```

---

# 29. Historical Event APIs

## List Historical Events

```http
GET /api/historical-events
```

## Events by Zone

```http
GET /api/zones/:zoneId/historical-events
```

## Nearby Historical Events

```http
GET /api/historical-events/nearby?lat=26.18&lng=92.71&radius=5000
```

---

# 30. Weather APIs

## Current Weather

```http
GET /api/weather/:zoneId/current
```

## Weather History

```http
GET /api/weather/:zoneId/history
```

## Weather Forecast

```http
GET /api/weather/:zoneId/forecast
```

External weather data is ingested directly by the Python ML service and forwarded to the AI/ML pipeline. The backend acts as an abstraction layer for client applications by serving processed and cached weather data.

---

# 31. Satellite APIs

## Latest Satellite Data

```http
GET /api/satellite/:zoneId/latest
```

## Satellite History

```http
GET /api/satellite/:zoneId/history
```

External satellite feeds are ingested directly by the Python ML service and forwarded to AI/ML. Satellite APIs return derived information required by client applications rather than unnecessarily transferring large raw images.

---

# 32. Terrain APIs

## Terrain Information

```http
GET /api/terrain/:zoneId
```

Example response:

```json
{
  "success": true,
  "data": {
    "elevation": 842.4,
    "slope": 34.8,
    "aspect": 176.2,
    "terrainRuggedness": 0.61
  }
}
```

---

# 33. Citizen / Field Reporting APIs

## Submit Report

```http
POST /api/reports
```

Example:

```json
{
  "reportType": "slope_crack",
  "description": "Large crack observed near road",
  "location": {
    "type": "Point",
    "coordinates": [92.7123, 26.1845]
  }
}
```

## Upload Media

```http
POST /api/reports/:reportId/media
```

## List Reports

```http
GET /api/reports
```

## Nearby Reports

```http
GET /api/reports/nearby?lat=26.18&lng=92.71&radius=5000
```

## Verify Report

```http
PATCH /api/reports/:reportId/verify
```

## Resolve Report

```http
PATCH /api/reports/:reportId/resolve
```

---

# 34. Alert APIs

## Get Active Alerts

```http
GET /api/alerts/active
```

## Get Zone Alerts

```http
GET /api/zones/:zoneId/alerts
```

## Create Alert

```http
POST /api/alerts
```

## Acknowledge Alert

```http
PATCH /api/alerts/:alertId/acknowledge
```

## Resolve Alert

```http
PATCH /api/alerts/:alertId/resolve
```

---

# 35. Alert Generation Logic

Alerts may be generated when:

- ML risk crosses a configured threshold.
- Risk level changes significantly.
- Sensor conditions exceed configured safety thresholds.
- A verified field report indicates a significant hazard.
- Multiple indicators jointly indicate increased risk.

Example:

```text
Risk Score
    │
    ├── 0–25 → Low
    │
    ├── 26–50 → Moderate
    │
    ├── 51–75 → High
    │
    └── 76–100 → Critical
```

Alert generation should include anti-spam controls so that the same unchanged condition does not continuously create duplicate alerts.

---

# 36. GenAI APIs

The GenAI layer is accessed through the Node backend.

## Chat

```http
POST /api/ai/chat
```

Request:

```json
{
  "message": "Why is Zone 001 at critical risk?",
  "zoneId": "ZONE-001"
}
```

The backend may retrieve:

- current ML prediction
- sensor readings
- rainfall
- satellite-derived features
- terrain information
- historical events
- field reports
- active alerts
- relevant SOP/RAG documents

The GenAI model then produces a grounded explanation.

---

# 37. Explain Risk API

```http
POST /api/ai/explain-risk
```

Request:

```json
{
  "zoneId": "ZONE-001"
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "summary": "The zone currently has critical landslide risk.",
    "mainFactors": [
      "High accumulated rainfall",
      "Elevated soil moisture",
      "Steep terrain",
      "Historical landslide activity"
    ],
    "confidence": 0.87
  }
}
```

The explanation must be based on actual ML outputs and retrieved system data.

---

# 38. Situation Report API

```http
POST /api/ai/generate-report
```

Request:

```json
{
  "zoneId": "ZONE-001",
  "reportType": "situation_summary"
}
```

The response may summarize:

- current risk
- recent rainfall
- sensor status
- field reports
- road conditions
- active alerts
- historical context

---

# 39. Alert Message Generation API

```http
POST /api/ai/generate-alert
```

The GenAI service may generate human-readable alert text in supported languages.

However:

```text
ML → determines risk
Human authority → decides action
GenAI → assists communication
```

GenAI must not independently issue evacuation or closure decisions.

---

# 40. GenAI Live Tool Access

GenAI does not directly query MongoDB.

Instead:

```text
User
  │
  ▼
GenAI API
  │
  ▼
Tool Router
  │
  ├── getCurrentRisk()
  ├── getZoneDetails()
  ├── getSensorReadings()
  ├── getWeather()
  ├── getRiskTrend()
  ├── getRecentReports()
  ├── getHistoricalEvents()
  ├── getActiveAlerts()
  └── getDeviceStatus()
  │
  ▼
Validated Data
  │
  ▼
LLM
```

This reduces hallucination and maintains data access control.

---

# 41. Dashboard API

The React web dashboard should avoid making dozens of independent requests during initial loading.

A consolidated dashboard endpoint should be provided.

```http
GET /api/dashboard/overview
```

Example:

```json
{
  "success": true,
  "data": {
    "totalZones": 24,
    "criticalZones": 3,
    "highRiskZones": 6,
    "activeAlerts": 8,
    "onlineDevices": 41,
    "offlineDevices": 3,
    "pendingReports": 12
  }
}
```

---

# 42. GIS Data API

## Risk Map

```http
GET /api/gis/risk-map
```

Response should provide geographic features suitable for map rendering.

Example:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "zoneId": "ZONE-001",
        "riskScore": 81,
        "riskLevel": "critical"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": []
      }
    }
  ]
}
```

This allows the React dashboard to render:

- risk zones
- heatmaps
- monitoring devices
- reports
- historical events
- infrastructure/road information where available

---

# 43. Road and Infrastructure Data

Road/infrastructure information should be represented only where reliable data is available.

Possible structure:

```json
{
  "roadId": "ROAD-001",
  "name": "Example Road",
  "geometry": {},
  "status": "blocked",
  "riskLevel": "high",
  "lastUpdated": "ISODate"
}
```

Possible statuses:

```text
open
restricted
blocked
unknown
```

For the prototype, this information may be sourced from verified field reports or demonstration data.

---

# 44. API Authentication and Authorization

JWT-based authentication is recommended for the prototype.

Every protected endpoint verifies:

```text
Token
   ↓
Authentication
   ↓
User identity
   ↓
Role
   ↓
Permission
   ↓
API operation
```

Example:

```text
Citizen
 └── Can submit report
 └── Can view appropriate alerts

Field Officer
 └── Can submit reports
 └── Can verify/update field information

District Admin
 └── Can view district risk
 └── Can manage alerts/reports

Super Admin
 └── Full administrative access
```

---

# 45. Device Authentication

Hardware devices should not use normal user JWT credentials.

Each device should have a device-specific authentication mechanism, such as:

```text
deviceId + device token
```

The exact mechanism can be finalized during hardware integration.

The backend must reject unknown devices.

---

# 46. Validation

Every API must validate incoming data.

Validation includes:

- required fields
- data types
- numeric ranges
- valid coordinates
- valid timestamps
- valid sensor types
- valid risk levels
- valid user roles
- valid report types

Examples:

```text
Latitude: -90 to +90
Longitude: -180 to +180
Risk score: 0 to 100
Probability: 0 to 1
```

---

# 47. Error Codes

A common error-code system should be used.

```text
AUTH_REQUIRED
AUTH_INVALID
FORBIDDEN
INVALID_REQUEST
INVALID_COORDINATES
INVALID_SENSOR_DATA
DEVICE_NOT_FOUND
SENSOR_NOT_FOUND
ZONE_NOT_FOUND
REPORT_NOT_FOUND
PREDICTION_FAILED
WEATHER_SERVICE_ERROR
SATELLITE_SERVICE_ERROR
AI_SERVICE_ERROR
DATABASE_ERROR
RATE_LIMITED
INTERNAL_ERROR
```

---

# 48. Data Freshness

Every data source should expose a timestamp.

The dashboard should distinguish between:

```text
Live
Recently Updated
Stale
Unavailable
```

For example:

```json
{
  "value": 76.4,
  "timestamp": "ISODate",
  "dataStatus": "recent"
}
```

The system must not present old data as live data.

---

# 49. Missing Data Handling

Missing data must be explicitly represented.

Example:

```json
{
  "soilMoisture": null,
  "dataStatus": "missing"
}
```

The ML pipeline may use scientifically appropriate imputation where applicable.

It must never silently fabricate missing satellite, terrain, weather, or sensor data.

The prediction response should include:

```text
dataCompleteness
```

so users can understand whether the prediction is based on complete information.

---

# 50. Offline Synchronization

The architecture supports limited offline operation.

## Hardware

```text
Sensors
   ↓
Edge Device
   ↓
Local Storage
   ↓
Local Warning
```

If connectivity fails, basic monitoring and local warning should continue.

## Android

The application may store:

- draft reports
- captured photographs
- location
- timestamp
- report type

When connectivity returns:

```text
Offline Report
      ↓
Local Queue
      ↓
Connectivity Restored
      ↓
API Upload
      ↓
Server Confirmation
```

The system must prevent duplicate uploads using a client-generated report ID or idempotency mechanism.

---

# 51. API Idempotency

Important ingestion operations should support duplicate protection.

For example, a hardware payload may include:

```json
{
  "messageId": "EDGE001-20260902-000012"
}
```

The backend can reject or ignore duplicate message IDs.

This is particularly important when devices retry transmission after network failures.

---

# 52. Rate Limiting

Rate limits should be applied to:

- authentication endpoints
- public report submission
- GenAI endpoints
- external-data proxy endpoints

GenAI endpoints should have stricter limits because they can consume significant provider resources.

---

# 53. API Versioning

The initial API may use:

```text
/api/v1/
```

Example:

```http
GET /api/v1/zones
```

Versioning allows future changes without breaking the Android and web clients.

---

# 54. Recommended Backend Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Device.js
│   │   ├── Sensor.js
│   │   ├── SensorReading.js
│   │   ├── RiskZone.js
│   │   ├── RiskPrediction.js
│   │   ├── WeatherData.js
│   │   ├── SatelliteData.js
│   │   ├── TerrainData.js
│   │   ├── HistoricalEvent.js
│   │   ├── Report.js
│   │   └── Alert.js
│   │
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   │   ├── mlService.js
│   │   ├── weatherService.js
│   │   ├── satelliteService.js
│   │   ├── alertService.js
│   │   └── genaiService.js
│   │
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   └── app.js
│
└── server.js
```

---

# 55. Python ML Service Structure

```text
ml-service/
│
├── app/
│   ├── main.py
│   ├── routes/
│   │   ├── prediction.py
│   │   └── external_data.py
│   ├── ingestion/
│   │   ├── weather_ingestion.py
│   │   ├── satellite_ingestion.py
│   │   └── terrain_ingestion.py
│   ├── models/
│   ├── preprocessing/
│   ├── features/
│   ├── inference/
│   ├── explainability/
│   └── utils/
│
├── training/
│   ├── train.py
│   ├── evaluate.py
│   └── feature_engineering.py
│
├── models/
│   └── selected_model/
│
└── requirements.txt
```

---

# 56. Frontend API Consumption

React and React Native must consume the same backend API.

```text
                Node/Express API
                 /           \
                /             \
               ▼               ▼
        React Web         React Native
```

No duplicated backend business logic should exist in the two clients.

---

# 57. Core API Integration Sequence

The main end-to-end sequence is:

### Step 1 — Hardware

```text
Sensor
  ↓
Edge Device
  ↓
POST /api/v1/ingestion/sensor
```

### Step 2 — Backend

```text
Validate
  ↓
MongoDB
  ↓
Prepare ML features
```

### Step 3 — ML

```text
POST /ml/predict
  ↓
Risk probability
  ↓
Risk score
  ↓
Risk level
```

### Step 4 — Backend

```text
Store prediction
  ↓
Update risk zone
  ↓
Evaluate alert condition
```

### Step 5 — Dashboard

```text
React
  ↓
GET /api/v1/gis/risk-map
  ↓
Display risk heatmap
```

### Step 6 — Android

```text
React Native
  ↓
GET /api/v1/alerts/active
  ↓
Display warning
```

### Step 7 — GenAI

```text
User question
  ↓
POST /api/v1/ai/chat
  ↓
Backend tools
  ↓
Current validated data
  ↓
LLM
  ↓
Grounded explanation
```

---

# 58. API-to-Team Ownership

| Area | Primary Owner |
|---|---|
| Hardware ingestion | Hardware/IoT |
| Device APIs | Hardware + Backend |
| MongoDB | Backend |
| REST APIs | Backend |
| ML API | AI/ML |
| Weather integration | AI/ML (Direct to Python ML) |
| Satellite integration | AI/ML (Direct to Python ML) |
| Terrain integration | AI/ML (Direct to Python ML) |
| GIS API | Backend + Frontend |
| Web dashboard | Frontend |
| Android | Frontend |
| Alerts | Backend + Cloud |
| GenAI API | AI/ML + Backend |
| Deployment | Cloud |
| Authentication | Backend |

---

# 59. Minimum APIs Required for Prototype

Due to the nine-day development timeline, the team should prioritize these APIs first:

```text
POST /api/v1/auth/login

POST /api/v1/ingestion/sensor

GET  /api/v1/zones

GET  /api/v1/zones/:zoneId

GET  /api/v1/zones/:zoneId/risk

GET  /api/v1/gis/risk-map

GET  /api/v1/alerts/active

POST /api/v1/reports

GET  /api/v1/reports

POST /api/v1/ai/chat

POST /api/v1/ai/explain-risk

GET  /api/v1/dashboard/overview
```

These APIs are sufficient to demonstrate the major integrated workflow.

---

# 60. Prototype Data Strategy

Because the project is being developed within a limited timeframe, the system may combine:

```text
Real data
+
Public datasets
+
API data
+
Hardware sensor data
+
Clearly labelled synthetic demonstration data
```

Synthetic data must always be marked as simulated.

It must not be presented during evaluation as actual field observations.

---

# 61. API Testing Strategy

Every critical endpoint should be tested independently before frontend integration.

Testing order:

```text
Database
   ↓
Authentication
   ↓
Hardware ingestion
   ↓
Risk zone APIs
   ↓
ML API
   ↓
Alert APIs
   ↓
Report APIs
   ↓
GIS APIs
   ↓
GenAI APIs
   ↓
React
   ↓
Android
```

Recommended tools:

- Postman
- REST Client
- automated API tests where time permits

---

# 62. Critical Integration Test

The most important system test is:

```text
Hardware Sensor
      ↓
Sensor Reading
      ↓
Backend
      ↓
MongoDB
      ↓
ML Prediction
      ↓
Risk Score
      ↓
Risk Zone
      ↓
GIS Map
      ↓
Alert
      ↓
Android/Web
      ↓
GenAI Explanation
```

A successful prototype should demonstrate this chain using either live hardware or a controlled simulation of hardware input.

---

# 63. Failure Handling

The system must continue operating when individual components fail.

### ML unavailable

```text
Sensor → Backend → Database
```

Data continues to be stored.

The dashboard indicates that the latest prediction is unavailable/stale.

### GenAI unavailable

```text
ML → GIS → Alerts
```

continues normally.

GenAI is an assistance layer, not a safety-critical dependency.

### Weather API unavailable

Previously received weather data remains available with a stale-data indicator.

### Satellite unavailable

Existing satellite-derived information remains available while new acquisition is unavailable.

### Hardware offline

The device should continue local monitoring where possible and upload buffered readings when connectivity returns.

---

# 64. Security Requirements

The API layer must:

- hash passwords securely
- use HTTPS in deployment
- validate all input
- sanitize user-generated content
- protect administrative APIs
- restrict GenAI tool access
- protect device credentials
- never expose provider API keys to clients
- implement role-based access control
- log important administrative operations

---

# 65. Data Flow Ownership

The authoritative data flow is:

```text
                    ┌───────────────┐
                    │ Hardware      │
                    └───────┬───────┘
                            │
                            ▼
                    Sensor Readings
                            │
                            ▼
                    ┌───────────────┐
                    │ Node Backend  │
                    └───────┬───────┘
                            │
                            ▼
                         MongoDB
                            │
                            │ (Live Sensors)
┌────────────┐              │
│ Weather    │──────┐       │
├────────────┤      │       │
│ Satellite  │──────┤       │
├────────────┤      ├──►┌───┴───────────┐
│ Terrain    │──────┤   │ Python ML     │ (Direct External Ingestion)
├────────────┤      │   └───────┬───────┘
│ Historical │──────┘           │
└────────────┘                  ▼
                              AI/ML
                        (Feature Builder &
                         Risk Prediction)
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
                GIS           Alerts         GenAI
                 │              │              │
                 └──────────────┼──────────────┘
                                ▼
                       Human Decision Makers
```

---

# 66. Final Database-to-API Contract

The most important contracts are:

### Hardware → Backend

```text
Sensor readings
```

### External Data Sources → Python ML

```text
Direct ingestion of external weather, satellite, terrain, and historical datasets
```

### Python ML Ingestion → AI/ML Pipeline

```text
Ingested external features and spatial-temporal feeds routed directly to AI/ML models
```

### Backend → ML

```text
Live sensor readings, zone parameters, and risk evaluation triggers
```

### ML → Backend

```text
Probability
Risk score
Risk level
Confidence
Data completeness
Model version
Explainability information
```

### Backend → GIS

```text
GeoJSON risk zones
```

### Backend → Alerts

```text
Risk transitions
Sensor conditions
Verified field hazards
```

### Backend → GenAI

```text
Validated live data
ML outputs
Field reports
Historical context
RAG documents
```

### Backend → React / Android

```text
Dashboard
Risk
Alerts
Reports
Maps
Sensor information
AI assistance
```

---

# 67. Final Technology Contract

| Layer | Technology |
|---|---|
| Web | React |
| Android | React Native |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| ML | Python |
| ML API | FastAPI or equivalent lightweight Python API |
| ML Libraries | Pandas, NumPy, scikit-learn, XGBoost/LightGBM/Random Forest |
| Explainability | SHAP |
| GIS | React-compatible mapping/GIS solution |
| GenAI | Hugging Face and/or Groq |
| Authentication | JWT |
| API Style | REST |
| Geographic Format | GeoJSON |
| Deployment | Cloud provider to be finalized |

---

# 68. Final Architecture Rule

The project must maintain one clear responsibility boundary:

```text
HARDWARE
Collects physical/environmental observations
        ↓
BACKEND
Validates, stores sensor data and orchestrates client services
        │
EXTERNAL DATA SOURCES ──► DIRECT INGESTION (PYTHON ML)
                                ↓
                              AI/ML
        Predicts landslide-event probability and risk
                                ↓
                               GIS
        Visualizes geographic risk
                                ↓
                           ALERT ENGINE
        Communicates configured warnings
                                ↓
                              GENAI
        Explains, summarizes, translates and assists
                                ↓
                         HUMAN AUTHORITIES
        Make operational/emergency decisions
```

This separation is essential.

**GenAI does not replace the ML prediction system.**

**The dashboard does not replace the backend.**

**The Android application does not have a separate backend.**

**MongoDB is not accessed directly by clients.**

**Hardware provides real-world sensing and local warning capability, while the software platform converts those observations and external datasets into actionable risk intelligence.**

---

# 69. Definition of Done

The Database + API layer is considered prototype-complete when:

- MongoDB is connected.
- Required collections/models exist.
- Authentication works.
- Hardware/simulated sensor data can be ingested.
- Sensor readings are stored.
- Risk zones can be retrieved.
- ML predictions can be requested.
- ML results are stored.
- GIS risk data can be retrieved.
- Reports can be submitted.
- Alerts can be retrieved.
- Dashboard APIs work.
- Android can consume the shared backend.
- GenAI can retrieve validated system information through backend tools.
- API errors are handled consistently.
- Basic authentication and authorization are implemented.
- The complete hardware → ML → GIS → alert → application pipeline can be demonstrated.

---

# 70. Final Outcome

This database and API architecture creates a single integration backbone for the entire project.

The resulting system connects:

**Rainfall + Soil Moisture + Satellite + Terrain/Slope + Historical Landslide Records + Hardware Observations + Field Reports**

into a unified platform that can:

**monitor → analyse → predict → map → explain → alert → support response.**

This directly supports the software requirements of **PS 26001** while providing the hardware sensing and local-warning foundation needed to integrate the project with **PS 26223**.