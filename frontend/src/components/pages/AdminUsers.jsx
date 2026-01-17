import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Users,
  Stethoscope,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Award,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import mockAuth from "../../lib/mockAuth";

function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [actionReason, setActionReason] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch users from mockAuth
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = mockAuth.getUsers();
    setUsers(allUsers);
  };

  const pendingDoctors = users.filter(u => u.role === 'doctor' && u.status === 'pending');
  const activeDoctors = users.filter(u => u.role === 'doctor' && u.status === 'active');
  const allUsersCount = users.length;

  const handleApproveDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setActionReason("");
    setShowApprovalModal(true);
  };

  const confirmAction = (action) => {
    if (!actionReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      if (action === "approve") {
        mockAuth.updateUserStatus(selectedDoctor.id, 'active', actionReason);
        toast.success(`Doctor ${selectedDoctor.name} approved successfully`);
      } else if (action === "reject") {
        mockAuth.updateUserStatus(selectedDoctor.id, 'rejected', actionReason);
        toast.error(`Doctor ${selectedDoctor.name} rejected`);
      } else if (action === "suspend") { // Not in modal but good to have logic
        mockAuth.updateUserStatus(selectedDoctor.id, 'suspended', actionReason);
        toast.warning(`Doctor ${selectedDoctor.name} suspended`);
      }

      loadUsers(); // Refresh list
      setShowApprovalModal(false);
      setSelectedDoctor(null);
      setActionReason("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Approval Modal */}
      {showApprovalModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Doctor Verification & Approval</CardTitle>
              <CardDescription>{selectedDoctor.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Doctor Details */}
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Specialty</p>
                  <p className="font-semibold">{selectedDoctor.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{selectedDoctor.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-sm">{selectedDoctor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedDoctor.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Reason Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Decision (Required)</label>
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Provide reasoning for your decision..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  All approval decisions are logged in the audit trail.
                </AlertDescription>
              </Alert>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowApprovalModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600"
                  onClick={() => confirmAction("reject")}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => confirmAction("approve")}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User & Doctor Management</h1>
          <p className="text-gray-600">Approve, manage, and monitor all platform users</p>
        </div>
        <Button onClick={() => loadUsers()}> {/* Refresh button */}
          <Users className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or specialty..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending Approval ({pendingDoctors.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active Doctors ({activeDoctors.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Users ({allUsersCount})
          </TabsTrigger>
        </TabsList>

        {/* Pending Approvals */}
        <TabsContent value="pending" className="space-y-4">
          {pendingDoctors.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No pending doctor approvals</div>
          ) : (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>{pendingDoctors.length} doctors</strong> are waiting for verification and approval.
              </AlertDescription>
            </Alert>
          )}

          {pendingDoctors.map((doctor) => (
            <Card key={doctor.id} className="border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-amber-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <Badge variant="outline">{doctor.specialty}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {doctor.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {doctor.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Applied: {new Date(doctor.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mt-3">
                        <Badge className="bg-amber-100 text-amber-700">
                          Pending Review
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveDoctor(doctor)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Active Doctors */}
        <TabsContent value="active" className="space-y-4">
          {activeDoctors.map((doctor) => (
            <Card key={doctor.id} className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-green-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <Badge variant="outline">{doctor.specialty}</Badge>
                        <Badge className="bg-green-600">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {doctor.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {doctor.phone || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* All Users */}
        <TabsContent value="all" className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {user.role === 'doctor' ? <Stethoscope className="w-5 h-5 text-gray-600" /> : <Users className="w-5 h-5 text-gray-600" />}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={user.status === 'active' ? "default" : "secondary"}>
                    {user.status || 'active'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { AdminUsers };
