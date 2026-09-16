import {
  Cpu,
  Plus,
  Wifi,
  WifiOff,
  AlertTriangle,
  MapPin,
  Droplets,
  Activity,
  Gauge,
  Battery,
  Radio,
  Settings,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

import './SensorNetwork.css';
import Sidebar from '../../components/Sidebar';

function SensorNetwork() {
  const sensors = [
    {
      name: 'Primary Monitor',
      location: 'LPU Campus, Punjab',
      id: 'ESP32-001',
      status: 'ONLINE',
      risk: 'LOW',
      score: 20,
      soil: '7%',
      water: '2cm',
      tilt: '0°',
      vibration: 'None',
      lastSeen: '09:32:18',
      reading: '1240',
      battery: '96%',
      type: 'online',
    },
    {
      name: 'North Slope Sensor',
      location: 'Slope A — North Face',
      id: 'ESP32-002',
      status: 'DEMO',
      risk: 'MEDIUM',
      score: 45,
      soil: '45%',
      water: '30cm',
      tilt: '2.5°',
      vibration: '1',
      lastSeen: 'Demo mode',
      reading: '0',
      battery: '87%',
      type: 'demo',
    },
    {
      name: 'River Bank Monitor',
      location: 'River Edge — South',
      id: 'ESP32-003',
      status: 'DEMO',
      risk: 'HIGH',
      score: 72,
      soil: '78%',
      water: '85cm',
      tilt: '5.2°',
      vibration: '3',
      lastSeen: 'Demo mode',
      reading: '0',
      battery: '42%',
      type: 'demo',
    },
  ];

  return (
    <div className='sensor-page'>
      {/* =========================================
          SIDEBAR / NAVIGATION
      ========================================= */}

      <aside className='sensor-sidebar'>
        <Sidebar />
      </aside>

      {/* =========================================
          MAIN
      ========================================= */}

      <main className='sensor-main'>
        {/* =========================================
            HERO
        ========================================= */}

        <section className='sensor-hero'>
          <div className='sensor-hero-content'>
            <div className='sensor-hero-icon'>
              <Cpu size={24} />
            </div>

            <div>
              <span className='sensor-eyebrow'>MULTI-SENSOR MONITORING</span>

              <h1>SENSOR NETWORK</h1>

              <p>
                Multi-sensor deployment dashboard. Monitor multiple ESP32 units
                across different locations. Each sensor has its own ML-powered
                risk assessment.
              </p>
            </div>
          </div>

          <a
            href='/add-sensor'
            className='add-sensor-btn'
          >
            <Plus size={14} />
            Add Sensor
          </a>
        </section>

        {/* =========================================
            OVERVIEW
        ========================================= */}

        <section className='sensor-overview'>
          <div className='sensor-stat'>
            <div className='sensor-stat-icon total'>
              <Cpu size={17} />
            </div>

            <strong>3</strong>
            <span>Total Sensors</span>
          </div>

          <div className='sensor-stat'>
            <div className='sensor-stat-icon online'>
              <Wifi size={17} />
            </div>

            <strong className='online-number'>1</strong>
            <span>Online</span>
          </div>

          <div className='sensor-stat'>
            <div className='sensor-stat-icon offline'>
              <WifiOff size={17} />
            </div>

            <strong>2</strong>
            <span>Offline / Demo</span>
          </div>

          <div className='sensor-stat'>
            <div className='sensor-stat-icon critical'>
              <AlertTriangle size={17} />
            </div>

            <strong className='critical-number'>1</strong>
            <span>High/Critical Risk</span>
          </div>
        </section>

        {/* =========================================
            WARNING
        ========================================= */}

        <div className='sensor-warning'>
          <AlertTriangle size={15} />

          <div>
            <strong>1 sensor reporting elevated risk</strong>

            <span>Check sensor details below for specific alerts.</span>
          </div>
        </div>

        {/* =========================================
            SENSOR CARDS
        ========================================= */}

        <section className='sensor-grid'>
          {sensors.map((sensor) => (
            <article
              className={`sensor-card ${sensor.type === 'online' ? 'active-sensor' : ''}`}
              key={sensor.id}
            >
              {/* CARD HEADER */}

              <div className='sensor-card-header'>
                <div className='sensor-name-wrapper'>
                  <div className={`sensor-device-icon ${sensor.type}`}>
                    <Radio size={15} />
                  </div>

                  <div>
                    <h3>{sensor.name}</h3>

                    <span className='sensor-location'>
                      <MapPin size={9} />
                      {sensor.location}
                    </span>
                  </div>
                </div>

                <div className='sensor-status-wrapper'>
                  <span className={`sensor-status ${sensor.type}`}>
                    <i></i>
                    {sensor.status}
                  </span>

                  <small>{sensor.id}</small>
                </div>
              </div>

              {/* RISK BADGE */}

              <div className={`sensor-risk-badge ${sensor.risk.toLowerCase()}`}>
                <span>{sensor.risk}</span>
                <span>— Score: {sensor.score}/100</span>
              </div>

              {/* READINGS */}

              <div className='sensor-readings'>
                <div className='reading-item'>
                  <span>Soil</span>
                  <strong>{sensor.soil}</strong>
                </div>

                <div className='reading-item'>
                  <span>Water</span>
                  <strong>{sensor.water}</strong>
                </div>

                <div className='reading-item'>
                  <span>Tilt</span>
                  <strong>{sensor.tilt}</strong>
                </div>

                <div className='reading-item'>
                  <span>Vibration</span>
                  <strong>{sensor.vibration}</strong>
                </div>
              </div>

              {/* FOOTER */}

              <div className='sensor-card-footer'>
                <span>Last seen: {sensor.lastSeen}</span>

                <span>Reading: {sensor.reading}</span>
              </div>

              {/* BATTERY */}

              <div className='sensor-battery'>
                <Battery size={11} />

                <div className='battery-track'>
                  <div
                    className='battery-fill'
                    style={{ width: sensor.battery }}
                  ></div>
                </div>

                <span>{sensor.battery}</span>
              </div>

              {/* DEMO MESSAGE */}

              {sensor.type === 'demo' && (
                <div className='demo-message'>
                  Demo mode — deploy a second ESP32 to activate this sensor
                </div>
              )}
            </article>
          ))}
        </section>

        {/* =========================================
            HOW TO ADD MORE SENSORS
        ========================================= */}

        <section className='add-sensor-guide'>
          <div className='guide-header'>
            <Settings size={16} />

            <div>
              <h2>HOW TO ADD MORE SENSORS</h2>
              <p>
                Connect another ESP32 device to expand your monitoring network.
              </p>
            </div>
          </div>

          <div className='guide-grid'>
            <div className='guide-step'>
              <div className='step-number'>1</div>

              <div>
                <h3>Flash the ESP32</h3>

                <p>
                  Upload the same landslide_monitor_soil_online firmware to a
                  new ESP32 board. Change the SENSOR_ID to "ESP32-002".
                </p>
              </div>
            </div>

            <div className='guide-step'>
              <div className='step-number'>2</div>

              <div>
                <h3>Configure WiFi</h3>

                <p>
                  Update the WiFi credentials and backend URL in the Arduino
                  code to point to your Render API.
                </p>
              </div>
            </div>

            <div className='guide-step'>
              <div className='step-number'>3</div>

              <div>
                <h3>Deploy & Monitor</h3>

                <p>
                  Place the new ESP32 at a different location. It will
                  automatically appear here as a new sensor in the network.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            UPDATED
        ========================================= */}

        <div className='sensor-updated'>
          <CheckCircle size={11} />
          Sensor network updated recently
        </div>
      </main>
    </div>
  );
}

export default SensorNetwork;
