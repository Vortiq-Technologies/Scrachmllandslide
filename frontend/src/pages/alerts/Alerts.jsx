import {
  Home,
  Map,
  FileText,
  Bell,
  Settings,
  AlertTriangle,
  Search,
  Filter,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react';

import './Alerts.css';

function Alerts() {
  return (
    <div className='alerts-page'>
      {/* ================= SIDEBAR ================= */}

      <aside className='alerts-sidebar'>
        {/* Logo */}
        <div className='alerts-logo'>
          <img
            src='/images/logo.png'
            alt='Landslide Early Warning System'
          />

          <div>
            <h3>LANDSLIDE</h3>
            <span>EARLY WARNING SYSTEM</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className='alerts-navigation'>
          <a
            href='/dashboard'
            className='alerts-nav-item'
          >
            <Home size={17} />
            Home
          </a>

          <a
            href='/risk-map'
            className='alerts-nav-item'
          >
            <Map size={17} />
            Risk Map
          </a>

          <a
            href='/reports'
            className='alerts-nav-item'
          >
            <FileText size={17} />
            Reports
          </a>

          <a
            href='/alerts'
            className='alerts-nav-item active'
          >
            <Bell size={17} />
            Alerts
          </a>

          <a
            href='/settings'
            className='alerts-nav-item'
          >
            <Settings size={17} />
            Settings
          </a>
        </nav>

        {/* System Status */}
        <div className='alerts-system-status'>
          <p>SYSTEM STATUS</p>

          <div>
            <span></span>
            All systems operational
          </div>
        </div>

        {/* User */}
        <div className='alerts-user'>
          <div className='alerts-avatar'>A</div>

          <div className='alerts-user-info'>
            <strong>Anchal</strong>
            <span>Field Officer</span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className='alerts-main'>
        {/* Header */}

        <div className='alerts-header'>
          <div>
            <h1>Alerts</h1>

            <p>Monitor and respond to landslide warnings</p>
          </div>

          <div className='active-alert-count'>
            <AlertTriangle size={16} />

            <span>3 Active Alerts</span>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}

        <div className='alert-summary'>
          <div className='summary-card critical-summary'>
            <div className='summary-icon'>
              <AlertTriangle size={19} />
            </div>

            <div>
              <strong>2</strong>
              <span>Critical Alerts</span>
            </div>
          </div>

          <div className='summary-card high-summary'>
            <div className='summary-icon'>
              <AlertTriangle size={19} />
            </div>

            <div>
              <strong>1</strong>
              <span>High Risk Alerts</span>
            </div>
          </div>

          <div className='summary-card resolved-summary'>
            <div className='summary-icon'>✓</div>

            <div>
              <strong>8</strong>
              <span>Resolved Today</span>
            </div>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}

        <div className='alert-filter-bar'>
          <div className='alert-search'>
            <Search size={16} />

            <input
              type='text'
              placeholder='Search alerts or zones...'
            />
          </div>

          <button className='filter-button'>
            <Filter size={15} />
            All Alerts
          </button>

          <button className='filter-button'>Critical</button>

          <button className='filter-button'>High</button>

          <button className='filter-button'>Recent</button>
        </div>

        {/* ================= ACTIVE ALERTS ================= */}

        <section className='alerts-section'>
          <div className='section-heading'>
            <div>
              <h2>Active Alerts</h2>

              <p>Alerts requiring attention</p>
            </div>

            <span className='live-label'>
              <span></span>
              Live
            </span>
          </div>

          <div className='alert-list'>
            {/* ALERT 1 */}

            <div className='alert-card critical-alert'>
              <div className='alert-severity critical-severity'>
                <AlertTriangle size={20} />
              </div>

              <div className='alert-content'>
                <div className='alert-top'>
                  <div>
                    <span className='alert-type'>CRITICAL WARNING</span>

                    <h3>High Landslide Risk Detected</h3>
                  </div>

                  <span className='alert-status'>Active</span>
                </div>

                <div className='alert-location'>
                  <MapPin size={14} />
                  Zone A · Sikkim, India
                </div>

                <p>
                  Heavy rainfall and increased slope movement have resulted in a
                  critical risk score.
                </p>

                <div className='alert-meta'>
                  <span>
                    <Clock size={13} />
                    10:18 AM
                  </span>

                  <span>
                    Risk Score: <strong>84/100</strong>
                  </span>

                  <span>
                    Probability: <strong>84%</strong>
                  </span>
                </div>
              </div>

              <a
                href='/alert-details'
                className='alert-view'
              >
                <ChevronRight size={19} />
              </a>
            </div>

            {/* ALERT 2 */}

            <div className='alert-card critical-alert'>
              <div className='alert-severity critical-severity'>
                <AlertTriangle size={20} />
              </div>

              <div className='alert-content'>
                <div className='alert-top'>
                  <div>
                    <span className='alert-type'>CRITICAL WARNING</span>

                    <h3>Soil Moisture Threshold Exceeded</h3>
                  </div>

                  <span className='alert-status'>Active</span>
                </div>

                <div className='alert-location'>
                  <MapPin size={14} />
                  Zone E · Sikkim, India
                </div>

                <p>
                  Soil moisture has exceeded the critical threshold and requires
                  immediate attention.
                </p>

                <div className='alert-meta'>
                  <span>
                    <Clock size={13} />
                    09:52 AM
                  </span>

                  <span>
                    Risk Score: <strong>81/100</strong>
                  </span>

                  <span>
                    Probability: <strong>79%</strong>
                  </span>
                </div>
              </div>

              <a
                href='/alert-details'
                className='alert-view'
              >
                <ChevronRight size={19} />
              </a>
            </div>

            {/* ALERT 3 */}

            <div className='alert-card high-alert'>
              <div className='alert-severity high-severity'>
                <AlertTriangle size={20} />
              </div>

              <div className='alert-content'>
                <div className='alert-top'>
                  <div>
                    <span className='alert-type'>HIGH RISK</span>

                    <h3>Increased Slope Movement</h3>
                  </div>

                  <span className='alert-status high-status'>Monitoring</span>
                </div>

                <div className='alert-location'>
                  <MapPin size={14} />
                  Zone D · Sikkim, India
                </div>

                <p>
                  Tilt sensor has detected increased movement compared with the
                  previous reading.
                </p>

                <div className='alert-meta'>
                  <span>
                    <Clock size={13} />
                    09:31 AM
                  </span>

                  <span>
                    Risk Score: <strong>67/100</strong>
                  </span>

                  <span>
                    Probability: <strong>63%</strong>
                  </span>
                </div>
              </div>

              <a
                href='/alert-details'
                className='alert-view'
              >
                <ChevronRight size={19} />
              </a>
            </div>
          </div>
        </section>

        {/* ================= RECENT ALERTS ================= */}

        <section className='recent-alerts'>
          <div className='section-heading'>
            <div>
              <h2>Recent Alerts</h2>

              <p>Previously resolved warnings</p>
            </div>
          </div>

          <div className='recent-alert-row'>
            <div className='resolved-icon'>✓</div>

            <div className='recent-alert-content'>
              <strong>Rainfall Warning Resolved</strong>

              <span>Zone B · Sikkim</span>
            </div>

            <span className='resolved-label'>Resolved</span>

            <span className='recent-time'>08:42 AM</span>
          </div>

          <div className='recent-alert-row'>
            <div className='resolved-icon'>✓</div>

            <div className='recent-alert-content'>
              <strong>Moderate Risk Warning</strong>

              <span>Zone C · Sikkim</span>
            </div>

            <span className='resolved-label'>Resolved</span>

            <span className='recent-time'>07:18 AM</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Alerts;
