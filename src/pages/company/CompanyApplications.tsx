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
  student_user_id: string;
  student_name: string;
  student_college_name: string;
  status: "applied" | "selected" | "rejected";
};

const statusBadge = (status: Application["status"]) => {
  if (status === "selected") return { variant: "secondary" as const, text: "Selected" };
  if (status === "rejected") return { variant: "destructive" as const, text: "Rejected" };
  return { variant: "outline" as const, text: "Applied" };
};

const CompanyApplications = () => {
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
      .eq("company_user_id", user.id)
      .order("visit_date", { ascending: false });

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
      .select("id, drive_id, student_user_id, student_name, student_college_name, status")
      .in("drive_id", driveIds)
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
    if (!user) return;
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(status === "selected" ? "Student selected." : "Student rejected.");
    fetchData();
  };

  if (loadingData) {
    return (
      <DashboardLayout title="Applications" theme="company" sidebar={<CompanySidebar />}>
        <div className="text-muted-foreground">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Applications" theme="company" sidebar={<CompanySidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Applicants</h2>
          <p className="text-muted-foreground">Select or reject candidates for your drives.</p>
        </div>

        {drives.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No drives yet</CardTitle>
            </CardHeader>
            <CardContent>
              Post a drive first in <span className="font-medium">Post Job</span>.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {drives.map((d) => {
              const appsForDrive = applications.filter((a) => a.drive_id === d.id);
              return (
                <Card key={d.id}>
                  <CardHeader>
                    <CardTitle>
                      {d.company_name} • {d.package} • {d.vacancies} seats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appsForDrive.length === 0 ? (
                      <p className="text-muted-foreground">No applications yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {appsForDrive.map((a) => {
                          const badge = statusBadge(a.status);
                          return (
                            <div
                              key={a.id}
                              className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="min-w-0">
                                <p className="font-medium truncate">{a.student_name}</p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {a.student_college_name}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant={badge.variant}>{badge.text}</Badge>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    disabled={a.status === "selected"}
                                    onClick={() => setApplicationStatus(a.id, "selected")}
                                  >
                                    Select
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={a.status === "rejected"}
                                    onClick={() => setApplicationStatus(a.id, "rejected")}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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

export default CompanyApplications;

