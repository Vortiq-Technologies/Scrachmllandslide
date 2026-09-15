import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';

import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';

// Placeholder pages (baad me banayenge)
import RiskMap from '../pages/map/RiskMap';
import Reports from '../pages/reports/Reports';
import Alerts from '../pages/alerts/Alerts';
import AICopilot from '../pages/copilot/AICopilot';
import SafetyInfo from '../pages/safety/SafetyInfo';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route
        path='/login'
        element={<Login />}
      />
      <Route
        path='/signup'
        element={<Signup />}
      />
      <Route
        path='/forgot-password'
        element={<ForgotPassword />}
      />

      {/* Dashboard (with layout) */}
      <Route element={<DashboardLayout />}>
        <Route
          path='/dashboard'
          element={<Dashboard />}
        />
        <Route
          path='/map'
          element={<RiskMap />}
        />
        <Route
          path='/reports'
          element={<Reports />}
        />
        <Route
          path='/alerts'
          element={<Alerts />}
        />
        <Route
          path='/copilot'
          element={<AICopilot />}
        />
        <Route
          path='/safety'
          element={<SafetyInfo />}
        />
        <Route
          path='/profile'
          element={<Profile />}
        />
        <Route
          path='/settings'
          element={<Settings />}
        />
      </Route>

      {/* Redirects */}
      <Route
        path='/'
        element={
          <Navigate
            to='/login'
            replace
          />
        }
      />
      <Route
        path='*'
        element={
          <Navigate
            to='/login'
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;
