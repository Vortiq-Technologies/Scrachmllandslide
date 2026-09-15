import {
  ArrowLeft,
  MapPin,
  CloudRain,
  Droplets,
  Activity,
  Thermometer,
  Wind,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Brain,
  TrendingUp,
} from 'lucide-react';

import './ZoneDetails.css';
import Sidebar from '../../components/Sidebar';

function ZoneDetails() {
  return (
    <div className='zone-details-page'>
      <aside className='zone-sidebar'>
        <Sidebar />
      </aside>

      <main className='zone-main'>
        {/* Back */}

        <button
          className='back-button'
          onClick={() => (window.location.href = '/risk-map')}
        >
          <ArrowLeft size={17} />
          Back to Risk Map
        </button>

        {/* Header */}

        <div className='zone-header'>
          <div>
            <div className='zone-title'>
              <MapPin size={20} />

              <h1>Zone A</h1>

              <span className='critical-badge'>CRITICAL</span>
            </div>

            <p>High-risk landslide monitoring zone</p>
          </div>

          <div className='last-updated'>
            <Clock size={15} />
            Last updated: 10:24 AM
          </div>
        </div>

        {/* ================= RISK OVERVIEW ================= */}

        <section className='risk-overview'>
          {/* Risk Score */}

          <div className='risk-score-card'>
            <div className='card-heading'>
              <span>OVERALL RISK SCORE</span>

              <AlertTriangle size={18} />
            </div>

            <div className='big-score'>
              84
              <small>/100</small>
            </div>

            <p>Very high landslide risk</p>

            <div className='risk-progress'>
              <div></div>
            </div>
          </div>

          {/* Probability */}

          <div className='probability-card'>
            <div className='card-heading'>
              <span>LANDSLIDE PROBABILITY</span>

              <TrendingUp size={18} />
            </div>

            <div className='percentage'>84%</div>

            <p>Probability of landslide event</p>
          </div>

          {/* Confidence */}

          <div className='confidence-card'>
            <div className='card-heading'>
              <span>MODEL CONFIDENCE</span>

              <ShieldCheck size={18} />
            </div>

            <div className='percentage'>89%</div>

            <p>Prediction confidence</p>
          </div>
        </section>

        {/* ================= SENSOR DATA ================= */}

        <section className='section'>
          <div className='section-title'>
            <div>
              <h2>Environmental Conditions</h2>

              <p>Latest sensor readings from Zone A</p>
            </div>

            <span className='live-indicator'>
              <span></span>
              Live Data
            </span>
          </div>

          <div className='sensor-grid'>
            {/* Rainfall */}

            <div className='sensor-card'>
              <div className='sensor-icon rainfall'>
                <CloudRain size={20} />
              </div>

              <div className='sensor-info'>
                <span>Rainfall</span>

                <strong>32 mm</strong>

                <small>Last 1 hour</small>
              </div>
            </div>

            {/* Soil Moisture */}

            <div className='sensor-card'>
              <div className='sensor-icon moisture'>
                <Droplets size={20} />
              </div>

              <div className='sensor-info'>
                <span>Soil Moisture</span>

                <strong>78%</strong>

                <small>Above normal</small>
              </div>
            </div>

            {/* Tilt */}

            <div className='sensor-card'>
              <div className='sensor-icon tilt'>
                <Activity size={20} />
              </div>

              <div className='sensor-info'>
                <span>Slope / Tilt</span>

                <strong>6.8°</strong>

                <small>High movement</small>
              </div>
            </div>

            {/* Temperature */}

            <div className='sensor-card'>
              <div className='sensor-icon temperature'>
                <Thermometer size={20} />
              </div>

              <div className='sensor-info'>
                <span>Temperature</span>

                <strong>24°C</strong>

                <small>Normal range</small>
              </div>
            </div>

            {/* Humidity */}

            <div className='sensor-card'>
              <div className='sensor-icon humidity'>
                <Wind size={20} />
              </div>

              <div className='sensor-info'>
                <span>Humidity</span>

                <strong>86%</strong>

                <small>High</small>
              </div>
            </div>

            {/* Sensor Status */}

            <div className='sensor-card'>
              <div className='sensor-icon status'>
                <ShieldCheck size={20} />
              </div>

              <div className='sensor-info'>
                <span>Sensor Network</span>

                <strong>Online</strong>

                <small>6 / 6 sensors active</small>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RISK FACTORS ================= */}

        <section className='lower-grid'>
          {/* Main Risk Factors */}

          <div className='risk-factors-card'>
            <div className='section-title'>
              <div>
                <h2>Main Risk Factors</h2>

                <p>Factors influencing the current prediction</p>
              </div>

              <Brain size={20} />
            </div>

            <div className='factor-list'>
              <div className='factor'>
                <div className='factor-number'>01</div>

                <div className='factor-content'>
                  <strong>Heavy Rainfall</strong>

                  <span>32 mm rainfall recorded in the last hour</span>
                </div>

                <b>High</b>
              </div>

              <div className='factor'>
                <div className='factor-number'>02</div>

                <div className='factor-content'>
                  <strong>High Soil Moisture</strong>

                  <span>Soil moisture is significantly above normal</span>
                </div>

                <b>High</b>
              </div>

              <div className='factor'>
                <div className='factor-number'>03</div>

                <div className='factor-content'>
                  <strong>Slope Movement</strong>

                  <span>Increased tilt detected by sensor network</span>
                </div>

                <b>High</b>
              </div>
            </div>
          </div>

          {/* Zone Information */}

          <div className='zone-info-card'>
            <h2>Zone Information</h2>

            <div className='info-row'>
              <span>Location</span>

              <strong>Sikkim, India</strong>
            </div>

            <div className='info-row'>
              <span>Zone ID</span>

              <strong>ZONE-A-001</strong>
            </div>

            <div className='info-row'>
              <span>Monitoring Since</span>

              <strong>Jan 2026</strong>
            </div>

            <div className='info-row'>
              <span>Active Sensors</span>

              <strong>6 / 6</strong>
            </div>

            <div className='info-row'>
              <span>Model Version</span>

              <strong>v1.2</strong>
            </div>
          </div>
        </section>

        {/* ================= WARNING ================= */}

        <div className='zone-warning'>
          <AlertTriangle size={20} />

          <div>
            <strong>Critical Risk Detected</strong>

            <p>
              Current conditions indicate a high probability of landslide
              activity. Authorities should review this zone and take appropriate
              action.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ZoneDetails;
