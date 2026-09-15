import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className='dashboard-page'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard */}
      <main className='dashboard-main'>
        {/* Header */}
        <div className='dashboard-header'>
          <div>
            <h1>Dashboard</h1>
            <p>Monitor landslide risk and current field conditions</p>
          </div>

          <div className='live-status'>
            <span className='live-dot'></span>
            Live Monitoring
          </div>
        </div>

        {/* Welcome Section */}
        <div className='welcome-card'>
          <div>
            <span className='welcome-label'>GOOD MORNING, ANCHAL</span>

            <h2>Stay informed. Stay prepared.</h2>

            <p>
              Monitor current landslide conditions, risk levels and active
              alerts across monitored zones.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className='stats-grid'>
          <div className='stat-card'>
            <span className='stat-label'>Monitored Zones</span>

            <h3>5</h3>

            <p>All zones active</p>
          </div>

          <div className='stat-card'>
            <span className='stat-label'>Critical Zones</span>

            <h3 className='critical'>2</h3>

            <p>Immediate attention</p>
          </div>

          <div className='stat-card'>
            <span className='stat-label'>High Risk</span>

            <h3 className='high'>1</h3>

            <p>Requires monitoring</p>
          </div>

          <div className='stat-card'>
            <span className='stat-label'>Active Alerts</span>

            <h3 className='alert'>3</h3>

            <p>Needs review</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='dashboard-grid'>
          <div className='dashboard-box'>
            <div className='box-header'>
              <div>
                <h3>Current Risk Overview</h3>
                <p>Latest risk status across zones</p>
              </div>

              <button>View Risk Map →</button>
            </div>

            <div className='risk-row'>
              <span>Zone A</span>
              <span className='risk-badge critical-badge'>CRITICAL</span>
              <strong>84/100</strong>
            </div>

            <div className='risk-row'>
              <span>Zone D</span>
              <span className='risk-badge high-badge'>HIGH</span>
              <strong>67/100</strong>
            </div>

            <div className='risk-row'>
              <span>Zone B</span>
              <span className='risk-badge moderate-badge'>MODERATE</span>
              <strong>48/100</strong>
            </div>

            <div className='risk-row'>
              <span>Zone C</span>
              <span className='risk-badge low-badge'>LOW</span>
              <strong>22/100</strong>
            </div>
          </div>

          <div className='dashboard-box'>
            <div className='box-header'>
              <div>
                <h3>Recent Alerts</h3>
                <p>Latest warnings from monitored zones</p>
              </div>

              <button>View All →</button>
            </div>

            <div className='alert-row'>
              <div>
                <strong>High Landslide Risk Detected</strong>

                <span>Zone A · Sikkim</span>
              </div>

              <span className='alert-time'>10:18 AM</span>
            </div>

            <div className='alert-row'>
              <div>
                <strong>Soil Moisture Threshold Exceeded</strong>

                <span>Zone E · Sikkim</span>
              </div>

              <span className='alert-time'>09:52 AM</span>
            </div>

            <div className='alert-row'>
              <div>
                <strong>Increased Slope Movement</strong>

                <span>Zone D · Sikkim</span>
              </div>

              <span className='alert-time'>09:31 AM</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
