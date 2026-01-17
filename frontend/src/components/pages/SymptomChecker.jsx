import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { AlertCircle, Brain, FileText, Calendar, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react";
import { ProgressStepper } from "../shared/ProgressStepper";
import { SeverityBadge } from "../shared/SeverityBadge";
import { AITypingIndicator } from "../shared/AITypingIndicator";
import { useNavigate } from "react-router-dom";
import { triageAPI } from "../../lib/api";
import { toast } from "sonner";

function SymptomChecker() {
  const navigate = useNavigate();
  const [step, setStep] = useState("input");
  const [symptoms, setSymptoms] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]); // Added for stricter chat state if needed

  const handleStartAnalysis = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    try {
      // 1. Start Session
      const sessionRes = await triageAPI.startSession();
      if (!sessionRes.sessionId) throw new Error("Failed to start session");
      setSessionId(sessionRes.sessionId);

      // 2. Submit Symptoms
      const triageRes = await triageAPI.submitSymptoms(sessionRes.sessionId, symptoms);
      processApiResponse(triageRes);

    } catch (error) {
      console.error("Error starting triage:", error);
      toast.error("Failed to start analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnswerQuestion = async (answer) => {
    if (!sessionId) return;
    setIsAnalyzing(true);
    // Optimistic update for UI history
    setHistory([...history, { question: currentQuestion?.text || "Question", answer }]);

    try {
      const triageRes = await triageAPI.answerQuestion(sessionId, answer);
      processApiResponse(triageRes);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to process answer.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processApiResponse = (response) => {
    const { status, next_question, diagnosis, identified_symptoms, recommendation, message, severity } = response;

    if (status === "IN_PROGRESS") {
      setStep("interview");
      // If message usually contains the question, or we use next_question
      // The backend returns next_question specifically
      if (next_question) {
        setCurrentQuestion({
          text: next_question, // Or message? backend sends message: "Do you have X?"
          why: "To better understand your condition"
        });
      } else {
        // Fallback
        setCurrentQuestion({
          text: message || "Any other symptoms?",
          why: "Refining analysis"
        });
      }
    } else if (status === "COMPLETED" || status === "ESCALATED") {
      // Construct results object that matches UI expectation

      let triageLevel = "Consultation Recommended";
      if (status === "ESCALATED" || severity === "critical") triageLevel = "Emergency - Critical";
      else if (severity === "high") triageLevel = "Urgent Care";
      else if (diagnosis && diagnosis[0]?.confidence >= 0.8) triageLevel = "Medical Consultation";
      else if (severity === "low") triageLevel = "Self Care";

      const results = {
        diagnosis: diagnosis?.map(d => ({ Condition: d.disease, Probability: (d.confidence * 100).toFixed(0) + "%" })) || [],
        triage_level: triageLevel,
        advice: recommendation || message,
        summary: identified_symptoms ? `Identified symptoms: ${identified_symptoms.join(", ")}` : ""
      };

      setAssessmentResults(results);
      setStep("results");
      saveContextToSession(results, severity);
    }
  };

  const saveContextToSession = (results, severity) => {
    const topCondition = results.diagnosis?.[0]?.Condition || "Unknown Condition";

    // Normalize severity string
    let sev = "moderate";
    if (severity) sev = severity;
    else {
      const sevLower = results.triage_level?.toLowerCase() || "";
      if (sevLower.includes("emergency") || sevLower.includes("critical")) sev = "critical";
      else if (sevLower.includes("urgent") || sevLower.includes("high")) sev = "high";
      else if (sevLower.includes("consult") || sevLower.includes("medium")) sev = "moderate";
      else sev = "low";
    }

    sessionStorage.setItem("aiChatContext", JSON.stringify({
      source: "symptom-checker",
      severity: sev,
      topCondition: topCondition,
      fullResults: results
    }));
    sessionStorage.setItem("symptomCheckComplete", "true");
  };

  // Helper for Actions
  const getSeverityActions = (severity) => {
    if (severity === "critical") return { chatDisabled: true, bookingRequired: true, message: "Critical severity - Immediate medical attention required" };
    if (severity === "high") return { chatDisabled: false, bookingRequired: false, bookingProminent: true, message: "High severity - We strongly recommend booking a consultation" };
    return { chatDisabled: false, bookingRequired: false, bookingProminent: false, message: null };
  };

  // Derived state for render
  let severity = "low";
  if (assessmentResults) {
    const tl = assessmentResults.triage_level?.toLowerCase() || "";
    if (tl.includes("emergency") || tl.includes("critical")) severity = "critical";
    else if (tl.includes("urgent") || tl.includes("high")) severity = "high";
    else if (tl.includes("consult")) severity = "moderate";
  }

  const severityActions = getSeverityActions(severity);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      { /* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">AI Symptom Checker</h1>
        </div>
        <p className="text-gray-600">AI-powered interview to help identify possible conditions</p>
      </div>

      { /* Disclaimer */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <strong>Not a Medical Diagnosis:</strong> This AI tool provides information only and cannot replace professional medical advice. For diagnosis and treatment, always consult a qualified healthcare provider.
          </div>
        </CardContent>
      </Card>

      { /* Stepper */}
      {step !== "input" && <ProgressStepper currentStep={step === "interview" ? 2 : 3} totalSteps={3} />}

      { /* INPUT STEP */}
      {step === "input" && (
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Symptoms</CardTitle>
            <CardDescription>Be as detailed as possible about what you're experiencing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: I have a runny nose, sore throat, and mild headache that started 2 days ago..."
              rows={6}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="resize-none"
            />
            {isAnalyzing ? (
              <div className="flex justify-center py-4"><AITypingIndicator /></div>
            ) : (
              <Button onClick={handleStartAnalysis} disabled={!symptoms.trim()} className="w-full bg-cyan-600 hover:bg-cyan-700" size="lg">Start AI Interview</Button>
            )}
          </CardContent>
        </Card>
      )}

      { /* INTERVIEW STEP */}
      {step === "interview" && currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>AI Health Interview</CardTitle>
            <Progress value={((history.length + 1) / 10) * 100} className="h-2" /> {/* Mock progress */}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">{currentQuestion.text}</h3>
              {currentQuestion.why && <p className="text-sm text-gray-500 italic">Why: {currentQuestion.why}</p>}
            </div>

            {isAnalyzing ? (
              <div className="flex flex-col items-center py-4 gap-3">
                <AITypingIndicator />
                <p className="text-sm text-gray-600">Analyzing your response...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => handleAnswerQuestion("yes")} variant="outline" size="lg" className="h-20">Yes</Button>
                <Button onClick={() => handleAnswerQuestion("no")} variant="outline" size="lg" className="h-20">No</Button>
              </div>
            )}
            { /* Provide a text input for other answers if needed, but keeping binary/simple for now based on UI */}
          </CardContent>
        </Card>
      )}

      { /* RESULTS STEP */}
      {step === "results" && assessmentResults && (
        <div className="space-y-6">
          {severityActions.message && (
            <Card className={severityActions.bookingRequired ? "bg-red-50 border-red-300" : "bg-orange-50 border-orange-300"}>
              <CardContent className="p-4 flex gap-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${severityActions.bookingRequired ? "text-red-600" : "text-orange-600"}`} />
                <div className={`text-sm font-semibold ${severityActions.bookingRequired ? "text-red-900" : "text-orange-900"}`}>{severityActions.message}</div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Assessment Results - Possible Conditions</CardTitle>
                <SeverityBadge severity={severity} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-1">AI Assessed Triage Level</h4>
                <p className="text-sm text-blue-800">{assessmentResults.triage_level}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Possible Conditions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {assessmentResults.diagnosis?.map((d, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{d.Condition}</h4>
                    <span className="text-cyan-600 font-bold">{d.Probability}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className={`h-20 flex flex-col gap-2 ${severityActions.chatDisabled ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => !severityActions.chatDisabled && navigate("/patient/chat")} disabled={severityActions.chatDisabled}>
              <MessageSquare className="w-6 h-6" />
              <span>Discuss with AI</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate("/patient/report-analyzer")}>
              <FileText className="w-6 h-6" />
              <span>Upload Report</span>
            </Button>
            <Button className={`h-20 flex flex-col gap-2 ${severityActions.bookingProminent ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-cyan-600 hover:bg-cyan-700"}`} onClick={() => navigate("/patient/booking")}>
              <Calendar className="w-6 h-6" />
              <span>{severityActions.bookingRequired ? "Book Now (Required)" : "Book Consultation"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export {
  SymptomChecker
};
