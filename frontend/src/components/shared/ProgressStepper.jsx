import { Check } from "lucide-react";
function ProgressStepper({ currentStep, totalSteps, className = "" }) {
  return <div className={`flex items-center justify-between ${className}`}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center relative w-full">
            {
    /* Step Circle */
  }
            <div
    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step < currentStep ? "bg-cyan-600 border-cyan-600 text-white" : step === currentStep ? "bg-cyan-600 border-cyan-600 text-white ring-4 ring-cyan-100" : "bg-white border-gray-300 text-gray-400"}`}
  >
              {step < currentStep ? <Check className="w-5 h-5" /> : <span className="font-medium">{step}</span>}
            </div>

            {
    /* Step Label */
  }
            <span
    className={`text-xs mt-2 ${step <= currentStep ? "text-cyan-700 font-medium" : "text-gray-400"}`}
  >
              Step {step}
            </span>
          </div>

          {
    /* Connector Line */
  }
          {index < totalSteps - 1 && <div className="flex-1 h-0.5 mx-2 mb-6">
              <div
    className={`h-full transition-all duration-300 ${step < currentStep ? "bg-cyan-600" : "bg-gray-300"}`}
  />
            </div>}
        </div>)}
    </div>;
}
export {
  ProgressStepper
};
