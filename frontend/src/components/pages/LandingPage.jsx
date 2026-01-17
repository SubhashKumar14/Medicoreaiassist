import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ArrowRight, Activity, FileText, Pill, Calendar, Shield, Brain, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
function LandingPage() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {
    /* Navigation */
  }
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold">MedAI Care</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/register")} className="bg-cyan-600 hover:bg-cyan-700">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {
    /* Hero Section */
  }
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-6">
              AI-Powered Healthcare Platform
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              AI-Assisted Telemedicine Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get instant health insights with our Clinical Decision Support System. Check symptoms, analyze reports, and consult with doctors - all powered by advanced AI.
            </p>
            <div className="flex gap-4">
              <Button
    size="lg"
    className="bg-cyan-600 hover:bg-cyan-700"
    onClick={() => navigate("/symptom-checker")}
  >
                Start Health Check
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                Patient Login
              </Button>
            </div>

            {
    /* Disclaimer */
  }
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
              <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> This platform provides AI-assisted information and is not a substitute for professional medical diagnosis. Always consult with a qualified healthcare provider.
                </p>
              </div>
            </div>
          </div>

          {
    /* Hero Image/Illustration */
  }
          <div className="relative">
            <div className="glass-card p-8 rounded-3xl">
              <div className="grid grid-cols-2 gap-4">
                <Card className="medical-card">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                      <Brain className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="font-semibold mb-2">AI Analysis</h3>
                    <p className="text-sm text-gray-600">Smart symptom assessment</p>
                  </CardContent>
                </Card>
                <Card className="medical-card mt-8">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                      <Calendar className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Quick Booking</h3>
                    <p className="text-sm text-gray-600">Instant appointments</p>
                  </CardContent>
                </Card>
                <Card className="medical-card">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Report Analysis</h3>
                    <p className="text-sm text-gray-600">AI-powered insights</p>
                  </CardContent>
                </Card>
                <Card className="medical-card mt-8">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">24/7 Support</h3>
                    <p className="text-sm text-gray-600">Always available</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* Features Section */
  }
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Healthcare Features</h2>
          <p className="text-gray-600 text-lg">Everything you need for better health management</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
    {
      icon: Activity,
      title: "Symptom Checker",
      description: "AI-powered symptom analysis with explainable results",
      color: "cyan"
    },
    {
      icon: FileText,
      title: "Report Analyzer",
      description: "Upload and analyze medical reports instantly",
      color: "teal"
    },
    {
      icon: Pill,
      title: "Pill Identifier",
      description: "Identify medications and get usage information",
      color: "emerald"
    },
    {
      icon: Calendar,
      title: "Book Consultation",
      description: "Connect with doctors based on AI triage",
      color: "blue"
    }
  ].map((feature, index) => <Card key={index} className="medical-card">
              <CardContent className="p-6">
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>)}
        </div>
      </section>

      {
    /* How It Works */
  }
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">Simple steps to better healthcare</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
    {
      step: "1",
      title: "Describe Symptoms",
      description: "Share your symptoms and answer AI-guided questions for accurate assessment"
    },
    {
      step: "2",
      title: "Get AI Analysis",
      description: "Receive instant analysis with possible conditions and severity assessment"
    },
    {
      step: "3",
      title: "Consult Doctor",
      description: "Book an appointment with a doctor who can see your AI-assisted triage"
    }
  ].map((item) => <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>)}
        </div>
      </section>

      {
    /* CTA Section */
  }
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 text-lg mb-8">
          Join thousands of patients using AI-powered healthcare
        </p>
        <Button
    size="lg"
    className="bg-cyan-600 hover:bg-cyan-700"
    onClick={() => navigate("/register")}
  >
          Create Free Account
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </section>

      {
    /* Footer */
  }
      <footer className="border-t bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2024 MedAI Care. All rights reserved.</p>
          <p className="text-sm mt-2">Clinical Decision Support System - For informational purposes only</p>
        </div>
      </footer>
    </div>;
}
export {
  LandingPage
};
