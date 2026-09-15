import {
  Search,
  Filter,
  MapPin,
  Clock,
  Camera,
  ChevronRight,
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
        {/* Header */}
        <div className='reports-header'>
          <div>
            <h1>Reports</h1>

            <p>Review and manage field incident reports</p>
          </div>

          <Link
            to='/reportsIncident'
            className='create-report-btn'
          >
            + Report Incident
          </Link>
        </div>

        {/* Summary Cards */}
        <div className='report-summary'>
          <div className='report-summary-card'>
            <span>Total Reports</span>
            <strong>24</strong>
            <small>All submitted reports</small>
          </div>

          <div className='report-summary-card'>
            <span>Pending Review</span>
            <strong className='pending-number'>8</strong>
            <small>Need attention</small>
          </div>

          <div className='report-summary-card'>
            <span>Under Review</span>
            <strong className='review-number'>5</strong>
            <small>Currently reviewing</small>
          </div>

          <div className='report-summary-card'>
            <span>Resolved</span>
            <strong className='resolved-number'>11</strong>
            <small>Successfully resolved</small>
          </div>
        </div>

        {/* Filters */}
        <div className='reports-filters'>
          <div className='report-search'>
            <Search size={18} />

            <input
              type='text'
              placeholder='Search reports, locations...'
            />
          </div>

          <button className='filter-button'>
            <Filter size={16} />
            All Status
          </button>

          <button className='filter-button'>
            <MapPin size={16} />
            All Zones
          </button>

          <button className='filter-button'>Recent</button>
        </div>

        {/* Reports Section */}
        <section className='reports-section'>
          <div className='section-heading'>
            <div>
              <h2>Recent Reports</h2>
              <p>Latest field reports submitted by users</p>
            </div>

            <span className='report-count'>24 Reports</span>
          </div>

          {/* Report Card 1 */}
          <div className='report-card'>
            <div className='report-card-left'>
              <div className='report-icon critical-report'>⚠</div>

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
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Report Card 2 */}
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
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Report Card 3 */}
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
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Report Card 4 */}
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
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reports;
