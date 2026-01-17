import { Shield, Home, Users, AlertTriangle, BarChart3, Settings, FileText, User, Bell, LogOut, Lock } from "lucide-react";
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
function AdminNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminMenuItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: AlertTriangle, label: "Alerts & Anomalies", path: "/admin/alerts" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Settings, label: "System Settings", path: "/admin/settings" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: FileText, label: "Audit Logs", path: "/admin/audit" }
  ];
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
    navigate("/login");
  };
  const criticalAlerts = 2;
  return <aside className="w-64 bg-white border-r flex flex-col h-screen sticky top-0">
      {
    /* Sidebar Header */
  }
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">MedAI Care</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {
    /* Menu Items */
  }
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminMenuItems.map((item) => {
    const isActive = location.pathname === item.path;
    const hasAlert = item.path === "/admin/alerts" && criticalAlerts > 0;
    return <button
      key={item.path}
      onClick={() => navigate(item.path)}
      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-red-50 text-red-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
    >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {hasAlert && <Badge variant="destructive" className="text-xs px-1.5 py-0.5 animate-pulse">
                  {criticalAlerts}
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
                {criticalAlerts > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>System Alerts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-3 bg-red-50 rounded-lg text-sm border border-red-200">
                  <p className="font-medium text-red-900">🚨 Critical: High Override Rate</p>
                  <p className="text-red-700">8 doctor overrides in last 2 hours</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg text-sm border border-amber-200">
                  <p className="font-medium text-amber-900">⚠️ Warning: System Performance</p>
                  <p className="text-amber-700">Report analysis response time elevated</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-medium text-blue-900">ℹ️ New Doctor Approval</p>
                  <p className="text-blue-700">2 pending doctor registrations</p>
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
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-gray-500 font-normal">admin@medai.com</p>
                  <Badge variant="outline" className="mt-1 text-xs">Super Admin</Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
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
    /* Governance Notice */
  }
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="flex gap-2 text-xs text-red-800">
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">System Governance</p>
              <p>Monitor and control AI-assisted healthcare operations safely.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>;
}
export {
  AdminNavigation
};
