import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  ChevronRight,
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import ThemeToggle from '../../components/ThemeToggle';

import './Dashboard.css';

function Dashboard() {
  return (
    <div className='dashboard-page'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard */}
      <main className='dashboard-main'>
        {/* ================= HEADER ================= */}

        <div className='dashboard-header'>
          <div>
            <span className='page-eyebrow'>MONITORING CENTER</span>

            <h1>Dashboard</h1>

            <p>Monitor landslide risk and current field conditions</p>
          </div>

          <div className='dashboard-header-actions'>
            <div className='live-status'>
              <span className='live-dot'></span>
              Live Monitoring
            </div>

            <ThemeToggle />
          </div>
        </div>

        {/* ================= WELCOME CARD ================= */}

        <section className='welcome-card'>
          <div className='welcome-content'>
            <span className='welcome-label'>GOOD MORNING, ANCHAL</span>

            <h2>Stay informed. Stay prepared.</h2>

            <p>
              Monitor current landslide conditions, risk levels and active
              alerts across monitored zones.
            </p>

            <div className='monitoring-message'>
              <span className='message-dot'></span>
              System is actively monitoring 5 zones
            </div>
          </div>

          {/* Decorative Monitoring Graphic */}

          <div className='welcome-visual'>
            <div className='visual-ring ring-one'></div>

            <div className='visual-ring ring-two'></div>

            <div className='visual-ring ring-three'></div>

            <div className='visual-icon'>
              <Activity size={34} />
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}

        <div className='stats-grid'>
          {/* Card 1 */}
          <div className='stat-card'>
            <div className='stat-card-top'>
              <span className='stat-label'>Monitored Zones</span>

              <div className='stat-icon green'>
                <MapPin size={17} />
              </div>
            </div>

            <h3>5</h3>

            <p>All zones active</p>
          </div>

          {/* Card 2 */}
          <div className='stat-card'>
            <div className='stat-card-top'>
              <span className='stat-label'>Critical Zones</span>

              <div className='stat-icon red'>
                <AlertTriangle size={17} />
              </div>
            </div>

            <h3 className='critical'>2</h3>

            <p>Immediate attention</p>
          </div>

          {/* Card 3 */}
          <div className='stat-card'>
            <div className='stat-card-top'>
              <span className='stat-label'>High Risk</span>

              <div className='stat-icon orange'>
                <Activity size={17} />
              </div>
            </div>

            <h3 className='high'>1</h3>

            <p>Requires monitoring</p>
          </div>

          {/* Card 4 */}
          <div className='stat-card'>
            <div className='stat-card-top'>
              <span className='stat-label'>Active Alerts</span>

              <div className='stat-icon red'>
                <ShieldCheck size={17} />
              </div>
            </div>

            <h3 className='alert'>3</h3>

            <p>Needs review</p>
          </div>
        </div>

        {/* ================= BOTTOM GRID ================= */}

        <div className='dashboard-grid'>
          {/* Risk Overview */}

          <section className='dashboard-box'>
            <div className='box-header'>
              <div>
                <span className='box-eyebrow'>RISK MONITORING</span>

                <h3>Current Risk Overview</h3>

                <p>Latest risk status across zones</p>
              </div>

              <button>
                View Risk Map
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Risk Row 1 */}

            <div className='risk-row'>
              <div className='zone-name'>
                <span className='zone-dot critical-dot'></span>
                Zone A
              </div>

              <span className='risk-badge critical-badge'>CRITICAL</span>

              <strong>84/100</strong>
            </div>

            {/* Risk Row 2 */}

            <div className='risk-row'>
              <div className='zone-name'>
                <span className='zone-dot high-dot'></span>
                Zone D
              </div>

              <span className='risk-badge high-badge'>HIGH</span>

              <strong>67/100</strong>
            </div>

            {/* Risk Row 3 */}

            <div className='risk-row'>
              <div className='zone-name'>
                <span className='zone-dot moderate-dot'></span>
                Zone B
              </div>

              <span className='risk-badge moderate-badge'>MODERATE</span>

              <strong>48/100</strong>
            </div>

            {/* Risk Row 4 */}

            <div className='risk-row'>
              <div className='zone-name'>
                <span className='zone-dot low-dot'></span>
                Zone C
              </div>

              <span className='risk-badge low-badge'>LOW</span>

              <strong>22/100</strong>
            </div>
          </section>

          {/* Recent Alerts */}

          <section className='dashboard-box'>
            <div className='box-header'>
              <div>
                <span className='box-eyebrow'>ALERT CENTER</span>

                <h3>Recent Alerts</h3>

                <p>Latest warnings from monitored zones</p>
              </div>

              <button>
                View All
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Alert 1 */}

            <div className='alert-row'>
              <div className='alert-indicator critical-indicator'>!</div>

              <div className='alert-content'>
                <strong>High Landslide Risk Detected</strong>

                <span>Zone A · Sikkim</span>
              </div>

              <span className='alert-time'>10:18 AM</span>
            </div>

            {/* Alert 2 */}

            <div className='alert-row'>
              <div className='alert-indicator moderate-indicator'>!</div>

              <div className='alert-content'>
                <strong>Soil Moisture Threshold Exceeded</strong>

                <span>Zone E · Sikkim</span>
              </div>

              <span className='alert-time'>09:52 AM</span>
            </div>

            {/* Alert 3 */}

            <div className='alert-row'>
              <div className='alert-indicator high-indicator'>!</div>

              <div className='alert-content'>
                <strong>Increased Slope Movement</strong>

                <span>Zone D · Sikkim</span>
              </div>

              <span className='alert-time'>09:31 AM</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
