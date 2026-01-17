import { Badge } from "../ui/badge";
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";
function SeverityBadge({ severity, showIcon = true, className = "" }) {
  const config = {
    low: {
      label: "Low",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: Info
    },
    moderate: {
      label: "Moderate",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: AlertTriangle
    },
    high: {
      label: "High",
      color: "bg-orange-100 text-orange-700 border-orange-200",
      icon: AlertCircle
    },
    critical: {
      label: "Critical",
      color: "bg-red-100 text-red-700 border-red-200",
      icon: XCircle
    }
  };
  const { label, color, icon: Icon } = config[severity];
  return <Badge className={`${color} border ${className} severity-badge`} variant="outline">
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </Badge>;
}
export {
  SeverityBadge
};
