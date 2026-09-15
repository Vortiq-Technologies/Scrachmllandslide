import { NavLink } from 'react-router-dom';
import {
  Home,
  Map,
  FileText,
  Bell,
  Settings,
  Activity,
  User,
} from 'lucide-react';

import './Sidebar.css';

function Sidebar() {
  return (
    <aside className='sidebar'>
      <div className='sidebar-logo'>
        <img
          src='/images/logo.png'
          alt='Landslide Early Warning System'
        />

        <div>
          <h2>LANDSLIDE</h2>
          <span>Early Warning System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className='sidebar-nav'>
        <NavLink
          to='/dashboard'
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to='/map'
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <Map size={20} />
          <span>Risk Map</span>
        </NavLink>

        <NavLink
          to='/reports'
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <FileText size={20} />
          <span>Reports</span>
        </NavLink>

        <NavLink
          to='/alerts'
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <Bell size={20} />
          <span>Alerts</span>

          <span className='alert-count'>3</span>
        </NavLink>

        <NavLink
          to='/settings'
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Bottom Section */}
      <div className='sidebar-bottom'>
        {/* System Status */}
        <div className='system-status'>
          <div className='status-icon'>
            <Activity size={18} />
          </div>

          <div>
            <span className='status-title'>System Status</span>

            <span className='status-online'>All systems operational</span>
          </div>
        </div>

        {/* User */}
        <div className='sidebar-user'>
          <div className='user-avatar'>
            <User size={18} />
          </div>

          <div className='user-info'>
            <strong>Anchal</strong>
            <span>Field Officer</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
