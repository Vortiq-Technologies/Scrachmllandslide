import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  CloudRain,
  MapPin,
  Activity,
} from 'lucide-react';

import './Login.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='login-page'>
      {/* ==================================================
          LEFT SIDE - LANDSLIDE VISUAL
      ================================================== */}

      <section className='login-visual'>
        <div className='visual-overlay'></div>

        <div className='visual-content'>
          {/* Logo */}
          <div className='brand'>
            <div className='brand-logo'>
              <Activity
                size={38}
                strokeWidth={2.5}
              />
            </div>

            <div>
              <h1>LANDSLIDE</h1>

              <p>EARLY WARNING SYSTEM</p>
            </div>
          </div>

          {/* Tagline */}
          <div className='tagline'>
            <span>Monitor</span>

            <span className='dot'>•</span>

            <span>Predict</span>

            <span className='dot'>•</span>

            <span>Respond</span>
          </div>

          {/* Main message */}
          <div className='visual-message'>
            <h2>
              Smarter Monitoring.
              <br />
              Safer Communities.
            </h2>

            <p>Real-time landslide risk monitoring and early warning.</p>
          </div>

          {/* Sensor Nodes */}
          <div className='sensor-node node-one'>
            <span className='node-icon'>
              <Activity size={18} />
            </span>

            <div>
              <strong>Node 01</strong>
              <small>Normal</small>
            </div>
          </div>

          <div className='sensor-node node-two'>
            <span className='node-icon'>
              <Activity size={18} />
            </span>

            <div>
              <strong>Node 02</strong>
              <small>Normal</small>
            </div>
          </div>

          <div className='sensor-node node-three watch'>
            <span className='node-icon'>
              <Activity size={18} />
            </span>

            <div>
              <strong>Node 03</strong>
              <small>Watch</small>
            </div>
          </div>

          {/* Alert */}
          <div className='visual-alert'>
            <div className='alert-icon'>
              <AlertTriangle size={22} />
            </div>

            <div>
              <strong>LANDSLIDE DETECTED</strong>

              <span>Monitoring area requires attention</span>
            </div>
          </div>

          {/* Bottom information */}
          <div className='visual-info'>
            <div className='info-box'>
              <CloudRain size={25} />

              <div>
                <strong>Heavy Rainfall</strong>
                <span>32 mm (last 1h)</span>
              </div>
            </div>

            <div className='info-box'>
              <MapPin size={25} />

              <div>
                <strong>North East Region</strong>
                <span>Sikkim, India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          RIGHT SIDE - LOGIN FORM
      ================================================== */}

      <section className='login-section'>
        <div className='login-card'>
          {/* Top */}
          <div className='login-top'>
            <div className='small-logo'>
              <Activity size={28} />
            </div>

            <div className='signup-top'>
              <span>New here?</span>

              <a href='/signup'>
                Sign Up
                <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* Heading */}
          <div className='login-heading'>
            <h2>Welcome Back</h2>

            <p>Sign in to your monitoring dashboard</p>
          </div>

          {/* Email */}
          <div className='form-group'>
            <label>Email Address</label>

            <div className='input-wrapper'>
              <Mail size={20} />

              <input
                type='email'
                placeholder='Enter your email'
              />
            </div>
          </div>

          {/* Password */}
          <div className='form-group'>
            <label>Password</label>

            <div className='input-wrapper'>
              <Lock size={20} />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
              />

              <button
                type='button'
                className='eye-button'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className='login-options'>
            <label className='remember'>
              <input type='checkbox' />

              <span>Remember me</span>
            </label>

            <a href='/forgot-password'>Forgot Password?</a>
          </div>

          {/* Login */}
          <button className='login-button'>
            Login
            <ArrowRight size={20} />
          </button>

          {/* Divider */}
          <div className='divider'>
            <span></span>

            <p>OR</p>

            <span></span>
          </div>

          {/* Social Login */}
          <div className='social-buttons'>
            <button className='social-button'>
              <span className='google-icon'>G</span>
              Continue with Google
            </button>

            <button className='social-button'>
              <span className='apple-icon'>●</span>
              Continue with Apple
            </button>
          </div>

          {/* Signup */}
          <p className='signup-bottom'>
            Don't have an account?
            <a href='/signup'>
              Sign Up <ArrowRight size={14} />
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
