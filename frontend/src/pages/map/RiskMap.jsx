import {
  Search,
  Filter,
  MapPin,
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
} from 'lucide-react';

import './RiskMap.css';
import Sidebar from '../../components/Sidebar';

function RiskMap() {
  return (
    <div className='risk-map-page'>
      {/* ================= SIDEBAR ================= */}

      <aside className='map-sidebar'>
        <Sidebar />
      </aside>

      {/* ================= MAIN ================= */}

      <main className='map-main'>
        {/* ================= HEADER ================= */}

        <div className='map-header'>
          <div>
            <h1>Risk Map</h1>

            <p>Monitor landslide risk across monitored zones</p>
          </div>

          <div className='map-header-status'>
            <span></span>
            Live Monitoring
          </div>
        </div>

        {/* ================= MAP SECTION ================= */}

        <section className='map-section'>
          {/* MAP TOOLBAR */}

          <div className='map-toolbar'>
            {/* SEARCH */}

            <div className='map-search'>
              <Search size={17} />

              <input
                type='text'
                placeholder='Search zone or location...'
              />
            </div>

            {/* FILTER */}

            <button className='map-filter-btn'>
              <Filter size={16} />
              Filters
            </button>

            {/* LAYERS */}

            <button className='map-layer-btn'>
              <Layers size={16} />
              Layers
            </button>
          </div>

          {/* ================= MAP ================= */}

          <div className='map-container'>
            {/* Fake terrain background */}

            <div className='terrain'>
              {/* ================= ZONE A ================= */}

              <div className='zone-marker critical zone-a'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone A</strong>
                  <span>CRITICAL</span>
                </div>
              </div>

              {/* ================= ZONE B ================= */}

              <div className='zone-marker moderate zone-b'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone B</strong>
                  <span>MODERATE</span>
                </div>
              </div>

              {/* ================= ZONE C ================= */}

              <div className='zone-marker low zone-c'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone C</strong>
                  <span>LOW</span>
                </div>
              </div>

              {/* ================= ZONE D ================= */}

              <div className='zone-marker high zone-d'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone D</strong>
                  <span>HIGH</span>
                </div>
              </div>

              {/* ================= ZONE E ================= */}

              <div className='zone-marker critical zone-e'>
                <div className='marker-pulse'></div>

                <div className='marker-dot'></div>

                <div className='marker-label'>
                  <strong>Zone E</strong>
                  <span>CRITICAL</span>
                </div>
              </div>
            </div>

            {/* ================= MAP CONTROLS ================= */}

            <div className='map-controls'>
              <button>
                <Plus size={18} />
              </button>

              <button>
                <Minus size={18} />
              </button>

              <button>
                <Navigation size={17} />
              </button>
            </div>

            {/* ================= MAP LEGEND ================= */}

            <div className='map-legend'>
              <h4>Risk Level</h4>

              <div className='legend-item'>
                <span className='legend-dot low-dot'></span>
                Low
              </div>

              <div className='legend-item'>
                <span className='legend-dot moderate-dot'></span>
                Moderate
              </div>

              <div className='legend-item'>
                <span className='legend-dot high-dot'></span>
                High
              </div>

              <div className='legend-item'>
                <span className='legend-dot critical-dot'></span>
                Critical
              </div>
            </div>

            {/* ================= SELECTED ZONE ================= */}

            <div className='selected-zone-card'>
              <div className='selected-zone-header'>
                <div>
                  <span className='selected-label'>SELECTED ZONE</span>

                  <h3>Zone A</h3>
                </div>

                <button>
                  <X size={16} />
                </button>
              </div>

              {/* RISK */}

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

        {/* ================= BOTTOM INFO ================= */}

        <div className='map-bottom-info'>
          <div>
            <strong>5</strong>
            <span>Monitored Zones</span>
          </div>

          <div>
            <strong className='critical-text'>2</strong>

            <span>Critical</span>
          </div>

          <div>
            <strong className='high-text'>1</strong>

            <span>High Risk</span>
          </div>

          <div>
            <strong className='normal-text'>2</strong>

            <span>Normal</span>
          </div>

          <p>Last updated: 10:24 AM</p>
        </div>

        {/* =====================================================
            SAFETY GUIDANCE
        ====================================================== */}

        <section className='safety-guidance'>
          {/* ================= SAFETY HEADER ================= */}

          <div className='safety-guidance-header'>
            <div className='safety-title-group'>
              <div className='safety-main-icon'>
                <ShieldCheck size={21} />
              </div>

              <div>
                <span>FIELD SAFETY</span>

                <h2>Safety Guidance</h2>

                <p>
                  Important information when monitoring or approaching
                  landslide-prone areas.
                </p>
              </div>
            </div>

            <div className='safety-info-badge'>
              <Info size={15} />
              Stay Alert
            </div>
          </div>

          {/* ================= SAFETY CARDS ================= */}

          <div className='safety-guidance-grid'>
            {/* ================= WARNING SIGNS ================= */}

            <div className='safety-info-card warning-signs'>
              <div className='safety-card-top'>
                <div className='safety-card-icon warning'>
                  <AlertTriangle size={18} />
                </div>

                <div>
                  <h3>Warning Signs</h3>

                  <span>Watch for these changes</span>
                </div>
              </div>

              <div className='safety-points'>
                <div>
                  <span className='point-dot'></span>

                  <p>New cracks appearing on roads or slopes</p>
                </div>

                <div>
                  <span className='point-dot'></span>

                  <p>Sudden changes in water flow</p>
                </div>

                <div>
                  <span className='point-dot'></span>

                  <p>Falling rocks or soil movement</p>
                </div>

                <div>
                  <span className='point-dot'></span>

                  <p>Unusual ground deformation</p>
                </div>
              </div>
            </div>

            {/* ================= WHAT TO DO ================= */}

            <div className='safety-info-card do-card'>
              <div className='safety-card-top'>
                <div className='safety-card-icon do'>
                  <CheckCircle size={18} />
                </div>

                <div>
                  <h3>What to Do</h3>

                  <span>Recommended actions</span>
                </div>
              </div>

              <div className='safety-points'>
                <div>
                  <span className='point-dot'></span>

                  <p>Monitor official warnings and alerts</p>
                </div>

                <div>
                  <span className='point-dot'></span>

                  <p>Follow evacuation instructions</p>
                </div>

                <div>
                  <span className='point-dot'></span>

                  <p>Keep a safe distance from unstable slopes</p>
                </div>

                <div>
                  <span className='point-dot'></span>

                  <p>Report new hazards immediately</p>
                </div>
              </div>
            </div>

            {/* ================= WHAT TO AVOID ================= */}

            <div className='safety-info-card dont-card'>
              <div className='safety-card-top'>
                <div className='safety-card-icon dont'>
                  <XCircle size={18} />
                </div>

                <div>
                  <h3>What to Avoid</h3>

                  <span>Important precautions</span>
                </div>
              </div>

              <div className='safety-points'>
                <div>
                  <span className='point-dot'></span>

                  <p>Do not approach an active landslide</p>
                </div>

                <div>
                  <span className='point-dot'></span>

                  <p>Do not ignore critical alerts</p>
                </div>

                <div>
                  <span className='point-dot'></span>

                  <p>Do not cross unstable roads or slopes</p>
                </div>

                <div>
                  <span className='point-dot'></span>

                  <p>Do not return before official clearance</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RAINFALL ADVISORY ================= */}

          <div className='safety-bottom-note'>
            <div className='rain-note-icon'>
              <CloudRain size={18} />
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
