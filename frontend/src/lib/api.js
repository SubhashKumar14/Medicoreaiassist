const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// Helper to retrieve auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper for making authenticated requests
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...token && { "Authorization": `Bearer ${token}` },
    ...options.headers
  };
  const response = await fetch(url, {
    ...options,
    headers
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const authAPI = {
  login: async (email, password) => {
    return makeRequest(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },
  register: async (name, email, password, role) => {
    return makeRequest(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password, role })
    });
  },
  getCurrentUser: async () => {
    return makeRequest(`${API_BASE_URL}/auth/me`);
  }
};

// ORCHESTRATION UPDATE: All AI calls now go through Backend Proxy
const triageAPI = {
  startSession: async () => {
    return makeRequest(`${API_BASE_URL}/triage/start`, {
      method: "POST"
    });
  },
  submitSymptoms: async (sessionId, symptoms, answer = null) => {
    return makeRequest(`${API_BASE_URL}/triage/submit`, {
      method: "POST",
      body: JSON.stringify({ sessionId, symptoms, answer })
    });
  },
  answerQuestion: async (sessionId, answer) => {
    return makeRequest(`${API_BASE_URL}/triage/submit`, { // Unified endpoint
      method: "POST",
      body: JSON.stringify({ sessionId, answer })
    });
  },
  getResults: async (sessionId) => {
    return makeRequest(`${API_BASE_URL}/triage/results/${sessionId}`);
  }
};

const reportAPI = {
  uploadReport: async (file) => {
    const formData = new FormData();
    formData.append("report", file); // Must match backend multer field name
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/reports/upload`, {
      method: "POST",
      headers: {
        ...token && { "Authorization": `Bearer ${token}` }
      },
      body: formData
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  getReportAnalysis: async (reportId) => {
    return makeRequest(`${API_BASE_URL}/reports/${reportId}`);
  },
  getAllReports: async () => {
    return makeRequest(`${API_BASE_URL}/reports`);
  }
};

const appointmentsAPI = {
  getDoctors: async () => {
    return makeRequest(`${API_BASE_URL}/appointments/doctors`); // Updated route
  },
  bookAppointment: async (data) => {
    return makeRequest(`${API_BASE_URL}/appointments/book`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  getAppointment: async (appointmentId) => {
    return makeRequest(`${API_BASE_URL}/appointments/${appointmentId}`);
  },
  getQueue: async () => {
    return makeRequest(`${API_BASE_URL}/appointments/queue`);
  },
  updateAppointmentStatus: async (appointmentId, status) => {
    return makeRequest(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
  }
};

const chatAPI = {
  sendMessage: async (message, context) => {
    // Note: Use Socket.io for real-time chat, this might be legacy or for history
    return makeRequest(`${API_BASE_URL}/chat`, {
      method: "POST",
      body: JSON.stringify({ message, context })
    });
  },
  getChatHistory: async (sessionId) => {
    return makeRequest(`${API_BASE_URL}/chat/history/${sessionId}`);
  }
};

const recordsAPI = {
  getPatientRecords: async (patientId) => {
    return makeRequest(`${API_BASE_URL}/records/patient/${patientId}`);
  },
  getMyRecords: async () => {
    return makeRequest(`${API_BASE_URL}/records/me`);
  }
};

const adminAPI = {
  getMetrics: async () => {
    return makeRequest(`${API_BASE_URL}/admin/metrics`);
  },
  getUsers: async () => {
    return makeRequest(`${API_BASE_URL}/admin/users`);
  },
  updateUser: async (userId, data) => {
    return makeRequest(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  getAnomalies: async () => {
    return makeRequest(`${API_BASE_URL}/admin/anomalies`);
  },
  toggleFeature: async (featureName, enabled) => {
    return makeRequest(`${API_BASE_URL}/admin/features/${featureName}`, {
      method: "PUT",
      body: JSON.stringify({ enabled })
    });
  }
};

const doctorAPI = {
  submitOverride: async (data) => {
    return makeRequest(`${API_BASE_URL}/doctor/override`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
};

const pillAPI = {
  identifyPill: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pill-identifier/identify`, { // Assuming backend proxy route
      method: "POST",
      headers: {
        ...token && { "Authorization": `Bearer ${token}` }
      },
      body: formData
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

export {
  adminAPI,
  appointmentsAPI,
  authAPI,
  chatAPI,
  pillAPI,
  recordsAPI,
  reportAPI,
  triageAPI,
  doctorAPI
};
