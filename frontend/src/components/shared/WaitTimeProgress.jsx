import { Progress } from "../ui/progress";
import { Clock } from "lucide-react";
function WaitTimeProgress({ estimatedMinutes, className = "" }) {
  const maxWaitTime = 60;
  const progress = Math.max(0, Math.min(100, (maxWaitTime - estimatedMinutes) / maxWaitTime * 100));
  return <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Estimated Wait Time</span>
        </div>
        <span className="font-medium text-cyan-700">{estimatedMinutes} min</span>
      </div>
      <Progress value={progress} className="h-2 progress-animate" />
      <p className="text-xs text-gray-500">
        {estimatedMinutes < 15 ? "Your turn is coming up soon!" : "Please wait, you'll be called shortly."}
      </p>
    </div>;
}
export {
  WaitTimeProgress
};
