import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import {
  Shield,
  Activity,
  Brain,
  AlertTriangle,
  Check,
  X,
  Lock,
  Unlock,
  RefreshCw,
  Save,
  RotateCcw,
  Pill,
  FileText,
  MessageSquare,
  Stethoscope
} from "lucide-react";
import { toast } from "sonner";
function AdminSettings() {
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(null);
  const [justification, setJustification] = useState("");
  const [featureToggles, setFeatureToggles] = useState({
    symptomChecker: {
      enabled: true,
      lastChanged: "2024-01-10 14:30",
      changedBy: "Admin User",
      reason: "Initial activation"
    },
    aiHealthChat: {
      enabled: true,
      lastChanged: "2024-01-10 14:30",
      changedBy: "Admin User",
      reason: "Initial activation"
    },
    reportAnalyzer: {
      enabled: true,
      lastChanged: "2024-01-10 14:30",
      changedBy: "Admin User",
      reason: "Initial activation"
    },
    pillIdentifier: {
      enabled: true,
      lastChanged: "2024-01-10 14:30",
      changedBy: "Admin User",
      reason: "Initial activation"
    },
    appointmentBooking: {
      enabled: true,
      lastChanged: "2024-01-10 14:30",
      changedBy: "Admin User",
      reason: "Initial activation"
    }
  });
  const [aiParameters, setAiParameters] = useState({
    confidenceThreshold: 65,
    uncertaintyThreshold: 40,
    minQuestions: 3,
    maxQuestions: 7,
    emergencyThreshold: 85,
    highSeverityThreshold: 70,
    mediumSeverityThreshold: 50
  });
  const [configVersions] = useState([
    { version: "v1.3", date: "2024-01-10 14:30", note: "Current active configuration", active: true },
    { version: "v1.2", date: "2024-01-08 10:15", note: "Adjusted confidence thresholds", active: false },
    { version: "v1.1", date: "2024-01-05 16:45", note: "Increased max questions to 7", active: false }
  ]);
  const [doctorControls, setDoctorControls] = useState({
    requireOverrideReason: true,
    showAIConfidence: true,
    allowManualPriority: true,
    enableReportUpload: true
  });
  const handleFeatureToggle = (feature, newState) => {
    setPendingToggle({ feature, newState });
    setJustification("");
    setShowJustificationModal(true);
  };
  const confirmFeatureToggle = () => {
    if (!justification.trim()) {
      toast.error("Please provide a justification");
      return;
    }
    if (pendingToggle) {
      setFeatureToggles({
        ...featureToggles,
        [pendingToggle.feature]: {
          enabled: pendingToggle.newState,
          lastChanged: (/* @__PURE__ */ new Date()).toLocaleString(),
          changedBy: "Admin User",
          reason: justification
        }
      });
      toast.success(
        `${pendingToggle.feature} ${pendingToggle.newState ? "enabled" : "disabled"} successfully`
      );
    }
    setShowJustificationModal(false);
    setPendingToggle(null);
    setJustification("");
  };
  const handleSaveAIParameters = () => {
    toast.success("AI parameters updated successfully");
  };
  const featureConfig = {
    symptomChecker: {
      icon: Activity,
      label: "Symptom Checker",
      description: "AI-powered symptom analysis and triage",
      color: "cyan"
    },
    aiHealthChat: {
      icon: MessageSquare,
      label: "AI Health Chat",
      description: "Context-aware health education chatbot",
      color: "blue"
    },
    reportAnalyzer: {
      icon: FileText,
      label: "Medical Report Analyzer",
      description: "AI analysis of uploaded medical reports",
      color: "purple"
    },
    pillIdentifier: {
      icon: Pill,
      label: "Pill Identifier",
      description: "Image-based medication identification",
      color: "green"
    },
    appointmentBooking: {
      icon: Stethoscope,
      label: "Appointment Booking",
      description: "Patient appointment scheduling system",
      color: "orange"
    }
  };
  return <div className="max-w-7xl mx-auto p-6 space-y-6">
      {
    /* Justification Modal */
  }
      {showJustificationModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Confirm Feature Change</CardTitle>
              <CardDescription>
                {pendingToggle && `You are about to ${pendingToggle.newState ? "enable" : "disable"} ${featureConfig[pendingToggle.feature]?.label}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="justification">Justification (Required)</Label>
                <Textarea
    id="justification"
    placeholder="Explain why this change is necessary..."
    value={justification}
    onChange={(e) => setJustification(e.target.value)}
    rows={4}
  />
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  This change will be logged in the audit trail and is permanent until changed again.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowJustificationModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={confirmFeatureToggle}>
                  Confirm Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>}

      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings & Controls</h1>
          <p className="text-gray-600">Manage system-wide features and AI parameters</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Admin Access
        </Badge>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Patient Features</TabsTrigger>
          <TabsTrigger value="ai-accuracy">AI Accuracy</TabsTrigger>
          <TabsTrigger value="doctor-controls">Doctor Controls</TabsTrigger>
          <TabsTrigger value="versions">Config Versions</TabsTrigger>
        </TabsList>

        {
    /* Patient Features Control */
  }
        <TabsContent value="features" className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="w-5 h-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Admin Control:</strong> Enable or disable patient portal features. All changes require
              justification and are audited.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {Object.entries(featureConfig).map(([key, config]) => {
    const feature = featureToggles[key];
    const Icon = config.icon;
    return <Card
      key={key}
      className={`${feature.enabled ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50"}`}
    >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.enabled ? `bg-${config.color}-100` : "bg-gray-200"}`}
    >
                          <Icon
      className={`w-6 h-6 ${feature.enabled ? `text-${config.color}-600` : "text-gray-500"}`}
    />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{config.label}</h3>
                            <Badge
      variant={feature.enabled ? "default" : "secondary"}
      className={feature.enabled ? "bg-green-600" : ""}
    >
                              {feature.enabled ? <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Active
                                </> : <>
                                  <X className="w-3 h-3 mr-1" />
                                  Disabled
                                </>}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{config.description}</p>

                          <div className="space-y-1 text-xs text-gray-500">
                            <p>
                              <strong>Last Changed:</strong> {feature.lastChanged}
                            </p>
                            <p>
                              <strong>By:</strong> {feature.changedBy}
                            </p>
                            <p>
                              <strong>Reason:</strong> {feature.reason}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
      checked={feature.enabled}
      onCheckedChange={(checked) => handleFeatureToggle(key, checked)}
    />
                        {feature.enabled ? <Unlock className="w-5 h-5 text-green-600" /> : <Lock className="w-5 h-5 text-gray-400" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>;
  })}
          </div>
        </TabsContent>

        {
    /* AI Accuracy & Safety Parameters */
  }
        <TabsContent value="ai-accuracy" className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical Settings:</strong> Changes to AI parameters affect all active sessions. Adjust
              carefully and test before applying to production.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Confidence & Accuracy
              </CardTitle>
              <CardDescription>Control AI prediction thresholds and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confidenceThreshold">Minimum Confidence Threshold</Label>
                    <Badge variant="outline">{aiParameters.confidenceThreshold}%</Badge>
                  </div>
                  <Input
    id="confidenceThreshold"
    type="range"
    min="50"
    max="95"
    value={aiParameters.confidenceThreshold}
    onChange={(e) => setAiParameters({ ...aiParameters, confidenceThreshold: parseInt(e.target.value) })}
  />
                  <p className="text-xs text-gray-500">
                    AI suggestions below this confidence level will be flagged as uncertain
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="uncertaintyThreshold">Uncertainty Alert Threshold</Label>
                    <Badge variant="outline">{aiParameters.uncertaintyThreshold}%</Badge>
                  </div>
                  <Input
    id="uncertaintyThreshold"
    type="range"
    min="20"
    max="60"
    value={aiParameters.uncertaintyThreshold}
    onChange={(e) => setAiParameters({ ...aiParameters, uncertaintyThreshold: parseInt(e.target.value) })}
  />
                  <p className="text-xs text-gray-500">
                    Confidence below this level triggers additional questions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Symptom Checker Parameters</CardTitle>
              <CardDescription>Control question flow and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minQuestions">Minimum Questions</Label>
                  <Input
    id="minQuestions"
    type="number"
    min="2"
    max="5"
    value={aiParameters.minQuestions}
    onChange={(e) => setAiParameters({ ...aiParameters, minQuestions: parseInt(e.target.value) })}
  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxQuestions">Maximum Questions</Label>
                  <Input
    id="maxQuestions"
    type="number"
    min="5"
    max="10"
    value={aiParameters.maxQuestions}
    onChange={(e) => setAiParameters({ ...aiParameters, maxQuestions: parseInt(e.target.value) })}
  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyThreshold">Emergency Threshold</Label>
                  <Input
    id="emergencyThreshold"
    type="number"
    min="70"
    max="95"
    value={aiParameters.emergencyThreshold}
    onChange={(e) => setAiParameters({ ...aiParameters, emergencyThreshold: parseInt(e.target.value) })}
  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Severity Classification Thresholds</CardTitle>
              <CardDescription>Define when to escalate severity levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="highSeverity">High Severity Threshold</Label>
                  <Input
    id="highSeverity"
    type="number"
    min="60"
    max="85"
    value={aiParameters.highSeverityThreshold}
    onChange={(e) => setAiParameters({
      ...aiParameters,
      highSeverityThreshold: parseInt(e.target.value)
    })}
  />
                  <p className="text-xs text-gray-500">Above this score = High severity</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mediumSeverity">Medium Severity Threshold</Label>
                  <Input
    id="mediumSeverity"
    type="number"
    min="40"
    max="70"
    value={aiParameters.mediumSeverityThreshold}
    onChange={(e) => setAiParameters({
      ...aiParameters,
      mediumSeverityThreshold: parseInt(e.target.value)
    })}
  />
                  <p className="text-xs text-gray-500">Above this score = Medium severity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveAIParameters}>
              <Save className="w-4 h-4 mr-2" />
              Save AI Parameters
            </Button>
          </div>
        </TabsContent>

        {
    /* Doctor Controls */
  }
        <TabsContent value="doctor-controls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Doctor Portal Controls
              </CardTitle>
              <CardDescription>Manage what doctors can see and do</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <p className="font-medium">Require Override Reasoning</p>
                  <p className="text-sm text-gray-500">
                    Force doctors to explain when overriding AI suggestions
                  </p>
                </div>
                <Switch
    checked={doctorControls.requireOverrideReason}
    onCheckedChange={(checked) => setDoctorControls({ ...doctorControls, requireOverrideReason: checked })}
  />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <p className="font-medium">Show AI Confidence Scores</p>
                  <p className="text-sm text-gray-500">Display AI confidence percentages to doctors</p>
                </div>
                <Switch
    checked={doctorControls.showAIConfidence}
    onCheckedChange={(checked) => setDoctorControls({ ...doctorControls, showAIConfidence: checked })}
  />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <p className="font-medium">Allow Manual Priority Override</p>
                  <p className="text-sm text-gray-500">
                    Let doctors manually change patient queue priority
                  </p>
                </div>
                <Switch
    checked={doctorControls.allowManualPriority}
    onCheckedChange={(checked) => setDoctorControls({ ...doctorControls, allowManualPriority: checked })}
  />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <p className="font-medium">Enable Report Upload</p>
                  <p className="text-sm text-gray-500">Allow doctors to upload patient reports</p>
                </div>
                <Switch
    checked={doctorControls.enableReportUpload}
    onCheckedChange={(checked) => setDoctorControls({ ...doctorControls, enableReportUpload: checked })}
  />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Doctor Controls
            </Button>
          </div>
        </TabsContent>

        {
    /* Configuration Versions */
  }
        <TabsContent value="versions" className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Configuration versions allow you to rollback to previous settings if needed.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Configuration History</CardTitle>
              <CardDescription>Previous configuration versions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {configVersions.map((version, idx) => <div
    key={idx}
    className={`p-4 border rounded-lg ${version.active ? "border-green-200 bg-green-50" : "border-gray-200"}`}
  >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{version.version}</span>
                        {version.active && <Badge className="bg-green-600">
                            <Check className="w-3 h-3 mr-1" />
                            Active
                          </Badge>}
                      </div>
                      <p className="text-sm text-gray-600">{version.note}</p>
                      <p className="text-xs text-gray-500 mt-1">{version.date}</p>
                    </div>

                    {!version.active && <Button variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Rollback
                      </Button>}
                  </div>
                </div>)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}
export {
  AdminSettings
};
