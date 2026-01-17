import { Activity, FileText, Pill, Calendar, MessageSquare, BarChart3, Users, Settings, Home, Stethoscope } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
function Sidebar({ isOpen = true, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole") || "patient";
  const hasAIChatContext = sessionStorage.getItem("aiChatContext");
  const patientMenuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Activity, label: "Symptom Checker", path: "/symptom-checker" },
    { icon: FileText, label: "Report Analyzer", path: "/report-analyzer" },
    { icon: Pill, label: "Pill Identifier", path: "/pill-identifier" },
    { icon: Calendar, label: "Book Appointment", path: "/booking" },
    // PROMPT 1 & 7: AI Chat only appears when context exists
    ...hasAIChatContext ? [{ icon: MessageSquare, label: "Continue AI Chat", path: "/chat" }] : []
  ];
  const doctorMenuItems = [
    { icon: Home, label: "Dashboard", path: "/doctor-dashboard" },
    { icon: Users, label: "Patient Queue", path: "/doctor-queue" },
    { icon: Calendar, label: "Appointments", path: "/doctor-appointments" },
    { icon: BarChart3, label: "Analytics", path: "/doctor-analytics" }
  ];
  const adminMenuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: BarChart3, label: "Analytics", path: "/admin" },
    { icon: Users, label: "User Management", path: "/admin" },
    { icon: Settings, label: "System Settings", path: "/admin" }
  ];
  const menuItems = userRole === "doctor" ? doctorMenuItems : userRole === "admin" ? adminMenuItems : patientMenuItems;
  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };
  return <>
      {
    /* Mobile Overlay */
  }
      {isOpen && <div
    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
    onClick={onClose}
  />}

      {
    /* Sidebar */
  }
      <aside
    className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} w-64`}
  >
        <div className="flex flex-col h-full">
          {
    /* Header */
  }
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-lg flex items-center justify-center">
                {userRole === "doctor" ? <Stethoscope className="w-6 h-6 text-white" /> : <Activity className="w-6 h-6 text-white" />}
              </div>
              <div>
                <p className="font-semibold">MedAI Care</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>

          {
    /* Menu Items */
  }
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
    const isActive = location.pathname === item.path;
    return <button
      key={item.path}
      onClick={() => handleNavigation(item.path)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-cyan-50 text-cyan-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
    >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>;
  })}
          </nav>

          {
    /* Footer */
  }
          <div className="p-4 border-t">
            <button
    onClick={() => handleNavigation("/settings")}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
  >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>;
}
export {
  Sidebar
};
