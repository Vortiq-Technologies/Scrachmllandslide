import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Loader2,
  ShieldCheck,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

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
              <img
                src='/images/logo.png'
                alt='Landslide Early Warning System logo'
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
              <img
                src='/images/logo.png'
                alt='Landslide Early Warning System logo'
              />
            </div>

            <div className='signup-top'>
              <span>New here?</span>
              <Link to='/signup'>
                Sign Up
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Heading */}
          <div className='login-heading'>
            <h2>Welcome Back</h2>
            <p>Sign in to your monitoring dashboard</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className='login-error-box'
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className='form-group'>
              <label>Email Address</label>
              <div className='input-wrapper'>
                <Mail size={20} />
                <input
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                <input
                  type='checkbox'
                  defaultChecked
                />
                <span>Remember me</span>
              </label>
              <Link to='/forgot-password'>Forgot Password?</Link>
            </div>

            {/* Login Button */}
            <button
              className='login-button'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className='animate-spin'
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Selection */}
          <div style={{ marginTop: '20px' }}>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              ⚡ Quick Demo Logins (Pre-seeded in DB):
            </p>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <button
                type='button'
                onClick={() =>
                  setDemoUser('admin@landslide.gov.in', 'Password123!')
                }
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  borderRadius: '6px',
                  background: 'var(--accent-soft)',
                  color: 'var(--accent-color)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                🛡️ Admin (Dr. Aarav)
              </button>
              <button
                type='button'
                onClick={() =>
                  setDemoUser('officer@landslide.gov.in', 'Password123!')
                }
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  borderRadius: '6px',
                  background: 'var(--card-bg-hover)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                📡 Field Officer (Rajesh)
              </button>
              <button
                type='button'
                onClick={() =>
                  setDemoUser('citizen@example.com', 'Password123!')
                }
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  borderRadius: '6px',
                  background: 'var(--card-bg-hover)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                👤 Citizen (Sunita)
              </button>
            </div>
          </div>

          {/* Signup Bottom Link */}
          <p
            className='signup-bottom'
            style={{ marginTop: '24px' }}
          >
            Don't have an account?
            <Link to='/signup'>
              Sign Up <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
