# AI/ML Technical Document

## AI-Based Early Warning and Landslide Risk Monitoring System in the North Eastern Region

---

# 1. Document Purpose

This document defines the complete Artificial Intelligence and Machine Learning architecture for the proposed landslide early-warning and risk-monitoring system.

The AI/ML subsystem directly addresses the requirement to:

- Collect and analyse rainfall patterns
- Analyse soil-moisture sensor data
- Analyse satellite imagery
- Analyse terrain/slope data
- Analyse historical landslide records
- Identify high-risk zones
- Predict possible landslide events

The AI/ML system will transform these heterogeneous data sources into a unified spatial-temporal dataset and use supervised machine-learning models to estimate landslide-event probability and risk.

---

# 2. AI/ML Objective

The AI/ML subsystem has two primary objectives.

## Objective 1 – High-Risk Zone Identification

Identify geographic areas where the combination of terrain susceptibility and current environmental conditions indicates elevated landslide risk.

## Objective 2 – Possible Landslide Event Prediction

Estimate the probability that a landslide event may occur within the defined prediction window based on current and recent conditions.

The system therefore produces:

```text
Geographic Zone
       ↓
Current Conditions
       ↓
AI/ML Analysis
       ↓
Event Probability
       ↓
Risk Score
       ↓
Risk Classification
```

---

# 3. AI/ML Design Principle

The project will not use Generative AI as the primary prediction mechanism.

The responsibilities are separated:

### Machine Learning

**Predicts the risk.**

### Generative AI

**Explains the risk and assists the authority.**

Therefore:

```text
ML:
"What is the risk?"

GenAI:
"Why is the risk high and what does it mean?"
```

This separation improves reliability and makes the system easier to validate.

---

# 4. Mandatory Data Sources

The AI/ML system will use five primary data categories specified by the problem statement.

## 4.1 Rainfall Patterns

Rainfall is one of the most important dynamic triggers for landslide events.

Potential features include:

- 1-hour rainfall
- 3-hour rainfall
- 6-hour rainfall
- 12-hour rainfall
- 24-hour rainfall
- 48-hour rainfall
- 72-hour rainfall
- Rainfall intensity
- Cumulative rainfall
- Rainfall trend
- Rainfall anomaly relative to historical conditions
- Forecast rainfall where available

---

# 5. Soil Moisture Data

Soil moisture provides information about ground saturation.

Potential features include:

- Current soil moisture
- Soil moisture percentage
- Change from previous reading
- Rate of increase
- Rolling average
- Maximum recent moisture
- Duration above a saturation level

Example:

```text
Previous soil moisture = 55%

Current soil moisture = 78%

Increase = +23%
```

Rapid increases can provide additional information about changing ground conditions.

---

# 6. Satellite Imagery

Satellite imagery provides large-area environmental information that cannot be obtained from individual sensors.

Satellite data may be used for:

- Vegetation changes
- Land-cover changes
- Surface changes
- Moisture-related indicators
- Terrain/environmental change
- Other relevant remotely sensed features

For the initial system, satellite imagery will be converted into useful numerical features before being passed to the primary tabular ML models.

```text
Satellite Image
      ↓
Preprocessing
      ↓
Image/Index Analysis
      ↓
Feature Extraction
      ↓
Numerical Features
      ↓
ML Dataset
```

---

# 7. Terrain and Slope Data

Terrain information provides relatively static information about landslide susceptibility.

Potential features include:

- Elevation
- Slope angle
- Aspect
- Terrain characteristics
- Other derived terrain variables where available

Example:

```text
Zone Z001

Elevation = 1240 m
Slope = 37°
Aspect = 145°
```

Terrain features provide context for interpreting dynamic conditions such as rainfall and soil moisture.

---

# 8. Historical Landslide Records

Historical landslide records are essential for supervised learning.

They provide:

### Training labels

Whether a landslide event occurred.

```text
Landslide = 1
```

or:

```text
Landslide = 0
```

They also provide historical features such as:

- Previous event count
- Event frequency
- Time since previous event
- Historical severity
- Historical location
- Associated rainfall
- Historical environmental conditions

Therefore, historical records serve both as:

**prediction targets + historical susceptibility information.**

---

# 9. Unified Dataset

The five data sources will be aligned into a unified spatial-temporal dataset.

Each training record represents a geographic area at a particular point or period in time.

Example:

```text
Zone ID              Z001
Timestamp            2026-08-15 14:00

Rainfall_1h          32 mm
Rainfall_6h          91 mm
Rainfall_24h         184 mm
Rainfall_72h         310 mm

SoilMoisture         81%
SoilMoistureChange   +14%

Elevation             1240 m
Slope                 37°
Aspect                145°

SatelliteChange      0.73
VegetationChange     0.41

PreviousEvents       3
DaysSinceLastEvent   420

LandslideOccurred    1
```

This structure allows information from different sources to be combined.

---

# 10. Spatial Alignment

Different datasets have different geographic resolutions.

For example:

- Sensor → specific point
- Satellite → pixel/grid
- Terrain → raster/grid
- Historical event → geographic point/polygon
- Rainfall → station/grid/API location

The system will map these sources to a common geographic representation.

Conceptually:

```text
Sensor
   ↓
Nearest / Associated Zone

Satellite Pixel
   ↓
Associated Zone

Terrain Grid
   ↓
Associated Zone

Historical Event
   ↓
Associated Zone
```

The exact spatial resolution will depend on the availability and resolution of the datasets.

---

# 11. Temporal Alignment

Data sources also operate at different time intervals.

For example:

```text
Sensor          → minutes
Weather         → hourly
Satellite       → periodic
Historical      → event-based
Terrain         → mostly static
```

The system will align data into suitable prediction windows.

Example:

```text
Zone Z001
Prediction time: 14:00

Rainfall:
Last 1h
Last 6h
Last 24h
Last 72h

Soil:
Current
Previous
Trend

Satellite:
Latest available

Terrain:
Static

History:
Previous events
```

---

# 12. Dataset Architecture

The AI/ML dataset pipeline will contain:

```text
/raw
    ↓
/processed
    ↓
/features
    ↓
/train
/validation
/test
```

### Raw

Original source data.

### Processed

Cleaned and aligned data.

### Features

ML-ready features.

### Train

Training data.

### Validation

Model-selection data.

### Test

Final unseen evaluation data.

Raw data should be retained so that preprocessing can be reproduced.

---

# 13. Data Quality

Before training or inference, the pipeline should check:

- Missing values
- Invalid measurements
- Impossible values
- Duplicate records
- Incorrect timestamps
- Invalid coordinates
- Sensor failures
- Satellite data availability
- Data-source consistency

Example:

```text
Rainfall = -25 mm
```

should be flagged as invalid.

The system should not silently treat invalid measurements as real observations.

---

# 14. Missing Data

Missing information is expected in a real-world disaster-monitoring system.

Example:

```text
Rainfall        ✓
Soil Moisture   ✓
Terrain         ✓
Historical      ✓
Satellite       ✗
```

The pipeline may use appropriate imputation techniques where scientifically reasonable.

However:

- Missing satellite data must not be fabricated.
- Data availability should be recorded.
- Excessive missing information should reduce prediction reliability.
- The model output should expose data completeness where appropriate.

Example:

```json
{
  "riskScore": 78,
  "riskLevel": "high",
  "dataCompleteness": 0.82
}
```

---

# 15. Feature Engineering

Feature engineering is a core component of the AI/ML pipeline.

Raw measurements will be converted into meaningful predictive variables.

---

# 16. Rainfall Features

The system may calculate:

```text
rainfall_1h
rainfall_3h
rainfall_6h
rainfall_12h
rainfall_24h
rainfall_48h
rainfall_72h
```

Additional features:

```text
rainfall_intensity
rainfall_trend
rainfall_anomaly
```

This allows the model to understand both the magnitude and persistence of rainfall.

---

# 17. Soil Moisture Features

Potential derived features:

```text
current_soil_moisture
soil_moisture_change
soil_moisture_rate
soil_moisture_rolling_average
soil_moisture_max_recent
```

These features help identify increasing ground saturation.

---

# 18. Terrain Features

Terrain features include:

```text
elevation
slope
aspect
terrain_characteristics
```

Additional derived terrain variables may be introduced when suitable datasets are available.

---

# 19. Historical Features

Potential historical features:

```text
previous_landslide_count
event_frequency
days_since_last_event
historical_severity
historical_rainfall_association
```

These help the model understand whether a zone has historically experienced landslide activity.

---

# 20. Satellite Features

Rather than directly feeding raw images into XGBoost, the system will derive structured features.

Potential features include:

```text
vegetation_index
vegetation_change
surface_change
land_cover_change
moisture_related_index
```

The exact indices will depend on the selected satellite source and available imagery.

---

# 21. Field Report Features

Field reports can provide additional evidence.

Potential derived features:

```text
recent_report_count
verified_crack_report
slope_movement_report
blocked_road_report
incident_density
```

Only validated or appropriately weighted reports should influence automated risk assessment.

---

# 22. Feature Vector

After processing, a zone may be represented as:

```text
[
 rainfall_1h,
 rainfall_6h,
 rainfall_24h,
 rainfall_72h,
 rainfall_intensity,
 soil_moisture,
 soil_moisture_change,
 elevation,
 slope,
 aspect,
 satellite_change,
 vegetation_change,
 previous_landslide_count,
 days_since_last_event,
 recent_report_count
]
```

This feature vector becomes the input to the ML model.

---

# 23. Machine Learning Approach

The primary ML paradigm will be:

**Supervised learning**

because historical landslide records provide labelled examples.

The basic problem is:

```text
Input:
Environmental + Terrain + Historical + Satellite + Field Features

Output:
Probability of landslide event
```

---

# 24. Primary ML Models

Three tree-based models will be evaluated.

## Model 1 – XGBoost

**Primary implementation candidate.**

Advantages:

- Strong tabular-data performance
- Handles nonlinear relationships
- Efficient
- Good with engineered features
- Works well with SHAP
- Fast inference

---

# 25. Model 2 – LightGBM

LightGBM will be evaluated against XGBoost.

Advantages:

- Fast training
- Fast inference
- Strong tabular-data performance
- Efficient for larger datasets

---

# 26. Model 3 – Random Forest

Random Forest will serve as the baseline model.

Its purpose is to establish a reference performance level.

If XGBoost or LightGBM cannot meaningfully outperform the baseline, the simpler model may be preferred.

---

# 27. Optional Advanced Models

If sufficient time-series or labelled satellite data is available, additional models may be evaluated.

Potential candidates include:

- MLP
- LSTM
- GRU
- Temporal models
- CNN-based satellite models
- Other suitable neural architectures

These are optional and will not be allowed to compromise the core system.

---

# 28. Final Model Selection

The final deployed model will not be selected simply because it is considered the most advanced.

The models will be evaluated:

```text
Random Forest
       ↓
XGBoost
       ↓
LightGBM
       ↓
Optional advanced model
       ↓
Validation
       ↓
Best suitable model
```

Selection criteria:

- Recall
- Precision
- F1-score
- PR-AUC
- ROC-AUC
- Calibration
- Robustness
- Inference speed
- Explainability
- Data requirements

---

# 29. Disaster-Specific Evaluation Priority

Accuracy alone is not sufficient.

Consider:

```text
Actual landslide = YES
Prediction = LOW
```

This is a dangerous false negative.

Therefore, the system will place strong emphasis on:

**Recall for High/Critical landslide events.**

At the same time, precision must be monitored to prevent excessive false alarms.

---

# 30. Evaluation Metrics

The model evaluation will include:

### Precision

Measures how many predicted events were actually relevant.

### Recall

Measures how many actual events were detected.

### F1 Score

Balances precision and recall.

### ROC-AUC

Measures classification discrimination.

### PR-AUC

Particularly useful when dangerous events are relatively rare.

### Confusion Matrix

Shows:

- True positives
- False positives
- True negatives
- False negatives

---

# 31. Class Imbalance

Landslide events may be significantly less frequent than normal conditions.

For example:

```text
Normal = 90%
Landslide = 10%
```

A naive model could achieve high accuracy while failing to detect landslides.

Therefore, the system may use:

- Class weighting
- Appropriate resampling
- Stratified validation
- Threshold tuning
- Precision/recall analysis

The chosen technique will depend on the actual dataset distribution.

---

# 32. Spatial Validation

Random splitting can create misleading results in geographic prediction.

Therefore, where possible, evaluation will use spatially separated areas.

Example:

```text
Training:
Zone A
Zone B
Zone C

Testing:
Zone D
```

This helps determine whether the model generalizes beyond areas it has already seen.

---

# 33. Temporal Validation

Where time-series data is available:

```text
Past data
   ↓
Training

Later data
   ↓
Testing
```

The model should not use future information when predicting the past.

This provides a more realistic evaluation of early-warning capability.

---

# 34. Data Leakage Prevention

The following must be avoided:

- Future rainfall information entering historical training samples
- Future satellite observations entering earlier predictions
- Duplicate event records appearing in train and test
- Geographic duplicates creating artificial performance
- Target information accidentally becoming a feature

All preprocessing must be designed around the prediction timestamp.

---

# 35. Prediction Output

The ML model will generate a structured prediction.

Example:

```json
{
  "zoneId": "ZONE001",
  "eventProbability": 0.84,
  "riskScore": 84,
  "riskLevel": "critical",
  "confidence": 0.87,
  "dataCompleteness": 0.94,
  "generatedAt": "2026-08-15T14:00:00"
}
```

---

# 36. Event Probability

The model's classification output will represent the estimated likelihood of the target event.

Example:

```text
Event probability = 0.84
```

This corresponds to:

```text
84%
```

where appropriate after model calibration.

The probability should be interpreted as a model estimate, not a guarantee that an event will occur.

---

# 37. Risk Score

The application will use a normalized:

**0–100 risk score**

Conceptually:

```text
Calibrated model probability
          ↓
       0–1
          ↓
        ×100
          ↓
     Risk Score
```

Example:

```text
0.84 → 84
```

---

# 38. Risk Classification

Initial application categories:

| Score | Level |
|---:|---|
| 0–25 | Low |
| 26–50 | Moderate |
| 51–75 | High |
| 76–100 | Critical |

These thresholds are configurable and may be recalibrated based on validation results and disaster-management requirements.

---

# 39. High-Risk Zone Identification

The system will identify zones based on current risk scores.

Example:

```text
ZONE A → 22 → LOW
ZONE B → 47 → MODERATE
ZONE C → 68 → HIGH
ZONE D → 84 → CRITICAL
```

GIS can then visualize:

```text
Critical zones
High-risk zones
Moderate zones
Low-risk zones
```

Authorities can prioritize monitoring accordingly.

---

# 40. Risk Ranking

Zones can be ranked by:

1. Risk score
2. Event probability
3. Recent risk increase
4. Population/infrastructure exposure where available
5. Nearby field reports
6. Road connectivity impact

Example:

```text
1. Zone D – 84 – Critical
2. Zone C – 76 – Critical
3. Zone F – 71 – High
4. Zone B – 64 – High
```

This can support response prioritization.

---

# 41. Risk Trend

The system should also track risk changes.

Example:

```text
10:00 → 42
11:00 → 49
12:00 → 61
13:00 → 73
14:00 → 84
```

This indicates rapidly increasing risk.

Trend features can also become inputs to the alert engine.

---

# 42. Explainable AI

The system will use **SHAP** for model explanation.

The purpose is to answer:

> Why did the model assign this risk?

Example:

```text
Risk Score: 84

Major contributors:

24h Rainfall        High contribution
Soil Moisture       High contribution
Slope               High contribution
Historical Events   Moderate contribution
Satellite Change   Moderate contribution
```

---

# 43. SHAP Pipeline

```text
Features
   ↓
Selected ML Model
   ↓
Prediction
   ↓
SHAP Explainer
   ↓
Feature Contributions
   ↓
Backend
   ↓
Dashboard / GenAI
```

The explanation should be presented as supporting information rather than claiming absolute causality.

---

# 44. Real-Time Inference

When new data arrives:

```text
New Sensor Data
      ↓
Backend
      ↓
Data Validation
      ↓
Feature Update
      ↓
ML Service
      ↓
Prediction
      ↓
Risk Update
```

This allows the risk state of monitored zones to be updated as new information becomes available.

---

# 45. ML Service Architecture

The AI/ML system will run as a Python service.

Suggested technologies:

- Python
- FastAPI
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- LightGBM
- SHAP

Architecture:

```text
Node.js Backend
      │
      │ HTTP Request
      ▼
Python FastAPI
      │
      ▼
Feature Processing
      │
      ▼
Loaded ML Model
      │
      ▼
Prediction
      │
      ▼
SHAP Explanation
      │
      ▼
Structured JSON
      │
      ▼
Node.js Backend
```

---

# 46. Training Pipeline

Training will be performed separately from real-time inference.

```text
Raw Data
   ↓
Cleaning
   ↓
Spatial Alignment
   ↓
Temporal Alignment
   ↓
Feature Engineering
   ↓
Train/Validation/Test Split
   ↓
Model Training
   ↓
Hyperparameter Tuning
   ↓
Evaluation
   ↓
Calibration
   ↓
Model Selection
   ↓
Model Version
```

---

# 47. Hyperparameter Optimization

For the prototype, hyperparameter optimization will remain lightweight.

Possible methods:

- Grid search
- Random search
- Cross-validation where appropriate
- Bayesian optimization if practical

The goal is to improve predictive performance without consuming excessive development time.

---

# 48. Model Versioning

Each deployed model should have a version.

Example:

```text
landslide_model_v1
landslide_model_v2
```

Metadata should include:

- Model type
- Training dataset version
- Features used
- Training period
- Evaluation metrics
- Creation date
- Model version

A heavy MLOps platform is not required for the prototype.

---

# 49. Retraining

For the SIH prototype:

**Retraining will be manual.**

New historical data can later be used for:

```text
New Data
   ↓
Data Validation
   ↓
Feature Generation
   ↓
Retraining
   ↓
Evaluation
   ↓
New Model Version
```

Automatic continuous retraining is outside the MVP.

---

# 50. Satellite ML Strategy

The satellite component has two possible levels.

## MVP

Use satellite-derived numerical features.

```text
Satellite
 ↓
Feature Extraction
 ↓
XGBoost / LightGBM
```

## Future

Use deep-learning vision models directly on satellite imagery.

```text
Satellite Image
 ↓
CNN / Vision Model
 ↓
Spatial Features
 ↓
Landslide Prediction
```

The second approach is not mandatory for the 9-day prototype.

---

# 51. Hardware Integration

Hardware readings enter the ML system through the central backend.

```text
Sensor
 ↓
Microcontroller
 ↓
Communication
 ↓
Node.js Backend
 ↓
MongoDB
 ↓
Feature Pipeline
 ↓
Python ML Service
```

This allows the same ML system to combine sensor readings with external datasets.

---

# 52. Weather Integration

Weather information can be included alongside hardware rainfall data.

For example:

```text
Local Sensor
     +
Weather API
     +
Historical Rainfall
     ↓
Rainfall Feature Engineering
     ↓
ML Model
```

This gives the model both local and broader rainfall context.

---

# 53. Citizen Report Integration

Citizen and field observations provide additional evidence.

Example:

```text
Existing risk = 63

New verified report:
"Large ground cracks observed"

        ↓

Risk monitoring triggered
        ↓
Potential reassessment
```

Reports should not directly force the model's output.

They provide additional evidence and can trigger human review or reassessment.

---

# 54. ML → Backend Integration

The Node.js backend calls the AI service.

Conceptually:

```text
POST /predict-risk
```

Request:

```json
{
  "zoneId": "ZONE001",
  "features": {
    "rainfall_1h": 32,
    "rainfall_24h": 184,
    "rainfall_72h": 310,
    "soilMoisture": 81,
    "soilMoistureChange": 14,
    "elevation": 1240,
    "slope": 37,
    "satelliteChange": 0.73,
    "previousEvents": 3
  }
}
```

Response:

```json
{
  "riskScore": 84,
  "eventProbability": 0.84,
  "riskLevel": "critical",
  "confidence": 0.87,
  "factors": [
    "High cumulative rainfall",
    "High soil moisture",
    "Steep slope",
    "Historical landslide activity"
  ]
}
```

The exact API schema will be defined in the Database/API Specification document.

---

# 55. ML → GIS Integration

After a prediction:

```text
ML
 ↓
Risk Score
 ↓
Backend
 ↓
Risk Zone
 ↓
GIS
```

The GIS layer updates the visual representation of that geographic area.

This allows authorities to immediately identify where risk is concentrated.

---

# 56. ML → Alert Integration

The alert engine receives the risk result.

```text
Risk = 84
     ↓
Critical
     ↓
Alert Engine
     ↓
Relevant Authority
```

The alert engine is responsible for notification logic.

The ML service itself should not send notifications directly.

---

# 57. ML → GenAI Integration

GenAI receives the structured ML result and supporting validated information.

```text
ML
 ↓
Risk Score
 ↓
SHAP Factors
 ↓
Backend
 ↓
GenAI
```

Example question:

> Why is Zone Z001 critical?

GenAI can use:

```text
Risk = 84
Rainfall = High
Soil Moisture = High
Slope = 37°
Historical Events = 3
```

and generate an understandable explanation.

---

# 58. AI/ML and GenAI Boundary

The system must maintain this boundary:

```text
                 AI/ML
                   │
                   ▼
           Numerical Prediction
                   │
                   ▼
              Risk Result
                   │
                   ▼
                GenAI
                   │
                   ▼
        Explanation / Summary
                   │
                   ▼
          Human Authority
```

GenAI must not modify the ML risk score.

---

# 59. Prediction Confidence

The system may expose a confidence or reliability indicator.

However, confidence must not be presented as certainty.

For example:

```text
Risk Score: 84
Model Probability: 0.84
Data Completeness: 94%
```

This allows authorities to understand the quality of the prediction.

---

# 60. Prediction Reliability

Reliability can be affected by:

- Missing sensor data
- Poor-quality historical data
- Missing satellite imagery
- Sensor malfunction
- Limited training examples
- Geographic distribution of training data

The system should therefore distinguish between:

**High predicted risk**

and

**High certainty of prediction.**

They are not the same thing.

---

# 61. AI/ML Failure Handling

If the ML service becomes unavailable:

```text
ML Service Down
      ↓
Backend detects failure
      ↓
Previous valid risk retained
      ↓
Dashboard indicates prediction-service status
```

The system must not invent a new prediction.

---

# 62. AI/ML Security

The ML service should not be directly exposed to the public internet unnecessarily.

Preferred architecture:

```text
Public Clients
      ↓
Node Backend
      ↓
Internal ML Service
```

Only validated backend requests should reach the prediction service.

---

# 63. AI/ML Performance Requirements

The inference pipeline should be fast enough to support near-real-time monitoring.

The target is not massive-scale inference during the SIH prototype.

Priority:

```text
Reliable prediction
      >
Complex architecture
```

The model should provide a prediction quickly enough that new sensor data can be reflected in the monitoring dashboard without significant delay.

---

# 64. Prototype Dataset Strategy

Because the system is an SIH prototype, the team may need to combine:

- Available historical datasets
- Publicly available environmental data
- Terrain/elevation datasets
- Satellite-derived information
- Weather data
- Prototype sensor data

The data source and time period should be documented.

Synthetic or simulated sensor data may be used for demonstration where live hardware data is unavailable, but it must be clearly identified as simulated.

---

# 65. Synthetic Data Rule

Synthetic data can help demonstrate the pipeline:

```text
Synthetic Sensor Data
        ↓
Backend
        ↓
ML Pipeline
        ↓
Dashboard
```

However, synthetic data should not be presented as actual field measurements.

The final presentation should clearly distinguish:

**Real data**

from

**Prototype/simulated data.**

---

# 66. AI/ML Development Workflow

The AI/ML member will follow:

```text
1. Collect datasets
        ↓
2. Understand variables
        ↓
3. Clean data
        ↓
4. Align spatially
        ↓
5. Align temporally
        ↓
6. Engineer features
        ↓
7. Build baseline
        ↓
8. Train Random Forest
        ↓
9. Train XGBoost
        ↓
10. Train LightGBM
        ↓
11. Evaluate
        ↓
12. Tune thresholds
        ↓
13. Select model
        ↓
14. Add SHAP
        ↓
15. Export model
        ↓
16. Build FastAPI service
        ↓
17. Integrate with backend
```

---

# 67. Nine-Day AI/ML Execution Plan

## Day 1

- Dataset discovery
- Define schema
- Identify data sources
- Set up Python environment

## Day 2

- Data collection
- Cleaning
- Initial exploratory analysis
- Historical-event labeling

## Day 3

- Spatial/temporal alignment
- Feature engineering
- Baseline model

## Day 4

- XGBoost
- LightGBM
- Random Forest comparison
- Initial evaluation

## Day 5

- Model tuning
- Threshold selection
- SHAP
- Risk scoring

## Day 6

- FastAPI inference service
- Backend integration

## Day 7

- GIS integration
- Alert integration
- GenAI context integration

## Day 8

- End-to-end testing
- Edge cases
- Missing data testing
- Prediction validation

## Day 9

- Model freeze
- Final metrics
- Demo dataset
- Documentation
- Presentation preparation

---

# 68. AI/ML MVP

The mandatory AI/ML prototype should demonstrate:

1. Five required data categories represented.
2. Unified dataset.
3. Feature engineering.
4. Historical-event labels.
5. Random Forest baseline.
6. XGBoost model.
7. LightGBM comparison.
8. Model evaluation.
9. Selected model.
10. Event probability.
11. 0–100 risk score.
12. Risk classification.
13. SHAP explanation.
14. FastAPI inference.
15. Node.js integration.
16. GIS integration.

---

# 69. Advanced Features if Time Permits

If the core system is stable, the AI team may add:

- Temporal models
- Advanced satellite feature extraction
- Forecast rainfall features
- Ensemble models
- Risk trend prediction
- Automated report analysis
- Advanced anomaly detection

These must not delay the primary prediction pipeline.

---

# 70. What the AI/ML System Will NOT Claim

The project should avoid claiming:

- Perfect landslide prediction
- Exact landslide timing
- Guaranteed prediction of every event
- Autonomous emergency decisions
- Fully production-ready government deployment
- Perfect satellite-based detection
- Guaranteed evacuation decisions

The system is an **AI-assisted risk monitoring and early-warning prototype**.

---

# 71. Final AI/ML Architecture

```text
                    REQUIRED DATA
                         │
      ┌──────────────────┼───────────────────┐
      │                  │                   │
   Rainfall         Soil Moisture        Satellite
      │                  │                   │
      └──────────────────┼───────────────────┘
                         │
                  Terrain / Slope
                         │
                 Historical Events
                         │
                 Field Observations
                         │
                         ▼
                DATA PREPROCESSING
                         │
                         ▼
              SPATIAL + TEMPORAL ALIGNMENT
                         │
                         ▼
                 FEATURE ENGINEERING
                         │
                         ▼
                  UNIFIED DATASET
                         │
                         ▼
                 MODEL TRAINING
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Random Forest       XGBoost          LightGBM
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                  MODEL EVALUATION
                         │
                         ▼
                 FINAL MODEL SELECTION
                         │
                         ▼
                    CALIBRATION
                         │
                         ▼
              EVENT PROBABILITY
                         │
                         ▼
                  RISK SCORE 0–100
                         │
                         ▼
                LOW/MODERATE/HIGH/
                    CRITICAL
                         │
                         ▼
                       SHAP
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
            GIS        ALERTS      GenAI
             │           │           │
             └───────────┼───────────┘
                         ▼
                 HUMAN AUTHORITY
```

---

# 72. Final Technical Decision

The AI/ML subsystem is therefore finalized as follows:

| Component | Final Decision |
|---|---|
| ML problem | Landslide risk + possible-event prediction |
| Mandatory data | Rainfall, soil moisture, satellite, terrain/slope, historical landslides |
| ML paradigm | Supervised learning |
| Primary model candidate | XGBoost |
| Comparison models | LightGBM + Random Forest |
| Advanced models | Optional, data-dependent |
| Dataset | Unified spatial-temporal dataset |
| Feature engineering | Mandatory |
| Satellite handling | Feature extraction for MVP |
| Target | Landslide event occurrence/probability |
| Risk score | 0–100 |
| Risk levels | Low / Moderate / High / Critical |
| Explainability | SHAP |
| Imbalance handling | Class weighting/resampling/threshold tuning as required |
| Validation | Spatial + temporal where possible |
| Main metrics | Recall, Precision, F1, PR-AUC, ROC-AUC |
| Critical priority | Recall for dangerous events |
| ML language | Python |
| ML API | FastAPI |
| Libraries | Pandas, NumPy, scikit-learn, XGBoost, LightGBM, SHAP |
| Model serving | Internal Python service |
| Model retraining | Manual for prototype |
| GenAI role | Explanation and decision support |
| Autonomous decisions | Not permitted |
| MLOps | Lightweight |
| Final model | Empirically selected after validation |

---

# 73. Final AI/ML Statement

The proposed AI/ML system will combine **rainfall patterns, soil-moisture sensor measurements, satellite-derived information, terrain/slope characteristics and historical landslide records** into a unified spatial-temporal dataset.

The system will perform data cleaning, spatial and temporal alignment and feature engineering before evaluating supervised machine-learning models including **Random Forest, XGBoost and LightGBM**. XGBoost will serve as the primary implementation candidate, while the final deployed model will be selected using validation results rather than being predetermined.

The selected model will estimate **possible landslide-event probability**, which will be calibrated and converted into a standardized **0–100 risk score** and corresponding Low, Moderate, High or Critical risk level. **SHAP-based explainability** will identify the major factors contributing to individual predictions.

The resulting prediction will be consumed by the central Node.js backend and made available to the **GIS visualization, alert engine, web dashboard, Android application and Generative AI Disaster Management Copilot**.

The AI/ML subsystem will provide predictive intelligence while keeping final emergency decisions under the control of authorized disaster-management personnel.