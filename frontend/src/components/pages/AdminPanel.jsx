import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import {
  Activity,
  AlertTriangle,
  Settings,
  BarChart3,
  Bell,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Pause,
  RefreshCw,
  Download,
  Lock
} from "lucide-react";
import { SeverityBadge } from "../shared/SeverityBadge";
function AdminPanel() {
  const [featureToggles, setFeatureToggles] = useState({
    "symptom-checker": true,
    "report-analyzer": true,
    "pill-identifier": false,
    "ai-chat": true
  });
  const [toggleJustification, setToggleJustification] = useState("");
  const [showToggleConfirm, setShowToggleConfirm] = useState(null);
  const [anomalyStates, setAnomalyStates] = useState({});
  const [investigationPane, setInvestigationPane] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(null);
  const [approvalReason, setApprovalReason] = useState("");
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [showIncidentPanel, setShowIncidentPanel] = useState(false);
  const [incidentNote, setIncidentNote] = useState("");
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(/* @__PURE__ */ new Set());
  const [alertNote, setAlertNote] = useState("");
  const [showAlertAck, setShowAlertAck] = useState(null);
  const [safetyLockEnabled, setSafetyLockEnabled] = useState(false);
  const metrics = {
    totalPatients: 1248,
    totalDoctors: 45,
    totalAppointments: 856,
    aiAccuracy: 87.5,
    aiOverrides: 42,
    emergencyCases: 12,
    averageWaitTime: 18,
    systemHealth: "healthy",
    appointmentsByStatus: {
      pending: 45,
      "in-progress": 12,
      completed: 785,
      cancelled: 14
    },
    appointmentsBySeverity: {
      low: 512,
      moderate: 286,
      high: 48,
      critical: 10
    }
  };
  const urgentAnomalies = [
    {
      id: "4",
      type: "ai_doctor_disagreement",
      severity: "high",
      message: "High doctor override rate detected",
      details: "8 overrides in last 2 hours - 42% above normal",
      affectedSessions: 8,
      timeWindow: "Last 2 hours",
      timestamp: "15 min ago",
      resolved: false,
      evidence: ["Session #45231", "Session #45234", "Session #45240"]
    },
    {
      id: "1",
      type: "ai_error",
      severity: "moderate",
      message: "AI model returned unusual confidence scores",
      details: "Confidence variance >30% - suggests data quality issue",
      affectedSessions: 3,
      timeWindow: "Last hour",
      timestamp: "2 hours ago",
      resolved: false,
      evidence: ["Session #45231"]
    }
  ];
  const systemAnomalies = [
    {
      id: "2",
      type: "unusual_pattern",
      severity: "low",
      message: "Spike in symptom checker usage",
      details: "45% increase from yesterday",
      affectedSessions: 156,
      timeWindow: "Today",
      timestamp: "5 hours ago",
      resolved: true,
      evidence: []
    },
    {
      id: "3",
      type: "system_error",
      severity: "moderate",
      message: "Report analysis service slow response",
      details: "Average response time: 8.5s (normal: 2s)",
      affectedSessions: 12,
      timeWindow: "Last 6 hours",
      timestamp: "1 day ago",
      resolved: true,
      evidence: []
    }
  ];
  const pendingDoctors = [
    {
      id: "doc-1",
      name: "Dr. James Wilson",
      email: "james.wilson@hospital.com",
      specialization: "Cardiology",
      verificationStatus: {
        medicalLicense: true,
        backgroundCheck: true,
        references: false
      },
      submittedDate: "2024-01-10"
    },
    {
      id: "doc-2",
      name: "Dr. Lisa Martinez",
      email: "lisa.m@clinic.com",
      specialization: "Pediatrics",
      verificationStatus: {
        medicalLicense: true,
        backgroundCheck: false,
        references: true
      },
      submittedDate: "2024-01-12"
    }
  ];
  const users = [
    { id: "1", name: "John Smith", email: "john.smith@email.com", role: "patient", status: "active", joinedDate: "2024-01-15" },
    { id: "2", name: "Dr. Sarah Johnson", email: "sarah.j@hospital.com", role: "doctor", status: "active", joinedDate: "2024-01-10" },
    { id: "3", name: "Maria Garcia", email: "maria.g@email.com", role: "patient", status: "active", joinedDate: "2024-02-20" },
    { id: "4", name: "Dr. Michael Chen", email: "michael.c@hospital.com", role: "doctor", status: "active", joinedDate: "2024-01-08" },
    { id: "5", name: "David Lee", email: "david.lee@email.com", role: "patient", status: "inactive", joinedDate: "2024-03-05" }
  ];
  const features = [
    {
      id: "symptom-checker",
      name: "Symptom Checker",
      description: "AI-powered symptom analysis",
      lastChanged: "2024-01-15 14:30",
      changedBy: "Admin Sarah"
    },
    {
      id: "report-analyzer",
      name: "Report Analyzer",
      description: "Medical report OCR and analysis",
      lastChanged: "2024-01-10 09:15",
      changedBy: "Admin John"
    },
    {
      id: "pill-identifier",
      name: "Pill Identifier",
      description: "Medication identification",
      lastChanged: "2024-01-05 16:45",
      changedBy: "Admin Sarah"
    },
    {
      id: "ai-chat",
      name: "AI Health Chat",
      description: "Conversational health assistant",
      lastChanged: "2024-01-14 11:20",
      changedBy: "Admin John"
    }
  ];
  const handleToggleFeature = (featureId) => {
    if (safetyLockEnabled) {
      alert("Safety lock enabled - requires two-person approval");
      return;
    }
    setShowToggleConfirm(featureId);
  };
  const confirmToggle = (featureId) => {
    if (!toggleJustification.trim()) {
      alert("Justification required");
      return;
    }
    setFeatureToggles({ ...featureToggles, [featureId]: !featureToggles[featureId] });
    setShowToggleConfirm(null);
    setToggleJustification("");
  };
  const triageAnomaly = (anomalyId, action) => {
    if (action === "investigate") {
      setAnomalyStates({ ...anomalyStates, [anomalyId]: "investigating" });
      setInvestigationPane(anomalyId);
    } else {
      setAnomalyStates({ ...anomalyStates, [anomalyId]: "resolved" });
    }
  };
  const acknowledgeAlert = (alertId) => {
    if (!alertNote.trim()) {
      alert("Acknowledgment note required");
      return;
    }
    setAcknowledgedAlerts(/* @__PURE__ */ new Set([...acknowledgedAlerts, alertId]));
    setShowAlertAck(null);
    setAlertNote("");
  };
  return <div className="max-w-7xl mx-auto p-6 space-y-6">
      {
    /* PROMPT 4.8: Emergency Banner */
  }
      {emergencyActive && <Card className="bg-red-50 border-red-300 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
                <div>
                  <h3 className="font-bold text-red-900">Emergency Alert: Critical System Event</h3>
                  <p className="text-sm text-red-800">Surge in critical severity sessions detected</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={() => alert("AI Module Paused")}>
                  <Pause className="w-4 h-4 mr-1" />
                  Pause AI Module
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowIncidentPanel(true)}>
                  Open Incident Panel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>}

      {
    /* PROMPT 4.8: Incident Panel */
  }
      {showIncidentPanel && <Card className="border-red-300">
          <CardHeader className="bg-red-50">
            <CardTitle>Incident Management Panel</CardTitle>
            <CardDescription>Record and manage critical incident</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Incident Note (Required)</label>
              <Textarea
    placeholder="Document the incident, affected systems, and actions taken..."
    value={incidentNote}
    onChange={(e) => setIncidentNote(e.target.value)}
    rows={4}
    className="resize-none"
  />
            </div>
            <div className="flex gap-2">
              <Button
    className="bg-red-600 hover:bg-red-700"
    disabled={!incidentNote.trim()}
  >
                Record Incident
              </Button>
              <Button variant="outline" onClick={() => alert("On-call doctor notified")}>
                <Send className="w-4 h-4 mr-1" />
                Notify On-Call
              </Button>
              <Button variant="outline" onClick={() => setShowIncidentPanel(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>}

      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          <p className="text-gray-600">Governance, monitoring, and system operations</p>
        </div>
        <div className="flex items-center gap-3">
          {
    /* PROMPT 4.12: Safety Lock */
  }
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
            <Lock className={`w-4 h-4 ${safetyLockEnabled ? "text-red-600" : "text-gray-400"}`} />
            <span className="text-sm font-medium">Safety Lock</span>
            <Switch
    checked={safetyLockEnabled}
    onCheckedChange={setSafetyLockEnabled}
  />
          </div>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {
    /* PROMPT 4.1: Primary Widgets - Actionable Items First */
  }
      <div className="grid md:grid-cols-4 gap-4">
        <Card className={metrics.systemHealth === "healthy" ? "border-green-200" : "border-red-200"}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">System Health</p>
                <p className="text-2xl font-bold text-green-600">Healthy</p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  <span>All systems operational</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Urgent Cases</p>
                <p className="text-3xl font-bold text-red-600">{metrics.emergencyCases}</p>
                <Button size="sm" variant="link" className="p-0 h-auto text-xs text-red-600">
                  View All →
                </Button>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Doctor Overrides</p>
                <p className="text-3xl font-bold text-amber-600">{metrics.aiOverrides}</p>
                <div className="text-xs text-amber-600 mt-1">
                  4.9% of cases
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Alerts</p>
                <p className="text-3xl font-bold text-blue-600">{urgentAnomalies.length}</p>
                <Button size="sm" variant="link" className="p-0 h-auto text-xs text-blue-600">
                  Review Alerts →
                </Button>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">🚨 Alerts & Anomalies</TabsTrigger>
          <TabsTrigger value="features">⚙️ Feature Controls</TabsTrigger>
          <TabsTrigger value="doctors">👥 Doctor Approvals</TabsTrigger>
          <TabsTrigger value="audit">📋 Audit Log</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        {
    /* PROMPT 4.2 & 4.10: Alerts & Anomalies Tab */
  }
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Urgent Anomalies & Alerts</CardTitle>
              <CardDescription>Actionable items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentAnomalies.map((anomaly) => <div
    key={anomaly.id}
    className={`border rounded-lg p-4 ${acknowledgedAlerts.has(anomaly.id) ? "bg-gray-50 border-gray-300" : "bg-white border-red-200"}`}
  >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SeverityBadge severity={anomaly.severity} />
                        {!acknowledgedAlerts.has(anomaly.id) && <Badge className="bg-red-100 text-red-700 border-red-200">
                            Unacknowledged
                          </Badge>}
                        {anomalyStates[anomaly.id] === "investigating" && <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            Investigating
                          </Badge>}
                      </div>
                      <h4 className="font-semibold mb-1">{anomaly.message}</h4>
                      <p className="text-sm text-gray-600 mb-2">{anomaly.details}</p>
                      
                      {
    /* PROMPT 4.2: Evidence summary */
  }
                      <div className="flex gap-4 text-xs text-gray-500 mb-2">
                        <span>📊 {anomaly.affectedSessions} sessions</span>
                        <span>⏱️ {anomaly.timeWindow}</span>
                        <span>🕐 {anomaly.timestamp}</span>
                      </div>

                      {anomaly.evidence.length > 0 && <div className="mt-2">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Sample Evidence:</p>
                          <div className="flex gap-2">
                            {anomaly.evidence.map((session, idx) => <Button key={idx} size="sm" variant="outline" className="text-xs h-7">
                                {session}
                              </Button>)}
                          </div>
                        </div>}
                    </div>
                  </div>

                  {
    /* PROMPT 4.2: Triage actions */
  }
                  {!acknowledgedAlerts.has(anomaly.id) && <div className="flex gap-2">
                      <Button
    size="sm"
    onClick={() => triageAnomaly(anomaly.id, "investigate")}
    disabled={anomalyStates[anomaly.id] === "investigating"}
  >
                        <Eye className="w-3 h-3 mr-1" />
                        Investigate
                      </Button>
                      <Button
    size="sm"
    variant="outline"
    onClick={() => setShowAlertAck(anomaly.id)}
  >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Acknowledge
                      </Button>
                      <Button size="sm" variant="outline">
                        Assign
                      </Button>
                    </div>}

                  {
    /* PROMPT 4.10: Alert acknowledgment dialog */
  }
                  {showAlertAck === anomaly.id && <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                      <label className="block text-sm font-medium">Acknowledgment Note (Required)</label>
                      <Textarea
    placeholder="Document your review and any actions taken..."
    value={alertNote}
    onChange={(e) => setAlertNote(e.target.value)}
    rows={2}
    className="resize-none text-sm"
  />
                      <div className="flex gap-2">
                        <Button
    size="sm"
    onClick={() => acknowledgeAlert(anomaly.id)}
    disabled={!alertNote.trim()}
  >
                          Submit
                        </Button>
                        <Button
    size="sm"
    variant="outline"
    onClick={() => {
      setShowAlertAck(null);
      setAlertNote("");
    }}
  >
                          Cancel
                        </Button>
                      </div>
                    </div>}

                  {
    /* PROMPT 4.2: Investigation pane */
  }
                  {investigationPane === anomaly.id && <div className="mt-3 p-4 bg-gray-50 border rounded-lg space-y-3">
                      <h5 className="font-semibold">Investigation Panel</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline">
                          <Send className="w-3 h-3 mr-1" />
                          Contact Doctor
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Pause className="w-3 h-3 mr-1" />
                          Disable Model
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="w-3 h-3 mr-1" />
                          Notify Compliance
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          Export Logs
                        </Button>
                      </div>
                    </div>}
                </div>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Anomalies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemAnomalies.map((anomaly) => <div key={anomaly.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SeverityBadge severity={anomaly.severity} />
                        {anomaly.resolved && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Resolved
                          </Badge>}
                      </div>
                      <h4 className="font-semibold mb-1">{anomaly.message}</h4>
                      <p className="text-sm text-gray-600">{anomaly.details}</p>
                    </div>
                  </div>
                </div>)}
            </CardContent>
          </Card>
        </TabsContent>

        {
    /* PROMPT 4.3: AI Feature Controls */
  }
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Feature Toggles</CardTitle>
              <CardDescription>Control AI module availability with audit trail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature) => <div key={feature.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{feature.name}</h4>
                        <span className="text-xs text-gray-500" title="Last change information">
                          ℹ️
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                      <p className="text-xs text-gray-500">
                        Last changed: {feature.lastChanged} by {feature.changedBy}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
    checked={featureToggles[feature.id]}
    onCheckedChange={() => handleToggleFeature(feature.id)}
  />
                      {featureToggles[feature.id] ? <Badge className="bg-green-100 text-green-700 border-green-200">ON</Badge> : <Badge variant="outline" className="bg-gray-100">OFF</Badge>}
                    </div>
                  </div>

                  {
    /* PROMPT 4.3: Toggle confirmation dialog */
  }
                  {showToggleConfirm === feature.id && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                      <h5 className="font-semibold text-amber-900">
                        Confirm Toggle: {featureToggles[feature.id] ? "Disable" : "Enable"} {feature.name}
                      </h5>
                      <label className="block text-sm font-medium">Justification (Required)</label>
                      <Textarea
    placeholder="Why are you toggling this feature? (e.g., performance issues, user feedback, maintenance)"
    value={toggleJustification}
    onChange={(e) => setToggleJustification(e.target.value)}
    rows={2}
    className="resize-none text-sm"
  />
                      <div className="flex gap-2">
                        <Button
    size="sm"
    onClick={() => confirmToggle(feature.id)}
    disabled={!toggleJustification.trim()}
    className="bg-amber-600 hover:bg-amber-700"
  >
                          Confirm
                        </Button>
                        <Button
    size="sm"
    variant="outline"
    onClick={() => {
      setShowToggleConfirm(null);
      setToggleJustification("");
    }}
  >
                          Cancel
                        </Button>
                      </div>
                    </div>}
                </div>)}
            </CardContent>
          </Card>

          {
    /* PROMPT 4.3: Safety Parameters */
  }
          <Card>
            <CardHeader>
              <CardTitle>AI Safety Parameters</CardTitle>
              <CardDescription>Configure model behavior and thresholds (Version 1.2.3)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Confidence Threshold</h4>
                  <p className="text-sm text-gray-600 mb-3">Minimum confidence for AI suggestions</p>
                  <div className="flex items-center gap-3">
                    <Input type="number" defaultValue="70" className="w-20" />
                    <span className="text-sm">%</span>
                    <Button size="sm">Update</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Override Alert Threshold</h4>
                  <p className="text-sm text-gray-600 mb-3">Alert when overrides exceed</p>
                  <div className="flex items-center gap-3">
                    <Input type="number" defaultValue="15" className="w-20" />
                    <span className="text-sm">%</span>
                    <Button size="sm">Update</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Question Range</h4>
                  <p className="text-sm text-gray-600 mb-3">Symptom checker questions</p>
                  <div className="flex items-center gap-3">
                    <Input type="number" defaultValue="3" className="w-16" placeholder="Min" />
                    <span>-</span>
                    <Input type="number" defaultValue="7" className="w-16" placeholder="Max" />
                    <Button size="sm">Update</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Emergency Threshold</h4>
                  <p className="text-sm text-gray-600 mb-3">Severity escalation point</p>
                  <div className="flex items-center gap-3">
                    <Input type="number" defaultValue="85" className="w-20" />
                    <span className="text-sm">%</span>
                    <Button size="sm">Update</Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">Version 1.2.3 active</span>
                <Button size="sm" variant="outline" className="ml-auto">
                  Rollback to v1.2.2
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {
    /* PROMPT 4.4: Doctor Approvals */
  }
        <TabsContent value="doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Doctor Approvals</CardTitle>
              <CardDescription>Review and approve new doctor registrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingDoctors.map((doctor) => <div key={doctor.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.email}</p>
                      <p className="text-sm text-gray-600">Specialization: {doctor.specialization}</p>
                      <p className="text-xs text-gray-500 mt-1">Submitted: {doctor.submittedDate}</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Pending Review
                    </Badge>
                  </div>

                  {
    /* Verification Status */
  }
                  <div className="mb-3">
                    <p className="text-sm font-semibold mb-2">Verification Status:</p>
                    <div className="flex gap-2">
                      <Badge className={doctor.verificationStatus.medicalLicense ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                        {doctor.verificationStatus.medicalLicense ? "\u2713" : "\u25CB"} Medical License
                      </Badge>
                      <Badge className={doctor.verificationStatus.backgroundCheck ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                        {doctor.verificationStatus.backgroundCheck ? "\u2713" : "\u25CB"} Background Check
                      </Badge>
                      <Badge className={doctor.verificationStatus.references ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                        {doctor.verificationStatus.references ? "\u2713" : "\u25CB"} References
                      </Badge>
                    </div>
                  </div>

                  {
    /* PROMPT 4.4: Approval actions */
  }
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowApprovalModal(doctor.id)}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => setShowApprovalModal(doctor.id)}>
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      Request More Info
                    </Button>
                  </div>

                  {
    /* PROMPT 4.4: Approval modal */
  }
                  {showApprovalModal === doctor.id && <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                      <label className="block text-sm font-medium">Approval Reason (Required)</label>
                      <Textarea
    placeholder="Document the reason for your decision..."
    value={approvalReason}
    onChange={(e) => setApprovalReason(e.target.value)}
    rows={2}
    className="resize-none text-sm"
  />
                      <div className="flex gap-2">
                        <Button size="sm" disabled={!approvalReason.trim()}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
    setShowApprovalModal(null);
    setApprovalReason("");
  }}>
                          Cancel
                        </Button>
                      </div>
                    </div>}
                </div>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.filter((u) => u.role === "doctor").map((doctor) => <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell>General Medicine</TableCell>
                      <TableCell>
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          {doctor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {
    /* PROMPT 4.6: Audit Log */
  }
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log & Evidence Trail</CardTitle>
              <CardDescription>Searchable system activity log</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {
    /* Search filters */
  }
              <div className="grid md:grid-cols-4 gap-3">
                <Input placeholder="User ID" />
                <Input placeholder="Session ID" />
                <Input placeholder="Action Type" />
                <Input type="date" placeholder="Date" />
              </div>

              {
    /* Sample log entries */
  }
              <div className="space-y-2">
                {[
    { id: "log-1", action: "AI Override", user: "Dr. Sarah Johnson", time: "2024-01-15 14:32", containsPHI: true },
    { id: "log-2", action: "Feature Toggle", user: "Admin John", time: "2024-01-15 14:30", containsPHI: false },
    { id: "log-3", action: "Symptom Check", user: "Patient John Smith", time: "2024-01-15 14:25", containsPHI: true }
  ].map((log) => <div key={log.id} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{log.action}</span>
                          {log.containsPHI && <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              PHI
                            </Badge>}
                        </div>
                        <p className="text-xs text-gray-600">User: {log.user} • Time: {log.time}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>)}
              </div>

              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Audit Log
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {
    /* PROMPT 4.9: Analytics Drilldown */
  }
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointments by Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metrics.appointmentsByStatus).map(([status, count]) => <div key={status} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status === "pending" ? "bg-orange-500" : status === "in-progress" ? "bg-blue-500" : status === "completed" ? "bg-green-500" : "bg-gray-500"}`} />
                      <span className="capitalize">{status.replace("-", " ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{count}</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        →
                      </Button>
                    </div>
                  </div>)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cases by Severity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metrics.appointmentsBySeverity).map(([severity, count]) => <div key={severity} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <SeverityBadge severity={severity} />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{count}</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        →
                      </Button>
                    </div>
                  </div>)}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Average Wait Time</p>
                <p className="text-2xl font-bold">{metrics.averageWaitTime} min</p>
                <p className="text-sm text-green-600 mt-1">↓ 15% improvement</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Emergency Cases</p>
                <p className="text-2xl font-bold">{metrics.emergencyCases}</p>
                <p className="text-sm text-gray-600 mt-1">This week</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Total Appointments</p>
                <p className="text-2xl font-bold">{metrics.totalAppointments}</p>
                <p className="text-sm text-green-600 mt-1">↑ 8% vs last month</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}
export {
  AdminPanel
};
