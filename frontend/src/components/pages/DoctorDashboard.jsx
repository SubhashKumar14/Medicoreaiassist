import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";
import {
  User,
  Clock,
  Activity,
  FileText,
  Video,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Brain,
  Stethoscope,
  Bell
} from "lucide-react";
import { SeverityBadge } from "../shared/SeverityBadge";
import { appointmentsAPI, doctorAPI } from "../../lib/api"; // Added doctorAPI
import { toast } from "sonner";

function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorReviewed, setDoctorReviewed] = useState({});
  const [doctorOverrides, setDoctorOverrides] = useState({});
  const [overrideReason, setOverrideReason] = useState("");
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [consultationStatus, setConsultationStatus] = useState({});
  const [currentConsultation, setCurrentConsultation] = useState(null);
  const [patientQueue, setPatientQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stats calculation
  const stats = {
    totalPatientsToday: 28, // Mock for now or fetch from separate metrics API
    patientsInQueue: patientQueue.length,
    patientsCompleted: 25, // Mock
    averageConsultationTime: 12 // Mock
  };

  useEffect(() => {
    fetchQueue();
    // Poll every 30 seconds for new patients
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await appointmentsAPI.getQueue();
      // Transform backend data if necessary
      const queue = Array.isArray(data) ? data : [];
      setPatientQueue(queue);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching queue:", error);
      toast.error("Failed to load patient queue");
      setIsLoading(false);
    }
  };

  const currentPatient = patientQueue.find((p) => p.id === selectedPatient);

  const handleOverride = async () => {
    if (selectedPatient && overrideReason.trim()) {
      try {
        await doctorAPI.submitOverride({
          patientId: selectedPatient, // Assuming patientId is the queue item id or separate
          // We need sessionId. Assuming it's in the queue object or we need to look it up
          // For strict integration, backend needs sessionId. 
          // If not present in queue data, we might need to rely on the current active session associated with patient
          // For now, let's pass null or mock if missing, but ideally it comes from patientQueue data
          sessionId: currentPatient?.sessionId || null,
          aiDiagnosis: currentPatient?.aiResults?.topDiseases?.map(d => ({ disease: d.name, confidence: d.probability / 100 })),
          doctorDiagnosis: "Override", // Simply flagging as override, or we need a text input for 'Correct Diagnosis'
          overrideReason: overrideReason,
          severity: currentPatient?.severity || "moderate"
        });

        setDoctorOverrides({ ...doctorOverrides, [selectedPatient]: overrideReason });
        setDoctorReviewed({ ...doctorReviewed, [selectedPatient]: true });
        setShowOverrideDialog(false);
        setOverrideReason("");
        toast.success("Override recorded safely in immutable log");
      } catch (error) {
        console.error("Override failed", error);
        toast.error("Failed to submit override record");
      }
    }
  };

  const startConsultation = async (patientId) => {
    try {
      await appointmentsAPI.updateAppointmentStatus(patientId, "in_progress");
      setCurrentConsultation(patientId);
      setConsultationStatus({ ...consultationStatus, [patientId]: "in-progress" });
      toast.success("Consultation started");
    } catch (error) {
      console.error("Error starting consultation", error);
      toast.error("Failed to start consultation");
    }
  };

  const completeConsultation = async (patientId) => {
    try {
      await appointmentsAPI.updateAppointmentStatus(patientId, "completed");
      setConsultationStatus({ ...consultationStatus, [patientId]: "completed" });
      setCurrentConsultation(null);
      toast.success("Consultation completed");

      // Remove from queue or mark as done locally?
      // Let's re-fetch queue to be safe or filter out locally
      fetchQueue();

      const currentIndex = patientQueue.findIndex((p) => p.id === patientId);
      if (currentIndex < patientQueue.length - 1) {
        setSelectedPatient(patientQueue[currentIndex + 1].id);
      } else {
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error("Error completing consultation", error);
      toast.error("Failed to complete consultation");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      { /* PROMPT 3.1: Decision-Focused Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-gray-600">Review patients and make clinical decisions</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Logged in as</p>
          <p className="font-semibold flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Dr. Sarah Johnson
          </p>
        </div>
      </div>

      {
        /* PROMPT 3.9: Safety & Liability Notice */
      }
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <strong>Professional Responsibility:</strong> AI provides assistive pre-consultation analysis. You retain full clinical authority and final responsibility for all patient care decisions.
          </div>
        </CardContent>
      </Card>

      {
        /* Stats */
      }
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Today</p>
                <p className="text-3xl font-bold">{stats.totalPatientsToday}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">In Queue</p>
                <p className="text-3xl font-bold text-orange-600">{stats.patientsInQueue}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            {
              /* PROMPT 6: Real-time indicator */
            }
            <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
              <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
              <span>Live Queue</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.patientsCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Time</p>
                <p className="text-3xl font-bold">{stats.averageConsultationTime}<span className="text-lg">m</span></p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {
          /* PROMPT 3.2: Patient Queue - Urgency Sorted */
        }
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Patient Queue</CardTitle>
              <CardDescription>Sorted by medical urgency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {patientQueue.map((patient) => <div
                key={patient.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPatient === patient.id ? "border-cyan-600 bg-cyan-50" : "border-gray-200 hover:border-cyan-300"} ${patient.aiPriority === "urgent" ? "ring-2 ring-red-200" : ""}`}
                onClick={() => setSelectedPatient(patient.id)}
              >
                {
                  /* PROMPT 3.2: AI-flagged urgent cases highlighted */
                }
                {patient.aiPriority === "urgent" && <div className="mb-2 flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
                  <Bell className="w-3 h-3" />
                  AI Priority: Urgent
                </div>}

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">#{patient.tokenNumber}</span>
                      <SeverityBadge severity={patient.severity} showIcon={false} />
                    </div>
                    <h4 className="font-semibold">{patient.patientName}</h4>
                    <p className="text-sm text-gray-600">{patient.patientAge} years old</p>
                  </div>
                </div>

                {
                  /* PROMPT 3.6: Live consultation status */
                }
                {consultationStatus[patient.id] === "in-progress" && <div className="mb-2 flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  In Consultation
                </div>}
                {consultationStatus[patient.id] === "completed" && <div className="mb-2 flex items-center gap-1 text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </div>}

                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <Clock className="w-3 h-3" />
                  Waiting {patient.waitTime} min
                </div>
                {
                  /* PROMPT 6: Real-time waiting indicator */
                }
                {patient.waitTime > 15 && <div className="mt-2 px-2 py-1 bg-red-50 rounded text-xs text-red-700">
                  ⏰ Extended wait time
                </div>}
              </div>)}
            </CardContent>
          </Card>
        </div>

        {
          /* Patient Details */
        }
        <div className="lg:col-span-2">
          {currentPatient ? <Tabs defaultValue="consultation" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="consultation">Consultation</TabsTrigger>
              <TabsTrigger value="ai-summary">AI Pre-Consult</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {
              /* PROMPT 3.5: Consultation Session Flow */
            }
            <TabsContent value="consultation" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{currentPatient.patientName}</CardTitle>
                      <CardDescription>Token #{currentPatient.tokenNumber} • {currentPatient.patientAge} years old</CardDescription>
                    </div>
                    <SeverityBadge severity={currentPatient.severity} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {
                    /* Current Complaint */
                  }
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-600" />
                      Current Complaint
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {currentPatient.symptoms}
                    </p>
                  </div>

                  {
                    /* Consultation Actions */
                  }
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Consultation Actions</h4>

                    {consultationStatus[currentPatient.id] !== "in-progress" ? <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => startConsultation(currentPatient.id)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Start Consultation
                    </Button> : <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-green-800">Consultation in Progress</span>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Clinical Notes</label>
                        <Textarea
                          placeholder="Document clinical findings, diagnosis, and treatment plan..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          Prescribe
                        </Button>
                        <Button variant="outline" size="sm">
                          <Activity className="w-4 h-4 mr-1" />
                          Order Tests
                        </Button>
                      </div>

                      <Button
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                        onClick={() => completeConsultation(currentPatient.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Consultation
                      </Button>
                    </div>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {
              /* PROMPT 3.3: AI Handoff Transparency */
            }
            <TabsContent value="ai-summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    Pre-Consultation AI Summary
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Prepared by AI based on patient-reported symptoms
                  </CardDescription>
                  {
                    /* PROMPT 4: AI vs Doctor status indicator */
                  }
                  {doctorReviewed[currentPatient.id] ? <div className="flex items-center gap-2 text-sm mt-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-semibold">
                      {doctorOverrides[currentPatient.id] ? "Doctor Override Recorded" : "Doctor Reviewed & Confirmed"}
                    </span>
                  </div> : <div className="flex items-center gap-2 text-sm mt-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-700 font-semibold">AI Analysis (Awaiting Doctor Review)</span>
                  </div>}
                </CardHeader>
                <CardContent className="space-y-4">
                  {
                    /* PROMPT 4: Clearly label AI output */
                  }
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <div className="flex gap-2 mb-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">AI Assessment (Assistive Only)</h4>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">{currentPatient.aiResults.explanation}</p>

                    {
                      /* PROMPT 3.3: AI confidence and uncertainty visible */
                    }
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-blue-900">Confidence Level:</span>
                        <Badge variant={currentPatient.aiResults.confidence === "high" ? "default" : "secondary"}>
                          {currentPatient.aiResults.confidence}
                        </Badge>
                      </div>
                      {currentPatient.aiResults.uncertainFactors.length > 0 && <div className="mt-2">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Uncertain Factors:</p>
                        <ul className="text-xs text-blue-800 space-y-1">
                          {currentPatient.aiResults.uncertainFactors.map((factor, idx) => <li key={idx} className="flex items-start gap-1">
                            <span className="text-blue-600">•</span>
                            {factor}
                          </li>)}
                        </ul>
                      </div>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">AI-Suggested Differential Diagnosis</h4>
                    <div className="space-y-3">
                      {currentPatient.aiResults.topDiseases.map((disease, index) => <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center font-semibold text-xs">
                              {index + 1}
                            </div>
                            <span className="font-semibold">{disease.name}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">AI Suggested</span>
                          </div>
                          <span className="text-lg font-bold text-cyan-600">
                            {disease.probability}%
                          </span>
                        </div>
                        <Progress value={disease.probability} className="h-2" />
                      </div>)}
                    </div>
                  </div>

                  {
                    /* PROMPT 3.4: Doctor action buttons with clear hierarchy */
                  }
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-gray-900">Your Clinical Decision</h4>

                    {!doctorReviewed[currentPatient.id] ? <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => setDoctorReviewed({ ...doctorReviewed, [currentPatient.id]: true })}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm AI Analysis
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-amber-600 text-amber-700 hover:bg-amber-50"
                          onClick={() => setShowOverrideDialog(true)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Override AI Suggestion
                        </Button>
                      </div>

                      {
                        /* PROMPT 3.4: Override Dialog */
                      }
                      {showOverrideDialog && <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg space-y-3">
                        <h5 className="font-semibold text-amber-900">Record Override Reasoning</h5>
                        <Textarea
                          placeholder="Please document your clinical reasoning for overriding AI suggestion..."
                          value={overrideReason}
                          onChange={(e) => setOverrideReason(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleOverride}
                            disabled={!overrideReason.trim()}
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            Submit Override
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowOverrideDialog(false);
                              setOverrideReason("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>}
                    </div> : <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">
                          {doctorOverrides[currentPatient.id] ? "Override Recorded" : "Analysis Confirmed"}
                        </span>
                      </div>
                      {doctorOverrides[currentPatient.id] && <p className="text-sm text-green-700 mt-2">
                        Reasoning: {doctorOverrides[currentPatient.id]}
                      </p>}
                    </div>}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-1">Clinical Decision Support</h4>
                        <p className="text-sm text-amber-800">
                          Review AI analysis and correlate with physical examination. Consider patient history and additional tests if needed. Your clinical judgment is final.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {
              /* PROMPT 3.7: Report & AI Insight Review Flow */
            }
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Medical Reports & Documents
                  </CardTitle>
                  <CardDescription>Patient-uploaded reports with AI analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentPatient.reports.length > 0 ? <div className="space-y-3">
                    {currentPatient.reports.map((report, index) => <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{report}</p>
                            <p className="text-sm text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Report</Button>
                          <Button variant="outline" size="sm">AI Analysis</Button>
                        </div>
                      </div>
                    </div>)}
                  </div> : <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No reports uploaded</p>
                  </div>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs> : <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patient Selected</h3>
              <p className="text-gray-500">Select a patient from the queue to begin consultation</p>
            </CardContent>
          </Card>}
        </div>
      </div>
    </div>
  );
}
export {
  DoctorDashboard
};
