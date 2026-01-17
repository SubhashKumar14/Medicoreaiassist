import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  Activity,
  Award
} from "lucide-react";
import { Progress } from "../ui/progress";
function DoctorAnalytics() {
  const stats = {
    totalPatients: 247,
    avgConsultationTime: 18,
    completionRate: 94,
    patientSatisfaction: 4.7
  };
  const weeklyData = [
    { day: "Mon", patients: 12, avgTime: 17 },
    { day: "Tue", patients: 15, avgTime: 19 },
    { day: "Wed", patients: 18, avgTime: 16 },
    { day: "Thu", patients: 14, avgTime: 20 },
    { day: "Fri", patients: 16, avgTime: 18 },
    { day: "Sat", patients: 8, avgTime: 15 },
    { day: "Sun", patients: 5, avgTime: 22 }
  ];
  const aiPerformance = {
    agreementRate: 87,
    overrideRate: 13,
    accuracyImprovement: "+5.2%"
  };
  const topConditions = [
    { condition: "Common Cold", count: 45, percentage: 18 },
    { condition: "Migraine", count: 32, percentage: 13 },
    { condition: "Allergic Rhinitis", count: 28, percentage: 11 },
    { condition: "Bronchitis", count: 24, percentage: 10 },
    { condition: "Hypertension", count: 22, percentage: 9 }
  ];
  return <div className="max-w-7xl mx-auto p-6 space-y-6">
      {
    /* Header */
  }
      <div>
        <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
        <p className="text-gray-600">Your clinical performance metrics and insights</p>
      </div>

      {
    /* Key Metrics */
  }
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Patients</p>
                <p className="text-3xl font-bold">{stats.totalPatients}</p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Consultation</p>
                <p className="text-3xl font-bold">{stats.avgConsultationTime}<span className="text-lg">m</span></p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  <span>-2min improvement</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
                <p className="text-3xl font-bold">{stats.completionRate}%</p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Excellent</span>
                </div>
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
                <p className="text-sm text-gray-500 mb-1">Satisfaction</p>
                <p className="text-3xl font-bold">{stats.patientSatisfaction}<span className="text-lg">/5.0</span></p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <Award className="w-3 h-3" />
                  <span>Top 10%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {
    /* Weekly Activity */
  }
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Weekly Activity
          </CardTitle>
          <CardDescription>Patients seen and average consultation time per day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((data) => <div key={data.day} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium w-12">{data.day}</span>
                  <div className="flex-1 mx-4">
                    <Progress value={data.patients / 20 * 100} className="h-2" />
                  </div>
                  <span className="text-gray-600 w-24">{data.patients} patients</span>
                  <span className="text-gray-500 w-20 text-right">{data.avgTime} min</span>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {
    /* AI Performance */
  }
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              AI Collaboration Performance
            </CardTitle>
            <CardDescription>How AI assistance aligns with your clinical decisions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">AI-Doctor Agreement Rate</span>
                <span className="text-2xl font-bold text-green-600">{aiPerformance.agreementRate}%</span>
              </div>
              <Progress value={aiPerformance.agreementRate} className="h-3 mb-1" />
              <p className="text-xs text-gray-500">AI suggestions aligned with your final diagnosis</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Override Rate</span>
                <span className="text-2xl font-bold text-amber-600">{aiPerformance.overrideRate}%</span>
              </div>
              <Progress value={aiPerformance.overrideRate} className="h-3 mb-1" />
              <p className="text-xs text-gray-500">Times you modified AI suggestions</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Accuracy Trend</span>
                <Badge className="bg-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {aiPerformance.accuracyImprovement}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                AI is learning from your feedback and improving over time
              </p>
            </div>
          </CardContent>
        </Card>

        {
    /* Top Conditions */
  }
        <Card>
          <CardHeader>
            <CardTitle>Top Conditions Treated</CardTitle>
            <CardDescription>Most frequently diagnosed conditions this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topConditions.map((item, idx) => <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.condition}</span>
                  <span className="text-gray-600">{item.count} cases</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={item.percentage * 5} className="h-2 flex-1" />
                  <span className="text-xs text-gray-500 w-12 text-right">{item.percentage}%</span>
                </div>
              </div>)}
          </CardContent>
        </Card>
      </div>

      {
    /* Performance Insights */
  }
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">📊 Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-blue-800">
          <div className="flex gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-blue-600" />
            <p className="text-sm">
              <strong>Excellent efficiency:</strong> Your average consultation time is 15% below the clinic average.
            </p>
          </div>
          <div className="flex gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-blue-600" />
            <p className="text-sm">
              <strong>High patient satisfaction:</strong> You're rated in the top 10% of doctors on the platform.
            </p>
          </div>
          <div className="flex gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-blue-600" />
            <p className="text-sm">
              <strong>Strong AI collaboration:</strong> Your feedback is helping improve AI accuracy for all users.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>;
}
export {
  DoctorAnalytics
};
