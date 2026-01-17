import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { LandingPage } from "./components/pages/LandingPage";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { PatientDashboard } from "./components/pages/PatientDashboard";
import { SymptomChecker } from "./components/pages/SymptomChecker";
import { AIHealthChat } from "./components/pages/AIHealthChat";
import { ReportAnalyzer } from "./components/pages/ReportAnalyzer";
import { BookingPage } from "./components/pages/BookingPage";
import { DoctorDashboard } from "./components/pages/DoctorDashboard";
import { AdminPanel } from "./components/pages/AdminPanel";
import { PillIdentifier } from "./components/pages/PillIdentifier";
import { PatientProfile } from "./components/pages/PatientProfile";
import { DoctorSchedule } from "./components/pages/DoctorSchedule";
import { DoctorAnalytics } from "./components/pages/DoctorAnalytics";
import { AdminSettings } from "./components/pages/AdminSettings";
import { AdminUsers } from "./components/pages/AdminUsers";
import { PatientNavigation } from "./components/layout/PatientNavigation";
import { DoctorNavigation } from "./components/layout/DoctorNavigation";
import { AdminNavigation } from "./components/layout/AdminNavigation";
import "./styles/globals.css";
import "./styles/medical-theme.css";
import { SocketProvider } from "./context/SocketContext";
function AIHealthChatProtectedRoute({ children }) {
  const hasContext = sessionStorage.getItem("aiChatContext");
  if (!hasContext) {
    return <Navigate to="/patient/dashboard" replace />;
  }
  return <>{children}</>;
}
function ProtectedRoute({
  children,
  allowedRole
}) {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (userRole !== allowedRole) {
    if (userRole === "patient") {
      return <Navigate to="/patient/dashboard" replace />;
    } else if (userRole === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
function PatientLayout({ children }) {
  return <div className="flex h-screen overflow-hidden">
    <PatientNavigation />
    <main className="flex-1 overflow-y-auto bg-gray-50">
      {children}
    </main>
  </div>;
}
function DoctorLayout({ children }) {
  return <div className="flex h-screen overflow-hidden">
    <DoctorNavigation />
    <main className="flex-1 overflow-y-auto bg-gray-50">
      {children}
    </main>
  </div>;
}
function AdminLayout({ children }) {
  return <div className="flex h-screen overflow-hidden">
    <AdminNavigation />
    <main className="flex-1 overflow-y-auto bg-gray-50">
      {children}
    </main>
  </div>;
}
function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          {/* ========================================== */}
          {/* PUBLIC ROUTES */}
          {/* ========================================== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ... PATIENT ROUTES ... */}
          <Route
            path="/patient/dashboard"
            element={<ProtectedRoute allowedRole="patient">
              <PatientLayout>
                <PatientDashboard />
              </PatientLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/patient/symptom-checker"
            element={<ProtectedRoute allowedRole="patient">
              <PatientLayout>
                <SymptomChecker />
              </PatientLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/patient/report-analyzer"
            element={<ProtectedRoute allowedRole="patient">
              <PatientLayout>
                <ReportAnalyzer />
              </PatientLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/patient/booking"
            element={<ProtectedRoute allowedRole="patient">
              <PatientLayout>
                <BookingPage />
              </PatientLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/patient/chat"
            element={<ProtectedRoute allowedRole="patient">
              <AIHealthChatProtectedRoute>
                <PatientLayout>
                  <AIHealthChat />
                </PatientLayout>
              </AIHealthChatProtectedRoute>
            </ProtectedRoute>}
          />
          <Route
            path="/patient/pill-identifier"
            element={<ProtectedRoute allowedRole="patient">
              <PatientLayout>
                <PillIdentifier />
              </PatientLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/patient/profile"
            element={<ProtectedRoute allowedRole="patient">
              <PatientLayout>
                <PatientProfile />
              </PatientLayout>
            </ProtectedRoute>}
          />

          {/* ... DOCTOR ROUTES ... */}
          <Route
            path="/doctor/dashboard"
            element={<ProtectedRoute allowedRole="doctor">
              <DoctorLayout>
                <DoctorDashboard />
              </DoctorLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/doctor/queue"
            element={<ProtectedRoute allowedRole="doctor">
              <DoctorLayout>
                <DoctorDashboard />
              </DoctorLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/doctor/appointments"
            element={<ProtectedRoute allowedRole="doctor">
              <DoctorLayout>
                <DoctorSchedule />
              </DoctorLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/doctor/analytics"
            element={<ProtectedRoute allowedRole="doctor">
              <DoctorLayout>
                <DoctorAnalytics />
              </DoctorLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/doctor/profile"
            element={<ProtectedRoute allowedRole="doctor">
              <DoctorLayout>
                <div className="max-w-7xl mx-auto p-6">
                  <div className="text-center py-20">
                    <h1 className="text-3xl font-bold mb-4">Doctor Profile</h1>
                    <p className="text-gray-600">Manage your professional profile</p>
                  </div>
                </div>
              </DoctorLayout>
            </ProtectedRoute>}
          />

          {/* ... ADMIN ROUTES ... */}
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminPanel />
              </AdminLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/admin/alerts"
            element={<ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminPanel />
              </AdminLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/admin/settings"
            element={<ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/admin/analytics"
            element={<ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminPanel />
              </AdminLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/admin/audit"
            element={<ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminPanel />
              </AdminLayout>
            </ProtectedRoute>}
          />
          <Route
            path="/admin/profile"
            element={<ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <div className="max-w-7xl mx-auto p-6">
                  <div className="text-center py-20">
                    <h1 className="text-3xl font-bold mb-4">Admin Profile</h1>
                    <p className="text-gray-600">Manage your admin account</p>
                  </div>
                </div>
              </AdminLayout>
            </ProtectedRoute>}
          />

          {/* LEGACY REDIRECTS */}
          <Route path="/dashboard" element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="/symptom-checker" element={<Navigate to="/patient/symptom-checker" replace />} />
          <Route path="/report-analyzer" element={<Navigate to="/patient/report-analyzer" replace />} />
          <Route path="/booking" element={<Navigate to="/patient/booking" replace />} />
          <Route path="/chat" element={<Navigate to="/patient/chat" replace />} />
          <Route path="/pill-identifier" element={<Navigate to="/patient/pill-identifier" replace />} />
          <Route path="/doctor-dashboard" element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster position="top-right" />
      </Router>
    </SocketProvider>
  );
}
export {
  App as default
};
