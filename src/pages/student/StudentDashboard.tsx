import { Building2, FileText, CheckCircle, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentSidebar from "@/components/StudentSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [drives, setDrives] = useState<
    { id: string; company_name: string; package: string; vacancies: number; visit_date: string }[]
  >([]);
  const [applications, setApplications] = useState<{ drive_id: string; status: "applied" | "selected" | "rejected" }[]>(
    [],
  );
  const [loadingData, setLoadingData] = useState(true);

  const collegeName = profile?.college_name ?? "";

  const drivesById = useMemo(() => {
    return new Map(drives.map((d) => [d.id, d] as const));
  }, [drives]);

  const stats = useMemo(() => {
    const available = drives.length;
    const applied = applications.filter((a) => a.status === "applied").length;
    const selected = applications.filter((a) => a.status === "selected").length;
    // Rejected students are not pending review.
    return [
      { title: "Available Opportunities", value: available, icon: Building2 },
      { title: "Applications Sent", value: applications.length, icon: FileText },
      { title: "Shortlisted", value: selected, icon: CheckCircle },
      { title: "Pending Review", value: applied, icon: Clock },
    ];
  }, [applications, drives.length]);

  const badgeForStatus = (status: "applied" | "selected" | "rejected") => {
    if (status === "selected") return <Badge variant="secondary">Selected</Badge>;
    if (status === "rejected") return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="outline">Applied</Badge>;
  };

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);

    if (!collegeName.trim()) {
      setDrives([]);
      setApplications([]);
      setLoadingData(false);
      return;
    }

    const { data: approvals, error: approvalsError } = await supabase
      .from("drive_college_approvals")
      .select("drive_id")
      .eq("college_name", collegeName)
      .eq("status", "accepted");

    if (approvalsError) {
      toast.error(approvalsError.message);
      setLoadingData(false);
      return;
    }

    const driveIds = (approvals as { drive_id: string }[]).map((a) => a.drive_id);
    if (driveIds.length === 0) {
      setDrives([]);
      setApplications([]);
      setLoadingData(false);
      return;
    }

    const { data: driveRows, error: drivesError } = await supabase
      .from("drives")
      .select("id, company_name, package, vacancies, visit_date")
      .in("id", driveIds)
      .order("visit_date", { ascending: true });

    if (drivesError) {
      toast.error(drivesError.message);
      setLoadingData(false);
      return;
    }

    setDrives(
      (driveRows as { id: string; company_name: string; package: string; vacancies: number; visit_date: string }[]) ?? [],
    );

    const { data: appRows, error: appsError } = await supabase
      .from("applications")
      .select("drive_id, status")
      .eq("student_user_id", user.id);

    if (appsError) {
      toast.error(appsError.message);
      setLoadingData(false);
      return;
    }

    setApplications((appRows as { drive_id: string; status: "applied" | "selected" | "rejected" }[]) ?? []);
    setLoadingData(false);
  };

  useEffect(() => {
    if (!loading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading, collegeName]);

  return (
    <DashboardLayout
      title="Student Dashboard"
      theme="student"
      sidebar={<StudentSidebar />}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Student Dashboard</h2>
          <p className="text-muted-foreground">Track your applications and discover new opportunities.</p>
        </div>

        {/* Stats Grid */}
        {loadingData ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className="bg-gray-100 p-2 rounded-full">
                    <stat.icon className="h-4 w-4 text-gray-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recent Opportunities & My Applications */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : drives.length === 0 ? (
                <p className="text-muted-foreground">
                  No approved drives yet. {collegeName.trim() ? "Check again later." : "Set your college in Profile."}
                </p>
              ) : (
                <div className="space-y-4">
                  {drives.slice(0, 4).map((d) => (
                    <div
                      key={d.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{d.company_name}</p>
                        <p className="text-sm text-muted-foreground">Visit: {d.visit_date}</p>
                      </div>
                      <span className="font-semibold text-purple-600">{d.package}</span>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/student/companies">View all companies</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <p className="text-muted-foreground">You have not applied to any drive yet.</p>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 4).map((a, index) => {
                    const d = drivesById.get(a.drive_id);
                    return (
                      <div key={`${a.drive_id}-${index}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{d?.company_name ?? "Company"}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {d?.package ?? ""}
                          </p>
                        </div>
                        {badgeForStatus(a.status)}
                      </div>
                    );
                  })}
                  <div className="pt-2">
                    <Button asChild variant="secondary" className="w-full">
                      <Link to="/student/applications">View all applications</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
