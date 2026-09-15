import {
  Search,
  Filter,
  Map,
  Layers,
  Plus,
  Minus,
  Navigation,
  AlertTriangle,
  X,
  ShieldCheck,
  CheckCircle,
  XCircle,
  CloudRain,
  Info,
  MapPin,
  Activity,
} from 'lucide-react';

import './RiskMap.css';
import Sidebar from '../../components/Sidebar';

function RiskMap() {
  return (
    <div className='risk-map-page'>
      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className='map-sidebar'>
        <Sidebar />
      </aside>

      {/* =========================================
          MAIN
      ========================================= */}

      <main className='map-main'>
        {/* =========================================
            HERO / PAGE BANNER
        ========================================= */}

        <section className='risk-hero'>
          <div className='risk-hero-content'>
            <div className='risk-hero-icon'>
              <Map size={24} />
            </div>

            <div>
              <span className='risk-eyebrow'>LIVE MONITORING</span>

              <h1>RISK MAP</h1>

              <p>
                Monitor landslide risk levels across all monitored zones and
                locations.
              </p>
            </div>
          </div>

          <div className='risk-live-status'>
            <span></span>
            Live Monitoring
          </div>
        </section>

        {/* =========================================
            RISK OVERVIEW
        ========================================= */}

        <section className='risk-overview'>
          <div className='risk-stat'>
            <div className='risk-stat-icon zones'>
              <MapPin size={17} />
            </div>

            <strong>5</strong>

            <span>Monitored Zones</span>
          </div>

          <div className='risk-stat'>
            <div className='risk-stat-icon critical'>
              <AlertTriangle size={17} />
            </div>

            <strong className='critical-number'>2</strong>

            <span>Critical Zones</span>
          </div>

          <div className='risk-stat'>
            <div className='risk-stat-icon high'>
              <Activity size={17} />
            </div>

            <strong className='high-number'>1</strong>

            <span>High Risk</span>
          </div>

          <div className='risk-stat'>
            <div className='risk-stat-icon normal'>
              <ShieldCheck size={17} />
            </div>

            <strong className='normal-number'>2</strong>

            <span>Normal</span>
          </div>
        </section>

        {/* =========================================
            ALERT
        ========================================= */}

        <div className='risk-alert'>
          <div className='risk-alert-icon'>
            <AlertTriangle size={16} />
          </div>

          <div>
            <strong>2 zones reporting elevated risk</strong>

            <span>
              Check the map below for critical and high-risk locations.
            </span>
          </div>
        </div>

        {/* =========================================
            MAP CARD
        ========================================= */}

        <section className='map-card'>
          {/* MAP CARD HEADER */}

          <div className='map-card-header'>
            <div>
              <span className='section-label'>MONITORED AREA</span>

              <h2>Risk Monitoring Map</h2>

              <p>Live overview of landslide risk across monitored zones.</p>
            </div>

            <div className='map-last-update'>
              <span></span>
              Updated 10:24 AM
            </div>
          </div>

          {/* =========================================
              TOOLBAR
          ========================================= */}

          <div className='map-toolbar'>
            <div className='map-search'>
              <Search size={16} />

              <input
                type='text'
                placeholder='Search zone or location...'
              />
            </div>

            <button className='map-tool-button'>
              <Filter size={15} />
              Filters
            </button>

            <button className='map-tool-button'>
              <Layers size={15} />
              Layers
            </button>
          </div>

          {/* =========================================
              MAP
          ========================================= */}

          <div className='map-container'>
            <div className='terrain'>
              {/* ZONE A */}

              <div className='zone-marker critical zone-a'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone A</strong>
                  <span>CRITICAL</span>
                </div>
              </div>

              {/* ZONE B */}

              <div className='zone-marker moderate zone-b'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone B</strong>
                  <span>MODERATE</span>
                </div>
              </div>

              {/* ZONE C */}

              <div className='zone-marker low zone-c'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone C</strong>
                  <span>LOW</span>
                </div>
              </div>

              {/* ZONE D */}

              <div className='zone-marker high zone-d'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone D</strong>
                  <span>HIGH</span>
                </div>
              </div>

              {/* ZONE E */}

              <div className='zone-marker critical zone-e'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone E</strong>
                  <span>CRITICAL</span>
                </div>
              </div>
            </div>

            {/* MAP CONTROLS */}

            <div className='map-controls'>
              <button>
                <Plus size={17} />
              </button>

              <button>
                <Minus size={17} />
              </button>

              <button>
                <Navigation size={16} />
              </button>
            </div>

            {/* LEGEND */}

            <div className='map-legend'>
              <strong>Risk Level</strong>

              <div>
                <span className='legend-dot low-dot'></span>
                Low
              </div>

              <div>
                <span className='legend-dot moderate-dot'></span>
                Moderate
              </div>

              <div>
                <span className='legend-dot high-dot'></span>
                High
              </div>

              <div>
                <span className='legend-dot critical-dot'></span>
                Critical
              </div>
            </div>

            {/* SELECTED ZONE */}

            <div className='selected-zone-card'>
              <div className='selected-zone-header'>
                <div>
                  <span>SELECTED ZONE</span>
                  <h3>Zone A</h3>
                </div>

                <button>
                  <X size={15} />
                </button>
              </div>

              <div className='selected-risk'>
                <div>
                  <span>Risk Level</span>
                  <strong>CRITICAL</strong>
                </div>

                <div className='risk-score'>
                  84
                  <small>/100</small>
                </div>
              </div>

              <p>High landslide probability detected.</p>

              <a href='/zone-details'>View Zone Details →</a>
            </div>
          </div>
        </section>

        {/* =========================================
            SAFETY GUIDANCE
        ========================================= */}

        <section className='safety-guidance'>
          <div className='safety-header'>
            <div className='safety-title'>
              <div className='safety-icon'>
                <ShieldCheck size={19} />
              </div>

              <div>
                <span>FIELD SAFETY</span>
                <h2>Safety Guidance</h2>

                <p>
                  Follow these precautions when monitoring landslide-prone
                  areas.
                </p>
              </div>
            </div>

            <div className='stay-alert'>
              <Info size={14} />
              Stay Alert
            </div>
          </div>

          {/* SAFETY CARDS */}

          <div className='safety-grid'>
            {/* WARNING */}

            <div className='safety-card warning-card'>
              <div className='safety-card-heading'>
                <div className='safety-card-icon warning'>
                  <AlertTriangle size={17} />
                </div>

                <div>
                  <h3>Warning Signs</h3>
                  <span>Watch for these changes</span>
                </div>
              </div>

              <div className='safety-list'>
                <p>
                  <i></i>
                  New cracks appearing on roads or slopes
                </p>

                <p>
                  <i></i>
                  Sudden changes in water flow
                </p>

                <p>
                  <i></i>
                  Falling rocks or soil movement
                </p>

                <p>
                  <i></i>
                  Unusual ground deformation
                </p>
              </div>
            </div>

            {/* DO */}

            <div className='safety-card do-card'>
              <div className='safety-card-heading'>
                <div className='safety-card-icon do'>
                  <CheckCircle size={17} />
                </div>

                <div>
                  <h3>What to Do</h3>
                  <span>Recommended actions</span>
                </div>
              </div>

              <div className='safety-list'>
                <p>
                  <i></i>
                  Monitor official warnings and alerts
                </p>

                <p>
                  <i></i>
                  Follow evacuation instructions
                </p>

                <p>
                  <i></i>
                  Keep a safe distance from unstable slopes
                </p>

                <p>
                  <i></i>
                  Report new hazards immediately
                </p>
              </div>
            </div>

            {/* DON'T */}

            <div className='safety-card dont-card'>
              <div className='safety-card-heading'>
                <div className='safety-card-icon dont'>
                  <XCircle size={17} />
                </div>

                <div>
                  <h3>What to Avoid</h3>
                  <span>Important precautions</span>
                </div>
              </div>

              <div className='safety-list'>
                <p>
                  <i></i>
                  Do not approach an active landslide
                </p>

                <p>
                  <i></i>
                  Do not ignore critical alerts
                </p>

                <p>
                  <i></i>
                  Do not cross unstable roads or slopes
                </p>

                <p>
                  <i></i>
                  Do not return before official clearance
                </p>
              </div>
            </div>
          </div>

          {/* RAINFALL */}

          <div className='rainfall-note'>
            <div className='rainfall-icon'>
              <CloudRain size={17} />
            </div>

            <div>
              <strong>Heavy Rainfall Advisory</strong>

              <p>
                During prolonged or heavy rainfall, remain alert for sudden
                slope movement and changing ground conditions.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RiskMap;
