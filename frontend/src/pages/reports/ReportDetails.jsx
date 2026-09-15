import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  FileText,
  Image,
  CheckCircle,
  AlertTriangle,
  Eye,
  MessageSquare,
  CalendarDays,
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import './ReportDetails.css';

function ReportDetails() {
  return (
    <div className='report-details-page'>
      <Sidebar />

      <main className='report-details-main'>
        {/* HEADER */}
        <div className='report-details-header'>
          <div>
            <Link
              to='/reports'
              className='back-link'
            >
              <ArrowLeft size={18} />
              Back to Reports
            </Link>

            <div className='report-title-row'>
              <div>
                <span className='report-id'>#RPT-024</span>
                <h1>Soil Cracks Detected</h1>
                <p>Field incident report submitted from Zone A, Sikkim</p>
              </div>

              <div className='report-status-group'>
                <span className='severity-badge critical'>Critical</span>

                <span className='status-badge pending'>Pending Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className='report-details-grid'>
          {/* LEFT CONTENT */}
          <div className='report-details-left'>
            {/* INCIDENT INFORMATION */}
            <section className='details-card'>
              <div className='card-heading'>
                <div className='heading-icon'>
                  <FileText size={19} />
                </div>

                <div>
                  <h2>Incident Information</h2>
                  <p>Details provided in the field report</p>
                </div>
              </div>

              <div className='info-grid'>
                <div className='info-item'>
                  <span>Incident Type</span>
                  <strong>Soil Cracks</strong>
                </div>

                <div className='info-item'>
                  <span>Observed Severity</span>
                  <strong className='critical-text'>Critical</strong>
                </div>

                <div className='info-item'>
                  {/* <span>Monitored Zone</span> */}
                  <strong>Zone A</strong>
                </div>

                <div className='info-item'>
                  <span>Region</span>
                  <strong>Sikkim</strong>
                </div>
              </div>

              <div className='description-box'>
                <span>Description</span>

                <p>
                  Multiple soil cracks were observed near the monitored slope
                  area. The cracks appear to be increasing in size and are
                  visible along the roadside section.
                </p>
              </div>
            </section>

            {/* LOCATION */}
            <section className='details-card'>
              <div className='card-heading'>
                <div className='heading-icon'>
                  <MapPin size={19} />
                </div>

                <div>
                  <h2>Location</h2>
                  <p>Reported incident location</p>
                </div>
              </div>

              <div className='location-content'>
                <div className='location-map'>
                  <div className='map-placeholder'>
                    <MapPin size={32} />

                    <strong>Zone A — Sikkim</strong>

                    <span>Incident location map</span>
                  </div>
                </div>

                <div className='location-info'>
                  <div className='location-row'>
                    <MapPin size={17} />
                    <div>
                      <span>Location / Landmark</span>
                      <strong>Main Road, Near Mountain Slope</strong>
                    </div>
                  </div>

                  <div className='location-row'>
                    <MapPin size={17} />
                    <div>
                      <span>Coordinates</span>
                      <strong>27.5330° N, 88.5122° E</strong>
                    </div>
                  </div>

                  <Link
                    to='/zone-details'
                    className='zone-link'
                  >
                    View Zone Details →
                  </Link>
                </div>
              </div>
            </section>

            {/* PHOTOS */}
            <section className='details-card'>
              <div className='card-heading'>
                <div className='heading-icon'>
                  <Image size={19} />
                </div>

                <div>
                  <h2>Photos & Evidence</h2>
                  <p>Attachments submitted with this report</p>
                </div>
              </div>

              <div className='photo-grid'>
                <div className='photo-placeholder'>
                  <Image size={30} />
                  <span>Photo 01</span>
                </div>

                <div className='photo-placeholder'>
                  <Image size={30} />
                  <span>Photo 02</span>
                </div>

                <div className='photo-placeholder'>
                  <Image size={30} />
                  <span>Photo 03</span>
                </div>
              </div>

              <div className='attachment-info'>
                <Image size={16} />
                <span>3 Photos attached to this report</span>
              </div>
            </section>

            {/* REVIEW TIMELINE */}
            <section className='details-card'>
              <div className='card-heading'>
                <div className='heading-icon'>
                  <Clock size={19} />
                </div>

                <div>
                  <h2>Report Timeline</h2>
                  <p>Activity and review history</p>
                </div>
              </div>

              <div className='timeline'>
                <div className='timeline-item completed'>
                  <div className='timeline-icon'>
                    <CheckCircle size={17} />
                  </div>

                  <div>
                    <strong>Report Submitted</strong>
                    <span>Today, 10:05 AM</span>
                    <p>Incident report was successfully submitted.</p>
                  </div>
                </div>

                <div className='timeline-item current'>
                  <div className='timeline-icon'>
                    <Eye size={17} />
                  </div>

                  <div>
                    <strong>Pending Review</strong>
                    <span>Current Status</span>
                    <p>Waiting for authority review and verification.</p>
                  </div>
                </div>

                <div className='timeline-item'>
                  <div className='timeline-icon'>
                    <CheckCircle size={17} />
                  </div>

                  <div>
                    <strong>Resolution</strong>
                    <span>Not completed</span>
                    <p>This report will be updated after review.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className='report-details-right'>
            {/* REPORT SUMMARY */}
            <section className='side-card'>
              <h3>Report Summary</h3>

              <div className='summary-row'>
                <CalendarDays size={17} />
                <div>
                  <span>Reported On</span>
                  <strong>Today, 10:05 AM</strong>
                </div>
              </div>

              <div className='summary-row'>
                <User size={17} />
                <div>
                  <span>Reported By</span>
                  <strong>Field Officer</strong>
                </div>
              </div>

              <div className='summary-row'>
                <MapPin size={17} />
                <div>
                  <span>Location</span>
                  <strong>Zone A · Sikkim</strong>
                </div>
              </div>
            </section>

            {/* RISK WARNING */}
            <section className='warning-card'>
              <div className='warning-icon'>
                <AlertTriangle size={21} />
              </div>

              <div>
                <h3>Critical Report</h3>

                <p>
                  This report is associated with a critical-risk monitored zone.
                </p>
              </div>
            </section>

            {/* AUTHORITY ACTION */}
            <section className='side-card action-card'>
              <h3>Review Actions</h3>

              <p>
                Update the report status after reviewing the submitted
                information.
              </p>

              <button className='action-btn primary'>
                <Eye size={17} />
                Mark Under Review
              </button>

              <button className='action-btn secondary'>
                <CheckCircle size={17} />
                Mark as Resolved
              </button>

              <button className='action-btn message'>
                <MessageSquare size={17} />
                Add Review Note
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ReportDetails;
