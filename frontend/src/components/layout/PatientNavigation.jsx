import { Activity, Home, FileText, Pill, Calendar, User, Bell, LogOut, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
function PatientNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasAIChatContext = sessionStorage.getItem("aiChatContext");
  const patientMenuItems = [
    { icon: Home, label: "Dashboard", path: "/patient/dashboard" },
    { icon: Activity, label: "Symptom Checker", path: "/patient/symptom-checker" },
    { icon: FileText, label: "Report Analyzer", path: "/patient/report-analyzer" },
    { icon: Pill, label: "Pill Identifier", path: "/patient/pill-identifier" },
    { icon: Calendar, label: "Book Appointment", path: "/patient/booking" },
    // AI Chat only included when context exists
    ...hasAIChatContext ? [{ icon: Heart, label: "AI Health Chat", path: "/patient/chat" }] : []
  ];
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
    navigate("/login");
  };
  const notifications = 3;
  return <aside className="w-64 bg-white border-r flex flex-col h-screen sticky top-0">
      {
    /* Sidebar Header */
  }
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/patient/dashboard")}>
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">MedAI Care</p>
            <p className="text-xs text-gray-500">Patient Portal</p>
          </div>
        </div>
      </div>

      {
    /* Menu Items */
  }
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {patientMenuItems.map((item) => {
    const isActive = location.pathname === item.path;
    return <button
      key={item.path}
      onClick={() => navigate(item.path)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-cyan-50 text-cyan-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
    >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>;
  })}
      </nav>

      {
    /* User Section */
  }
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          {
    /* Notifications */
  }
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-3 bg-cyan-50 rounded-lg text-sm">
                  <p className="font-medium text-cyan-900">Appointment Reminder</p>
                  <p className="text-cyan-700">Dr. Smith - Tomorrow at 10:00 AM</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-medium text-blue-900">Health Report Ready</p>
                  <p className="text-blue-700">Your recent blood test results are available</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {
    /* User Menu */
  }
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-gray-500 font-normal">john.doe@email.com</p>
                  <Badge variant="outline" className="mt-1 text-xs">Patient</Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/patient/profile")}>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {
    /* AI-Assisted Care Notice */
  }
        <div className="p-3 bg-cyan-50 rounded-lg">
          <div className="flex gap-2 text-xs text-cyan-800">
            <Heart className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">AI-Assisted Care</p>
              <p>This platform uses AI to support, not replace, medical professionals.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>;
}
export {
  PatientNavigation
};
