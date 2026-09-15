import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  Calendar,
  Activity,
  Bell,
  FileText,
  AlertTriangle,
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import './Profile.css';

function Profile() {
  return (
    <div className='profile-page'>
      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN ================= */}

      <main className='profile-main'>
        {/* Header */}

        <div className='profile-header'>
          <div>
            <h1>My Profile</h1>
            <p>Manage your account and field officer information</p>
          </div>

          <button className='edit-profile-btn'>
            <Edit3 size={16} />
            Edit Profile
          </button>
        </div>

        {/* ================= PROFILE OVERVIEW ================= */}

        <section className='profile-overview'>
          <div className='profile-avatar-large'>
            <User size={42} />
          </div>

          <div className='profile-main-info'>
            <h2>Anchal</h2>
            <p>Field Officer</p>

            <div className='profile-status'>
              <span></span>
              Active Account
            </div>
          </div>

          <div className='profile-role'>
            <ShieldCheck size={20} />
            <div>
              <span>Role</span>
              <strong>Field Officer</strong>
            </div>
          </div>
        </section>

        {/* ================= CONTENT GRID ================= */}

        <div className='profile-grid'>
          {/* Personal Information */}

          <section className='profile-card'>
            <div className='card-title'>
              <div className='title-icon'>
                <User size={18} />
              </div>

              <div>
                <h3>Personal Information</h3>
                <p>Your basic account information</p>
              </div>
            </div>

            <div className='info-list'>
              <div className='info-row'>
                <div className='info-icon'>
                  <User size={17} />
                </div>

                <div>
                  <span>Full Name</span>
                  <strong>Anchal</strong>
                </div>
              </div>

              <div className='info-row'>
                <div className='info-icon'>
                  <Mail size={17} />
                </div>

                <div>
                  <span>Email Address</span>
                  <strong>anchal@example.com</strong>
                </div>
              </div>

              <div className='info-row'>
                <div className='info-icon'>
                  <Phone size={17} />
                </div>

                <div>
                  <span>Phone Number</span>
                  <strong>+91 XXXXX XXXXX</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Assignment Information */}

          <section className='profile-card'>
            <div className='card-title'>
              <div className='title-icon'>
                <MapPin size={18} />
              </div>

              <div>
                <h3>Field Assignment</h3>
                <p>Your current monitoring assignment</p>
              </div>
            </div>

            <div className='assignment-box'>
              <div className='assignment-icon'>
                <MapPin size={22} />
              </div>

              <div>
                <span>Assigned Region</span>
                <strong>North Eastern Region</strong>
              </div>
            </div>

            <div className='assignment-details'>
              <div>
                <span>Monitoring Zones</span>
                <strong>5 Zones</strong>
              </div>

              <div>
                <span>Critical Zones</span>
                <strong className='critical-value'>2</strong>
              </div>
            </div>
          </section>
        </div>

        {/* ================= ACTIVITY ================= */}

        <section className='profile-card activity-card'>
          <div className='card-title'>
            <div className='title-icon'>
              <Activity size={18} />
            </div>

            <div>
              <h3>Activity Overview</h3>
              <p>Your recent activity on the monitoring system</p>
            </div>
          </div>

          <div className='activity-grid'>
            <div className='activity-item'>
              <div className='activity-item-icon'>
                <FileText size={20} />
              </div>

              <div>
                <strong>24</strong>
                <span>Reports Submitted</span>
              </div>
            </div>

            <div className='activity-item'>
              <div className='activity-item-icon'>
                <AlertTriangle size={20} />
              </div>

              <div>
                <strong>8</strong>
                <span>Alerts Reviewed</span>
              </div>
            </div>

            <div className='activity-item'>
              <div className='activity-item-icon'>
                <Bell size={20} />
              </div>

              <div>
                <strong>17</strong>
                <span>Notifications</span>
              </div>
            </div>

            <div className='activity-item'>
              <div className='activity-item-icon'>
                <Calendar size={20} />
              </div>

              <div>
                <strong>6 Months</strong>
                <span>Account Activity</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ACCOUNT STATUS ================= */}

        <section className='account-status-card'>
          <div className='account-status-left'>
            <div className='status-check'>
              <ShieldCheck size={21} />
            </div>

            <div>
              <h3>Account Security</h3>
              <p>Your account is protected and currently active.</p>
            </div>
          </div>

          <span className='secure-badge'>Secure</span>
        </section>
      </main>
    </div>
  );
}

export default Profile;
