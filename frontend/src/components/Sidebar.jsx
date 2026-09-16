import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  Home,
  Map,
  FileText,
  Bell,
  Settings,
  Activity,
  User,
  Bot,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate('/login');
  };

  const getDisplayName = () => {
    if (!user) return 'Guest User';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  const getDisplayRole = () => {
    if (!user) return 'GUEST';
    const role = user.role || 'user';
    return role.replace('_', ' ').toUpperCase();
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const navClass = ({ isActive }) =>
    isActive ? 'nav-item active' : 'nav-item';

  return (
    <aside className='sidebar'>
      {/* ================= LOGO ================= */}
      <div className='sidebar-logo'>
        <img
          src='/images/logo.png'
          alt='Landslide Early Warning System'
        />

        <div className='sidebar-logo-text'>
          <h2>LANDSLIDE</h2>
          <span>Early Warning System</span>
        </div>
      </div>

      {/* ================= MAIN NAVIGATION ================= */}
      <div className='sidebar-menu-label'>MAIN MENU</div>

      <nav className='sidebar-nav'>
        <NavLink
          to='/dashboard'
          className={navClass}
        >
          <Home size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to='/sensor-network'
          className={navClass}
        >
          <Map size={19} />
          <span>Sensor Network</span>
        </NavLink>

        <NavLink
          to='/reports'
          className={navClass}
        >
          <FileText size={19} />
          <span>Reports</span>
        </NavLink>

        <NavLink
          to='/alerts'
          className={navClass}
        >
          <Bell size={19} />
          <span>Alerts</span>
        </NavLink>
      </nav>

      {/* ================= AI SECTION ================= */}
      <div className='sidebar-menu-label ai-label'>INTELLIGENCE</div>

      <nav className='sidebar-nav'>
        <NavLink
          to='/copilot'
          className={navClass}
        >
          <Bot size={19} />
          <span>AI Copilot</span>
          <span className='ai-badge'>AI</span>
        </NavLink>
      </nav>

      {/* ================= SYSTEM SECTION ================= */}
      <div className='sidebar-menu-label'>SYSTEM</div>

      <nav className='sidebar-nav'>
        <NavLink
          to='/settings'
          className={navClass}
        >
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* ================= BOTTOM AREA ================= */}
      <div className='sidebar-bottom'>
        {/* System Status */}
        <div className='system-status'>
          <div className='status-icon'>
            <Activity size={16} />
          </div>

          <div className='status-content'>
            <span className='status-title'>System Status</span>
            <span className='status-online'>
              <span className='online-dot'></span>
              All systems operational
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className='sidebar-user'>
          <Link
            to='/profile'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flex: 1,
              minWidth: 0,
            }}
          >
            <div className='user-avatar'>{getInitials()}</div>
            <div className='user-info'>
              <strong>{getDisplayName()}</strong>
              <span>{getDisplayRole()}</span>
            </div>
          </Link>

          <button
            className='logout-btn'
            onClick={handleLogout}
            title='Log out'
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
