import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { alertsApi } from '../../services/api';
import './Alerts.css';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertsApi.getAllAlerts();
      const list = Array.isArray(data) ? data : data.alerts || [];
      setAlerts(list);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (alertId) => {
    try {
      setActionLoading(alertId);
      await alertsApi.acknowledgeAlert(
        alertId,
        'Acknowledged by emergency operator',
      );
      setAlerts((prev) =>
        prev.map((a) =>
          a._id === alertId || a.alertId === alertId
            ? { ...a, status: 'acknowledged' }
            : a,
        ),
      );
    } catch (err) {
      alert('Failed to acknowledge alert: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      setActionLoading(alertId);
      await alertsApi.resolveAlert(alertId, 'Resolved by field command');
      setAlerts((prev) =>
        prev.map((a) =>
          a._id === alertId || a.alertId === alertId
            ? { ...a, status: 'resolved' }
            : a,
        ),
      );
    } catch (err) {
      alert('Failed to resolve alert: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const criticalCount = alerts.filter(
    (a) =>
      (a.severity || a.riskLevel || '').toUpperCase() === 'CRITICAL' &&
      a.status !== 'resolved',
  ).length;

  const highCount = alerts.filter(
    (a) =>
      (a.severity || a.riskLevel || '').toUpperCase() === 'HIGH' &&
      a.status !== 'resolved',
  ).length;

  const resolvedCount = alerts.filter(
    (a) => (a.status || '').toLowerCase() === 'resolved',
  ).length;

  const activeAlerts = alerts.filter(
    (a) => (a.status || '').toLowerCase() !== 'resolved',
  );
  const resolvedAlerts = alerts.filter(
    (a) => (a.status || '').toLowerCase() === 'resolved',
  );

  const filteredActiveAlerts = activeAlerts.filter((alert) => {
    const sev = (alert.severity || alert.riskLevel || 'MODERATE').toUpperCase();
    if (filterSeverity !== 'ALL' && sev !== filterSeverity) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (alert.title || alert.message || '').toLowerCase();
      const zone = (alert.zoneName || alert.zoneId?.name || '').toLowerCase();
      return title.includes(q) || zone.includes(q);
    }
    return true;
  });

  return (
    <div className='alerts-page'>
      <Sidebar />

      <main className='alerts-main'>
        {/* Header */}
        <div className='alerts-header'>
          <div>
            <div className='alerts-header-icon'>
              <AlertTriangle size={19} />
            </div>

            <div>
              <span className='page-eyebrow'>ALERT MONITORING</span>
              <h1>Alerts Center</h1>
              <p>Monitor, acknowledge, and resolve landslide hazard warnings</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={fetchAlerts}
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
                fontSize: '13px',
              }}
            >
              <RefreshCw
                size={15}
                className={loading ? 'animate-spin' : ''}
              />
              <span>Refresh</span>
            </button>

            <div className='active-alert-count'>
              <AlertTriangle size={16} />
              <span>{activeAlerts.length} Active Alerts</span>
            </div>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className='alert-summary'>
          <div className='summary-card critical-summary'>
            <div className='summary-icon'>
              <AlertTriangle size={19} />
            </div>
            <div>
              <strong>{criticalCount}</strong>
              <span>Critical Alerts</span>
            </div>
          </div>

          <div className='summary-card high-summary'>
            <div className='summary-icon'>
              <AlertTriangle size={19} />
            </div>
            <div>
              <strong>{highCount}</strong>
              <span>High Risk Alerts</span>
            </div>
          </div>

          <div className='summary-card resolved-summary'>
            <div className='summary-icon'>✓</div>
            <div>
              <strong>{resolvedCount}</strong>
              <span>Resolved Alerts</span>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className={`filter-button ${filterSeverity === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('ALL')}
          >
            All Alerts
          </button>
          <button
            className={`filter-button ${filterSeverity === 'CRITICAL' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('CRITICAL')}
          >
            Critical
          </button>
          <button
            className={`filter-button ${filterSeverity === 'HIGH' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('HIGH')}
          >
            High
          </button>
          <button
            className={`filter-button ${filterSeverity === 'MODERATE' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('MODERATE')}
          >
            Moderate
          </button>
        </div>

        {/* ================= ACTIVE ALERTS ================= */}
        <section className='alerts-section'>
          <div className='section-heading'>
            <div>
              <h2>Active Incident Warnings</h2>
              <p>Landslide threshold violations & ML hazard alerts</p>
            </div>
            <span className='live-label'>
              <span></span>
              Live Feed
            </span>
          </div>

          {loading ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <Loader2
                size={28}
                className='animate-spin'
                style={{ margin: '0 auto 10px' }}
              />
              <p>Fetching active alerts from server...</p>
            </div>
          ) : filteredActiveAlerts.length > 0 ? (
            <div className='alert-list'>
              {filteredActiveAlerts.map((alert) => {
                const id = alert._id || alert.alertId;
                const severity = (
                  alert.severity ||
                  alert.riskLevel ||
                  'MODERATE'
                ).toLowerCase();
                const isCrit =
                  severity === 'critical' ||
                  severity === 'emergency_evacuation';
                const isHigh = severity === 'high';
                const status = (alert.status || 'active').toLowerCase();
                const timeStr =
                  alert.issuedAt || alert.createdAt
                    ? new Date(
                        alert.issuedAt || alert.createdAt,
                      ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Active';

                return (
                  <div
                    key={id}
                    className={`alert-card ${isCrit ? 'critical-alert' : isHigh ? 'high-alert' : 'moderate-alert'}`}
                  >
                    <div
                      className={`alert-severity ${isCrit ? 'critical-severity' : isHigh ? 'high-severity' : 'moderate-severity'}`}
                    >
                      <AlertTriangle size={20} />
                    </div>

                    <div
                      className='alert-content'
                      style={{ flex: 1 }}
                    >
                      <div className='alert-top'>
                        <div>
                          <span className='alert-type'>
                            {(
                              alert.severity ||
                              alert.riskLevel ||
                              'WARNING'
                            ).toUpperCase()}
                          </span>
                          <h3>
                            {alert.title || alert.message || 'Landslide Alert'}
                          </h3>
                        </div>

                        <span
                          className={`alert-status ${status === 'acknowledged' ? 'high-status' : ''}`}
                        >
                          {status.toUpperCase()}
                        </span>
                      </div>

                      <div className='alert-location'>
                        <MapPin size={14} />
                        {alert.zoneName ||
                          alert.zoneId?.name ||
                          'Assigned Zone'}{' '}
                        · Himalayan Sector
                      </div>

                      <p>
                        {alert.message ||
                          alert.description ||
                          'Threshold triggered by sensor telemetry.'}
                      </p>

                      <div className='alert-meta'>
                        <span>
                          <Clock size={13} />
                          {timeStr}
                        </span>
                        {alert.riskScore !== undefined && (
                          <span>
                            Risk Score:{' '}
                            <strong>
                              {Math.round(
                                alert.riskScore <= 1
                                  ? alert.riskScore * 100
                                  : alert.riskScore,
                              )}
                              /100
                            </strong>
                          </span>
                        )}
                        {alert.triggerSource && (
                          <span>
                            Source: <strong>{alert.triggerSource}</strong>
                          </span>
                        )}
                      </div>

                      {/* Action response buttons */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '12px',
                        }}
                      >
                        {status !== 'acknowledged' && (
                          <button
                            onClick={() => handleAcknowledge(id)}
                            disabled={actionLoading === id}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              background: 'var(--card-bg-hover)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-color)',
                              cursor: 'pointer',
                            }}
                          >
                            {actionLoading === id
                              ? 'Updating...'
                              : 'Acknowledge'}
                          </button>
                        )}
                        <button
                          onClick={() => handleResolve(id)}
                          disabled={actionLoading === id}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            cursor: 'pointer',
                          }}
                        >
                          {actionLoading === id
                            ? 'Updating...'
                            : 'Resolve Alert'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: '36px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <ShieldCheck
                size={36}
                style={{ color: '#22c55e', margin: '0 auto 8px' }}
              />
              <p>No active alerts matching the selected filter criteria.</p>
            </div>
          )}
        </section>

        {/* ================= RECENT RESOLVED ALERTS ================= */}
        {resolvedAlerts.length > 0 && (
          <section className='recent-alerts'>
            <div className='section-heading'>
              <div>
                <h2>Resolved Alerts</h2>
                <p>Previously addressed hazard incidents</p>
              </div>
            </div>

            {resolvedAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert._id || alert.alertId}
                className='recent-alert-row'
              >
                <div className='resolved-icon'>✓</div>
                <div className='recent-alert-content'>
                  <strong>
                    {alert.title || alert.message || 'Resolved Alert'}
                  </strong>
                  <span>
                    {alert.zoneName || alert.zoneId?.name || 'Region'}
                  </span>
                </div>
                <span className='resolved-label'>Resolved</span>
                <span className='recent-time'>
                  {alert.resolvedAt
                    ? new Date(alert.resolvedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Complete'}
                </span>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Alerts;
