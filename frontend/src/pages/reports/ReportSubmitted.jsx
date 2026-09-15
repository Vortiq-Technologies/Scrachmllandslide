import { Check, FileText, MapPin, ArrowRight, Home, Plus } from 'lucide-react';

import { Link } from 'react-router-dom';

import Sidebar from '../../components/Sidebar';

import './ReportSubmitted.css';

function ReportSubmitted() {
  return (
    <div className='report-submitted-page'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className='report-submitted-main'>
        <div className='success-container'>
          {/* Success Icon */}
          <div className='success-icon'>
            <Check
              size={34}
              strokeWidth={3}
            />
          </div>

          {/* Heading */}
          <span className='success-label'>REPORT SUBMITTED</span>

          <h1>Thank you for your report</h1>

          <p className='success-description'>
            Your field report has been successfully submitted. The information
            will be reviewed by the monitoring team.
          </p>

          {/* Report ID Card */}
          <div className='submitted-card'>
            <div className='submitted-card-header'>
              <div className='submitted-icon'>
                <FileText size={20} />
              </div>

              <div>
                <span>Report ID</span>

                <strong>#RPT-025</strong>
              </div>
            </div>

            <div className='submitted-details'>
              <div className='submitted-detail'>
                <MapPin size={16} />

                <div>
                  <span>Location</span>
                  <strong>Zone A · Sikkim</strong>
                </div>
              </div>

              <div className='submitted-detail'>
                <FileText size={16} />

                <div>
                  <span>Status</span>

                  <strong className='pending-status'>Pending Review</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className='success-info'>
            <strong>What happens next?</strong>

            <p>
              Our monitoring team will review your report and assess the
              information provided. You can track the status of your report from
              the Reports section.
            </p>
          </div>

          {/* Actions */}
          <div className='success-actions'>
            <Link
              to='/reports'
              className='primary-success-button'
            >
              <FileText size={16} />
              View My Reports
              <ArrowRight size={16} />
            </Link>

            <Link
              to='/reportIncident'
              className='secondary-success-button'
            >
              <Plus size={16} />
              Submit Another Report
            </Link>
          </div>

          {/* Home */}
          <Link
            to='/dashboard'
            className='back-home-link'
          >
            <Home size={15} />
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ReportSubmitted;
