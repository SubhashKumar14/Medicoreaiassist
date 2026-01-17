import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Bell,
  Lock,
  Heart,
  FileText,
  AlertCircle
} from "lucide-react";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
function PatientProfile() {
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    address: "123 Main St, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543",
    bloodType: "O+",
    allergies: "Penicillin, Shellfish",
    chronicConditions: "None",
    currentMedications: "None"
  });
  const [notifications, setNotifications] = useState({
    appointmentReminders: true,
    reportReady: true,
    aiInsights: false,
    healthTips: true,
    marketingEmails: false
  });
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated successfully");
    }, 1e3);
  };
  return <div className="max-w-5xl mx-auto p-6 space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileData.firstName[0]}{profileData.lastName[0]}
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {
    /* Personal Information */
  }
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
    id="firstName"
    value={profileData.firstName}
    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
    id="lastName"
    value={profileData.lastName}
    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
    id="email"
    type="email"
    className="pl-10"
    value={profileData.email}
    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
  />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
    id="phone"
    type="tel"
    className="pl-10"
    value={profileData.phone}
    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
  />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
    id="dob"
    type="date"
    className="pl-10"
    value={profileData.dateOfBirth}
    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
  />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
    id="gender"
    value={profileData.gender}
    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
    id="address"
    className="pl-10"
    value={profileData.address}
    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
    id="city"
    value={profileData.city}
    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
    id="state"
    value={profileData.state}
    onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
    id="zip"
    value={profileData.zipCode}
    onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Person to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Contact Name</Label>
                  <Input
    id="emergencyContact"
    value={profileData.emergencyContact}
    onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
    id="emergencyPhone"
    type="tel"
    value={profileData.emergencyPhone}
    onChange={(e) => setProfileData({ ...profileData, emergencyPhone: e.target.value })}
  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {
    /* Medical History */
  }
        <TabsContent value="medical" className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Keep your medical information up to date to help doctors provide better care and AI provide more accurate insights.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Medical Information
              </CardTitle>
              <CardDescription>Your health history helps us serve you better</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Input
    id="bloodType"
    value={profileData.bloodType}
    onChange={(e) => setProfileData({ ...profileData, bloodType: e.target.value })}
  />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea
    id="allergies"
    placeholder="List any known allergies to medications, foods, or other substances"
    value={profileData.allergies}
    onChange={(e) => setProfileData({ ...profileData, allergies: e.target.value })}
    rows={3}
  />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                <Textarea
    id="chronicConditions"
    placeholder="List any ongoing health conditions (e.g., diabetes, hypertension)"
    value={profileData.chronicConditions}
    onChange={(e) => setProfileData({ ...profileData, chronicConditions: e.target.value })}
    rows={3}
  />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
    id="currentMedications"
    placeholder="List all medications you're currently taking"
    value={profileData.currentMedications}
    onChange={(e) => setProfileData({ ...profileData, currentMedications: e.target.value })}
    rows={3}
  />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {
    /* Notifications */
  }
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-gray-500">Get notified about upcoming appointments</p>
                </div>
                <Switch
    checked={notifications.appointmentReminders}
    onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminders: checked })}
  />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <p className="font-medium">Report Ready Notifications</p>
                  <p className="text-sm text-gray-500">When your medical reports are analyzed</p>
                </div>
                <Switch
    checked={notifications.reportReady}
    onCheckedChange={(checked) => setNotifications({ ...notifications, reportReady: checked })}
  />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <p className="font-medium">AI Health Insights</p>
                  <p className="text-sm text-gray-500">Educational health tips based on your data</p>
                </div>
                <Switch
    checked={notifications.aiInsights}
    onCheckedChange={(checked) => setNotifications({ ...notifications, aiInsights: checked })}
  />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <p className="font-medium">General Health Tips</p>
                  <p className="text-sm text-gray-500">Weekly wellness and prevention tips</p>
                </div>
                <Switch
    checked={notifications.healthTips}
    onCheckedChange={(checked) => setNotifications({ ...notifications, healthTips: checked })}
  />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Updates about new features and services</p>
                </div>
                <Switch
    checked={notifications.marketingEmails}
    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
  />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {
    /* Security */
  }
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Password & Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data & Privacy
              </CardTitle>
              <CardDescription>Control your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Delete My Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {
    /* Save Button */
  }
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>;
}
export {
  PatientProfile
};
