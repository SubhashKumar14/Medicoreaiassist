import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar, User, Award, Clock, CheckCircle } from "lucide-react";
import { SeverityBadge } from "../shared/SeverityBadge";
import { WaitTimeProgress } from "../shared/WaitTimeProgress";
function BookingPage() {
  const [step, setStep] = useState("booking");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState("low");
  const doctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialization: "General Physician",
      experience: "12 years",
      rating: 4.8,
      availability: "Available now",
      avatar: "SJ"
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialization: "Internal Medicine",
      experience: "15 years",
      rating: 4.9,
      availability: "Available in 30 min",
      avatar: "MC"
    },
    {
      id: "3",
      name: "Dr. Emily Davis",
      specialization: "Family Medicine",
      experience: "10 years",
      rating: 4.7,
      availability: "Available now",
      avatar: "ED"
    }
  ];
  const mockAppointment = {
    tokenNumber: 45,
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialization: "General Physician",
    severity: "moderate",
    estimatedWaitTime: 25,
    scheduledTime: new Date(Date.now() + 25 * 6e4)
  };
  const handleBooking = () => {
    setStep("confirmation");
  };
  return <div className="max-w-5xl mx-auto p-6 space-y-6">
      {step === "booking" ? <>
          {
    /* Header */
  }
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Book Consultation</h1>
            </div>
            <p className="text-gray-600">Connect with a doctor for your health concerns</p>
          </div>

          {
    /* Booking Form */
  }
          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
              <CardDescription>Provide information about your symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {
    /* Symptoms */
  }
              <div>
                <label className="block text-sm font-medium mb-2">Describe Your Symptoms</label>
                <Textarea
    placeholder="Please describe what you're experiencing..."
    rows={4}
    value={symptoms}
    onChange={(e) => setSymptoms(e.target.value)}
    className="resize-none"
  />
              </div>

              {
    /* Severity */
  }
              <div>
                <label className="block text-sm font-medium mb-2">How severe are your symptoms?</label>
                <Select value={severity} onValueChange={(value) => setSeverity(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor discomfort</SelectItem>
                    <SelectItem value="moderate">Moderate - Affecting daily activities</SelectItem>
                    <SelectItem value="high">High - Severe symptoms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {
    /* Doctor Selection */
  }
          <Card>
            <CardHeader>
              <CardTitle>Select a Doctor</CardTitle>
              <CardDescription>Choose from available physicians</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctors.map((doctor) => <div
    key={doctor.id}
    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedDoctor === doctor.id ? "border-cyan-600 bg-cyan-50" : "border-gray-200 hover:border-cyan-300"}`}
    onClick={() => setSelectedDoctor(doctor.id)}
  >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {doctor.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Award className="w-4 h-4 fill-current" />
                          <span className="font-semibold">{doctor.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {doctor.experience} experience
                        </span>
                        <span className="text-green-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {doctor.availability}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>)}
            </CardContent>
          </Card>

          {
    /* Book Button */
  }
          <Button
    onClick={handleBooking}
    disabled={!selectedDoctor || !symptoms}
    className="w-full bg-cyan-600 hover:bg-cyan-700"
    size="lg"
  >
            Confirm Booking
          </Button>
        </> : <>
          {
    /* Confirmation Screen */
  }
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Booking Confirmed!</h2>
              <p className="text-green-700">Your consultation has been scheduled successfully</p>
            </CardContent>
          </Card>

          {
    /* Appointment Details */
  }
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {
    /* Token Number */
  }
              <div className="bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl p-6 text-white text-center">
                <p className="text-sm text-cyan-100 mb-2">Your Token Number</p>
                <div className="text-6xl font-bold mb-2">#{mockAppointment.tokenNumber}</div>
                <p className="text-sm text-cyan-100">Please wait for your turn</p>
              </div>

              {
    /* Severity Badge */
  }
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Severity Assessment</span>
                <SeverityBadge severity={mockAppointment.severity} />
              </div>

              {
    /* Doctor Info */
  }
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    SJ
                  </div>
                  <div>
                    <h3 className="font-semibold">{mockAppointment.doctorName}</h3>
                    <p className="text-sm text-gray-600">{mockAppointment.doctorSpecialization}</p>
                  </div>
                </div>
              </div>

              {
    /* Wait Time */
  }
              <WaitTimeProgress estimatedMinutes={mockAppointment.estimatedWaitTime} />

              {
    /* Scheduled Time */
  }
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-900">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Scheduled Time</span>
                </div>
                <span className="font-semibold text-blue-700">
                  {mockAppointment.scheduledTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {
    /* Instructions */
  }
          <Card>
            <CardHeader>
              <CardTitle>What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan-700 text-xs font-semibold">1</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    The doctor will review your symptoms and AI analysis
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan-700 text-xs font-semibold">2</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    You'll receive a notification when it's your turn
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan-700 text-xs font-semibold">3</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Prepare any questions or additional information you'd like to share
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {
    /* Action Buttons */
  }
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => setStep("booking")}>
              Back to Dashboard
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700">Join Video Consultation</Button>
          </div>
        </>}
    </div>;
}
export {
  BookingPage
};
