import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Phone,
  Shield,
  Loader2,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!agreed) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await register({
        name,
        email,
        password,
        role,
        phone: phone || undefined,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signup-page'>
      {/* =====================================
          LEFT SIDE
      ====================================== */}

      <div className='signup-left'>
        <div className='signup-background'></div>
        <div className='signup-overlay'></div>

        <div className='signup-left-content'>
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

          <div className='signup-tagline'>
            <span>Monitor</span>
            <b>•</b>
            <span>Predict</span>
            <b>•</b>
            <span>Respond</span>
          </div>

          <div className='signup-sensor signup-sensor-1'>
            <div className='signup-sensor-icon normal'>
              <Activity size={17} />
            </div>
            <div>
              <strong>Node 01</strong>
              <span className='normal-text'>Normal</span>
            </div>
          </div>

          <div className='signup-sensor signup-sensor-2'>
            <div className='signup-sensor-icon normal'>
              <Activity size={17} />
            </div>
            <div>
              <strong>Node 02</strong>
              <span className='normal-text'>Normal</span>
            </div>
          </div>

          <div className='signup-sensor signup-sensor-3'>
            <div className='signup-sensor-icon watch'>
              <Activity size={17} />
            </div>
            <div>
              <strong>Node 03</strong>
              <span className='watch-text'>Watch</span>
            </div>
          </div>

          <div className='signup-message'>
            <h2>
              Smarter Monitoring.
              <br />
              Safer Communities.
            </h2>
            <p>Real-time landslide risk monitoring and early warning.</p>
          </div>

          <div className='signup-alert'>
            <div className='signup-alert-icon'>
              <AlertTriangle size={20} />
            </div>
            <div className='signup-alert-text'>
              <strong>LANDSLIDE DETECTED</strong>
              <span>Monitoring area requires attention</span>
            </div>
          </div>

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
          <div className='signup-top'>
            <div className='signup-mini-logo'>
              <Activity size={24} />
            </div>

            <div className='signup-existing'>
              <span>Already a member?</span>
              <Link to='/login'>
                Login
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className='signup-heading'>
            <h2>Create Account</h2>
            <p>Join the landslide monitoring network</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <div className='signup-form-group'>
              <label>Full Name *</label>
              <div className='signup-input-box'>
                <User size={18} />
                <input
                  type='text'
                  placeholder='Enter your full name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className='signup-form-group'>
              <label>Email Address *</label>
              <div className='signup-input-box'>
                <Mail size={18} />
                <input
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ROLE & PHONE GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Role
                </label>
                <div className='signup-input-box'>
                  <Shield size={18} />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      width: '100%',
                      outline: 'none',
                      fontSize: '13px'
                    }}
                  >
                    <option value='citizen' style={{ background: '#1e293b', color: '#fff' }}>Citizen</option>
                    <option value='field_officer' style={{ background: '#1e293b', color: '#fff' }}>Field Officer</option>
                    <option value='analyst' style={{ background: '#1e293b', color: '#fff' }}>Risk Analyst</option>
                    <option value='admin' style={{ background: '#1e293b', color: '#fff' }}>District Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <div className='signup-input-box'>
                  <Phone size={18} />
                  <input
                    type='tel'
                    placeholder='+91 9876543210'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* PASSWORD */}
            <div className='signup-form-group'>
              <label>Password *</label>
              <div className='signup-input-box'>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Create a secure password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type='checkbox'
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  I agree to the Terms & Conditions and Safety Monitoring Guidelines
                </span>
              </label>
            </div>

            {/* SIGNUP BUTTON */}
            <button className='signup-button' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className='animate-spin' />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          {/* LOGIN BOTTOM */}
          <div className='signup-login-bottom'>
            <span>Already have an account?</span>
            <Link to='/login'>
              Login
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

