import {
  ArrowLeft,
  MapPin,
  Camera,
  Video,
  Upload,
  AlertTriangle,
  Navigation,
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

import Sidebar from '../../components/Sidebar';

import './ReportIncident.css';

function ReportIncident() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend demo ke liye
    navigate('/reportSubmitted');
  };

  return (
    <div className='report-incident-page'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className='report-incident-main'>
        {/* Back */}
        <Link
          to='/reports'
          className='back-to-reports'
        >
          <ArrowLeft size={17} />
          Back to Reports
        </Link>

        {/* Header */}
        <div className='incident-header'>
          <div>
            <h1>Report an Incident</h1>

            <p>Submit a field observation or suspected landslide incident</p>
          </div>

          <div className='field-report-label'>FIELD REPORT</div>
        </div>

        {/* Form */}
        <form
          className='incident-form'
          onSubmit={handleSubmit}
        >
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
                Incident Type
                <span>*</span>
              </label>

              <select required>
                <option value=''>Select incident type</option>

                <option>Landslide</option>

                <option>Soil Cracks</option>

                <option>Rockfall</option>

                <option>Soil Movement</option>

                <option>Waterlogging</option>

                <option>Surface Erosion</option>

                <option>Other</option>
              </select>
            </div>

            {/* Severity */}

            <div className='form-group'>
              <label>
                Observed Severity
                <span>*</span>
              </label>

              <div className='severity-options'>
                <label className='severity-option low-option'>
                  <input
                    type='radio'
                    name='severity'
                    value='low'
                    required
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
                  />

                  <div>
                    <strong>Critical</strong>
                    <small>Immediate attention</small>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}

            <div className='form-group'>
              <label>
                Description
                <span>*</span>
              </label>

              <textarea
                required
                rows='5'
                placeholder='Describe what you observed. Include details such as soil movement, cracks, debris, water flow, road blockage, or any other relevant information...'
              ></textarea>

              <small className='field-hint'>
                Please provide as much detail as possible.
              </small>
            </div>
          </section>

          {/* =========================
              LOCATION
          ========================= */}

          <section className='form-section'>
            <div className='form-section-header'>
              <div className='section-number'>02</div>

              <div>
                <h2>Location</h2>

                <p>Where did you observe the incident?</p>
              </div>
            </div>

            <div className='location-grid'>
              {/* Zone */}

              <div className='form-group'>
                <label>Monitored Zone</label>

                <select>
                  <option value=''>Select zone</option>

                  <option>Zone A — Sikkim</option>

                  <option>Zone B — Sikkim</option>

                  <option>Zone C — Sikkim</option>

                  <option>Zone D — Sikkim</option>

                  <option>Zone E — Sikkim</option>

                  <option>Outside monitored zone</option>
                </select>
              </div>

              {/* Location */}

              <div className='form-group'>
                <label>
                  Location / Landmark
                  <span>*</span>
                </label>

                <div className='input-with-icon'>
                  <MapPin size={17} />

                  <input
                    type='text'
                    required
                    placeholder='Enter nearby landmark or location'
                  />
                </div>
              </div>
            </div>

            {/* GPS */}

            <div className='gps-box'>
              <div className='gps-icon'>
                <Navigation size={18} />
              </div>

              <div className='gps-content'>
                <strong>Capture Current Location</strong>

                <p>
                  Use your device GPS to automatically attach the incident
                  coordinates.
                </p>
              </div>

              <button
                type='button'
                className='gps-button'
              >
                Get Location
              </button>
            </div>
          </section>

          {/* =========================
              MEDIA
          ========================= */}

          <section className='form-section'>
            <div className='form-section-header'>
              <div className='section-number'>03</div>

              <div>
                <h2>Photos & Videos</h2>

                <p>Add visual evidence if available.</p>
              </div>
            </div>

            <div className='upload-area'>
              <div className='upload-icon'>
                <Upload size={22} />
              </div>

              <h3>Upload photos or videos</h3>

              <p>Add images or short videos of the incident area.</p>

              <div className='upload-buttons'>
                <button
                  type='button'
                  className='upload-button'
                >
                  <Camera size={16} />
                  Add Photos
                </button>

                <button
                  type='button'
                  className='upload-button'
                >
                  <Video size={16} />
                  Add Video
                </button>
              </div>

              <small>Supported: JPG, PNG, MP4 · Max 10 MB each</small>
            </div>
          </section>

          {/* =========================
              WARNING
          ========================= */}

          <div className='report-warning'>
            <AlertTriangle size={20} />

            <div>
              <strong>Important</strong>

              <p>
                Please submit accurate information. This report may be used by
                authorities to assess landslide risk and take appropriate
                action.
              </p>
            </div>
          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className='form-actions'>
            <Link
              to='/reports'
              className='cancel-button'
            >
              Cancel
            </Link>

            <button
              type='submit'
              className='submit-report-button'
            >
              Submit Report
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ReportIncident;
