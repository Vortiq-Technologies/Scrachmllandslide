import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Camera,
  ChevronRight,
  FileWarning,
  ClipboardList,
  Eye,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import ThemeToggle from '../../components/ThemeToggle';
import { reportsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

import './Reports.css';

function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getReports();
      const list = Array.isArray(data) ? data : data.reports || [];
      setReports(list);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleVerify = async (reportId) => {
    try {
      setActionLoading(reportId);
      await reportsApi.verifyReport(reportId, 'Verified by field officer');
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: 'verified', verifiedAt: new Date() } : r))
      );
    } catch (err) {
      alert('Verification failed: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolve = async (reportId) => {
    try {
      setActionLoading(reportId);
      await reportsApi.resolveReport(reportId, 'Resolved by emergency team');
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: 'resolved', resolvedAt: new Date() } : r))
      );
    } catch (err) {
      alert('Resolution failed: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => (r.status || 'pending').toLowerCase() === 'pending').length;
  const verifiedCount = reports.filter((r) => (r.status || '').toLowerCase() === 'verified').length;
  const resolvedCount = reports.filter((r) => (r.status || '').toLowerCase() === 'resolved').length;

  const filteredReports = reports.filter((report) => {
    const st = (report.status || 'pending').toLowerCase();
    if (statusFilter !== 'ALL' && st !== statusFilter.toLowerCase()) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const desc = (report.description || '').toLowerCase();
      const type = (report.reportType || '').toLowerCase();
      const zone = (report.zoneId?.name || report.zoneName || '').toLowerCase();
      return desc.includes(q) || type.includes(q) || zone.includes(q);
    }
    return true;
  });

  return (
    <div className='reports-page'>
      <Sidebar />

      <main className='reports-main'>
        {/* ================= HEADER ================= */}
        <div className='reports-header'>
          <div>
            <span className='page-eyebrow'>FIELD MONITORING</span>
            <h1>Citizen & Field Reports</h1>
            <p>Review, verify and manage crowd-sourced and field officer incident hazard logs</p>
          </div>

          <div className='reports-header-actions'>
            <button
              onClick={fetchReports}
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
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <ThemeToggle />

            <Link to='/reportsIncident' className='create-report-btn'>
              <span>+</span>
              Report Incident
            </Link>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className='report-summary'>
          <div className='report-summary-card'>
            <div className='summary-top'>
              <span>Total Reports</span>
              <div className='summary-icon green'>
                <ClipboardList size={17} />
              </div>
            </div>
            <strong>{totalCount}</strong>
            <small>All geo-tagged records</small>
          </div>

          <div className='report-summary-card'>
            <div className='summary-top'>
              <span>Pending Review</span>
              <div className='summary-icon orange'>
                <FileWarning size={17} />
              </div>
            </div>
            <strong className='pending-number'>{pendingCount}</strong>
            <small>Unverified citizen inputs</small>
          </div>

          <div className='report-summary-card'>
            <div className='summary-top'>
              <span>Verified Hazards</span>
              <div className='summary-icon blue'>
                <Eye size={17} />
              </div>
            </div>
            <strong className='review-number'>{verifiedCount}</strong>
            <small>Confirmed by authorities</small>
          </div>

          <div className='report-summary-card'>
            <div className='summary-top'>
              <span>Resolved</span>
              <div className='summary-icon success'>
                <CheckCircle2 size={17} />
              </div>
            </div>
            <strong className='resolved-number'>{resolvedCount}</strong>
            <small>Mitigation complete</small>
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className='reports-filters'>
          <div className='report-search'>
            <Search size={17} />
            <input
              type='text'
              placeholder='Search reports, hazards, zones...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className={`filter-button ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Status
          </button>
          <button
            className={`filter-button ${statusFilter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            Pending
          </button>
          <button
            className={`filter-button ${statusFilter === 'VERIFIED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('VERIFIED')}
          >
            Verified
          </button>
          <button
            className={`filter-button ${statusFilter === 'RESOLVED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('RESOLVED')}
          >
            Resolved
          </button>
        </div>

        {/* ================= REPORT SECTION ================= */}
        <section className='reports-section'>
          <div className='section-heading'>
            <div>
              <span className='section-label'>INCIDENT LOG</span>
              <h2>Report Feed</h2>
              <p>Live geo-referenced observations from citizen sensors & ground patrols</p>
            </div>
            <span className='report-count'>{filteredReports.length} Reports</span>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Loader2 size={28} className='animate-spin' style={{ margin: '0 auto 10px' }} />
              <p>Fetching incident reports...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => {
              const severity = (report.severity || 'MODERATE').toLowerCase();
              const status = (report.status || 'pending').toLowerCase();
              const timeStr = report.createdAt
                ? new Date(report.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                : 'Recent';

              const coords = report.location?.coordinates || [];
              const coordStr = coords.length === 2 ? `[${coords[1].toFixed(3)}°N, ${coords[0].toFixed(3)}°E]` : '';

              return (
                <div key={report._id} className='report-card'>
                  <div className='report-card-left' style={{ flex: 1 }}>
                    <div className={`report-icon ${severity}-report`}>!</div>

                    <div className='report-content' style={{ flex: 1 }}>
                      <div className='report-title-row'>
                        <h3 style={{ textTransform: 'capitalize' }}>
                          {(report.reportType || 'Incident').replace('_', ' ')}
                        </h3>
                        <span className={`severity-badge ${severity}`}>
                          {severity.toUpperCase()}
                        </span>
                      </div>

                      <div className='report-location'>
                        <MapPin size={13} />
                        {report.zoneId?.name || report.zoneName || 'Himalayan Regional Sector'} {coordStr}
                      </div>

                      <p>{report.description || 'No description provided.'}</p>

                      <div className='report-meta'>
                        <span>
                          <Clock size={13} />
                          {timeStr}
                        </span>
                        {report.submittedBy?.name && (
                          <span>By: {report.submittedBy.name}</span>
                        )}
                        {report.media && report.media.length > 0 && (
                          <span>
                            <Camera size={13} /> {report.media.length} Media
                          </span>
                        )}
                      </div>

                      {/* Management Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        {status === 'pending' && (
                          <button
                            onClick={() => handleVerify(report._id)}
                            disabled={actionLoading === report._id}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              background: 'rgba(59, 130, 246, 0.15)',
                              color: '#3b82f6',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              cursor: 'pointer'
                            }}
                          >
                            {actionLoading === report._id ? 'Verifying...' : '✓ Verify Report'}
                          </button>
                        )}
                        {status !== 'resolved' && (
                          <button
                            onClick={() => handleResolve(report._id)}
                            disabled={actionLoading === report._id}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              background: 'rgba(34, 197, 94, 0.15)',
                              color: '#22c55e',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              cursor: 'pointer'
                            }}
                          >
                            {actionLoading === report._id ? 'Resolving...' : '✓ Mark Resolved'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='report-card-right'>
                    <span className={`status-badge ${status === 'pending' ? 'pending' : status === 'verified' ? 'reviewing' : 'resolved'}`}>
                      {status === 'pending' ? 'Pending Review' : status === 'verified' ? 'Verified Hazard' : 'Resolved'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={36} style={{ color: '#22c55e', margin: '0 auto 8px' }} />
              <p>No reports found matching your criteria.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Reports;

