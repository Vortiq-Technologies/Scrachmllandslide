/**
 * Centralized API client for Landslide Early Warning & Risk Monitoring System
 * Handles base URL, auth token injection, error parsing, and API endpoints.
 */

const API_BASE = '/api/v1';

/**
 * Universal request wrapper
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('lews_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = result?.error?.message || result?.message || `HTTP Error ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = result;
      throw err;
    }

    return result.data !== undefined ? result.data : result;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
    throw err;
  }
}

// ── Auth Endpoints ────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: userData,
    }),

  getMe: () => request('/auth/me'),
};

// ── Dashboard Endpoints ───────────────────────────────────────────────────────
export const dashboardApi = {
  getOverview: () => request('/dashboard/overview'),
};

// ── Alerts Endpoints ──────────────────────────────────────────────────────────
export const alertsApi = {
  getActiveAlerts: () => request('/alerts/active'),
  getAllAlerts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/alerts${query ? `?${query}` : ''}`);
  },
  createAlert: (alertData) =>
    request('/alerts', {
      method: 'POST',
      body: alertData,
    }),
  acknowledgeAlert: (alertId, notes) =>
    request(`/alerts/${alertId}/acknowledge`, {
      method: 'PATCH',
      body: { notes },
    }),
  resolveAlert: (alertId, notes) =>
    request(`/alerts/${alertId}/resolve`, {
      method: 'PATCH',
      body: { notes },
    }),
  getZoneAlerts: (zoneId) => request(`/zones/${zoneId}/alerts`),
};

// ── Reports Endpoints ─────────────────────────────────────────────────────────
export const reportsApi = {
  getReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reports${query ? `?${query}` : ''}`);
  },
  submitReport: (reportData) =>
    request('/reports', {
      method: 'POST',
      body: reportData,
    }),
  verifyReport: (reportId, notes) =>
    request(`/reports/${reportId}/verify`, {
      method: 'PATCH',
      body: { notes },
    }),
  resolveReport: (reportId, notes) =>
    request(`/reports/${reportId}/resolve`, {
      method: 'PATCH',
      body: { notes },
    }),
  getNearbyReports: (lat, lng, radius = 5000) =>
    request(`/reports/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// ── Risk & Zones Endpoints ────────────────────────────────────────────────────
export const riskApi = {
  getZones: () => request('/risk/zones'),
  getZoneById: (zoneId) => request(`/risk/zones/${zoneId}`),
  getZoneRisk: (zoneId) => request(`/risk/zones/${zoneId}/risk`),
  getZoneRiskHistory: (zoneId) => request(`/risk/zones/${zoneId}/risk/history`),
  getNearbyZones: (lat, lng, radius = 5000) =>
    request(`/risk/zones/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// ── GenAI Copilot Endpoints ───────────────────────────────────────────────────
export const genAiApi = {
  chat: (message, zoneId, conversationHistory = []) =>
    request('/ai/chat', {
      method: 'POST',
      body: { message, zoneId, conversationHistory },
    }),

  explainRisk: (zoneId) =>
    request('/ai/explain-risk', {
      method: 'POST',
      body: { zoneId },
    }),

  generateReport: (zoneId, reportType = 'situation_summary') =>
    request('/ai/generate-report', {
      method: 'POST',
      body: { zoneId, reportType },
    }),

  generateAlert: (alertContext) =>
    request('/ai/generate-alert', {
      method: 'POST',
      body: alertContext,
    }),
};

// ── Devices & Sensors ─────────────────────────────────────────────────────────
export const devicesApi = {
  getDevices: () => request('/devices'),
  getSensors: () => request('/sensors'),
};

export default {
  auth: authApi,
  dashboard: dashboardApi,
  alerts: alertsApi,
  reports: reportsApi,
  risk: riskApi,
  genAi: genAiApi,
  devices: devicesApi,
};
