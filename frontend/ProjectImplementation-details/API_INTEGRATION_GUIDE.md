# API Integration Guide

This guide shows how to integrate the frontend with your existing backend and AI services.

## 📡 API Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API
REACT_APP_BACKEND_URL=http://localhost:5000/api

# AI Service
REACT_APP_AI_URL=http://localhost:8000
```

## 🔌 API Integration Points

### 1. Symptom Checker Integration

**Frontend Component**: `/components/pages/SymptomChecker.tsx`

**API Calls**:
```typescript
import { triageAPI } from '@/lib/api';

// Start a new triage session
const session = await triageAPI.startSession();

// Submit initial symptoms
const response = await triageAPI.submitSymptoms(sessionId, symptoms);

// Answer follow-up questions
const nextQuestion = await triageAPI.answerQuestion(sessionId, answer);

// Get final results
const results = await triageAPI.getResults(sessionId);
```

**Backend Endpoints** (Your existing structure):
```
POST /api/triage/start
POST /api/triage/submit
POST /api/triage/answer
GET /api/triage/results/:sessionId
```

**AI Service** (Port 8000):
```
POST /api/triage/start
POST /api/triage/submit
POST /api/triage/answer
GET /api/triage/results/:sessionId
```

### 2. Report Analyzer Integration

**Frontend Component**: `/components/pages/ReportAnalyzer.tsx`

**API Calls**:
```typescript
import { reportAPI } from '@/lib/api';

// Upload report file
const formData = new FormData();
formData.append('report', file);
const analysis = await reportAPI.uploadReport(file);

// Get existing analysis
const report = await reportAPI.getReportAnalysis(reportId);

// Get all user reports
const reports = await reportAPI.getAllReports();
```

**Backend Endpoints**:
```
POST /api/reports/upload
GET /api/reports/:reportId
GET /api/reports
```

### 3. Appointment Booking Integration

**Frontend Component**: `/components/pages/BookingPage.tsx`

**API Calls**:
```typescript
import { appointmentsAPI } from '@/lib/api';

// Get available doctors
const doctors = await appointmentsAPI.getDoctors();

// Book appointment
const appointment = await appointmentsAPI.bookAppointment({
  doctorId: selectedDoctor,
  symptoms: symptoms,
  severity: 'moderate',
  triageSessionId: sessionId, // optional
});

// Get appointment details
const appointmentDetails = await appointmentsAPI.getAppointment(appointmentId);
```

**Backend Endpoints**:
```
GET /api/doctors
POST /api/appointments/book
GET /api/appointments/:id
GET /api/appointments/queue
PUT /api/appointments/:id/status
```

### 4. AI Chat Integration

**Frontend Component**: `/components/pages/AIHealthChat.tsx`

**API Calls**:
```typescript
import { chatAPI } from '@/lib/api';

// Send message to AI
const response = await chatAPI.sendMessage(message, context);

// Get chat history
const history = await chatAPI.getChatHistory(sessionId);
```

**AI Service Endpoints**:
```
POST /api/chat
```

**Backend Endpoints**:
```
GET /api/chat/history/:sessionId
```

### 5. Doctor Dashboard Integration

**Frontend Component**: `/components/pages/DoctorDashboard.tsx`

**API Calls**:
```typescript
import { appointmentsAPI, recordsAPI } from '@/lib/api';

// Get patient queue
const queue = await appointmentsAPI.getQueue();

// Update appointment status
await appointmentsAPI.updateAppointmentStatus(appointmentId, 'in-progress');

// Get patient records
const records = await recordsAPI.getPatientRecords(patientId);
```

**Backend Endpoints**:
```
GET /api/appointments/queue
PUT /api/appointments/:id/status
GET /api/records/patient/:patientId
```

### 6. Admin Panel Integration

**Frontend Component**: `/components/pages/AdminPanel.tsx`

**API Calls**:
```typescript
import { adminAPI } from '@/lib/api';

// Get system metrics
const metrics = await adminAPI.getMetrics();

// Get all users
const users = await adminAPI.getUsers();

// Update user
await adminAPI.updateUser(userId, data);

// Get anomalies
const anomalies = await adminAPI.getAnomalies();

// Toggle feature
await adminAPI.toggleFeature('symptom-checker', true);
```

**Backend Endpoints**:
```
GET /api/admin/metrics
GET /api/admin/users
PUT /api/admin/users/:userId
GET /api/admin/anomalies
PUT /api/admin/features/:name
```

## 🔐 Authentication Flow

### Login
```typescript
import { authAPI } from '@/lib/api';

const response = await authAPI.login(email, password);
// Response: { token: string, user: User }

// Store token
localStorage.setItem('authToken', response.token);
localStorage.setItem('userRole', response.user.role);
```

### Register
```typescript
const response = await authAPI.register(name, email, password, role);
// Response: { token: string, user: User }

localStorage.setItem('authToken', response.token);
localStorage.setItem('userRole', response.user.role);
```

### Get Current User
```typescript
const user = await authAPI.getCurrentUser();
// Response: User object
```

## 📊 Response Data Structures

### Triage Results
```typescript
{
  topDiseases: [
    {
      name: string;
      probability: number;
      description: string;
    }
  ];
  severity: 'low' | 'moderate' | 'high' | 'critical';
  explanation: string;
  recommendations: string[];
}
```

### Report Analysis
```typescript
{
  id: string;
  fileName: string;
  analysis: {
    abnormalValues: [
      {
        parameter: string;
        value: string;
        normalRange: string;
        severity: 'low' | 'moderate' | 'high' | 'critical';
      }
    ];
    summary: string;
    aiExplanation: string;
    recommendations: string[];
  };
}
```

### Appointment
```typescript
{
  id: string;
  tokenNumber: number;
  patientName: string;
  doctorName: string;
  symptoms: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  triageResults: {
    topDiseases: Disease[];
    explanation: string;
  };
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  estimatedWaitTime: number; // in minutes
  scheduledTime: string;
}
```

## 🔄 WebSocket Integration (Optional)

For real-time updates in doctor queue and notifications:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('authToken')
  }
});

// Listen for queue updates
socket.on('queue:update', (queue) => {
  // Update queue state
});

// Listen for appointment status changes
socket.on('appointment:status', (data) => {
  // Update appointment state
});
```

## 🧪 Testing with Mock Data

The frontend includes mock data for all API calls. To test without backend:

1. Comment out API calls in components
2. Use the mock data already present in components
3. The UI will work fully with realistic demo data

To enable real API integration:

1. Ensure backend is running on port 5000
2. Ensure AI service is running on port 8000
3. Update `.env` file with correct URLs
4. Replace mock data with actual API calls

## 📝 Error Handling

All API calls include error handling:

```typescript
try {
  const results = await triageAPI.getResults(sessionId);
  // Handle success
} catch (error) {
  console.error('Error fetching results:', error);
  // Show error toast
  toast.error('Failed to fetch results. Please try again.');
}
```

## 🚀 Next Steps

1. Set up your backend services (already exists in your project)
2. Configure environment variables
3. Test each API endpoint individually
4. Integrate frontend with backend endpoints
5. Test full user flows
6. Add WebSocket for real-time features
7. Implement proper error handling
8. Add loading states and optimistic updates

## 📞 Support

For questions about API integration, refer to your existing backend documentation:
- Backend: `/backend/README.md`
- AI Service: `/ai_service/README.md`
