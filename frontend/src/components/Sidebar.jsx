import { NavLink, Link } from 'react-router-dom';

import {
  Home,
  Map,
  FileText,
  Bell,
  Settings,
  Activity,
  User,
  Bot,
} from 'lucide-react';

import './Sidebar.css';

function Sidebar() {
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
          <span>Home</span>
        </NavLink>

        <NavLink
          to='/map'
          className={navClass}
        >
          <Map size={19} />
          <span>Risk Map</span>
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

          <span className='alert-count'>3</span>
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

        {/* Profile */}

        <Link
          to='/profile'
          className='sidebar-user'
        >
          <div className='user-avatar'>
            <User size={18} />
          </div>

          <div className='user-info'>
            <strong>Anchal</strong>
            <span>Field Officer</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
