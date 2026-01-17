import { Activity, Bell, User, LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
function Navbar({ onMenuClick, showMenu = true }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole") || "patient";
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };
  return <nav className="border-b bg-white sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {showMenu && <Button
    variant="ghost"
    size="icon"
    onClick={onMenuClick}
    className="lg:hidden"
  >
              <Menu className="w-5 h-5" />
            </Button>}
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold hidden sm:block">MedAI Care</span>
          </div>

          <Badge variant="secondary" className="hidden md:block">
            {userRole === "doctor" ? "Doctor Portal" : userRole === "admin" ? "Admin Panel" : "Patient Portal"}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {
    /* Notifications */
  }
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-3 bg-cyan-50 rounded-lg text-sm">
                  <p className="font-medium text-cyan-900">Appointment Reminder</p>
                  <p className="text-cyan-700">Your consultation starts in 30 minutes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium">Report Analysis Complete</p>
                  <p className="text-gray-600">Your blood test results are ready</p>
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
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-gray-500 font-normal">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
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
      </div>
    </nav>;
}
export {
  Navbar
};
