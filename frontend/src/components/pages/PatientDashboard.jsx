import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Activity, FileText, Pill, Calendar, MessageSquare, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SeverityBadge } from "../shared/SeverityBadge";
function PatientDashboard() {
  const navigate = useNavigate();
  const hasSymptomCheck = sessionStorage.getItem("symptomCheckComplete");
  const hasReportAnalysis = sessionStorage.getItem("reportAnalysisComplete");
  const aiChatContext = sessionStorage.getItem("aiChatContext");
  const pendingActions = sessionStorage.getItem("pendingActions");
  const recentActivity = [
    {
      id: "1",
      type: "symptom-check",
      title: "Symptom Check Completed",
      description: "Possible conditions identified",
      severity: "moderate",
      time: "2 hours ago"
    },
    {
      id: "2",
      type: "appointment",
      title: "Appointment Booked",
      description: "Dr. Sarah Johnson - Token #45",
      severity: "low",
      time: "1 day ago"
    },
    {
      id: "3",
      type: "report",
      title: "Report Analyzed",
      description: "Blood test results reviewed",
      severity: "low",
      time: "3 days ago"
    }
  ];
  const quickActions = [
    {
      icon: Activity,
      title: "Symptom Checker",
      description: "AI-powered symptom assessment",
      color: "cyan",
      route: "/symptom-checker"
    },
    {
      icon: FileText,
      title: "Report Analyzer",
      description: "Upload and analyze medical reports",
      color: "teal",
      route: "/report-analyzer"
    },
    {
      icon: Pill,
      title: "Pill Identifier",
      description: "Identify medications instantly",
      color: "emerald",
      route: "/pill-identifier"
    },
    {
      icon: Calendar,
      title: "Book Consultation",
      description: "Schedule appointment with doctor",
      color: "blue",
      route: "/booking"
    }
  ];
  return <div className="max-w-7xl mx-auto p-6 space-y-8">
      {
    /* PROMPT 2.1: Guided Entry Point */
  }
      <div className="bg-gradient-to-r from-cyan-600 to-teal-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-cyan-50 mb-4">Let's check your health today</p>
            {
    /* PROMPT 2.1: Primary CTA - Start Health Check */
  }
            <Button
    size="lg"
    className="bg-white text-cyan-700 hover:bg-cyan-50"
    onClick={() => navigate("/symptom-checker")}
  >
              <Activity className="w-5 h-5 mr-2" />
              Start Health Check
            </Button>
          </div>
          <div className="text-right">
            <div className="text-sm text-cyan-50 mb-1">Your Health Score</div>
            <div className="text-4xl font-bold">85/100</div>
          </div>
        </div>
      </div>

      {
    /* PROMPT 2.10: Journey Progress Indicator */
  }
      {(hasSymptomCheck || hasReportAnalysis) && <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Your Health Journey</h3>
                <div className="flex items-center gap-2 mt-1">
                  {hasSymptomCheck && <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                      ✓ Symptom Check Complete
                    </span>}
                  {hasReportAnalysis && <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                      ✓ Report Analyzed
                    </span>}
                  {aiChatContext && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                      AI Chat Available
                    </span>}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/chat")}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>}

      {
    /* PROMPT 2.1: Guided Flow Visualization */
  }
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 text-center">Your Health Check Process</h3>
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cyan-700 font-bold">1</span>
              </div>
              <p className="text-sm font-medium">Start</p>
              <p className="text-xs text-gray-500">Check Symptoms</p>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-[-30px]" />
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cyan-700 font-bold">2</span>
              </div>
              <p className="text-sm font-medium">Analyze</p>
              <p className="text-xs text-gray-500">AI Assessment</p>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-[-30px]" />
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cyan-700 font-bold">3</span>
              </div>
              <p className="text-sm font-medium">Decide</p>
              <p className="text-xs text-gray-500">Review Results</p>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-[-30px]" />
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cyan-700 font-bold">4</span>
              </div>
              <p className="text-sm font-medium">Consult</p>
              <p className="text-xs text-gray-500">Book Doctor</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {
    /* PROMPT 2.1: Secondary Features (context-aware) */
  }
      <div>
        <h2 className="text-2xl font-semibold mb-4">Additional Health Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => <Card
    key={action.title}
    className="medical-card cursor-pointer"
    onClick={() => navigate(action.route)}
  >
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>)}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {
    /* Recent Activity Timeline */
  }
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your health journey timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => <div key={activity.id} className="flex gap-4">
                  {
    /* Timeline Line */
  }
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                      {activity.type === "symptom-check" && <Activity className="w-5 h-5 text-cyan-600" />}
                      {activity.type === "appointment" && <Calendar className="w-5 h-5 text-cyan-600" />}
                      {activity.type === "report" && <FileText className="w-5 h-5 text-cyan-600" />}
                    </div>
                    {index < recentActivity.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
                  </div>

                  {
    /* Activity Content */
  }
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold">{activity.title}</h4>
                      <SeverityBadge severity={activity.severity} showIcon={false} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>)}
            </CardContent>
          </Card>
        </div>

        {
    /* Health Tips & AI Chat */
  }
        <div className="space-y-6">
          {
    /* Health Tips */
  }
          <Card>
            <CardHeader>
              <CardTitle>Health Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-cyan-50 rounded-lg">
                <p className="text-sm text-cyan-900">
                  💧 Stay hydrated - aim for 8 glasses of water daily
                </p>
              </div>
              <div className="p-3 bg-teal-50 rounded-lg">
                <p className="text-sm text-teal-900">
                  🏃 Get 30 minutes of exercise today
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-900">
                  🥗 Include more fruits and vegetables in your diet
                </p>
              </div>
            </CardContent>
          </Card>

          {
    /* PROMPT 8: Safety Disclaimer Card */
  }
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex gap-2 text-xs text-amber-800">
                <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">AI Assistance Notice</p>
                  <p>All AI features provide assistive information only. They are not medical diagnoses. Always consult a qualified healthcare professional.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {
    /* Upcoming Appointments */
  }
          <Card>
            <CardHeader>
              <CardTitle>Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No upcoming appointments</p>
                <Button
    variant="link"
    className="mt-2 text-cyan-600"
    onClick={() => navigate("/booking")}
  >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
export {
  PatientDashboard
};
