import { Stethoscope, Home, Users, Calendar, BarChart3, User, Bell, LogOut, ShieldCheck } from "lucide-react";
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
function DoctorNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const doctorMenuItems = [
    { icon: Home, label: "Dashboard", path: "/doctor/dashboard" },
    { icon: Users, label: "Patient Queue", path: "/doctor/queue" },
    { icon: Calendar, label: "Appointments", path: "/doctor/appointments" },
    { icon: BarChart3, label: "Analytics", path: "/doctor/analytics" }
  ];
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
    navigate("/login");
  };
  const urgentCases = 3;
  return <aside className="w-64 bg-white border-r flex flex-col h-screen sticky top-0">
      {
    /* Sidebar Header */
  }
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/doctor/dashboard")}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">MedAI Care</p>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </div>
        </div>
      </div>

      {
    /* Menu Items */
  }
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {doctorMenuItems.map((item) => {
    const isActive = location.pathname === item.path;
    const hasUrgent = item.path === "/doctor/queue" && urgentCases > 0;
    return <button
      key={item.path}
      onClick={() => navigate(item.path)}
      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
    >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {hasUrgent && <Badge variant="destructive" className="text-xs px-1.5 py-0.5 animate-pulse">
                  {urgentCases}
                </Badge>}
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
                {urgentCases > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Urgent Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-3 bg-red-50 rounded-lg text-sm border border-red-200">
                  <p className="font-medium text-red-900">🚨 High Priority Patient</p>
                  <p className="text-red-700">Patient with severe symptoms waiting</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg text-sm border border-amber-200">
                  <p className="font-medium text-amber-900">⚠️ Extended Wait Time</p>
                  <p className="text-amber-700">Patient waiting over 30 minutes</p>
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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">Dr. Sarah Smith</p>
                  <p className="text-xs text-gray-500 font-normal">dr.smith@medai.com</p>
                  <Badge variant="outline" className="mt-1 text-xs">Cardiologist</Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/doctor/profile")}>
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
    /* Clinical Authority Notice */
  }
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex gap-2 text-xs text-blue-800">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Clinical Authority</p>
              <p>AI assists your decisions. Your clinical judgment is final.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>;
}
export {
  DoctorNavigation
};
