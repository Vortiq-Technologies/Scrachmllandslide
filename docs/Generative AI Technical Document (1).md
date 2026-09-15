# Generative AI Technical Document

## AI-Based Early Warning and Landslide Risk Monitoring System in the North Eastern Region

---

# 1. Document Purpose

This document defines the Generative AI architecture and implementation for the integrated landslide disaster-management system.

Generative AI will operate as a:

**Disaster Management Copilot**

It will assist authorities, field officers and other authorized users by converting complex system information into understandable and actionable information.

The GenAI subsystem will **not replace the AI/ML prediction system**.

The core separation is:

> **AI/ML predicts the risk. Generative AI explains and assists with the risk.**

---

# 2. Role of Generative AI

The GenAI subsystem will provide an intelligent interface over validated system information.

It can:

- Explain ML predictions
- Answer questions about current risk
- Summarize incidents
- Generate situation reports
- Explain risk trends
- Summarize sensor conditions
- Assist with field reports
- Generate alert messages
- Translate alerts and explanations
- Retrieve relevant disaster-management guidelines
- Help authorities query operational information using natural language

---

# 3. What GenAI Will NOT Do

Generative AI will not:

- Calculate the primary landslide risk score
- Replace the ML model
- Modify ML predictions
- Independently order evacuation
- Independently close roads
- Independently dispatch emergency teams
- Invent sensor readings
- Invent weather information
- Treat generated text as verified sensor data

The final emergency decision remains with authorized human personnel.

---

# 4. Overall GenAI Architecture

```text id="9m4y5q"
                         USER
                           │
                           ▼
                  ┌─────────────────┐
                  │ GenAI Copilot   │
                  └────────┬────────┘
                           │
                    Understand Query
                           │
                           ▼
                  ┌─────────────────┐
                  │ Context / Tool  │
                  │ Selection       │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        Live System      Knowledge     ML Results
           Data            Base
              │            │            │
              └────────────┼────────────┘
                           ▼
                   Context Builder
                           │
                           ▼
                        LLM API
                           │
                           ▼
                  Response Validation
                           │
                           ▼
                     User Response
```

---

# 5. GenAI Technology

The project will use an external or hosted Large Language Model through:

- Hugging Face
- Groq

The final provider/model can be selected based on:

- Availability
- Cost
- Latency
- Context-window requirements
- Tool/function-calling support
- Multilingual performance
- Prototype limits

The architecture will remain provider-independent so that changing the LLM provider does not require redesigning the application.

---

# 6. Why the LLM Is Not Directly Connected to MongoDB

The LLM should not receive unrestricted database access.

Instead:

```text id="9s2xqy"
User Question
      ↓
GenAI
      ↓
Backend Tool
      ↓
Validated Database Query
      ↓
Structured Result
      ↓
GenAI
      ↓
Answer
```

This provides a controlled boundary between the language model and operational data.

---

# 7. Tool-Based Architecture

The backend will expose controlled tools/functions to the GenAI layer.

Potential tools include:

```text id="58c1o3"
getCurrentRisk()
getZoneDetails()
getRiskTrend()
getSensorReadings()
getWeather()
getNearbyVillages()
getNearbyRoads()
getRecentReports()
getHistoricalEvents()
getActiveAlerts()
getDeviceStatus()
```

The exact tools will be implemented as backend services rather than directly exposing database operations.

---

# 8. Example Natural-Language Query

User:

> Which areas are at critical risk right now?

The flow:

```text id="jv39yp"
User
 ↓
GenAI
 ↓
Recognizes need for live risk data
 ↓
getCurrentRisk()
 ↓
Backend
 ↓
MongoDB
 ↓
Current risk zones
 ↓
GenAI
 ↓
Natural-language response
```

The model does not guess which zones are currently critical.

---

# 9. Structured Context

The backend should provide structured information to GenAI.

Example:

```json id="7q4wz4"
{
  "zoneId": "ZONE001",
  "riskScore": 84,
  "riskLevel": "critical",
  "eventProbability": 0.84,
  "rainfall24h": 184,
  "soilMoisture": 81,
  "slope": 37,
  "historicalEvents": 3,
  "topFactors": [
    "High cumulative rainfall",
    "High soil moisture",
    "Steep slope"
  ]
}
```

This is much safer than sending uncontrolled raw data.

---

# 10. Risk Explanation

One of the most important GenAI capabilities is explaining ML results.

Example:

### User

> Why is Zone Z001 critical?

### Backend data

```text id="3r7hfh"
Risk Score: 84
Event Probability: 84%

Rainfall: High
Soil Moisture: High
Slope: 37°
Historical Events: 3
Recent Movement: Detected
```

### GenAI

The zone is currently classified as critical because it is experiencing high cumulative rainfall and high soil moisture, combined with steep terrain and recent slope movement. Historical landslide activity in the area also increases concern.

The response is generated from validated system data.

---

# 11. Risk Trend Explanation

GenAI can explain changing risk.

Example:

```text id="3j3kn3"
10:00 → 42
11:00 → 49
12:00 → 61
13:00 → 73
14:00 → 84
```

User:

> Why has Zone A's risk increased?

The system can retrieve:

- Risk history
- Rainfall trend
- Soil moisture trend
- Movement data
- Recent reports

and explain the increase.

---

# 12. Natural-Language Monitoring

Authorities should not need to manually search multiple dashboards for every question.

Examples:

> Show me all critical zones.

> Which areas have rapidly increasing risk?

> Which villages are near critical zones?

> Which roads may be affected?

> Which sensors are offline?

> What changed in the last six hours?

The GenAI layer translates these questions into controlled backend operations.

---

# 13. GenAI Tool-Calling Flow

```text id="4d1d6c"
Natural Language Question
          ↓
      Intent Detection
          ↓
       Tool Selection
          ↓
     Backend Function
          ↓
     Validated Data
          ↓
     Context Builder
          ↓
          LLM
          ↓
       Final Answer
```

---

# 14. Multi-Step Queries

Some questions require multiple tools.

Example:

> Which critical zones have nearby villages and roads?

The system can perform:

```text id="5d2k8u"
getCurrentRisk()
       ↓
Critical Zones
       ↓
getNearbyVillages()
       +
getNearbyRoads()
       ↓
Combined Context
       ↓
GenAI
       ↓
Answer
```

The backend controls which data can be accessed.

---

# 15. RAG Architecture

The system can use **Retrieval-Augmented Generation (RAG)** for trusted disaster-management knowledge.

The knowledge base may contain:

- Disaster-management SOPs
- Emergency response guidelines
- Landslide-management guidelines
- Preparedness procedures
- Relevant official documents

Architecture:

```text id="9j85j0"
User Question
      ↓
Knowledge Retrieval
      ↓
Relevant Documents
      ↓
Context
      ↓
LLM
      ↓
Answer
```

---

# 16. RAG and Live Data Are Different

This distinction is important.

### RAG answers:

> What should an authority generally do according to the relevant procedure?

### Live tools answer:

> What is happening right now?

For example:

```text id="k2zyhk"
"What is the current risk?"
        ↓
Live system data

"What does the emergency SOP recommend?"
        ↓
RAG knowledge base
```

A query may use both.

---

# 17. Combined RAG + Live Data

Example:

> Zone A is critical. What does the applicable response procedure recommend?

Flow:

```text id="s4b0pl"
Current Risk
     ↓
Backend Tool
     ↓
Risk = Critical
     │
     ├──────────────┐
     ▼              ▼
Live Data          RAG
     │              │
     └──────┬───────┘
            ▼
           LLM
            ↓
     Contextual Answer
```

This is one of the strongest applications of GenAI in the project.

---

# 18. Knowledge Retrieval Architecture

For the prototype, the knowledge base should remain lightweight.

Possible architecture:

```text id="n2p3ag"
Official Documents
       ↓
Text Extraction
       ↓
Chunking
       ↓
Embeddings
       ↓
Vector Storage
       ↓
Similarity Search
       ↓
Relevant Context
       ↓
LLM
```

The exact vector database can be selected based on implementation simplicity.

MongoDB-compatible vector search may be used if supported by the selected deployment environment.

A separate vector database should not be introduced unless necessary.

---

# 19. Embeddings

Documents can be converted into vector representations using a suitable embedding model.

The embedding system should be selected based on:

- Language support
- Retrieval quality
- Speed
- Deployment simplicity

The exact embedding model is not mandatory to lock at this stage.

---

# 20. RAG Chunking

Long documents should not be sent to the LLM as complete files.

Instead:

```text id="xg2e8h"
Document
   ↓
Sections
   ↓
Chunks
   ↓
Embeddings
   ↓
Vector Index
```

When a question is asked, only relevant chunks are retrieved.

---

# 21. RAG Citation/Source Awareness

The system should retain document metadata such as:

- Document name
- Section
- Page/reference
- Source
- Version/date

This allows the GenAI response to indicate the basis of procedural information.

---

# 22. GenAI Prompt Architecture

The GenAI system should use a structured system prompt defining:

- Its role
- Available tools
- Data rules
- Safety boundaries
- Response format
- Uncertainty handling
- Emergency-decision limitations

Conceptually:

```text id="z8zqyr"
SYSTEM INSTRUCTIONS
       +
USER QUESTION
       +
LIVE DATA
       +
RAG CONTEXT
       +
ML RESULT
       ↓
      LLM
       ↓
VALIDATED RESPONSE
```

---

# 23. Context Priority

When multiple information sources exist, the priority should be:

```text id="8hz5cq"
1. Current validated system data
2. Current ML prediction
3. Verified field reports
4. Trusted knowledge-base information
5. General model knowledge
```

General LLM knowledge should not override live project data.

---

# 24. Hallucination Control

The system should reduce hallucination through:

### Tool access

Live information comes from backend functions.

### Structured context

The LLM receives validated data.

### RAG

Procedural answers can use trusted documents.

### Explicit uncertainty

If information is unavailable, the model should say so.

Example:

> Satellite data for this zone is currently unavailable, so the explanation does not include satellite-derived information.

It should never fabricate the missing value.

---

# 25. No-Data Behaviour

If the user asks:

> What is the soil moisture in Zone A?

and the sensor is offline:

The system should respond:

> The latest soil-moisture reading for Zone A is unavailable because the associated sensor is currently offline. The last recorded reading was X at time Y.

It should not invent a current value.

---

# 26. Emergency Safety

GenAI responses involving emergency situations should be carefully framed.

Instead of:

> Evacuate Zone A immediately.

The system should produce information such as:

> Zone A is currently classified as critical. The system indicates high cumulative rainfall, high soil moisture and recent slope movement. Authorized disaster-management personnel should review the situation and follow the applicable emergency procedures.

This preserves human authority.

---

# 27. Alert Generation

GenAI can help convert structured alert information into readable messages.

Example input:

```text id="u9q7o6"
Zone: Z001
Risk: Critical
Score: 84
Rainfall: High
Soil Moisture: High
```

GenAI can generate:

> **Critical Landslide Risk Alert:** Zone Z001 is currently classified as critical due to high cumulative rainfall, high soil moisture and steep terrain. Authorities are advised to review the zone and follow applicable emergency procedures.

The alert engine still controls whether the alert is actually sent.

---

# 28. Multilingual Alerts

The same structured alert can be converted into supported languages.

```text id="8fn7jl"
Structured Alert
      ↓
GenAI
      ↓
English
Hindi
Assamese
Other supported languages
```

Translations should preserve:

- Location
- Severity
- Risk score where appropriate
- Time
- Important safety wording

Numerical values must not be altered during translation.

---

# 29. Situation Report Generation

Authorities can request:

> Generate a situation report for the last six hours.

The system can retrieve:

- Risk changes
- Active alerts
- Sensor conditions
- Weather
- Field reports
- Road incidents
- New landslide observations

Then GenAI can produce:

```text id="j14r2f"
SITUATION REPORT

Period:
...

Critical Zones:
...

High-Risk Zones:
...

Major Changes:
...

Field Reports:
...

Weather:
...

Sensor Issues:
...

Areas Requiring Attention:
...
```

---

# 30. Field Report Analysis

GenAI can assist with submitted reports.

Example:

```text id="m7d4i6"
Photo + Description
        ↓
Backend
        ↓
GenAI
        ↓
Structured Summary
```

Possible outputs:

- Report category
- Summary
- Key observations
- Possible severity
- Missing information

The result should remain reviewable by a human officer.

---

# 31. Image Analysis

If a multimodal model is available, GenAI may assist with images submitted by field users.

For example, an image may contain visible:

- Ground cracks
- Rockfall
- Blocked roads
- Surface damage

However, image analysis should be treated as **decision support**, not definitive geological diagnosis.

The system should avoid claiming certainty from an image alone.

---

# 32. GenAI API Architecture

The Node.js backend can expose endpoints such as:

```text id="gj5tyh"
/api/ai/chat
/api/ai/explain-risk
/api/ai/analyze-report
/api/ai/generate-alert
/api/ai/generate-report
```

These endpoints remain behind authentication and authorization.

---

# 33. `/api/ai/chat`

Purpose:

General Disaster Management Copilot interaction.

Example:

```text id="m4w3ur"
POST /api/ai/chat
```

Request:

```json id="4eq3g6"
{
  "message": "Which areas are at critical risk right now?"
}
```

The backend determines which tools are required.

---

# 34. `/api/ai/explain-risk`

Purpose:

Generate an explanation for a specific ML prediction.

Input:

```json id="e4c1pl"
{
  "zoneId": "ZONE001"
}
```

Backend retrieves:

- Current prediction
- SHAP factors
- Sensor information
- Weather
- Historical information

and provides the validated context to GenAI.

---

# 35. `/api/ai/analyze-report`

Purpose:

Assist with field/citizen report analysis.

Input may contain:

- Description
- Location
- Image reference
- Report type

Output may contain:

- Summary
- Suggested classification
- Important observations
- Missing information

---

# 36. `/api/ai/generate-alert`

Purpose:

Generate readable alert content from structured alert information.

The alert engine remains responsible for triggering and distributing the alert.

---

# 37. `/api/ai/generate-report`

Purpose:

Generate a structured disaster situation report from selected operational data.

---

# 38. GenAI Authentication

Only authenticated and authorized users should be able to access operational GenAI features.

For example:

```text id="5azqsv"
Citizen
   ↓
Limited queries

Field Officer
   ↓
Operational queries

Authority
   ↓
Full monitoring + reporting queries

Administrator
   ↓
Full system access
```

Permissions should be enforced by the backend.

---

# 39. Data Privacy

The GenAI service should receive only the information required to answer the request.

Sensitive or unnecessary information should not be included in prompts.

For example, when explaining a risk zone, the LLM does not need:

- User passwords
- Authentication tokens
- Unrelated personal information

---

# 40. API Key Security

GenAI API credentials must remain server-side.

```text id="l72ekq"
React
   ↓
Node Backend
   ↓
Hugging Face / Groq
```

Not:

```text id="wq8kn1"
React
   ↓
Groq API Key
```

The client must never contain provider secrets.

---

# 41. GenAI Response Structure

For operational queries, responses can internally follow a structured format such as:

```json id="x45d7v"
{
  "answer": "...",
  "dataSources": [
    "current_risk",
    "sensor_data"
  ],
  "confidence": "high",
  "warnings": [],
  "requiresHumanReview": true
}
```

The frontend can then present the response naturally.

---

# 42. Grounding Metadata

The backend should track which sources were used.

For example:

```text id="q2n5qs"
Answer generated using:

✓ Current risk prediction
✓ Sensor readings
✓ Historical events
✓ Weather information
```

This increases transparency.

---

# 43. GenAI Latency

GenAI should not block the core monitoring system.

For example:

```text id="1m3knh"
Sensor
 ↓
ML
 ↓
Risk
 ↓
Alert
```

should work independently.

If GenAI takes several seconds:

```text id="fkj4pr"
GenAI response delayed
```

the risk monitoring system continues operating.

---

# 44. GenAI Failure Handling

If the GenAI provider is unavailable:

```text id="d9p7p3"
GenAI unavailable
       ↓
ML continues
       ↓
GIS continues
       ↓
Alerts continue
       ↓
Dashboard continues
```

The system should display:

> Disaster Management Copilot is temporarily unavailable.

It should not fabricate an AI response.

---

# 45. Provider Abstraction

The backend should use a provider abstraction.

Conceptually:

```text id="d5ts5f"
              GenAI Service
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     Hugging Face           Groq
```

The rest of the application should not need to know which provider is currently active.

This makes switching providers easier.

---

# 46. Prompt Injection Protection

Because users can submit arbitrary text, the system should treat user input as untrusted.

The GenAI layer should:

- Keep system instructions separate
- Restrict available tools
- Validate tool arguments
- Never expose secrets
- Never execute arbitrary commands
- Restrict database access to predefined backend functions

---

# 47. Tool Authorization

Not every user should have access to every tool.

Example:

```text id="z6p4q8"
Citizen
  ├── getCurrentRisk ✓
  ├── getNearbyRisk ✓
  └── getAllSensorData ✗

Authority
  ├── getCurrentRisk ✓
  ├── getSensorReadings ✓
  ├── getReports ✓
  └── generateSituationReport ✓
```

The backend performs the final authorization check.

The LLM cannot grant itself permissions.

---

# 48. GenAI Observability

The system should log:

- Request ID
- User role
- Tool calls
- Response status
- Provider used
- Latency
- Errors
- Token usage where available

Sensitive prompt content should not be unnecessarily logged.

---

# 49. GenAI Evaluation

The GenAI subsystem should be evaluated for:

### Groundedness

Does the answer use the provided data?

### Factual accuracy

Does it correctly represent system information?

### Tool accuracy

Did it retrieve the correct data?

### Hallucination rate

Does it invent unavailable information?

### Instruction following

Does it respect safety boundaries?

### Multilingual quality

Does translation preserve meaning?

---

# 50. Test Questions

The prototype should include test queries such as:

### Current Risk

> Which zones are currently critical?

### Explanation

> Why is Zone A critical?

### Trend

> Which areas have increased in risk during the last six hours?

### Sensor

> Which sensors are currently offline?

### Geography

> Which villages are near the highest-risk zone?

### History

> Has this area experienced landslides before?

### Procedure

> What does the relevant emergency procedure recommend for this type of situation?

### Report

> Summarize the latest field reports.

---

# 51. Incorrect-Data Tests

The GenAI system should also be tested with questions where data is unavailable.

Example:

> What is the current soil moisture in Zone Z999?

If no reading exists:

```text id="4pvk8w"
Expected:

"No current soil-moisture reading is available
for Zone Z999."
```

Not:

```text id="9w3t8a"
"Soil moisture is approximately 70%."
```

---

# 52. Emergency Decision Test

Question:

> Should we evacuate Zone A immediately?

Expected behavior:

The system should provide:

- Current risk
- Relevant contributing factors
- Applicable procedural information
- Recommendation to consult authorized emergency personnel

It should not represent itself as the final decision-maker.

---

# 53. GenAI Architecture During SIH Demo

The demonstration should use:

```text id="l2pfup"
Authority
   ↓
"Why is Zone A critical?"
   ↓
GenAI
   ↓
Backend Tool
   ↓
Current ML Result
   ↓
SHAP Factors
   ↓
GenAI Explanation
```

Then:

```text id="g8w6ak"
Authority
   ↓
"Generate a situation report."
   ↓
Live Risk
+ Alerts
+ Weather
+ Reports
+ Sensors
   ↓
GenAI
   ↓
Situation Report
```

This clearly demonstrates that GenAI is connected to the actual disaster-management platform rather than being a generic chatbot.

---

# 54. GenAI MVP

The mandatory prototype GenAI functionality will include:

1. Disaster Management Copilot
2. Risk explanation
3. Current-risk natural-language queries
4. Backend tool calling
5. Structured ML-result context
6. Basic RAG knowledge base
7. Situation-report generation
8. Alert message generation
9. Basic multilingual capability
10. Hallucination/failure controls

---

# 55. Advanced GenAI Features

If time permits:

- Multimodal field-report analysis
- Advanced image understanding
- More sophisticated tool planning
- Automated daily situation reports
- More languages
- More extensive RAG knowledge base
- Conversational incident tracking

These remain secondary to the core system.

---

# 56. Nine-Day GenAI Implementation Plan

## Day 1–2

- Select provider
- Set up backend GenAI service
- Create system prompt
- Define safety rules

## Day 3

- Implement `/api/ai/chat`
- Basic LLM integration

## Day 4

- Implement risk explanation
- Connect ML results

## Day 5

- Implement backend tools
- Current-risk queries

## Day 6

- RAG knowledge base
- Situation reports

## Day 7

- Alert generation
- Multilingual output
- Basic report analysis

## Day 8

- Security
- Hallucination testing
- Failure handling

## Day 9

- Final integration
- Demo questions
- Freeze prompts/tools

---

# 57. Final GenAI Architecture

```text id="7b8xpw"
                         USER
                           │
                           ▼
                 ┌───────────────────┐
                 │ Disaster          │
                 │ Management        │
                 │ Copilot           │
                 └─────────┬─────────┘
                           │
                           ▼
                    Query Understanding
                           │
                           ▼
                  ┌────────────────────┐
                  │ Backend Tool Layer │
                  └─────────┬──────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
     Live Risk          Sensor/Data        Reports
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                     Context Builder
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
       ML + SHAP Results             RAG Knowledge
              │                           │
              └─────────────┬─────────────┘
                            ▼
                     LLM Provider
                  Hugging Face / Groq
                            │
                            ▼
                    Response Validation
                            │
                            ▼
                         USER
```

---

# 58. Final GenAI Technical Decisions

| Component | Decision |
|---|---|
| GenAI role | Disaster Management Copilot |
| Prediction | AI/ML, not GenAI |
| LLM provider | Hugging Face and/or Groq |
| Provider architecture | Provider-independent |
| Live data access | Backend tools |
| Database access | Indirect, controlled |
| RAG | Yes |
| Knowledge source | Trusted disaster-management documents |
| Risk explanation | Yes |
| Natural-language queries | Yes |
| Situation reports | Yes |
| Alert generation | Yes |
| Translation | Yes |
| Field-report assistance | Yes |
| Image analysis | Optional |
| Tool calling | Yes |
| Structured context | Yes |
| Hallucination controls | Yes |
| Human-in-the-loop | Mandatory |
| Autonomous emergency action | No |
| Client-side API keys | No |
| Failure dependency | None for core monitoring |
| Vector database | Keep lightweight / MongoDB-compatible where practical |
| Heavy MLOps | No |

---

# 59. Final GenAI Role in the Complete System

The final intelligence architecture is:

```text id="7k7j5r"
                REAL-WORLD DATA
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
    Hardware       Weather       Satellite
       │              │              │
       └──────────────┼──────────────┘
                      ▼
                 Node Backend
                      │
                      ▼
                  MongoDB
                      │
                      ▼
                  AI/ML Model
                      │
                      ▼
             Risk + Probability
                      │
                      ▼
                    SHAP
                      │
                      ▼
             Validated Context
                      │
                      ▼
                   GenAI
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
    Explain        Summarize       Query
       │              │              │
       ▼              ▼              ▼
    Translate       Reports        Assist
                      │
                      ▼
              HUMAN AUTHORITY
```

---

# 60. Final Technical Statement

Generative AI will be implemented as a **Disaster Management Copilot** on top of the project's validated operational data.

The AI/ML subsystem will independently analyse rainfall, soil moisture, satellite-derived features, terrain/slope information and historical landslide records to generate landslide-event probability, risk scores and explainable contributing factors.

The GenAI subsystem will consume these validated results through controlled backend APIs and tools. It will retrieve live operational information when required, retrieve relevant disaster-management guidance through RAG, and use a Large Language Model from a provider such as Hugging Face or Groq to generate understandable explanations, natural-language answers, situation reports, alerts and multilingual communication.

The GenAI system will never be responsible for the primary numerical prediction and will not independently perform emergency actions. It will remain a decision-support layer operating under controlled backend access and human authority.

The final intelligence chain is:

**Data → ML Prediction → Explainable Risk → GenAI Assistance → Human Decision**