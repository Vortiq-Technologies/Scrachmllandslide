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
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';

import { Link } from 'react-router-dom';

import './Reports.css';

function Reports() {
  return (
    <div className='reports-page'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className='reports-main'>
        {/* ================= HEADER ================= */}

        <div className='reports-header'>
          <div>
            <span className='page-eyebrow'>FIELD MONITORING</span>

            <h1>Reports</h1>

            <p>Review and manage field incident reports</p>
          </div>

          <div className='reports-header-actions'>
            <Link
              to='/reportsIncident'
              className='create-report-btn'
            >
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

            <strong>24</strong>

            <small>All submitted reports</small>
          </div>

          <div className='report-summary-card'>
            <div className='summary-top'>
              <span>Pending Review</span>

              <div className='summary-icon orange'>
                <FileWarning size={17} />
              </div>
            </div>

            <strong className='pending-number'>8</strong>

            <small>Need attention</small>
          </div>

          <div className='report-summary-card'>
            <div className='summary-top'>
              <span>Under Review</span>

              <div className='summary-icon blue'>
                <Eye size={17} />
              </div>
            </div>

            <strong className='review-number'>5</strong>

            <small>Currently reviewing</small>
          </div>

          <div className='report-summary-card'>
            <div className='summary-top'>
              <span>Resolved</span>

              <div className='summary-icon success'>
                <CheckCircle2 size={17} />
              </div>
            </div>

            <strong className='resolved-number'>11</strong>

            <small>Successfully resolved</small>
          </div>
        </div>

        {/* ================= FILTERS ================= */}

        <div className='reports-filters'>
          <div className='report-search'>
            <Search size={17} />

            <input
              type='text'
              placeholder='Search reports, locations...'
            />
          </div>

          <button className='filter-button'>
            <Filter size={15} />
            All Status
          </button>

          <button className='filter-button'>
            <MapPin size={15} />
            All Zones
          </button>

          <button className='filter-button'>Recent</button>
        </div>

        {/* ================= REPORT SECTION ================= */}

        <section className='reports-section'>
          <div className='section-heading'>
            <div>
              <span className='section-label'>INCIDENT LOG</span>

              <h2>Recent Reports</h2>

              <p>Latest field reports submitted by users</p>
            </div>

            <span className='report-count'>24 Reports</span>
          </div>

          {/* ================= REPORT 1 ================= */}

          <div className='report-card'>
            <div className='report-card-left'>
              <div className='report-icon critical-report'>!</div>

              <div className='report-content'>
                <div className='report-title-row'>
                  <h3>Soil Cracks Detected</h3>

                  <span className='severity-badge critical'>CRITICAL</span>
                </div>

                <div className='report-location'>
                  <MapPin size={13} />
                  Zone A · Sikkim
                </div>

                <p>
                  Large cracks observed near the hillside after continuous
                  rainfall.
                </p>

                <div className='report-meta'>
                  <span>
                    <Clock size={13} />
                    Today, 10:05 AM
                  </span>

                  <span>Report ID: #RPT-024</span>

                  <span>
                    <Camera size={13} />3 Photos
                  </span>
                </div>
              </div>
            </div>

            <div className='report-card-right'>
              <span className='status-badge pending'>Pending Review</span>

              <Link
                to='/report-details'
                className='view-report'
              >
                View Details
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          {/* ================= REPORT 2 ================= */}

          <div className='report-card'>
            <div className='report-card-left'>
              <div className='report-icon high-report'>!</div>

              <div className='report-content'>
                <div className='report-title-row'>
                  <h3>Small Landslide Observed</h3>

                  <span className='severity-badge high'>HIGH</span>
                </div>

                <div className='report-location'>
                  <MapPin size={13} />
                  Zone D · Sikkim
                </div>

                <p>Minor soil movement and debris observed beside the road.</p>

                <div className='report-meta'>
                  <span>
                    <Clock size={13} />
                    Today, 09:24 AM
                  </span>

                  <span>Report ID: #RPT-023</span>

                  <span>
                    <Camera size={13} />2 Photos
                  </span>
                </div>
              </div>
            </div>

            <div className='report-card-right'>
              <span className='status-badge reviewing'>Under Review</span>

              <Link
                to='/report-details'
                className='view-report'
              >
                View Details
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          {/* ================= REPORT 3 ================= */}

          <div className='report-card'>
            <div className='report-card-left'>
              <div className='report-icon moderate-report'>i</div>

              <div className='report-content'>
                <div className='report-title-row'>
                  <h3>Waterlogging Near Slope</h3>

                  <span className='severity-badge moderate'>MODERATE</span>
                </div>

                <div className='report-location'>
                  <MapPin size={13} />
                  Zone B · Sikkim
                </div>

                <p>
                  Water accumulation reported near the monitored slope area.
                </p>

                <div className='report-meta'>
                  <span>
                    <Clock size={13} />
                    Today, 08:42 AM
                  </span>

                  <span>Report ID: #RPT-022</span>

                  <span>
                    <Camera size={13} />1 Photo
                  </span>
                </div>
              </div>
            </div>

            <div className='report-card-right'>
              <span className='status-badge resolved'>Resolved</span>

              <Link
                to='/report-details'
                className='view-report'
              >
                View Details
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          {/* ================= REPORT 4 ================= */}

          <div className='report-card'>
            <div className='report-card-left'>
              <div className='report-icon low-report'>✓</div>

              <div className='report-content'>
                <div className='report-title-row'>
                  <h3>Minor Surface Erosion</h3>

                  <span className='severity-badge low'>LOW</span>
                </div>

                <div className='report-location'>
                  <MapPin size={13} />
                  Zone C · Sikkim
                </div>

                <p>Minor erosion observed along the roadside after rainfall.</p>

                <div className='report-meta'>
                  <span>
                    <Clock size={13} />
                    Yesterday, 06:18 PM
                  </span>

                  <span>Report ID: #RPT-021</span>

                  <span>
                    <Camera size={13} />2 Photos
                  </span>
                </div>
              </div>
            </div>

            <div className='report-card-right'>
              <span className='status-badge resolved'>Resolved</span>

              <Link
                to='/report-details'
                className='view-report'
              >
                View Details
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reports;
