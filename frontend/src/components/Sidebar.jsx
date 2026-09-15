import { NavLink, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDisplayName = () => {
    if (!user) return 'Guest User';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  const getDisplayRole = () => {
    if (!user) return 'Guest';
    const role = user.role || 'user';
    return role.replace('_', ' ').toUpperCase();
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

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
          <span>Dashboard</span>
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
        </NavLink>

        <NavLink
          to='/copilot'
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <Bot size={20} />
          <span>AI Copilot</span>
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

        {/* User Profile & Logout */}
        <div className='sidebar-user'>
          <div className='user-avatar'>{getInitials()}</div>

          <div className='user-info'>
            <strong>{getDisplayName()}</strong>
            <span>{getDisplayRole()}</span>
          </div>

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

