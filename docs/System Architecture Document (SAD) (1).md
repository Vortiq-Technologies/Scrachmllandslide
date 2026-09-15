# System Architecture Document (SAD)

## AI-Based Early Warning and Landslide Risk Monitoring System in the North Eastern Region

---

# 1. Document Purpose

This document defines the overall architecture of the proposed integrated disaster-management system.

The architecture combines:

- Hardware-based environmental and slope monitoring
- Centralized backend services
- MongoDB data storage
- AI/ML-based landslide risk prediction
- GIS-based visualization
- Weather and satellite data
- Citizen and field reporting
- Alert and notification services
- Generative AI-based disaster-management assistance
- React web dashboard
- React Native Android application
- Offline and edge capabilities

The architecture is designed specifically for the combined implementation of:

**PS 26001 – AI-Based Early Warning and Landslide Risk Monitoring System in NER**

and

**PS 26223 – Student Innovation – Disaster Management**

---

# 2. Architectural Goals

The system architecture must achieve the following goals:

1. Collect real-world environmental and slope data.
2. Combine hardware and external data sources.
3. Process data centrally.
4. Predict landslide risk using AI/ML.
5. Display risk geographically.
6. Generate timely warnings.
7. Allow field users and citizens to submit observations.
8. Provide authorities with a centralized monitoring platform.
9. Provide an Android application for field usage.
10. Use Generative AI as a decision-support assistant.
11. Continue basic safety functionality during network failures.
12. Remain scalable beyond the prototype.
13. Avoid unnecessary architectural complexity during the 9-day development period.

---

# 3. Architectural Philosophy

The system follows a **centralized application architecture with specialized processing services**.

The core design principle is:

> **One shared backend, multiple clients, specialized AI services.**

The web and Android applications do not maintain separate business logic or databases.

```text
                    ┌──────────────────┐
                    │   React Web App  │
                    └────────┬─────────┘
                             │
                             │
                    ┌────────▼─────────┐
                    │                  │
                    │  CENTRAL BACKEND │
                    │ Node.js/Express  │
                    │                  │
                    └────────┬─────────┘
                             │
                    ┌────────┼────────┐
                    │        │        │
                    ▼        ▼        ▼
                MongoDB    AI/ML    External
                          Service     APIs
                    │        │        │
                    └────────┼────────┘
                             │
                    ┌────────▼─────────┐
                    │   GenAI Layer    │
                    └──────────────────┘
                             ▲
                             │
                    ┌────────┴─────────┐
                    │ React Native App │
                    └──────────────────┘
```

---

# 4. High-Level System Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                             │
│                                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐ │
│  │ IoT Sensors│ │ Weather API│ │ Satellite  │ │ Historical   │ │
│  │            │ │            │ │ Data       │ │ Landslides   │ │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └──────┬───────┘ │
│        │              │              │               │         │
└────────┼──────────────┼──────────────┼───────────────┼─────────┘
         │              │              │               │
         └──────────────┴──────────────┴───────────────┘
                                │
                                ▼
                  ┌────────────────────────┐
                  │     API / INGESTION     │
                  │        LAYER            │
                  └────────────┬───────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │     NODE.JS BACKEND    │
                  │        EXPRESS         │
                  │                        │
                  │ Auth                   │
                  │ Data Processing        │
                  │ Reports                │
                  │ Alerts                 │
                  │ GIS Services           │
                  │ AI Integration         │
                  │ GenAI Integration      │
                  └────────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐   ┌──────────────┐  ┌──────────────┐
        │ MongoDB   │   │ Python AI/ML │  │ Notification │
        │           │   │ Service      │  │ Services     │
        └───────────┘   └──────┬───────┘  └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Risk Engine  │
                        └──────┬───────┘
                               │
                 ┌─────────────┼──────────────┐
                 │             │              │
                 ▼             ▼              ▼
            ┌─────────┐   ┌──────────┐  ┌────────────┐
            │ GIS     │   │ Alerts   │  │ GenAI      │
            │ Engine  │   │ Engine   │  │ Copilot    │
            └────┬────┘   └────┬─────┘  └─────┬──────┘
                 │             │              │
                 └─────────────┼──────────────┘
                               │
                  ┌────────────┴─────────────┐
                  │                          │
                  ▼                          ▼
          ┌────────────────┐        ┌────────────────┐
          │ React Web      │        │ React Native   │
          │ Dashboard      │        │ Android App    │
          └────────────────┘        └────────────────┘
```

---

# 5. Major Architectural Components

The system is divided into the following major components.

## 5.1 Hardware Monitoring Layer

Responsible for:

- Sensor measurement
- Device identification
- Local processing
- Local warning
- Communication
- Device health monitoring

---

## 5.2 Data Ingestion Layer

Responsible for receiving:

- Sensor readings
- Weather information
- Satellite-derived information
- Field reports
- Historical data

The ingestion layer validates and normalizes incoming information before storage or analysis.

---

## 5.3 Application Backend

Implemented using:

**Node.js + Express**

It acts as the central application and integration layer.

---

## 5.4 Database Layer

Implemented using:

**MongoDB**

Stores application, monitoring, risk, geographic and reporting data.

---

## 5.5 AI/ML Layer

Implemented as a Python-based service.

Responsible for:

- Feature processing
- Model inference
- Risk scoring
- Risk classification
- Model evaluation
- Prediction metadata

---

## 5.6 GIS Layer

Responsible for geographic visualization of:

- Risk zones
- Sensors
- Roads
- Villages
- Reports
- Historical events
- Infrastructure

---

## 5.7 Alert Engine

Responsible for:

- Evaluating risk thresholds
- Creating alerts
- Selecting recipients
- Triggering supported notification channels

---

## 5.8 GenAI Layer

Responsible for:

- Explaining AI predictions
- Answering natural-language queries
- Summarizing incidents
- Generating situation reports
- Generating understandable warnings
- Translation/multilingual communication

---

## 5.9 Web Application

Provides the primary monitoring interface for authorities.

---

## 5.10 Android Application

Provides mobile access for field personnel and citizens.

---

# 6. Hardware Architecture

The hardware subsystem consists conceptually of:

```text
┌─────────────────────┐
│ Environmental /     │
│ Slope Sensors       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Microcontroller /   │
│ Edge Device         │
└───────┬───────┬─────┘
        │       │
        │       ▼
        │  ┌──────────────┐
        │  │ Local Warning│
        │  │ Buzzer / LED │
        │  └──────────────┘
        │
        ▼
┌─────────────────────┐
│ Communication       │
│ Module              │
└──────────┬──────────┘
           │
           ▼
      Central Backend
```

The exact sensors and communication modules will be defined in the Hardware Design Document.

---

# 7. Hardware Data Flow

A normal hardware reading follows:

```text
Sensor
  ↓
Microcontroller
  ↓
Read Measurement
  ↓
Validate Measurement
  ↓
Attach Timestamp
  ↓
Attach Device ID
  ↓
Attach Location
  ↓
Transmit
  ↓
Backend
```

If a dangerous local condition is detected:

```text
Sensor
  ↓
Microcontroller
  ↓
Local Threshold/Condition
  ↓
Local Warning
```

This provides an additional safety layer independent of cloud processing.

---

# 8. Central Backend Architecture

The Node.js backend is the central system component.

Logical structure:

```text
backend/
│
├── routes/
│
├── controllers/
│
├── services/
│
├── models/
│
├── middleware/
│
├── integrations/
│
├── utils/
│
└── config/
```

---

# 9. Backend Responsibilities

The backend manages:

### Authentication

- Login
- Registration where applicable
- Token validation
- Role permissions

### Data

- Sensor ingestion
- Sensor retrieval
- Risk data
- Historical events

### Geographic Services

- Zone retrieval
- Nearby objects
- Map data

### Reporting

- Citizen reports
- Field reports
- Media references
- Report status

### Alerts

- Alert generation
- Alert retrieval
- Notification dispatch

### AI

- Prediction requests
- Prediction storage
- GenAI requests

### External Services

- Weather
- Satellite
- Notification systems

---

# 10. Backend Service Flow

```text
Incoming Request
      ↓
Authentication
      ↓
Authorization
      ↓
Validation
      ↓
Controller
      ↓
Business Service
      ↓
Database / External Service / AI
      ↓
Response
```

This structure prevents frontend applications from directly accessing sensitive services.

---

# 11. Database Architecture

MongoDB will serve as the central application database.

```text
                    MongoDB
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
   Operational      Geographic       Historical
      Data             Data             Data
       │               │                │
       ▼               ▼                ▼
   Users          Risk Zones       Landslide Events
   Sensors        Reports
   Alerts         Roads
   Readings       Villages
```

---

# 12. Data Ownership

Each major data type has a primary owner.

| Data | Primary Component |
|---|---|
| User data | Backend |
| Sensor data | Hardware + Backend |
| Risk score | AI/ML |
| Risk zone | Backend + AI/ML |
| Geographic data | Backend/GIS |
| Citizen reports | Mobile + Backend |
| Alerts | Alert Engine |
| Historical data | Data/AI layer |
| GenAI response | GenAI layer |
| Device health | Hardware + Backend |

---

# 13. AI/ML Architecture

The AI/ML system operates independently from the user interface.

```text
              Backend
                 │
                 │ Prediction Request
                 ▼
       ┌─────────────────────┐
       │ Python AI/ML Service│
       └──────────┬──────────┘
                  │
                  ▼
          Feature Processing
                  │
                  ▼
             ML Model
                  │
                  ▼
          Risk Calculation
                  │
                  ▼
      ┌──────────────────────┐
      │ Prediction Response  │
      │ Score                 │
      │ Level                 │
      │ Confidence            │
      │ Factors               │
      └──────────┬───────────┘
                 │
                 ▼
              Backend
```

---

# 14. ML Data Sources

The model may use:

- Local sensor readings
- Rainfall
- Soil moisture
- Slope
- Elevation
- Terrain features
- Historical landslide records
- Satellite-derived features
- Field observations

Not every feature must be available for every prediction.

The model and feature pipeline will be designed around actual data availability.

---

# 15. ML Model Lifecycle

```text
Historical Data
      ↓
Data Cleaning
      ↓
Feature Engineering
      ↓
Training Dataset
      ↓
Model Training
      ↓
Validation
      ↓
Model Evaluation
      ↓
Selected Model
      ↓
Deployment
      ↓
Inference
```

Model selection will remain flexible until actual dataset and validation results are available.

---

# 16. Risk Calculation Architecture

Risk calculation consists of:

```text
Environmental Factors
          +
Terrain Factors
          +
Historical Factors
          +
Current Field Information
          ↓
      Feature Vector
          ↓
        ML Model
          ↓
      Risk Score
          ↓
     Risk Category
```

Example:

```text
Rainfall             HIGH
Soil Moisture        HIGH
Slope                HIGH
Historical Events    MEDIUM
Field Report         HIGH

             ↓

Risk Score = 84
Risk Level = CRITICAL
```

---

# 17. Risk Result Contract

The AI/ML service should return structured results.

Example:

```json
{
  "zoneId": "ZONE001",
  "riskScore": 84,
  "riskLevel": "critical",
  "confidence": 0.87,
  "factors": [
    "High cumulative rainfall",
    "High soil moisture",
    "Steep slope",
    "Recent slope movement"
  ],
  "generatedAt": "timestamp"
}
```

This structure becomes the common data contract between AI/ML, backend, GIS, alerts and GenAI.

---

# 18. GIS Architecture

GIS is implemented primarily through the frontend map interface supported by backend geographic services.

```text
MongoDB GeoJSON
       ↓
Backend GIS APIs
       ↓
React Map Component
       ↓
Interactive Map
```

The map can display multiple geographic layers.

### Layer 1

Risk zones.

### Layer 2

Sensor locations.

### Layer 3

Roads.

### Layer 4

Villages.

### Layer 5

Citizen/field reports.

### Layer 6

Historical landslide events.

---

# 19. Geographic Query Flow

Example:

> Show critical areas within 10 km of this village.

```text
User
 ↓
React
 ↓
Backend GIS API
 ↓
MongoDB Geospatial Query
 ↓
Matching Zones
 ↓
React Map
```

This avoids sending the entire database to the client.

---

# 20. Citizen Reporting Architecture

```text
Citizen / Field Officer
          ↓
React Native App
          ↓
Capture:
- GPS
- Photo
- Video
- Description
- Hazard Type
          ↓
Backend API
          ↓
Validation
          ↓
Media Storage
          ↓
MongoDB
          ↓
Authority Dashboard
```

---

# 21. Report Verification

Reports should have a lifecycle:

```text
Submitted
    ↓
Received
    ↓
Under Review
    ↓
Verified / Rejected
    ↓
Resolved
```

Authorized personnel can update the report status.

---

# 22. Report-to-Risk Integration

A citizen report can provide additional information about local conditions.

Example:

```text
Existing Risk = 62
```

Then:

```text
New Field Report:
"Large cracks observed on hillside"
```

The system can use the report as an additional evidence source.

The report should not automatically override the ML model.

Instead, it can trigger:

- Review
- Risk reassessment
- Authority attention
- Additional monitoring

---

# 23. Alert Architecture

The alert engine sits between risk results and notification services.

```text
AI/ML Risk
     ↓
Alert Engine
     ↓
Check Threshold
     ↓
Determine Severity
     ↓
Determine Target Users
     ↓
Generate Alert
     ↓
Notification Service
```

---

# 24. Alert Generation Example

```text
Risk Score = 82
       ↓
Critical Threshold
       ↓
Critical Alert
       ↓
Identify Relevant Zone
       ↓
Identify Authorized Users
       ↓
Send Notification
```

The same alert can appear on:

- Web dashboard
- Android application
- Push notification
- SMS where implemented

---

# 25. Alert Deduplication

The system should avoid repeatedly generating identical alerts for the same unchanged condition.

For example:

```text
Critical Alert
     ↓
Alert ID: A102
     ↓
Risk remains critical
     ↓
No duplicate alert immediately
```

A new alert may be generated when:

- Risk significantly changes
- Condition worsens
- A new incident occurs
- Previous alert is resolved/expired

---

# 26. GenAI Architecture

GenAI sits above validated system information.

```text
                   User
                    │
                    ▼
              GenAI Copilot
                    │
             ┌──────┴──────┐
             │             │
             ▼             ▼
       System Tools      Knowledge Base
             │             │
             ▼             ▼
        Live Data        SOPs / Guides
             │             │
             └──────┬──────┘
                    ▼
              Context Builder
                    │
                    ▼
                  LLM
                    │
                    ▼
              Final Response
```

---

# 27. GenAI Data Flow

Example question:

> Which areas are at highest risk right now?

```text
User
 ↓
GenAI
 ↓
Request Current Risk Data
 ↓
Backend Tool
 ↓
MongoDB
 ↓
Current Risk Zones
 ↓
GenAI
 ↓
Natural Language Answer
```

The model should not guess the current risk.

---

# 28. GenAI Risk Explanation

Example:

```text
User:
Why is Zone A critical?

Backend:
Risk = 84
Rainfall = High
Soil Moisture = High
Slope = Steep
Recent Movement = Detected

GenAI:
Zone A is currently classified as critical because
recent rainfall and high soil moisture are combined
with steep terrain and observed slope movement.
```

The numerical risk score comes from the ML system.

---

# 29. GenAI Knowledge Architecture

The system can use two information sources:

### Live operational data

From:

- MongoDB
- Sensor system
- Weather APIs
- Risk engine
- Reports

### Trusted reference information

From:

- Disaster-management guidelines
- SOPs
- Emergency procedures
- Relevant official documentation

These sources should be kept conceptually separate.

---

# 30. GenAI Safety Boundary

The following architecture boundary is mandatory:

```text
                 ML
                  │
                  ▼
             Risk Score
                  │
                  ▼
                GenAI
                  │
                  ▼
        Explanation / Assistance
                  │
                  ▼
          Human Authority
                  │
                  ▼
           Final Decision
```

Not:

```text
ML → GenAI → Automatic Evacuation
```

Human authorities remain responsible for emergency decisions.

---

# 31. Web Application Architecture

```text
React
 │
 ├── Dashboard
 ├── Map
 ├── Risk Monitoring
 ├── Alerts
 ├── Reports
 ├── Sensors
 ├── Historical Events
 ├── Analytics
 └── GenAI Copilot
        │
        ▼
    REST APIs
        │
        ▼
 Node.js Backend
```

---

# 32. Android Architecture

```text
React Native
 │
 ├── Login
 ├── Risk Map
 ├── Alerts
 ├── Nearby Hazards
 ├── Submit Report
 ├── Report History
 └── Offline Queue
        │
        ▼
    REST APIs
        │
        ▼
 Node.js Backend
```

---

# 33. Shared Backend Principle

The same backend serves both applications.

```text
               Node.js Backend
                 /         \
                /           \
               ▼             ▼
         React Web      React Native
```

This ensures:

- Consistent data
- Consistent authentication
- Consistent business logic
- Easier maintenance
- Faster development
- No duplicate APIs

---

# 34. External Data Integration

External data sources are integrated through the backend.

```text
Weather API
     ↓
Backend Integration
     ↓
Validation
     ↓
MongoDB / Processing
```

Similarly:

```text
Satellite Source
     ↓
Backend / Processing
     ↓
Relevant Features
     ↓
Database / ML Pipeline
```

The frontend should not directly depend on external API credentials.

---

# 35. Offline Architecture

Offline support exists at two important levels.

## Hardware

```text
Sensors
 ↓
Edge Processing
 ↓
Local Warning
```

No cloud dependency for the basic local warning.

## Mobile

```text
Offline Report
 ↓
Local Device Storage
 ↓
Pending Queue
 ↓
Network Available
 ↓
Backend Sync
```

---

# 36. Failure-Tolerant Architecture

The system should degrade gracefully.

### If weather API fails

Local sensor and historical information can continue.

### If GenAI fails

ML risk and dashboard remain operational.

### If ML service fails

Previously calculated risk remains available, while the system reports prediction-service unavailability.

### If cloud connectivity fails

Hardware can continue local warning.

### If mobile network fails

Reports can be queued locally.

---

# 37. End-to-End Primary Flow

The most important system flow is:

```text
        ┌──────────────┐
        │   Sensors    │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ Edge Device  │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ Node Backend │
        └──────┬───────┘
               ▼
          ┌─────────┐
          │ MongoDB │
          └────┬────┘
               ▼
        ┌──────────────┐
        │ Python ML    │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ Risk Engine  │
        └──────┬───────┘
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
      GIS    Alerts    GenAI
       │       │        │
       └───────┼────────┘
               ▼
        Human Authority
```

This is the core architecture that should be demonstrated during SIH.

---

# 38. Secondary Citizen Reporting Flow

```text
Citizen
   ↓
Android App
   ↓
Geo-tagged Report
   ↓
Backend
   ↓
MongoDB
   ↓
Authority Dashboard
   ↓
Review
   ↓
Risk Reassessment / Response
```

---

# 39. Hardware Emergency Flow

If a local threshold is crossed:

```text
Sensor
 ↓
Edge Device
 ↓
Danger Condition
 ↓
Local Buzzer / LED
 ↓
Immediate Local Warning
```

At the same time, if connectivity exists:

```text
Sensor
 ↓
Backend
 ↓
ML
 ↓
Risk Score
 ↓
Alert
 ↓
Authority
```

This creates two complementary warning paths:

**Local physical warning + centralized intelligent warning**

---

# 40. Authentication Flow

```text
User
 ↓
Login
 ↓
Backend
 ↓
Credential Validation
 ↓
JWT / Session
 ↓
Authenticated Client
 ↓
Role Verification
 ↓
Authorized API Access
```

---

# 41. API Security Boundary

The architecture follows:

```text
Web ────────┐
            │
Mobile ─────┼──→ Backend ─→ Database
            │
Hardware ───┘
```

External services are accessed through controlled backend integrations.

Clients do not receive:

- Database credentials
- AI provider keys
- Weather API keys
- Cloud credentials
- Internal service secrets

---

# 42. Deployment Architecture

The deployment can initially be kept simple.

```text
                     Internet
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
       React Web Hosting       Mobile Application
             │                       │
             └───────────┬───────────┘
                         ▼
                  Node.js Backend
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           MongoDB      AI/ML     External
                       Service     Services
                          │
                          ▼
                         GenAI
```

The exact cloud provider will be selected later.

---

# 43. Development Environment

Each team member should be able to run the relevant subsystem independently.

Example:

```text
Frontend
localhost:3000

Backend
localhost:5000

AI/ML
localhost:8000

MongoDB
local / cloud instance
```

Actual ports can be changed according to implementation.

---

# 44. Integration Contracts

The following contracts should be frozen early:

### Sensor → Backend

Defines:

- Device ID
- Sensor readings
- Timestamp
- Location
- Device health

### Backend → ML

Defines:

- Zone ID
- Feature values
- Historical/terrain features
- Prediction request

### ML → Backend

Defines:

- Risk score
- Risk level
- Confidence
- Factors
- Timestamp

### Backend → Frontend

Defines:

- Risk data
- Geographic data
- Alerts
- Reports
- Sensor status

### Backend → GenAI

Defines:

- Validated context
- User query
- Available tools
- Relevant knowledge

Freezing these contracts early is important because all six team members depend on them.

---

# 45. Recommended Integration Order

The team should not wait until the final days to integrate everything.

The integration order should be:

### Integration 1

```text
Hardware → Backend → MongoDB
```

### Integration 2

```text
MongoDB → ML → Risk Result
```

### Integration 3

```text
Risk Result → Web Dashboard
```

### Integration 4

```text
Risk → GIS
```

### Integration 5

```text
Risk → Alert
```

### Integration 6

```text
Mobile → Backend → Report
```

### Integration 7

```text
Validated Data → GenAI
```

### Final

```text
Hardware
   ↓
Backend
   ↓
ML
   ↓
GIS
   ↓
Alert
   ↓
Mobile/Web
   ↓
GenAI
```

---

# 46. Architecture for the SIH Demonstration

The live demonstration should use one controlled scenario.

### Scenario

A monitored hill zone begins experiencing heavy rainfall.

```text
Heavy Rain
    ↓
Rainfall Sensor
    ↓
Soil Moisture Increases
    ↓
Slope Movement Detected
    ↓
Backend Receives Data
    ↓
AI/ML Calculates Risk
    ↓
Risk = HIGH/CRITICAL
    ↓
GIS Zone Updated
    ↓
Alert Generated
    ↓
Authority Notified
```

Then:

```text
Authority:
"Why is this zone critical?"

       ↓

GenAI Copilot

       ↓

"High cumulative rainfall, high soil moisture,
steep terrain and recent slope movement are
the major contributing factors."
```

Finally:

```text
Field Officer
    ↓
Android App
    ↓
Uploads Ground Crack Photo
    ↓
Geo-tagged Report
    ↓
Authority Dashboard
```

This demonstrates the complete value chain of the project.

---

# 47. Architecture Priorities

## P0 – Mandatory Core

```text
Hardware sensing
Backend
MongoDB
ML risk prediction
GIS
Web dashboard
Android app
Geo-tagged reporting
Alerts
Local warning
```

## P1 – Important

```text
Weather integration
Satellite integration
GenAI Copilot
Offline synchronization
Road status
Advanced analytics
Multilingual communication
```

## P2 – Future

```text
Large-scale NER deployment
Advanced satellite analytics
Advanced edge AI
Additional disaster types
Government-system integrations
Large-scale infrastructure prediction
```

---

# 48. Architectural Constraints

The following constraints are recognized:

1. Development time is approximately nine days.
2. Hardware components are not finalized.
3. Cloud provider is not finalized.
4. Communication technology is not finalized.
5. Exact ML algorithm is not finalized.
6. External datasets may vary in quality.
7. Prototype reliability cannot be assumed to equal production disaster-management reliability.
8. GenAI must not become a single point of failure.
9. Human authorities remain responsible for emergency decisions.

---

# 49. Key Architectural Decisions

### Decision 1

**MERN is used for the main application platform.**

### Decision 2

**React Native is used for Android.**

### Decision 3

**Web and mobile share one backend.**

### Decision 4

**MongoDB is the primary database.**

### Decision 5

**AI/ML runs through a Python service rather than inside Node.js.**

### Decision 6

**The exact ML model remains flexible.**

### Decision 7

**GenAI is an assistant, not the prediction engine.**

### Decision 8

**Hardware retains basic local warning capability.**

### Decision 9

**GIS is integrated into the application rather than treated as a separate product.**

### Decision 10

**The architecture prioritizes vertical integration over excessive microservices.**

---

# 50. Final Architecture

The complete architecture can be summarized as:

```text
                         ┌───────────────────┐
                         │     HARDWARE      │
                         │ Sensors + Edge    │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ COMMUNICATION     │
                         └─────────┬─────────┘
                                   │
                                   ▼
┌───────────────┐        ┌───────────────────┐
│ Weather APIs  │───────►│                   │
├───────────────┤        │                   │
│ Satellite     │───────►│  NODE + EXPRESS   │
├───────────────┤        │     BACKEND       │
│ Historical    │───────►│                   │
│ Data          │        │                   │
└───────────────┘        └─────────┬─────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 │                 │                 │
                 ▼                 ▼                 ▼
          ┌────────────┐   ┌─────────────┐   ┌──────────────┐
          │  MongoDB   │   │ Python      │   │ Notification │
          │            │   │ AI/ML       │   │ Services     │
          └─────┬──────┘   └──────┬──────┘   └──────────────┘
                │                 │
                │                 ▼
                │          ┌─────────────┐
                │          │ Risk Engine  │
                │          └──────┬──────┘
                │                 │
                └────────┬────────┘
                         │
              ┌──────────┼───────────┐
              │          │           │
              ▼          ▼           ▼
           ┌──────┐  ┌────────┐  ┌────────┐
           │ GIS  │  │ Alerts │  │ GenAI  │
           └──┬───┘  └───┬────┘  └───┬────┘
              │          │            │
              └──────────┼────────────┘
                         │
                  ┌──────┴──────┐
                  │             │
                  ▼             ▼
             ┌────────┐   ┌────────────┐
             │ React  │   │ React      │
             │ Web    │   │ Native     │
             │        │   │ Android    │
             └────────┘   └────────────┘
                  │             │
                  ▼             ▼
              Authorities   Field Users
                           & Citizens
```

## 51. Architecture Summary

The proposed system is a unified disaster-management architecture in which **hardware provides real-world sensing, the shared Node.js backend provides centralized coordination, MongoDB provides persistent and geospatial data storage, Python-based AI/ML predicts landslide risk, GIS provides geographic understanding, the alert engine provides early warning, and Generative AI provides explanation and decision-support assistance**.

The architecture deliberately avoids making any single advanced technology responsible for the entire system.

The fundamental safety chain remains:

**Sense → Process → Predict → Visualize → Alert → Human Decision**

while the intelligence layer adds:

**Explain → Summarize → Query → Translate → Assist**

This separation makes the system both technically credible and practical to implement within the SIH prototype timeline.