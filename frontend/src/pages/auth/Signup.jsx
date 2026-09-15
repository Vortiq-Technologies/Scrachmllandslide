import { useState } from 'react';

import {
  Activity,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  CloudRain,
  MapPin,
  Check,
} from 'lucide-react';

import './Signup.css';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className='signup-page'>
      {/* =====================================
          LEFT SIDE
      ====================================== */}

      <div className='signup-left'>
        {/* Background */}
        <div className='signup-background'></div>

        {/* Dark overlay */}
        <div className='signup-overlay'></div>

        {/* Content */}
        <div className='signup-left-content'>
          {/* BRAND */}
          <div className='signup-brand'>
            <div className='signup-brand-icon'>
              <Activity
                size={30}
                strokeWidth={2.5}
              />
            </div>

            <div className='signup-brand-text'>
              <h1>LANDSLIDE</h1>

              <p>EARLY WARNING SYSTEM</p>
            </div>
          </div>

          {/* TAGLINE */}
          <div className='signup-tagline'>
            <span>Monitor</span>

            <b>•</b>

            <span>Predict</span>

            <b>•</b>

            <span>Respond</span>
          </div>

          {/* SENSOR 01 */}
          <div className='signup-sensor signup-sensor-1'>
            <div className='signup-sensor-icon normal'>
              <Activity size={17} />
            </div>

            <div>
              <strong>Node 01</strong>

              <span className='normal-text'>Normal</span>
            </div>
          </div>

          {/* SENSOR 02 */}
          <div className='signup-sensor signup-sensor-2'>
            <div className='signup-sensor-icon normal'>
              <Activity size={17} />
            </div>

            <div>
              <strong>Node 02</strong>

              <span className='normal-text'>Normal</span>
            </div>
          </div>

          {/* SENSOR 03 */}
          <div className='signup-sensor signup-sensor-3'>
            <div className='signup-sensor-icon watch'>
              <Activity size={17} />
            </div>

            <div>
              <strong>Node 03</strong>

              <span className='watch-text'>Watch</span>
            </div>
          </div>

          {/* MAIN MESSAGE */}
          <div className='signup-message'>
            <h2>
              Smarter Monitoring.
              <br />
              Safer Communities.
            </h2>

            <p>Real-time landslide risk monitoring and early warning.</p>
          </div>

          {/* ALERT */}
          <div className='signup-alert'>
            <div className='signup-alert-icon'>
              <AlertTriangle size={20} />
            </div>

            <div className='signup-alert-text'>
              <strong>LANDSLIDE DETECTED</strong>

              <span>Monitoring area requires attention</span>
            </div>
          </div>

          {/* BOTTOM INFO */}
          <div className='signup-bottom-info'>
            <div className='signup-info-card'>
              <CloudRain size={22} />

              <div>
                <strong>Heavy Rainfall</strong>

                <span>32 mm (last 1h)</span>
              </div>
            </div>

            <div className='signup-info-card'>
              <MapPin size={22} />

              <div>
                <strong>North East Region</strong>

                <span>Sikkim, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          RIGHT SIDE
      ====================================== */}

      <div className='signup-right'>
        <div className='signup-card'>
          {/* TOP */}
          <div className='signup-top'>
            <div className='signup-mini-logo'>
              <Activity size={24} />
            </div>

            <div className='signup-existing'>
              <span>Already a member?</span>

              <a href='/'>
                Login
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* HEADING */}
          <div className='signup-heading'>
            <h2>Create Account</h2>

            <p>Join the landslide monitoring network</p>
          </div>

          {/* FULL NAME */}
          <div className='signup-form-group'>
            <label>Full Name</label>

            <div className='signup-input-box'>
              <User size={18} />

              <input
                type='text'
                placeholder='Enter your full name'
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className='signup-form-group'>
            <label>Email Address</label>

            <div className='signup-input-box'>
              <Mail size={18} />

              <input
                type='email'
                placeholder='Enter your email'
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className='signup-form-group'>
            <label>Password</label>

            <div className='signup-input-box'>
              <Lock size={18} />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Create a password'
              />

              <button
                type='button'
                className='signup-password-toggle'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* TERMS */}
          <div className='signup-terms'>
            <label>
              <input type='checkbox' />

              <span className='custom-check'>
                <Check size={11} />
              </span>

              <p>
                I agree to the <a href='/terms'>Terms & Conditions</a> and{' '}
                <a href='/privacy'>Privacy Policy</a>
              </p>
            </label>
          </div>

          {/* SIGNUP BUTTON */}
          <button className='signup-button'>
            <span>Create Account</span>

            <ArrowRight size={19} />
          </button>

          {/* DIVIDER */}
          <div className='signup-divider'>
            <span></span>

            <p>OR</p>

            <span></span>
          </div>

          {/* SOCIAL LOGIN */}
          <div className='signup-social'>
            <button className='signup-social-button'>
              <span className='google'>G</span>
              Continue with Google
            </button>

            <button className='signup-social-button'>
              <span className='apple'>●</span>
              Continue with Apple
            </button>
          </div>

          {/* LOGIN BOTTOM */}
          <div className='signup-login-bottom'>
            <span>Already have an account?</span>

            <a href='/'>
              Login
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
