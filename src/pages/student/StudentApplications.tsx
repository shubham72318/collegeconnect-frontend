import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StudentSidebar from "@/components/StudentSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Drive = {
  id: string;
  company_name: string;
  package: string;
  vacancies: number;
  visit_date: string;
};

type Application = {
  id: string;
  drive_id: string;
  status: "applied" | "selected" | "rejected";
  created_at?: string;
};

const statusBadgeVariant = (status: Application["status"]) => {
  if (status === "selected") return { variant: "secondary" as const, label: "Selected" };
  if (status === "rejected") return { variant: "destructive" as const, label: "Rejected" };
  return { variant: "outline" as const, label: "Applied" };
};

const StudentApplications = () => {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [drivesById, setDrivesById] = useState<Record<string, Drive>>({});
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);

    const { data: appRows, error: appsError } = await supabase
      .from("applications")
      .select("id, drive_id, status, created_at")
      .eq("student_user_id", user.id)
      .order("created_at", { ascending: false });

    if (appsError) {
      toast.error(appsError.message);
      setLoadingData(false);
      return;
    }

    const apps = (appRows as Application[]) ?? [];
    setApplications(apps);

    const driveIds = Array.from(new Set(apps.map((a) => a.drive_id)));
    if (driveIds.length === 0) {
      setDrivesById({});
      setLoadingData(false);
      return;
    }

    const { data: driveRows, error: drivesError } = await supabase
      .from("drives")
      .select("id, company_name, package, vacancies, visit_date")
      .in("id", driveIds);

    if (drivesError) {
      toast.error(drivesError.message);
      setLoadingData(false);
      return;
    }

    const byId: Record<string, Drive> = {};
    for (const d of (driveRows as Drive[]) ?? []) byId[d.id] = d;
    setDrivesById(byId);
    setLoadingData(false);
  };

  useEffect(() => {
    if (!loading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading]);

  const stats = useMemo(() => {
    const total = applications.length;
    const selected = applications.filter((a) => a.status === "selected").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const applied = applications.filter((a) => a.status === "applied").length;
    return { total, selected, rejected, applied };
  }, [applications]);

  return (
    <DashboardLayout title="Applications" theme="student" sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Applications</h2>
          <p className="text-muted-foreground">Track the status of drives you applied to.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Applied", value: stats.applied, variant: "outline" as const },
            { title: "Selected", value: stats.selected, variant: "secondary" as const },
            { title: "Rejected", value: stats.rejected, variant: "destructive" as const },
            { title: "Total", value: stats.total, variant: "default" as const },
          ].map((s) => (
            <Card key={s.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.title}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                  <Badge variant={s.variant}>{s.title}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {loadingData ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground">No applications yet. Apply to an approved drive from Companies.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {applications.map((a) => {
              const d = drivesById[a.drive_id];
              const badge = statusBadgeVariant(a.status);
              return (
                <Card key={a.id}>
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{d?.company_name ?? "Company"}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {d?.package ?? ""} {d?.visit_date ? `• ${d.visit_date}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentApplications;

