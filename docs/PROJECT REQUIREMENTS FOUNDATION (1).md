# PROJECT REQUIREMENTS FOUNDATION
## AI-Powered Landslide Early Warning and Disaster Risk Monitoring System

**SIH Problem Statements:**  
- **26001 — AI-Based Early Warning and Landslide Risk Monitoring System in NER**
- **26223 — Student Innovation – Disaster Management**

**Organizations:**  
- Ministry of Development of North Eastern Region (MDoNER)
- AICTE, MIC – Student Innovation

**Category:** Software + Hardware  
**Theme:** Disaster Management

**Document Version:** 1.0  
**Project Stage:** Prototype Development  
**Development Timeline:** Approximately 9 Days  
**Team Size:** 6 Members

---

# 1. Document Purpose

This document defines the basic requirements, scope, objectives and technical direction of the proposed disaster-management system.

It will act as the foundation for the detailed Product Requirements Document (PRD), Technical Requirements Document (TRD), hardware design, AI/ML design, Generative AI design, database design, application design and testing documents.

The system is designed specifically around the requirements described in SIH Problem Statements 26001 and 26223.

The objective is to develop a **working prototype within the available development period**, while keeping the architecture simple enough for the team to implement, integrate and demonstrate reliably.

---

# 2. Problem Statement

The North Eastern Region is vulnerable to landslides, flash floods, road blockages and slope failures because of heavy rainfall, fragile terrain and unplanned hill cutting.

These events can:

- Damage infrastructure
- Block roads
- Disrupt connectivity
- Isolate communities
- Delay emergency response
- Increase risks to human life

Existing monitoring can be reactive and dependent on manual reporting. There is a need for better use of real-time environmental information, historical information, geographic data and predictive technologies to identify potentially dangerous areas earlier.

The project therefore focuses on creating an integrated system capable of **monitoring, predicting, visualizing and communicating disaster risk**.

---

# 3. Proposed Solution

The proposed system combines hardware and software into one disaster-management platform.

The hardware component collects information from vulnerable locations using suitable sensors.

The software platform combines this sensor information with available weather, terrain, satellite and historical data.

An AI/ML model analyzes the available information and generates a risk score for monitored areas.

GIS is used to display the risk geographically, including vulnerable areas, roads, villages and infrastructure.

Generative AI provides an additional intelligence layer that explains risk conditions, summarizes incidents, assists authorized users with information and generates understandable alerts and reports.

The system also provides a web application for authorities and an Android application for field officers/citizens.

---

# 4. Project Objectives

The main objectives are:

1. Monitor environmental and physical conditions related to landslide risk.
2. Collect data from hardware sensors.
3. Integrate external weather and geographic data.
4. Use AI/ML to estimate landslide risk.
5. Display risk information geographically through GIS.
6. Provide early warnings for high-risk conditions.
7. Allow geo-tagged field/citizen reporting.
8. Provide authorities with a centralized monitoring dashboard.
9. Provide an Android application for field reporting and alerts.
10. Use Generative AI to explain and summarize disaster information.
11. Provide multilingual communication where feasible.
12. Maintain basic monitoring and warning capability during network failure.
13. Demonstrate a complete working prototype within the development period.

---

# 5. System Scope

The system will contain the following major components:

## 5.1 Hardware Monitoring Unit

The hardware unit will monitor relevant environmental and physical conditions.

Potential measurements include:

- Rainfall
- Soil moisture
- Slope/tilt movement
- Temperature
- Humidity
- Device status
- Location

The exact sensors and hardware components will be finalized separately in the Hardware Design Document based on availability, reliability and development time.

The hardware must be capable of sending collected data to the software system.

---

# 6. Edge/Local Processing

The hardware unit should support basic local processing.

This allows the system to detect clearly dangerous sensor conditions even when communication with the cloud is unavailable.

For example, if configured sensor thresholds indicate abnormal conditions, the hardware may activate a local warning mechanism such as:

- Buzzer
- LED
- Local display, if available

The edge system will remain intentionally simple.

It will not attempt to replace the main AI/ML prediction system.

---

# 7. Data Sources

The software platform will combine information from multiple sources.

### Primary data

- Hardware sensor readings
- Field/citizen reports

### External data

- Weather information
- Rainfall information
- Terrain/slope data
- Elevation data
- Satellite imagery/data
- Historical landslide records

The exact external APIs and datasets will be selected based on availability and suitability during development.

The system should maintain a common geographic reference so that data from different sources can be associated with the correct monitoring zone.

---

# 8. AI/ML Risk Prediction

The AI/ML component will estimate the risk of landslide occurrence based on available environmental, geographic and historical factors.

Potential model inputs include:

- Rainfall
- Soil moisture
- Slope
- Elevation
- Terrain characteristics
- Historical landslide occurrences
- Weather information
- Sensor trends

The output will include:

- Risk score
- Risk category
- Relevant contributing factors

A simple risk classification can initially be used:

| Risk Score | Risk Level |
|---:|---|
| 0–25 | Low |
| 26–50 | Moderate |
| 51–75 | High |
| 76–100 | Critical |

The exact model and scoring method will be finalized in the AI/ML Technical Document.

The prototype should prioritize **working predictions and explainability over model complexity**.

---

# 9. GIS-Based Monitoring

GIS will be used to display geographically relevant information.

The web dashboard should be able to display:

- Risk zones
- Sensor locations
- Landslide incidents
- Roads
- Villages
- Relevant infrastructure
- Field reports
- Other available geographic information

Risk zones should be visually distinguishable according to their risk level.

Authorized users should be able to select a zone and view relevant information such as current risk, sensor values and recent incidents.

---

# 10. Risk Monitoring Dashboard

The web application will provide a centralized dashboard for authorized authorities.

The primary dashboard should show:

- Overall risk status
- Number of critical/high-risk areas
- Interactive GIS map
- Sensor status
- Recent incidents
- Active alerts
- Road/connection status where data is available
- Weather-linked risk information

The dashboard should prioritize **clarity and useful information rather than visual complexity**.

---

# 11. Citizen and Field Reporting

The Android application will allow citizens or field personnel to report observed problems.

A report may contain:

- Photograph
- Video, where supported
- GPS location
- Report category
- Description
- Timestamp

Possible categories include:

- Landslide
- Surface crack
- Slope movement
- Road blockage
- Fallen debris
- Flood-related observation

Reports will be sent to the backend and displayed on the monitoring dashboard.

The system may use AI assistance to summarize or classify reports, but AI-generated classification will not automatically be treated as a confirmed disaster event.

---

# 12. Alert System

The system will generate alerts based on risk conditions and verified incidents.

The alert system should support:

- Web dashboard alerts
- Android notifications
- SMS or another practical notification mechanism, where available

Alerts should contain important information such as:

- Location
- Risk level
- Time
- Main reason for the alert
- Recommended attention/action

Critical alerts should use predefined structures/templates wherever possible to reduce the possibility of incorrect AI-generated information.

---

# 13. Generative AI

Generative AI will be integrated as a **Disaster Management Copilot**.

It will not replace the predictive ML model.

Its main functions will include:

### Risk explanation

Explain why a monitored area has reached a particular risk level using validated system information.

### Natural-language queries

Allow authorized users to ask questions such as:

> "Which areas are currently at critical risk?"

The system should retrieve actual data from the backend rather than allowing the LLM to guess.

### Situation summaries

Generate concise summaries of current disaster conditions.

### Incident summaries

Convert field reports into structured and readable summaries.

### Disaster-management knowledge

Use relevant disaster-management documents and guidelines to answer procedural questions through a retrieval-based approach where practical.

### Multilingual communication

Assist in generating or translating warnings and information into supported languages.

Generative AI will remain a **decision-support component**. It will not independently authorize evacuation, road closure or emergency deployment.

---

# 14. Knowledge Base / RAG

Where time permits, a small knowledge base will be created using relevant disaster-management documents and procedures.

The system can retrieve relevant sections from these documents when an authorized user asks a procedural question.

The prototype will prioritize a small number of reliable documents instead of attempting to build a large knowledge repository.

---

# 15. Android Application

The Android application will focus on the most important field functions.

### Required functions

- User access
- View warnings
- View relevant risk information
- Submit geo-tagged reports
- Capture photographs
- Add descriptions
- Receive alerts

### Optional functions

- Offline report creation
- Local caching
- Basic map access
- Report status tracking

The application will remain focused on field operations and will not duplicate the complete authority dashboard.

---

# 16. Web Application

The web application will be the main authority-facing interface.

### Required functions

- Authentication
- Dashboard
- GIS map
- Risk-zone information
- Sensor monitoring
- Incident monitoring
- Alerts
- Field reports
- GenAI assistant

### Optional functions

- Historical analytics
- Advanced filtering
- Report generation
- Response-team management

Optional functions will only be implemented if the core system is stable.

---

# 17. Backend

The backend will act as the central communication layer between hardware, AI/ML, GenAI, database and applications.

It will handle:

- Authentication
- Sensor data ingestion
- Data validation
- Database operations
- Risk information
- Incident management
- Alert management
- AI/ML communication
- GenAI communication
- Application APIs

The backend should expose documented APIs for the web and Android applications.

---

# 18. Database

The database will store the core operational information.

Initial entities are expected to include:

- Users
- Devices
- Sensors
- Sensor readings
- Locations
- Risk zones
- Risk predictions
- Incidents
- Field reports
- Alerts
- Historical events

Geographic information will be stored in a way that supports GIS operations.

The final database schema will be defined in the Database Design Document.

---

# 19. Cloud Deployment

The system will be deployed to a cloud environment suitable for the prototype.

The cloud environment should host the required:

- Backend
- Database
- AI/ML service
- GenAI integration
- Web application

The exact cloud provider will be selected based on:

- Free/low-cost availability
- Deployment speed
- Team familiarity
- Required computing resources
- Reliability during demonstration

The project will avoid unnecessary cloud infrastructure and microservices unless they are genuinely required.

---

# 20. Offline and Low-Network Capability

The project statement specifically requires low-network/offline support.

The prototype will address this at two levels.

### Hardware

The hardware unit should continue basic monitoring and local warning when internet connectivity is unavailable.

### Android

The application should, where feasible, allow reports to be temporarily stored locally and synchronized when connectivity returns.

Full offline operation of every software feature is not required for the prototype.

---

# 21. Security Requirements

The prototype will implement basic security measures including:

- User authentication
- Role-based access
- Secure API communication
- Server-side storage of API credentials
- Input validation
- Basic rate limiting
- Access control for administrative functions
- Activity logging for important operations

The GenAI API key must never be exposed to the web or Android client.

---

# 22. User Roles

The prototype will initially support three major user types.

### Authority/Admin

Can:

- View overall risk
- Monitor zones
- View incidents
- View sensor information
- Access GenAI assistant
- Review reports
- Manage alerts

### Field Officer

Can:

- View assigned/nearby risks
- Receive alerts
- Submit reports
- Upload photographs
- Verify incidents

### Citizen

Can:

- View relevant warnings
- Submit geo-tagged hazard reports
- Receive alerts

The exact permissions will be finalized in the PRD.

---

# 23. Core End-to-End Functionality

The prototype must demonstrate the following complete functionality:

1. Hardware collects sensor data.
2. Data reaches the backend.
3. Backend stores and validates the data.
4. AI/ML processes relevant information.
5. Risk score is generated.
6. Risk is displayed on the GIS dashboard.
7. High-risk conditions generate an alert.
8. Android users can receive the alert.
9. Field/citizen users can submit geo-tagged reports.
10. Authorities can view the report.
11. GenAI can explain the risk or summarize the situation.
12. Hardware can provide basic local warning when network connectivity is unavailable.

This is the **minimum complete system demonstration**.

---

# 24. Non-Functional Requirements

The prototype should prioritize:

### Reliability

Core functionality should remain stable during demonstrations.

### Responsiveness

Dashboard and APIs should provide reasonably fast responses.

### Scalability

The architecture should allow additional sensors and geographical zones to be added later.

### Maintainability

Code and APIs should be modular enough for team members to work independently.

### Security

User and system access should be controlled.

### Usability

The dashboard should be understandable to a non-technical authority user.

### Offline resilience

Basic monitoring and warning should not completely depend on continuous internet connectivity.

---

# 25. MVP Priority

Because the team has approximately nine days, features are divided into priorities.

## P0 — Mandatory

These must work.

- Hardware sensor monitoring
- Backend
- Database
- AI/ML risk prediction
- GIS risk visualization
- Web dashboard
- Android application
- Geo-tagged reporting
- Alert system
- Basic offline hardware warning
- Cloud deployment
- Basic GenAI risk explanation

## P1 — Important

Implement after P0 is stable.

- RAG knowledge base
- Natural-language system queries
- Multilingual alerts
- Weather API integration
- Historical data visualization
- Offline Android report synchronization

## P2 — Optional

Only implement if sufficient time remains.

- Advanced satellite analysis
- Advanced image analysis
- Advanced predictive forecasting
- Complex response-team optimization
- Advanced analytics
- Additional sensor types

---

# 26. Technology Direction

The project will use technologies that can be implemented quickly and are familiar to the team.

Potential technologies include:

### Hardware
Microcontroller/edge computing platform + appropriate sensors.

### Backend
Python-based backend framework.

### Database
PostgreSQL, with geographic capabilities where required.

### AI/ML
Python-based machine-learning framework.

### GenAI
Hugging Face and/or Groq-based LLM integration.

### Web
React-based frontend.

### Android
Native Android, Flutter or React Native depending on team implementation preference.

### GIS
Web-based mapping technology with geographic database support.

### Cloud
A suitable low-cost/free cloud platform selected during implementation.

The final technology selection will be documented in the TRD.

---

# 27. Project Constraints

The project has the following constraints:

- Approximately nine days of development time.
- Six-person development team.
- Working prototype required.
- Hardware components are not fully finalized.
- External datasets must be sourced.
- Cloud provider is not yet selected.
- Satellite integration is planned.
- Both hardware and software must be demonstrated.
- The project must remain aligned with PS 26001 and PS 26223.

Because of these constraints, unnecessary complexity will be avoided.

---

# 28. Out of Scope for the Initial Prototype

The following are not mandatory for the first working prototype:

- Full-scale government deployment
- Production-grade nationwide infrastructure
- Highly complex distributed architecture
- Fully autonomous disaster decisions
- Large-scale satellite image processing
- Perfect landslide prediction
- Complete offline operation of every application feature
- Large multilingual language coverage
- Extensive computer-vision capabilities
- Complex microservice infrastructure

These may be considered future enhancements.

---

# 29. Success Criteria

The project will be considered successful when the team can demonstrate:

1. A working hardware monitoring unit.
2. Real sensor data reaching the software platform.
3. A functioning AI/ML risk prediction.
4. A live GIS-based risk map.
5. A functioning authority dashboard.
6. A working Android application.
7. Geo-tagged incident reporting.
8. Automatic risk-based alerts.
9. GenAI-based risk explanation and assistance.
10. Basic local warning during network failure.
11. Successful cloud deployment.
12. A clear mapping of implemented features to PS 26001 and PS 26223.

---

# 30. Traceability Principle

All future project documents must maintain traceability to the original problem statements.

Every major requirement will be classified as one of:

**PS 26001 Requirement**

Requirement explicitly stated in the software problem statement.

**PS 26223 Requirement**

Requirement relevant to the hardware disaster-management problem statement.

**Implementation Requirement**

A technical requirement needed to implement a stated problem requirement.

**Innovation**

An additional capability that strengthens the solution without replacing the required functionality.

This classification will be maintained in the PRD and subsequent technical documents.

---

# 31. Development Philosophy

The project will follow a **working-system-first approach**.

The team will prioritize:

**Working core functionality > feature quantity**

**Reliable integration > complex architecture**

**Problem-statement coverage > unnecessary features**

**Demonstrable prototype > production-scale engineering**

The final prototype should clearly demonstrate how hardware, software, AI/ML, GIS and Generative AI work together to improve disaster preparedness and response.

---

# 32. Final Product Definition

The final prototype is an integrated **AI-powered disaster early-warning and risk monitoring system** that combines physical sensing, predictive analytics, geographic visualization, Generative AI and field reporting.

Its core purpose is to help authorities and communities move from a primarily reactive approach toward **earlier identification, understanding and communication of disaster risk**.

The project will specifically demonstrate the combination of hardware-based disaster monitoring required for the hardware problem statement and AI/GIS/software-based risk monitoring and early-warning capabilities required for the software problem statement.