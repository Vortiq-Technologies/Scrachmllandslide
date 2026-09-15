import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Camera,
  Video,
  Upload,
  AlertTriangle,
  Navigation,
  Loader2,
  Check,
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import ThemeToggle from '../../components/ThemeToggle';
import { reportsApi, riskApi } from '../../services/api';

import './ReportIncident.css';

function ReportIncident() {
  const navigate = useNavigate();

  const [reportType, setReportType] = useState('Landslide');
  const [severity, setSeverity] = useState('moderate');
  const [description, setDescription] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [landmark, setLandmark] = useState('');
  const [coordinates, setCoordinates] = useState([92.7123, 26.1845]); // Default NER coordinates [lng, lat]
  const [gpsStatus, setGpsStatus] = useState(null);
  const [zones, setZones] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const data = await riskApi.getZones();
        const list = Array.isArray(data) ? data : data.zones || [];
        setZones(list);
      } catch (err) {
        console.error('Failed to load risk zones:', err);
      }
    };
    loadZones();
  }, []);

  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by this browser.');
      return;
    }

    setGpsStatus('Acquiring satellite GPS fix...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates([lng, lat]);
        setGpsStatus(`GPS Captured: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
      },
      (err) => {
        setGpsStatus(`GPS error: ${err.message}. Using regional default.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide an incident description.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Normalize reportType to schema enum
      const mappedType = reportType.toLowerCase().replace(/\s+/g, '_');

      const payload = {
        reportType: mappedType,
        severity: severity.toLowerCase(),
        description: `${landmark ? `[Near ${landmark}] ` : ''}${description}`,
        location: {
          type: 'Point',
          coordinates: coordinates,
        },
        zoneId: zoneId || undefined,
      };

      await reportsApi.submitReport(payload);
      navigate('/reportsSubmitted');
    } catch (err) {
      setError(err.message || 'Failed to submit incident report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='report-incident-page'>
      <Sidebar />

      <main className='report-incident-main'>
        {/* Top Navigation */}
        <div className='incident-topbar'>
          <Link to='/reports' className='back-to-reports'>
            <ArrowLeft size={17} />
            Back to Reports
          </Link>
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className='incident-header'>
          <div>
            <span className='page-eyebrow'>FIELD REPORTING</span>
            <h1>Report an Incident</h1>
            <p>Submit a field observation or suspected landslide hazard to emergency authorities</p>
          </div>
          <div className='field-report-label'>GEO-TAGGED REPORT</div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className='incident-form' onSubmit={handleSubmit}>
          {/* =========================
              INCIDENT INFORMATION
          ========================= */}
          <section className='form-section'>
            <div className='form-section-header'>
              <div className='section-number'>01</div>
              <div>
                <h2>Incident Information</h2>
                <p>Tell us what you observed in the field.</p>
              </div>
            </div>

            {/* Incident Type */}
            <div className='form-group'>
              <label>
                Incident Type <span>*</span>
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                required
              >
                <option value='Landslide'>Landslide / Slope Collapse</option>
                <option value='slope_crack'>Slope Cracks / Tension Fissures</option>
                <option value='rockfall'>Rockfall / Falling Boulders</option>
                <option value='soil_movement'>Soil Movement / Subsidence</option>
                <option value='road_blocked'>Road Blockage / Debris</option>
                <option value='water_accumulation'>Waterlogging / Mud Inflow</option>
                <option value='other'>Other Hazardous Anomaly</option>
              </select>
            </div>

            {/* Severity */}
            <div className='form-group'>
              <label>
                Observed Severity <span>*</span>
              </label>
              <div className='severity-options'>
                <label className='severity-option low-option'>
                  <input
                    type='radio'
                    name='severity'
                    value='low'
                    checked={severity === 'low'}
                    onChange={(e) => setSeverity(e.target.value)}
                  />
                  <div>
                    <strong>Low</strong>
                    <small>Minor observation</small>
                  </div>
                </label>

                <label className='severity-option moderate-option'>
                  <input
                    type='radio'
                    name='severity'
                    value='moderate'
                    checked={severity === 'moderate'}
                    onChange={(e) => setSeverity(e.target.value)}
                  />
                  <div>
                    <strong>Moderate</strong>
                    <small>Needs monitoring</small>
                  </div>
                </label>

                <label className='severity-option high-option'>
                  <input
                    type='radio'
                    name='severity'
                    value='high'
                    checked={severity === 'high'}
                    onChange={(e) => setSeverity(e.target.value)}
                  />
                  <div>
                    <strong>High</strong>
                    <small>Requires attention</small>
                  </div>
                </label>

                <label className='severity-option critical-option'>
                  <input
                    type='radio'
                    name='severity'
                    value='critical'
                    checked={severity === 'critical'}
                    onChange={(e) => setSeverity(e.target.value)}
                  />
                  <div>
                    <strong>Critical</strong>
                    <small>Immediate danger</small>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className='form-group'>
              <label>
                Description <span>*</span>
              </label>
              <textarea
                required
                rows='4'
                placeholder='Describe what you observed. Include details such as soil movement, cracks, debris, water flow, road blockage, or any other relevant information...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <small className='field-hint'>Please provide specific observable facts to help response teams.</small>
            </div>
          </section>

          {/* =========================
              LOCATION
          ========================= */}
          <section className='form-section'>
            <div className='form-section-header'>
              <div className='section-number'>02</div>
              <div>
                <h2>Location & GPS Coordinates</h2>
                <p>Where did you observe the incident?</p>
              </div>
            </div>

            <div className='location-grid'>
              {/* Zone */}
              <div className='form-group'>
                <label>Associated Risk Zone</label>
                <select value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
                  <option value=''>Select zone (or nearest sector)</option>
                  {zones.map((z) => (
                    <option key={z._id || z.code} value={z._id}>
                      {z.name || z.code}
                    </option>
                  ))}
                  <option value=''>Outside designated sector</option>
                </select>
              </div>

              {/* Landmark */}
              <div className='form-group'>
                <label>
                  Location / Nearby Landmark <span>*</span>
                </label>
                <div className='input-with-icon'>
                  <MapPin size={17} />
                  <input
                    type='text'
                    required
                    placeholder='e.g. Near National Highway 10 Mile 14'
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* GPS */}
            <div className='gps-box'>
              <div className='gps-icon'>
                <Navigation size={19} />
              </div>
              <div className='gps-content'>
                <strong>Capture Current GPS Coordinates</strong>
                <p>
                  {gpsStatus || `Active GeoJSON Point: [${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`}
                </p>
              </div>
              <button
                type='button'
                className='gps-button'
                onClick={handleCaptureGps}
              >
                Capture GPS
              </button>
            </div>
          </section>

          {/* =========================
              WARNING
          ========================= */}
          <div className='report-warning'>
            <div className='warning-icon'>
              <AlertTriangle size={19} />
            </div>
            <div>
              <strong>Verified Disaster Management Data</strong>
              <p>
                Please ensure all provided details are accurate. Incident reports are validated by district officers
                and correlated with live sensor models.
              </p>
            </div>
          </div>

          {/* =========================
              ACTIONS
          ========================= */}
          <div className='form-actions'>
            <Link to='/reports' className='cancel-button'>
              Cancel
            </Link>
            <button
              type='submit'
              className='submit-report-button'
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className='animate-spin' />
                  <span>Transmitting Report...</span>
                </>
              ) : (
                'Submit Incident Report'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ReportIncident;
