import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  ChevronRight,
  RefreshCw,
  Cpu,
  FileSpreadsheet,
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, riskApi, alertsApi } from '../../services/api';

import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [zones, setZones] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [overviewData, zonesData, alertsData] = await Promise.allSettled([
        dashboardApi.getOverview(),
        riskApi.getZones(),
        alertsApi.getActiveAlerts(),
      ]);

      if (overviewData.status === 'fulfilled' && overviewData.value) {
        setOverview(overviewData.value);
      }
      if (zonesData.status === 'fulfilled' && zonesData.value) {
        setZones(Array.isArray(zonesData.value) ? zonesData.value : zonesData.value.zones || []);
      }
      if (alertsData.status === 'fulfilled' && alertsData.value) {
        setRecentAlerts(Array.isArray(alertsData.value) ? alertsData.value : alertsData.value.alerts || []);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // 30s auto refresh
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = (user?.name || 'Commander').toUpperCase();
    if (hour < 12) return `GOOD MORNING, ${name}`;
    if (hour < 18) return `GOOD AFTERNOON, ${name}`;
    return `GOOD EVENING, ${name}`;
  };

  // Safe fallback metrics
  const totalZones = overview?.zones?.total ?? zones.length ?? 0;
  const criticalZones = overview?.zones?.distribution?.critical ?? zones.filter(z => (z.currentRiskLevel || '').toUpperCase() === 'CRITICAL').length;
  const highRiskZones = overview?.zones?.distribution?.high ?? zones.filter(z => (z.currentRiskLevel || '').toUpperCase() === 'HIGH').length;
  const activeAlertsCount = overview?.alerts?.active ?? recentAlerts.length ?? 0;
  const onlineDevices = overview?.devices?.online ?? 0;
  const totalDevices = overview?.devices?.total ?? 0;

  return (
    <div className='dashboard-page'>
      <Sidebar />

      <main className='dashboard-main'>
        {/* ================= HEADER ================= */}
        <div className='dashboard-header'>
          <div>
            <span className='page-eyebrow'>MONITORING CENTER</span>
            <h1>Dashboard</h1>
            <p>Monitor landslide risk and current field conditions in real time</p>
          </div>

          <div className='dashboard-header-actions'>
            <button
              onClick={handleRefresh}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px'
              }}
              title='Refresh live data'
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>

            <div className='live-status'>
              <span className='live-dot'></span>
              Live Connected
            </div>

            <ThemeToggle />
          </div>
        </div>

        {/* ================= WELCOME CARD ================= */}
        <section className='welcome-card'>
          <div className='welcome-content'>
            <span className='welcome-label'>{getGreeting()}</span>
            <h2>Stay informed. Stay prepared.</h2>
            <p>
              AI-Powered Landslide Early Warning Engine is actively tracking telemetry,
              soil moisture saturation, and precipitation across monitored slopes.
            </p>

            <div className='monitoring-message'>
              <span className='message-dot'></span>
              System is actively monitoring {totalZones} zones & {onlineDevices} online IoT sensors
            </div>
          </div>

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
          {/* Card 1: Monitored Zones */}
          <div className='stat-card'>
            <div className='stat-card-top'>
              <span className='stat-label'>Monitored Zones</span>
              <div className='stat-icon green'>
                <MapPin size={17} />
              </div>
            </div>
            <h3>{loading ? '...' : totalZones}</h3>
            <p>{zones.length > 0 ? `${zones.length} active sectors` : 'Live sensors synced'}</p>
          </div>

          {/* Card 2: Critical Zones */}
          <div className='stat-card'>
            <div className='stat-card-top'>
              <span className='stat-label'>Critical Zones</span>
              <div className='stat-icon red'>
                <AlertTriangle size={17} />
              </div>
            </div>
            <h3 className='critical'>{loading ? '...' : criticalZones}</h3>
            <p>{criticalZones > 0 ? 'Immediate attention needed' : 'Slope stability stable'}</p>
          </div>

          {/* Card 3: High Risk Zones */}
          <div className='stat-card'>
            <div className='stat-card-top'>
              <span className='stat-label'>High Risk Zones</span>
              <div className='stat-icon orange'>
                <Activity size={17} />
              </div>
            </div>
            <h3 className='high'>{loading ? '...' : highRiskZones}</h3>
            <p>Requires monitoring</p>
          </div>

          {/* Card 4: Active Alerts */}
          <div className='stat-card'>
            <div className='stat-card-top'>
              <span className='stat-label'>Active Alerts</span>
              <div className='stat-icon red'>
                <ShieldCheck size={17} />
              </div>
            </div>
            <h3 className='alert'>{loading ? '...' : activeAlertsCount}</h3>
            <p>{activeAlertsCount > 0 ? 'Requires action review' : 'No critical alarms'}</p>
          </div>
        </div>

        {/* ================= BOTTOM GRID ================= */}
        <div className='dashboard-grid'>
          {/* Current Risk Overview */}
          <section className='dashboard-box'>
            <div className='box-header'>
              <div>
                <span className='box-eyebrow'>RISK MONITORING</span>
                <h3>Current Risk Overview</h3>
                <p>Latest risk status across monitored zones</p>
              </div>

              <Link to='/map' style={{ textDecoration: 'none' }}>
                <button>
                  View Map
                  <ChevronRight size={15} />
                </button>
              </Link>
            </div>

            {loading ? (
              <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading zones telemetry...</p>
            ) : zones.length > 0 ? (
              zones.slice(0, 5).map((zone) => {
                const level = (zone.currentRiskLevel || 'LOW').toLowerCase();
                const score = Math.round((zone.currentRiskScore !== undefined ? zone.currentRiskScore * 100 : 0));
                return (
                  <div key={zone._id || zone.code} className='risk-row'>
                    <div className='zone-name'>
                      <span className={`zone-dot ${level}-dot`}></span>
                      {zone.name || zone.code}
                    </div>
                    <span className={`risk-badge ${level}-badge`}>
                      {(zone.currentRiskLevel || 'LOW').toUpperCase()}
                    </span>
                    <strong>{score}/100</strong>
                  </div>
                );
              })
            ) : (
              <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>No risk zones currently configured.</p>
            )}
          </section>

          {/* Recent Alerts */}
          <section className='dashboard-box'>
            <div className='box-header'>
              <div>
                <span className='box-eyebrow'>ALERT CENTER</span>
                <h3>Recent Alerts</h3>
                <p>Latest warnings and threshold triggers</p>
              </div>

              <Link to='/alerts' style={{ textDecoration: 'none' }}>
                <button>
                  View All
                  <ChevronRight size={15} />
                </button>
              </Link>
            </div>

            {loading ? (
              <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading active alerts...</p>
            ) : recentAlerts.length > 0 ? (
              recentAlerts.slice(0, 4).map((alert) => {
                const severity = (alert.severity || alert.riskLevel || 'MODERATE').toLowerCase();
                const timeStr = alert.issuedAt || alert.createdAt
                  ? new Date(alert.issuedAt || alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Active';

                return (
                  <div key={alert._id || alert.alertId} className='alert-row'>
                    <div className={`alert-indicator ${severity}-indicator`}>!</div>
                    <div className='alert-content'>
                      <strong>{alert.title || alert.message || 'Landslide Alert'}</strong>
                      <span>{alert.zoneId?.name || alert.zoneName || 'Monitored Region'}</span>
                    </div>
                    <span className='alert-time'>{timeStr}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={32} style={{ color: '#22c55e', margin: '0 auto 8px' }} />
                <p>All slopes normal. No active danger alerts.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

