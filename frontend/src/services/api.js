// Centralized API Client for EduQR

export const getBaseUrl = () => {
  const custom = typeof window !== 'undefined' ? localStorage.getItem('eduqr_api_url') : null;
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const defaultUrl = 'http://localhost:8080';
  const chosen = (custom || envUrl || defaultUrl).trim();
  return chosen.replace(/\/+$/, '');
};

export const setBaseUrl = (url) => {
  if (!url || !url.trim()) {
    localStorage.removeItem('eduqr_api_url');
  } else {
    localStorage.setItem('eduqr_api_url', url.trim().replace(/\/+$/, ''));
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('eduqr_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    // If token expired, clear
    localStorage.removeItem('eduqr_token');
    localStorage.removeItem('eduqr_user');
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || `Request failed (${response.status})`);
    }
    return data;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed (${response.status})`);
  }
  return response;
};

export const api = {
  getBaseUrl,
  setBaseUrl,
  get baseUrl() {
    return getBaseUrl();
  },

  // Health Check
  health: async () => {
    const res = await fetch(`${getBaseUrl()}/api/health`);
    return handleResponse(res);
  },

  // Auth
  auth: {
    login: async (username, password) => {
      const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      return handleResponse(res);
    },

    register: async (userData) => {
      const res = await fetch(`${getBaseUrl()}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },

    me: async () => {
      const res = await fetch(`${getBaseUrl()}/api/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    health: async () => {
      const res = await fetch(`${getBaseUrl()}/api/health`);
      return handleResponse(res);
    },
  },

  // Students
  students: {
    getAll: async ({ query = '', department = '', status = '', page = 0, size = 15 } = {}) => {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (department) params.append('department', department);
      if (status) params.append('status', status);
      params.append('page', page);
      params.append('size', size);

      const res = await fetch(`${getBaseUrl()}/api/students?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getById: async (id) => {
      const res = await fetch(`${getBaseUrl()}/api/students/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    create: async (studentData) => {
      const res = await fetch(`${getBaseUrl()}/api/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(studentData),
      });
      return handleResponse(res);
    },

    update: async (id, studentData) => {
      const res = await fetch(`${getBaseUrl()}/api/students/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(studentData),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${getBaseUrl()}/api/students/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    regenerateQr: async (id) => {
      const res = await fetch(`${getBaseUrl()}/api/students/${id}/regenerate-qr`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    exportCsv: async () => {
      const res = await fetch(`${getBaseUrl()}/api/students/export/csv`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to download CSV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
  },

  // QR Code Verification
  qr: {
    verify: async (input) => {
      const res = await fetch(`${getBaseUrl()}/api/qr/verify/${encodeURIComponent(input)}`);
      return handleResponse(res);
    },

    logScan: async (payload) => {
      const res = await fetch(`${getBaseUrl()}/api/qr/log-scan`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    getImageUrl: (id) => `${getBaseUrl()}/api/qr/student/${id}/image`,
  },

  // Analytics
  analytics: {
    getStats: async () => {
      const res = await fetch(`${getBaseUrl()}/api/analytics/dashboard`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
