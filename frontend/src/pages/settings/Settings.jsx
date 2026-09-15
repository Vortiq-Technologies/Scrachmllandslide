import {
  Bell,
  Shield,
  User,
  Lock,
  Smartphone,
  Mail,
  Save,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import './Settings.css';

function Settings() {
  return (
    <div className='settings-page'>
      {/* ================= SIDEBAR ================= */}

      <aside className='settings-sidebar'>
        <Sidebar />
      </aside>

      {/* ================= MAIN ================= */}

      <main className='settings-main'>
        {/* ================= HEADER ================= */}

        <div className='settings-header'>
          <div>
            <h1>Settings</h1>
            <p>Manage your account, notifications and system preferences</p>
          </div>

          <div className='settings-status'>
            <CheckCircle size={15} />
            System Operational
          </div>
        </div>

        {/* ================= PROFILE CARD ================= */}

        <section className='settings-profile-card'>
          <div className='profile-avatar'>A</div>

          <div className='profile-content'>
            <h2>Anchal</h2>
            <p>Field Officer</p>
            <span>Field Operations & Monitoring</span>
          </div>

          <button className='edit-profile-btn'>
            <User size={16} />
            Edit Profile
          </button>
        </section>

        {/* ================= SETTINGS GRID ================= */}

        <div className='settings-layout'>
          {/* ================= LEFT ================= */}

          <div className='settings-left'>
            {/* ACCOUNT SETTINGS */}

            <section className='settings-card'>
              <div className='settings-card-header'>
                <div className='settings-section-icon'>
                  <User size={18} />
                </div>

                <div>
                  <h2>Account Settings</h2>
                  <p>Manage your personal account information</p>
                </div>
              </div>

              <div className='settings-fields'>
                <div className='settings-field'>
                  <label>Full Name</label>

                  <input
                    type='text'
                    value='Anchal'
                    readOnly
                  />
                </div>

                <div className='settings-field'>
                  <label>Email Address</label>

                  <div className='input-with-icon'>
                    <Mail size={16} />

                    <input
                      type='email'
                      value='anchal@example.com'
                      readOnly
                    />
                  </div>
                </div>

                <div className='settings-field'>
                  <label>Role</label>

                  <input
                    type='text'
                    value='Field Officer'
                    readOnly
                  />
                </div>

                <div className='settings-field'>
                  <label>Assigned Region</label>

                  <input
                    type='text'
                    value='North Eastern Region'
                    readOnly
                  />
                </div>
              </div>
            </section>

            {/* NOTIFICATION SETTINGS */}

            <section className='settings-card'>
              <div className='settings-card-header'>
                <div className='settings-section-icon'>
                  <Bell size={18} />
                </div>

                <div>
                  <h2>Notification Preferences</h2>
                  <p>Choose which alerts and updates you receive</p>
                </div>
              </div>

              <div className='setting-option'>
                <div className='setting-option-icon alert-option'>
                  <Bell size={17} />
                </div>

                <div className='setting-option-content'>
                  <strong>Critical Risk Alerts</strong>

                  <span>
                    Receive immediate notifications for critical landslide risk
                  </span>
                </div>

                <label className='toggle'>
                  <input
                    type='checkbox'
                    defaultChecked
                  />
                  <span className='toggle-slider'></span>
                </label>
              </div>

              <div className='setting-option'>
                <div className='setting-option-icon rain-option'>
                  <Bell size={17} />
                </div>

                <div className='setting-option-content'>
                  <strong>Weather & Rainfall Alerts</strong>

                  <span>
                    Get notified when rainfall conditions become risky
                  </span>
                </div>

                <label className='toggle'>
                  <input
                    type='checkbox'
                    defaultChecked
                  />
                  <span className='toggle-slider'></span>
                </label>
              </div>

              <div className='setting-option'>
                <div className='setting-option-icon report-option'>
                  <Mail size={17} />
                </div>

                <div className='setting-option-content'>
                  <strong>Report Updates</strong>

                  <span>Receive updates about submitted incident reports</span>
                </div>

                <label className='toggle'>
                  <input
                    type='checkbox'
                    defaultChecked
                  />
                  <span className='toggle-slider'></span>
                </label>
              </div>
            </section>

            {/* SECURITY */}

            <section className='settings-card'>
              <div className='settings-card-header'>
                <div className='settings-section-icon'>
                  <Lock size={18} />
                </div>

                <div>
                  <h2>Security</h2>
                  <p>Protect your account and login information</p>
                </div>
              </div>

              <button className='security-row'>
                <div className='security-row-left'>
                  <div className='security-icon'>
                    <Lock size={17} />
                  </div>

                  <div>
                    <strong>Change Password</strong>

                    <span>Update your account password</span>
                  </div>
                </div>

                <ChevronRight size={18} />
              </button>

              <button className='security-row'>
                <div className='security-row-left'>
                  <div className='security-icon'>
                    <Shield size={17} />
                  </div>

                  <div>
                    <strong>Two-Factor Authentication</strong>

                    <span>Add an extra layer of account security</span>
                  </div>
                </div>

                <span className='security-status'>Disabled</span>

                <ChevronRight size={18} />
              </button>
            </section>
          </div>

          {/* ================= RIGHT ================= */}

          <div className='settings-right'>
            {/* SYSTEM STATUS */}

            <section className='settings-card system-settings-card'>
              <div className='settings-card-header'>
                <div className='settings-section-icon'>
                  <Shield size={18} />
                </div>

                <div>
                  <h2>System Status</h2>
                  <p>Current monitoring system status</p>
                </div>
              </div>

              <div className='system-status-box'>
                <div className='system-status-circle'>
                  <CheckCircle size={21} />
                </div>

                <div>
                  <strong>All Systems Operational</strong>

                  <span>Monitoring services are running normally</span>
                </div>
              </div>

              <div className='system-metric'>
                <span>Sensor Network</span>

                <strong className='online-text'>Online</strong>
              </div>

              <div className='system-metric'>
                <span>Risk Prediction</span>

                <strong className='online-text'>Active</strong>
              </div>

              <div className='system-metric'>
                <span>Alert Service</span>

                <strong className='online-text'>Active</strong>
              </div>

              <div className='system-metric'>
                <span>Last System Check</span>

                <strong>10:24 AM</strong>
              </div>
            </section>

            {/* APP SETTINGS */}

            <section className='settings-card'>
              <div className='settings-card-header'>
                <div className='settings-section-icon'>
                  <Smartphone size={18} />
                </div>

                <div>
                  <h2>Application</h2>
                  <p>Application preferences</p>
                </div>
              </div>

              <div className='application-row'>
                <div>
                  <strong>Language</strong>

                  <span>Select application language</span>
                </div>

                <select defaultValue='English'>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>

              <div className='application-row'>
                <div>
                  <strong>Risk Alert Sound</strong>

                  <span>Play sound for critical alerts</span>
                </div>

                <label className='toggle'>
                  <input
                    type='checkbox'
                    defaultChecked
                  />
                  <span className='toggle-slider'></span>
                </label>
              </div>
            </section>

            {/* SAVE */}

            <button className='save-settings-btn'>
              <Save size={17} />
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
