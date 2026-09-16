import {
  Cpu,
  MapPin,
  Wifi,
  Settings,
  ShieldAlert,
  ArrowLeft,
  Plus,
  Info,
} from 'lucide-react';

import './AddSensor.css';
import Sidebar from '../../components/Sidebar';

function AddSensor() {
  return (
    <div className='add-sensor-page'>
      {/* SIDEBAR */}
      <aside className='add-sensor-sidebar'>
        <Sidebar />
      </aside>

      {/* MAIN */}
      <main className='add-sensor-main'>
        {/* HEADER */}
        <div className='add-sensor-topbar'>
          <div>
            <a
              href='/sensors'
              className='back-link'
            >
              <ArrowLeft size={14} />
              Back to Sensor Network
            </a>

            <div className='page-heading'>
              <div className='page-heading-icon'>
                <Cpu size={22} />
              </div>

              <div>
                <span>DEVICE MANAGEMENT</span>
                <h1>ADD SENSOR</h1>
                <p>
                  Register a new ESP32 device and configure its monitoring
                  settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className='add-sensor-layout'>
          {/* LEFT FORM */}
          <section className='sensor-form-card'>
            <div className='form-card-header'>
              <div>
                <h2>Sensor Information</h2>
                <p>Enter the basic details of the new monitoring device.</p>
              </div>

              <div className='required-note'>* Required</div>
            </div>

            {/* BASIC DETAILS */}
            <div className='form-section'>
              <div className='section-title'>
                <Cpu size={15} />
                <span>Basic Details</span>
              </div>

              <div className='form-grid'>
                <div className='form-group'>
                  <label>
                    Sensor Name <span>*</span>
                  </label>

                  <input
                    type='text'
                    placeholder='e.g. East Slope Monitor'
                  />
                </div>

                <div className='form-group'>
                  <label>
                    Sensor ID <span>*</span>
                  </label>

                  <input
                    type='text'
                    placeholder='ESP32-004'
                  />

                  <small>Unique ID assigned to this ESP32 device.</small>
                </div>

                <div className='form-group full-width'>
                  <label>
                    Sensor Location <span>*</span>
                  </label>

                  <div className='input-with-icon'>
                    <MapPin size={14} />

                    <input
                      type='text'
                      placeholder='e.g. East Slope — Main Ridge'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* LOCATION */}
            <div className='form-section'>
              <div className='section-title'>
                <MapPin size={15} />
                <span>Location Coordinates</span>
              </div>

              <div className='form-grid'>
                <div className='form-group'>
                  <label>Latitude</label>

                  <input
                    type='text'
                    placeholder='31.2534'
                  />
                </div>

                <div className='form-group'>
                  <label>Longitude</label>

                  <input
                    type='text'
                    placeholder='75.7031'
                  />
                </div>
              </div>

              <div className='location-info'>
                <Info size={13} />
                <span>
                  Coordinates help map the sensor location and improve
                  location-based risk analysis.
                </span>
              </div>
            </div>

            {/* CONNECTION */}
            <div className='form-section'>
              <div className='section-title'>
                <Wifi size={15} />
                <span>Connection Settings</span>
              </div>

              <div className='form-grid'>
                <div className='form-group'>
                  <label>WiFi Network</label>

                  <input
                    type='text'
                    placeholder='Network name'
                  />
                </div>

                <div className='form-group'>
                  <label>Backend API URL</label>

                  <input
                    type='text'
                    placeholder='https://your-api-url.com'
                  />
                </div>
              </div>
            </div>

            {/* RISK SETTINGS */}
            <div className='form-section'>
              <div className='section-title'>
                <ShieldAlert size={15} />
                <span>Risk Thresholds</span>
              </div>

              <p className='section-description'>
                Configure the values used to determine sensor risk levels.
              </p>

              <div className='threshold-grid'>
                <div className='threshold-card'>
                  <span>Soil Moisture</span>

                  <div className='threshold-input'>
                    <input
                      type='number'
                      placeholder='70'
                    />
                    <b>%</b>
                  </div>

                  <small>High risk threshold</small>
                </div>

                <div className='threshold-card'>
                  <span>Water Level</span>

                  <div className='threshold-input'>
                    <input
                      type='number'
                      placeholder='60'
                    />
                    <b>cm</b>
                  </div>

                  <small>High risk threshold</small>
                </div>

                <div className='threshold-card'>
                  <span>Tilt</span>

                  <div className='threshold-input'>
                    <input
                      type='number'
                      step='0.1'
                      placeholder='4.0'
                    />
                    <b>°</b>
                  </div>

                  <small>High risk threshold</small>
                </div>

                <div className='threshold-card'>
                  <span>Vibration</span>

                  <div className='threshold-input'>
                    <input
                      type='number'
                      placeholder='3'
                    />
                    <b>level</b>
                  </div>

                  <small>High risk threshold</small>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className='form-actions'>
              <a
                href='/sensors'
                className='cancel-btn'
              >
                Cancel
              </a>

              <button className='submit-sensor-btn'>
                <Plus size={15} />
                Add Sensor
              </button>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <aside className='sensor-info-panel'>
            {/* PREVIEW */}
            <div className='sensor-preview-card'>
              <div className='preview-header'>
                <span>DEVICE PREVIEW</span>

                <div className='preview-dot'></div>
              </div>

              <div className='preview-device'>
                <div className='preview-icon'>
                  <Cpu size={24} />
                </div>

                <div>
                  <strong>New Sensor</strong>
                  <span>ESP32-004</span>
                </div>
              </div>

              <div className='preview-status'>
                <span className='status-dot'></span>
                WAITING FOR CONNECTION
              </div>

              <div className='preview-readings'>
                <div>
                  <span>Soil</span>
                  <strong>--</strong>
                </div>

                <div>
                  <span>Water</span>
                  <strong>--</strong>
                </div>

                <div>
                  <span>Tilt</span>
                  <strong>--</strong>
                </div>

                <div>
                  <span>Vibration</span>
                  <strong>--</strong>
                </div>
              </div>
            </div>

            {/* SETUP GUIDE */}
            <div className='setup-card'>
              <div className='setup-header'>
                <Settings size={15} />

                <div>
                  <h2>Setup Checklist</h2>
                  <span>Before deploying the ESP32</span>
                </div>
              </div>

              <div className='setup-step'>
                <div>1</div>

                <section>
                  <strong>Flash firmware</strong>
                  <p>Upload the landslide monitoring firmware to the ESP32.</p>
                </section>
              </div>

              <div className='setup-step'>
                <div>2</div>

                <section>
                  <strong>Configure WiFi</strong>
                  <p>Add WiFi credentials and the backend API URL.</p>
                </section>
              </div>

              <div className='setup-step'>
                <div>3</div>

                <section>
                  <strong>Set Sensor ID</strong>
                  <p>Make sure the SENSOR_ID matches the ID above.</p>
                </section>
              </div>

              <div className='setup-step'>
                <div>4</div>

                <section>
                  <strong>Deploy device</strong>
                  <p>Install the ESP32 at the selected monitoring location.</p>
                </section>
              </div>
            </div>

            {/* INFO */}
            <div className='deployment-note'>
              <Info size={15} />

              <div>
                <strong>How it works</strong>

                <p>
                  Once the ESP32 connects to your backend, it will automatically
                  appear in the Sensor Network.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default AddSensor;
