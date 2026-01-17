import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, Clock, User, Video, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
function DoctorSchedule() {
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [selectedDate, setSelectedDate] = useState(/* @__PURE__ */ new Date());
  const appointments = [
    {
      id: "1",
      time: "09:00 AM",
      duration: 30,
      patient: "John Smith",
      type: "Video Consultation",
      status: "confirmed",
      reason: "Follow-up checkup"
    },
    {
      id: "2",
      time: "10:00 AM",
      duration: 45,
      patient: "Maria Garcia",
      type: "In-Person",
      status: "confirmed",
      reason: "Initial consultation - Migraine"
    },
    {
      id: "3",
      time: "11:30 AM",
      duration: 30,
      patient: "David Lee",
      type: "Video Consultation",
      status: "pending",
      reason: "Allergy consultation"
    },
    {
      id: "4",
      time: "02:00 PM",
      duration: 60,
      patient: "Sarah Johnson",
      type: "In-Person",
      status: "confirmed",
      reason: "Annual physical examination"
    },
    {
      id: "5",
      time: "03:30 PM",
      duration: 30,
      patient: "Robert Chen",
      type: "Video Consultation",
      status: "completed",
      reason: "Prescription refill"
    }
  ];
  const stats = {
    totalToday: 8,
    completed: 2,
    upcoming: 4,
    cancelled: 1
  };
  const statusColors = {
    confirmed: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    completed: "bg-gray-100 text-gray-700 border-gray-200",
    cancelled: "bg-red-100 text-red-700 border-red-200"
  };
  return <div className="max-w-7xl mx-auto p-6 space-y-6">
      {
    /* Header */
  }
      <div>
        <h1 className="text-3xl font-bold mb-2">My Schedule</h1>
        <p className="text-gray-600">Manage your appointments and availability</p>
      </div>

      {
    /* Stats */
  }
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Today</p>
            <p className="text-3xl font-bold">{stats.totalToday}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-700">Completed</p>
            <p className="text-3xl font-bold text-green-700">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-700">Upcoming</p>
            <p className="text-3xl font-bold text-blue-700">{stats.upcoming}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-700">Cancelled</p>
            <p className="text-3xl font-bold text-red-700">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      {
    /* Date Navigator */
  }
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })}
            </CardTitle>
            <div className="flex gap-2">
              <Button
    variant="outline"
    size="sm"
    onClick={() => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    }}
  >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
    variant="outline"
    size="sm"
    onClick={() => setSelectedDate(/* @__PURE__ */ new Date())}
  >
                Today
              </Button>
              <Button
    variant="outline"
    size="sm"
    onClick={() => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    }}
  >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {
    /* Appointments List */
  }
      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
          <CardDescription>{appointments.length} scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {appointments.map((appointment) => <div
    key={appointment.id}
    className={`p-4 border-2 rounded-lg ${statusColors[appointment.status]}`}
  >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <Clock className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">{appointment.time}</p>
                      <p className="text-xs text-gray-600">{appointment.duration} min</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4" />
                      <p className="font-semibold">{appointment.patient}</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{appointment.reason}</p>
                    <div className="flex items-center gap-2">
                      {appointment.type === "Video Consultation" ? <Badge variant="outline" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Video
                        </Badge> : <Badge variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          In-Person
                        </Badge>}
                      <Badge variant="outline" className="text-xs capitalize">
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {appointment.status === "confirmed" && <>
                      {appointment.type === "Video Consultation" && <Button size="sm">
                          <Video className="w-4 h-4 mr-2" />
                          Join Call
                        </Button>}
                      {appointment.type === "In-Person" && <Button size="sm">Start Consultation</Button>}
                    </>}
                  {appointment.status === "pending" && <Button size="sm" variant="outline">
                      Confirm
                    </Button>}
                </div>
              </div>
            </div>)}

          {appointments.length === 0 && <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No appointments scheduled for this day</p>
            </div>}
        </CardContent>
      </Card>
    </div>;
}
export {
  DoctorSchedule
};
