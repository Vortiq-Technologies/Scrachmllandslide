import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import RiskMap from './pages/map/RiskMap';
import ZoneDetails from './pages/map/ZoneDetails';
import Alerts from './pages/alerts/Alerts';
import Reports from './pages/reports/Reports';
import ReportIncident from './pages/reports/ReportsIncident';
import ReportSubmitted from './pages/reports/ReportSubmitted';
import ReportDetails from './pages/reports/ReportDetails';
import Settings from './pages/settings/Settings';
import AICopilot from './pages/copilot/AICopilot';
import Profile from './pages/profile/Profile';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={<Login />}
        />

        <Route
          path='/signup'
          element={<Signup />}
        />

        <Route
          path='/dashboard'
          element={<Dashboard />}
        />
        <Route
          path='/map'
          element={<RiskMap />}
        />
        <Route
          path='/zone-details'
          element={<ZoneDetails />}
        />
        <Route
          path='/alerts'
          element={<Alerts />}
        />
        <Route
          path='/reports'
          element={<Reports />}
        />

        <Route
          path='/reportsIncident'
          element={<ReportIncident />}
        />
        <Route
          path='/reportIncident'
          element={<ReportIncident />}
        />
        <Route
          path='/reportsSubmitted'
          element={<ReportSubmitted />}
        />

        <Route
          path='/report-details'
          element={<ReportDetails />}
        />

        <Route
          path='/settings'
          element={<Settings />}
        />

        <Route
          path='/copilot'
          element={<AICopilot />}
        />
        <Route
          path='/profile'
          element={<Profile />}
        />

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
    </BrowserRouter>
  );
}

export default App;
