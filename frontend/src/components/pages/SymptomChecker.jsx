import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { AlertCircle, Brain, RefreshCcw } from "lucide-react";
import { ProgressStepper } from "../shared/ProgressStepper";
import { AITypingIndicator } from "../shared/AITypingIndicator";
import { QuestionCard } from "../shared/QuestionCard";
import { SymptomResultCard } from "../shared/SymptomResultCard";
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

  const handleStartAnalysis = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    try {
      // 1. Start Session
      const sessionRes = await triageAPI.startSession();
      if (!sessionRes.session_id) throw new Error("Failed to start session");
      setSessionId(sessionRes.session_id);

      // 2. Submit Symptoms
      const triageRes = await triageAPI.submitSymptoms(sessionRes.session_id, symptoms);
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
    // We store the answer text for display
    const answerText = typeof answer === 'string' ? answer : JSON.stringify(answer);
    setHistory([...history, { question: currentQuestion?.text || "Assessment", answer: answerText }]);

    try {
      const triageRes = await triageAPI.submitSymptoms(sessionId, null, answer); // Use submitSymptoms with 'answer' param logic
      processApiResponse(triageRes);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to process answer.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processApiResponse = (response) => {
    const { status, next_question, final_results, stop_reason } = response;

    if (status === "IN_PROGRESS" && next_question) {
      setStep("interview");
      setCurrentQuestion(next_question);
    } else if (status === "COMPLETED" || status === "ESCALATED") {
      setAssessmentResults(final_results);
      setStep("results");
      saveContextToSession(final_results);
    }
  };

  const saveContextToSession = (results) => {
    const topCondition = results.diagnosis?.[0]?.disease || "Unknown Condition";
    sessionStorage.setItem("aiChatContext", JSON.stringify({
      source: "symptom-checker",
      topCondition: topCondition,
      fullResults: results
    }));
  };

  const resetSession = () => {
    setStep("input");
    setSymptoms("");
    setCurrentQuestion(null);
    setAssessmentResults(null);
    setHistory([]);
    setSessionId(null);
  };

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
      {step === 'input' && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Not a Medical Diagnosis:</strong> This AI tool provides information only and cannot replace professional medical advice. For diagnosis and treatment, always consult a qualified healthcare provider.
            </div>
          </CardContent>
        </Card>
      )}

      { /* Stepper */}
      {step !== "input" && <ProgressStepper currentStep={step === "interview" ? 2 : 3} totalSteps={3} />}

      { /* INPUT STEP */}
      {step === "input" && (
        <Card className="animate-in fade-in slide-in-from-bottom-2">
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
              className="resize-none text-lg p-4"
            />
            {isAnalyzing ? (
              <div className="flex justify-center py-4"><AITypingIndicator /></div>
            ) : (
              <Button onClick={handleStartAnalysis} disabled={!symptoms.trim()} className="w-full bg-cyan-600 hover:bg-cyan-700 h-12 text-lg" size="lg">
                Start AI Interview
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      { /* INTERVIEW STEP */}
      {step === "interview" && currentQuestion && (
        <div className="space-y-6">
          {/* Progress Bar for Questions? Optional */}

          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <AITypingIndicator />
              <p className="text-gray-500 animate-pulse">Analyzing your response...</p>
            </div>
          ) : (
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswerQuestion}
              isAnalyzing={isAnalyzing}
            />
          )}
        </div>
      )}

      { /* RESULTS STEP */}
      {step === "results" && assessmentResults && (
        <div className="space-y-6">
          <SymptomResultCard results={assessmentResults} />

          <div className="flex justify-center">
            <Button variant="ghost" onClick={resetSession} className="text-slate-500">
              <RefreshCcw className="w-4 h-4 mr-2" /> Start New Assessment
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
