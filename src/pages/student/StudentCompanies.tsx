import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import StudentSidebar from "@/components/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Drive = {
  id: string;
  company_name: string;
  package: string;
  vacancies: number;
  visit_date: string;
};

type Application = {
  drive_id: string;
  status: "applied" | "selected" | "rejected";
};

const statusBadgeVariant = (status: Application["status"]) => {
  if (status === "selected") return { variant: "secondary" as const, label: "Selected" };
  if (status === "rejected") return { variant: "destructive" as const, label: "Rejected" };
  return { variant: "outline" as const, label: "Applied" };
};

const StudentCompanies = () => {
  const { user, profile, loading } = useAuth();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const collegeName = profile?.college_name ?? "";

  const appliedMap = useMemo(() => {
    const m = new Map<string, Application["status"]>();
    for (const a of applications) m.set(a.drive_id, a.status);
    return m;
  }, [applications]);

  const fetchData = async () => {
    if (!user) return;
    if (!collegeName.trim()) {
      setDrives([]);
      setApplications([]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);

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

    setDrives((driveRows as Drive[]) ?? []);

    const { data: appRows, error: appsError } = await supabase
      .from("applications")
      .select("drive_id, status")
      .eq("student_user_id", user.id);

    if (appsError) {
      toast.error(appsError.message);
    } else {
      setApplications((appRows as Application[]) ?? []);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (!loading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading, collegeName]);

  const applyToDrive = async (driveId: string) => {
    if (!user) return;
    if (!profile) return;
    const { error } = await supabase.from("applications").insert({
      drive_id: driveId,
      student_user_id: user.id,
      student_name: profile.full_name ?? "Student",
      student_college_name: profile.college_name,
      status: "applied",
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Application sent. Company will review your application.");
    fetchData();
  };

  return (
    <DashboardLayout title="Companies" theme="student" sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Available Drives</h2>
          <p className="text-muted-foreground">
            Only companies approved by your college are shown here.
          </p>
        </div>

        {!collegeName.trim() ? (
          <Card>
            <CardHeader>
              <CardTitle>Set your college</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Your profile does not have a <span className="font-medium">college name</span>. Add it in{" "}
              <Link className="text-primary underline" to="/student/profile">
                Profile
              </Link>{" "}
              to view available drives.
            </CardContent>
          </Card>
        ) : loadingData ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : drives.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground">No approved drives for your college yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {drives.map((d) => {
              const status = appliedMap.get(d.id);
              const badge = status ? statusBadgeVariant(status) : null;
              return (
                <Card key={d.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-4">
                      <span className="truncate">{d.company_name}</span>
                      {badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                      <span>{d.package}</span>
                      <span>
                        Date: {d.visit_date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-muted-foreground">{d.vacancies} vacancies</p>
                      {status ? (
                        <Button type="button" disabled>
                          {badge?.label}
                        </Button>
                      ) : (
                        <Button type="button" onClick={() => applyToDrive(d.id)}>
                          Apply
                        </Button>
                      )}
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

export default StudentCompanies;

