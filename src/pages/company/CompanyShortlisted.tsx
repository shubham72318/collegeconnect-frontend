import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import CompanySidebar from "@/components/CompanySidebar";
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
  id: string;
  drive_id: string;
  student_name: string;
  student_college_name: string;
  status: "applied" | "selected" | "rejected";
  created_at?: string;
};

const CompanyShortlisted = () => {
  const { user, loading } = useAuth();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);

    const { data: myDrives, error: drivesError } = await supabase
      .from("drives")
      .select("id, company_name, package, vacancies, visit_date")
      .eq("company_user_id", user.id);

    if (drivesError) {
      toast.error(drivesError.message);
      setLoadingData(false);
      return;
    }

    const driveRows = (myDrives as Drive[]) ?? [];
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
      .eq("status", "selected")
      .order("created_at", { ascending: false });

    if (appsError) toast.error(appsError.message);
    setApplications((apps as Application[]) ?? []);
    setLoadingData(false);
  };

  useEffect(() => {
    if (!loading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading]);

  const setApplicationStatus = async (applicationId: string, status: Application["status"]) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", applicationId);
    if (error) toast.error(error.message);
    else {
      toast.success(status === "selected" ? "Selected." : "Removed from shortlist.");
      fetchData();
    }
  };

  if (loadingData) {
    return (
      <DashboardLayout title="Shortlisted" theme="company" sidebar={<CompanySidebar />}>
        <div className="text-muted-foreground">Loading...</div>
      </DashboardLayout>
    );
  }

  if (drives.length === 0) {
    return (
      <DashboardLayout title="Shortlisted" theme="company" sidebar={<CompanySidebar />}>
        <Card>
          <CardHeader>
            <CardTitle>No drives yet</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">Post a drive first.</CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Shortlisted" theme="company" sidebar={<CompanySidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Selected Candidates</h2>
          <p className="text-muted-foreground">These students are accepted for your drives.</p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground">No shortlisted students yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {drives.map((d) => {
              const appsForDrive = applications.filter((a) => a.drive_id === d.id);
              if (appsForDrive.length === 0) return null;
              return (
                <Card key={d.id}>
                  <CardHeader>
                    <CardTitle>
                      {d.company_name} • {d.package}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {appsForDrive.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="min-w-0">
                            <p className="font-medium truncate">{a.student_name}</p>
                            <p className="text-sm text-muted-foreground truncate">{a.student_college_name}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">Selected</Badge>
                            <Button type="button" size="sm" variant="outline" onClick={() => setApplicationStatus(a.id, "rejected")}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
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

export default CompanyShortlisted;

