import { Briefcase, Users, UserCheck, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompanySidebar from "@/components/CompanySidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CompanyDashboard = () => {
  const { user, loading } = useAuth();
  const [drives, setDrives] = useState<{ id: string; company_name: string; package: string; vacancies: number; visit_date: string }[]>([]);
  const [applications, setApplications] = useState<{ id: string; drive_id: string; student_name: string; student_college_name: string; status: "applied" | "selected" | "rejected" }[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const driveById = useMemo(() => new Map(drives.map((d) => [d.id, d] as const)), [drives]);

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);

    const { data: myDrives, error: drivesError } = await supabase
      .from("drives")
      .select("id, company_name, package, vacancies, visit_date")
      .eq("company_user_id", user.id)
      .order("created_at", { ascending: false });

    if (drivesError) {
      toast.error(drivesError.message);
      setLoadingData(false);
      return;
    }

    const driveRows =
      (myDrives as {
        id: string;
        company_name: string;
        package: string;
        vacancies: number;
        visit_date: string;
      }[]) ?? [];
    setDrives(driveRows);

    if (driveRows.length === 0) {
      setApplications([]);
      setLoadingData(false);
      return;
    }

    const driveIds = driveRows.map((d) => d.id);
    const { data: apps, error: appsError } = await supabase
      .from("applications")
      .select("id, drive_id, student_name, student_college_name, status, created_at")
      .in("drive_id", driveIds)
      .order("created_at", { ascending: false });

    if (appsError) {
      toast.error(appsError.message);
      setLoadingData(false);
      return;
    }

    setApplications(
      (apps as {
        id: string;
        drive_id: string;
        student_name: string;
        student_college_name: string;
        status: "applied" | "selected" | "rejected";
      }[]) ?? [],
    );
    setLoadingData(false);
  };

  useEffect(() => {
    if (!loading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading]);

  const stats = useMemo(() => {
    const activePostings = drives.length;
    const totalApps = applications.length;
    const shortlisted = applications.filter((a) => a.status === "selected").length;
    const hiredThisMonth = shortlisted; // MVP: same as shortlisted
    return [
      { title: "Active Postings", value: activePostings, icon: Briefcase },
      { title: "Total Applications", value: totalApps, icon: Users },
      { title: "Shortlisted", value: shortlisted, icon: UserCheck },
      { title: "Hired This Month", value: hiredThisMonth, icon: TrendingUp },
    ];
  }, [applications, drives.length]);

  const statusBadge = (status: "applied" | "selected" | "rejected") => {
    if (status === "selected") return <Badge variant="secondary">Selected</Badge>;
    if (status === "rejected") return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="outline">Applied</Badge>;
  };

  return (
    <DashboardLayout
      title="Company Dashboard"
      theme="company"
      sidebar={<CompanySidebar />}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Company Dashboard</h2>
          <p className="text-muted-foreground">Manage your job postings and review applications.</p>
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

        {/* Active Postings & Recent Applications */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : drives.length === 0 ? (
                <p className="text-muted-foreground">No drives posted yet.</p>
              ) : (
                <div className="space-y-4">
                  {drives.slice(0, 4).map((d) => {
                    const appsCount = applications.filter((a) => a.drive_id === d.id).length;
                    return (
                      <div key={d.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{d.company_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {appsCount} applications • Visit: {d.visit_date}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {d.vacancies} seats
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : applications.length === 0 ? (
                <p className="text-muted-foreground">No applications yet.</p>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 4).map((a) => {
                    const d = driveById.get(a.drive_id);
                    return (
                      <div key={a.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg gap-3">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{a.student_name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {d?.company_name ?? "Drive"} • {d?.package ?? ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {statusBadge(a.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
