# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## AI-Powered Landslide Early Warning & Disaster Risk Monitoring System

**SIH Problem Statements**

- **PS 26001:** AI-Based Early Warning and Landslide Risk Monitoring System in NER
- **PS 26223:** Student Innovation – Disaster Management

**Organizations**

- Ministry of Development of North Eastern Region (MDoNER)
- AICTE, MIC – Student Innovation

**Category:** Software + Hardware  
**Theme:** Disaster Management  
**Project Stage:** Working Prototype  
**Development Time:** Approximately 9 Days  
**Team Size:** 6

---

# 1. Purpose

This Product Requirements Document defines the features and expected behavior of the proposed disaster-management system.

The PRD translates the requirements of the two SIH problem statements into implementable product features.

The primary goal is to build a working prototype that can:

- Monitor environmental and slope conditions.
- Predict landslide risk.
- Display risk geographically.
- Provide early warnings.
- Allow field/citizen reporting.
- Assist authorities in understanding and responding to risk.
- Continue basic monitoring during network failure.

Generative AI is included as a supporting intelligence layer and does not replace the predictive AI/ML system.

---

# 2. Product Vision

The system aims to provide a single platform through which authorities can **monitor vulnerable areas, identify increasing disaster risk, receive early warnings and coordinate initial response**.

The system combines physical monitoring with software-based intelligence.

The product follows the principle:

> **Monitor → Predict → Understand → Warn → Respond**

---

# 3. Target Users

## 3.1 Disaster Management Authority

The primary user.

Needs to:

- Monitor multiple areas.
- Identify critical zones.
- Understand why risk is increasing.
- View affected infrastructure.
- Receive alerts.
- Review field reports.
- Access disaster-management information.

---

## 3.2 Field Officer

Needs to:

- Monitor assigned areas.
- Receive alerts.
- Report observed hazards.
- Upload photographs/videos.
- Share location.
- Verify incidents.

---

## 3.3 Citizen

Needs to:

- Receive relevant warnings.
- Report hazards.
- Submit photographs.
- Share their location.
- Understand basic risk information.

---

# 4. Product Components

The product consists of:

1. Hardware Monitoring Unit
2. Edge/Local Processing
3. Backend
4. Database
5. AI/ML Risk Engine
6. GIS Mapping System
7. Web Dashboard
8. Android Application
9. Alert System
10. Generative AI Layer
11. External Data Integration
12. Cloud Infrastructure

---

# 5. Feature Priority

Because development time is approximately nine days, features are divided into three priorities.

### P0 — Must Have

Required for the working prototype and final demonstration.

### P1 — Should Have

Important features to implement after P0 functionality is stable.

### P2 — Could Have

Only implemented if sufficient development time remains.

---

# 6. Hardware Monitoring Requirements

## HW-01 — Environmental Monitoring

**Priority:** P0

The hardware unit shall collect relevant environmental information.

Potential measurements:

- Rainfall
- Soil moisture
- Temperature
- Humidity

The exact sensor selection will be finalized in the Hardware Design Document based on component availability.

### Acceptance Criteria

- Sensors provide readable values.
- Values can be processed by the controller.
- Sensor data can be transmitted to the backend.
- Sensor failure can be identified where practical.

**PS Mapping:** PS 26001 — rainfall and soil moisture monitoring.

---

# 7. Slope Monitoring

## HW-02 — Slope Movement Detection

**Priority:** P0

The hardware should monitor changes in slope orientation or movement using a suitable sensor.

The system should identify abnormal changes beyond configured thresholds.

### Acceptance Criteria

- Slope/tilt data can be collected.
- Abnormal changes can be detected.
- The reading is associated with the correct monitoring device/location.

**PS Mapping:** PS 26001 — terrain/slope monitoring.

---

# 8. Hardware Location

## HW-03 — Device Location

**Priority:** P1

The system should associate each hardware monitoring unit with a geographical location.

Location may be:

- GPS-derived, or
- Preconfigured during deployment.

### Acceptance Criteria

The dashboard can identify where the sensor node is deployed.

---

# 9. Edge Warning

## HW-04 — Local Warning

**Priority:** P0

The hardware shall be capable of generating a local warning when configured dangerous conditions are detected.

Possible mechanisms:

- Buzzer
- LED
- Local indicator

### Acceptance Criteria

When a configured critical threshold is exceeded:

- Warning indicator activates.
- The warning works without requiring cloud processing.

This supports the low-network requirement.

---

# 10. Backend Data Ingestion

## BE-01 — Sensor Data API

**Priority:** P0

The backend shall provide an API through which hardware devices can submit sensor readings.

Sensor data should include:

- Device ID
- Timestamp
- Location
- Sensor values
- Device status

### Acceptance Criteria

- Backend receives valid sensor data.
- Invalid data is rejected.
- Data is stored.
- Latest readings are available to other services.

---

# 11. Data Storage

## BE-02 — Central Data Storage

**Priority:** P0

The system shall store:

- Sensor readings
- Devices
- Locations
- Risk predictions
- Incidents
- Reports
- Alerts
- Historical information

### Acceptance Criteria

Data remains available after the application is refreshed or restarted.

---

# 12. AI/ML Risk Prediction

## ML-01 — Risk Calculation

**Priority:** P0

The system shall calculate landslide risk using multiple available factors.

Potential inputs:

- Rainfall
- Soil moisture
- Slope
- Elevation
- Terrain
- Historical landslides
- Weather information
- Sensor trends

### Output

The system shall produce:

- Risk score
- Risk category

Example:

**87/100 — Critical**

### Acceptance Criteria

Given valid input data, the ML service returns a valid risk result.

**PS Mapping:** PS 26001 — AI/ML-based risk prediction.

---

# 13. Risk Classification

## ML-02 — Risk Levels

**Priority:** P0

The prototype shall classify risk into understandable categories.

| Score | Level |
|---:|---|
| 0–25 | Low |
| 26–50 | Moderate |
| 51–75 | High |
| 76–100 | Critical |

The exact thresholds may be adjusted during model validation.

---

# 14. Risk Explanation

## ML-03 — Risk Factors

**Priority:** P0

The system shall identify important factors contributing to the current risk.

For example:

- Heavy rainfall
- High soil moisture
- Steep slope
- Recent abnormal sensor movement

These factors will be supplied to the GenAI subsystem for natural-language explanation.

---

# 15. Weather Integration

## DATA-01 — Weather Data

**Priority:** P1

The system should integrate weather information from an available API/data source.

Relevant information may include:

- Rainfall
- Forecast
- Temperature
- Precipitation probability

### Acceptance Criteria

Weather data can be associated with the relevant geographical area and displayed to authorized users.

**PS Mapping:** PS 26001 — weather-linked risk forecasts and IMD/weather API integration.

---

# 16. Terrain and Geographic Data

## DATA-02 — Terrain Information

**Priority:** P0

The system shall incorporate available geographic information relevant to landslide risk.

Potential data:

- Elevation
- Slope
- Terrain
- Geographic boundaries

The exact source will be selected based on available datasets.

**PS Mapping:** PS 26001 — terrain/slope data.

---

# 17. Historical Landslide Data

## DATA-03 — Historical Events

**Priority:** P0

The system shall support historical landslide records.

Historical information may include:

- Location
- Date
- Severity
- Affected road/village
- Event description

Historical data will support both ML development and GIS visualization.

**PS Mapping:** PS 26001 — historical landslide records.

---

# 18. Satellite Data

## DATA-04 — Satellite Information

**Priority:** P1

The system should integrate available satellite data or imagery relevant to monitored areas.

The prototype may initially use available historical or accessible satellite information.

The purpose is to provide additional geographic/environmental information rather than requiring a complex satellite image prediction model.

**PS Mapping:** PS 26001 — satellite imagery/feeds.

---

# 19. GIS Dashboard

## GIS-01 — Interactive Risk Map

**Priority:** P0

The web application shall provide an interactive map showing:

- Risk zones
- Sensor locations
- Incidents
- Roads
- Villages
- Relevant infrastructure

Risk zones shall be distinguishable by risk level.

---

# 20. Zone Details

## GIS-02 — Risk Zone Information

**Priority:** P0

Selecting a zone should display:

- Risk score
- Risk level
- Sensor readings
- Weather information
- Risk factors
- Historical incidents
- Nearby villages
- Nearby roads
- Active reports

---

# 21. Road Connectivity

## GIS-03 — Road Status

**Priority:** P1

The system should show relevant road information.

Possible states:

- Open
- At risk
- Blocked
- Unknown

This supports the problem statement requirement regarding road connectivity.

---

# 22. Citizen/Field Reporting

## APP-01 — Geo-tagged Report

**Priority:** P0

Users shall be able to submit hazard reports.

A report may contain:

- Category
- Description
- Photograph
- Video where supported
- GPS location
- Timestamp

Possible categories:

- Landslide
- Crack
- Slope movement
- Road blockage
- Fallen debris
- Flood-related observation

**PS Mapping:** PS 26001 — citizen/field geo-tagged reporting.

---

# 23. Report Management

## APP-02 — Report Status

**Priority:** P1

Authorized users should be able to track a report through basic states:

**Submitted → Under Review → Verified → Resolved**

---

# 24. Alert System

## ALERT-01 — Risk-Based Alerts

**Priority:** P0

The system shall generate an alert when a monitored area reaches a configured high or critical risk level.

The alert should contain:

- Location
- Risk level
- Risk score
- Main risk factors
- Timestamp

---

# 25. Multichannel Alerts

## ALERT-02 — Alert Delivery

**Priority:** P1

Alerts should be available through:

- Web dashboard
- Android application
- SMS or another practical notification method

The exact notification service will depend on available infrastructure.

---

# 26. Generative AI Disaster Copilot

## GENAI-01 — Risk Explanation

**Priority:** P0

GenAI shall convert structured ML output into understandable explanations.

Example:

> "Risk has increased because of heavy rainfall, high soil moisture and recent slope movement."

GenAI will not modify the numerical risk score.

---

# 27. GenAI Natural-Language Queries

## GENAI-02 — System Questions

**Priority:** P1

Authorized users should be able to ask questions such as:

- "Which zones are critical?"
- "Why is Zone 14 high risk?"
- "Which villages are near the critical area?"
- "What are the latest sensor readings?"

The AI should obtain live information from authorized backend functions rather than inventing information.

---

# 28. GenAI Knowledge Assistant

## GENAI-03 — Disaster Guidelines

**Priority:** P1

The system should use a small knowledge base of relevant disaster-management guidelines.

RAG may be used to retrieve relevant information.

The assistant should identify the source document when appropriate.

---

# 29. GenAI Situation Reports

## GENAI-04 — Automated Reports

**Priority:** P1

The system should generate concise summaries containing:

- Current risk zones
- Major incidents
- Sensor anomalies
- Road issues
- Important changes
- Recommended areas for attention

---

# 30. Multilingual Support

## GENAI-05 — Multilingual Communication

**Priority:** P1

The system should support generating warnings and information in selected supported languages.

Critical warnings should use controlled templates to prevent alteration of important values such as location, risk level and emergency information.

**PS Mapping:** PS 26001 — multilingual notifications.

---

# 31. Android Application

## AND-01 — Risk and Alert View

**Priority:** P0

Users shall be able to view relevant:

- Risk levels
- Warnings
- Locations
- Basic incident information

---

## AND-02 — Hazard Reporting

**Priority:** P0

Users shall be able to submit geo-tagged reports with photographs and descriptions.

---

## AND-03 — Offline Reporting

**Priority:** P1

Where feasible, reports created without connectivity should be stored locally and synchronized when connectivity returns.

**PS Mapping:** PS 26001 — low-network/offline functionality.

---

# 32. Web Application

## WEB-01 — Authority Dashboard

**Priority:** P0

The web application shall provide:

- Risk overview
- GIS map
- Sensor status
- Active alerts
- Incidents
- Reports

---

## WEB-02 — Monitoring

**Priority:** P0

The dashboard shall display current and recent sensor information.

---

## WEB-03 — GenAI Assistant

**Priority:** P1

Authorized users should be able to interact with the Disaster Copilot through the web application.

---

# 33. Emergency Response Prioritization

## RESP-01 — Priority Areas

**Priority:** P1

The system should identify areas requiring higher attention based on:

- Risk level
- Population/villages
- Roads
- Infrastructure
- Active incidents

The output is a recommendation for authorities, not an autonomous emergency decision.

**PS Mapping:** PS 26001 — emergency response prioritisation.

---

# 34. Offline Hardware Operation

## OFF-01 — Local Monitoring

**Priority:** P0

The hardware shall continue basic monitoring during temporary network loss.

---

## OFF-02 — Data Synchronization

**Priority:** P1

Stored sensor data should synchronize with the central system when connectivity returns.

---

# 35. Authentication

## SEC-01 — User Authentication

**Priority:** P0

The system shall provide authenticated access to authority and field functions.

---

# 36. Role-Based Access

## SEC-02 — User Permissions

**Priority:** P1

Different users should have different access levels.

Authorities should have broader access than citizens.

---

# 37. Product Non-Functional Requirements

## Performance

The dashboard should provide reasonably fast responses for normal prototype usage.

## Reliability

The core monitoring and alert workflow should remain stable during demonstration.

## Maintainability

The system should be modular enough for the six team members to work independently.

## Scalability

Additional sensor nodes and geographical areas should be addable without redesigning the complete system.

## Security

API credentials and sensitive system information must remain protected.

## Usability

The primary dashboard should be understandable without technical knowledge.

---

# 38. MVP Definition

The MVP consists of:

### Hardware

- Working sensors
- Controller
- Sensor data transmission
- Local warning

### Backend

- Data ingestion
- Database
- APIs
- Authentication

### AI/ML

- Risk prediction
- Risk classification

### GIS

- Interactive map
- Risk visualization
- Sensor/incident locations

### Web

- Authority dashboard
- Risk monitoring
- Alerts

### Android

- Working application
- Hazard reporting
- Geo-tagging
- Alerts

### GenAI

- Risk explanation
- Basic Disaster Copilot

### Cloud

- Working deployment

---

# 39. P1 Features

After the MVP is stable:

- RAG
- Multilingual generation
- Weather API
- Satellite data
- Offline Android synchronization
- Natural-language data queries
- Situation reports
- Road-status integration
- Response prioritization

---

# 40. P2 Features

Only if sufficient time remains:

- Advanced satellite image analysis
- Computer vision for field photographs
- Advanced forecasting
- Advanced emergency optimization
- Additional sensors
- Large-scale multilingual support

---

# 41. Feature Ownership

| Area | Primary Owner |
|---|---|
| Hardware | Hardware Engineer |
| Edge/Firmware | Hardware/Edge Engineer |
| Backend | Backend Engineer |
| Web + Android | Frontend/Mobile Engineer |
| Cloud | Cloud/DevOps Engineer |
| AI/ML + GenAI | AI/ML Engineer |
| Integration | Backend + All Members |

All members are responsible for integration testing of their component.

---

# 42. Acceptance of the Complete Product

The prototype should pass the following demonstration:

### Scenario 1 — Normal Conditions

Sensors provide normal readings and the dashboard shows low/moderate risk.

### Scenario 2 — Increasing Risk

Rainfall/soil/slope conditions change.

The ML system calculates increased risk.

The GIS map changes accordingly.

### Scenario 3 — Critical Risk

Risk reaches the critical threshold.

The system generates an alert.

The web dashboard and Android application display the warning.

### Scenario 4 — Local Warning

A dangerous condition is simulated while network connectivity is unavailable.

The hardware activates its local warning mechanism.

### Scenario 5 — Field Report

A field/citizen user submits a geo-tagged photograph and description.

The report appears on the authority dashboard.

### Scenario 6 — GenAI

An authority asks:

> "Why is this area at critical risk?"

GenAI provides an explanation using the actual risk and sensor information.

### Scenario 7 — Disaster Knowledge

An authority asks a procedural question.

The GenAI assistant retrieves relevant information from the configured knowledge base.

---

# 43. Requirements Traceability

The implementation will maintain explicit traceability between the SIH requirements and product features.

| SIH Requirement | PRD Feature |
|---|---|
| Rainfall patterns | HW-01 / DATA-01 |
| Soil moisture | HW-01 |
| Satellite imagery | DATA-04 |
| Terrain/slope | HW-02 / DATA-02 |
| Historical records | DATA-03 |
| AI/ML prediction | ML-01 |
| Real-time alerts | ALERT-01 |
| GIS mapping | GIS-01 |
| Roads | GIS-03 |
| Villages | GIS-01 / GIS-02 |
| Infrastructure | GIS-01 / GIS-02 |
| Geo-tagged reports | APP-01 |
| Risk severity | ML-02 |
| Road connectivity | GIS-03 |
| Weather-linked forecast | DATA-01 |
| Emergency prioritization | RESP-01 |
| Multilingual notifications | GENAI-05 |
| Low-network operation | OFF-01 / OFF-02 |
| Mobile/web application | WEB / AND |
| Sensor integration | HW / BE |
| Cloud architecture | Cloud |
| Offline synchronization | OFF-02 / AND-03 |

---

# 44. Scope Control

Any new feature proposed during development must satisfy at least one of the following:

1. Directly addresses PS 26001.
2. Directly addresses PS 26223.
3. Is necessary for implementing an existing requirement.
4. Provides a meaningful innovation related to disaster management.

Features that do not satisfy these conditions should not be added to the core prototype unless they can be implemented without affecting P0 functionality.

---

# 45. Final Product Requirement

The final prototype must demonstrate an integrated disaster-management system rather than independent hardware and software components.

The hardware, backend, AI/ML, GIS, Generative AI, web application and Android application must work together sufficiently to demonstrate the complete process from **data collection to risk prediction, visualization, warning and field response**.

The system should remain intentionally lightweight and practical for the available development timeline.

**Primary development principle:**

> **Build the complete core workflow first. Add advanced features only after the core workflow is stable.**