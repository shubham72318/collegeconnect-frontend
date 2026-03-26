import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import CollegeSidebar from "@/components/CollegeSidebar";
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
  created_at?: string;
};

type ApprovalStatus = "accepted" | "rejected";

type Approval = {
  drive_id: string;
  status: ApprovalStatus;
};

const CollegeCompanies = () => {
  const { user, profile, loading } = useAuth();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const collegeName = profile?.college_name ?? "";

  const approvalByDriveId = useMemo(() => {
    const m = new Map<string, ApprovalStatus>();
    for (const a of approvals) m.set(a.drive_id, a.status);
    return m;
  }, [approvals]);

  const fetchData = async () => {
    if (!user) return;
    if (!collegeName.trim()) {
      setDrives([]);
      setApprovals([]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);

    const { data: driveRows, error: drivesError } = await supabase
      .from("drives")
      .select("id, company_name, package, vacancies, visit_date, created_at")
      .order("created_at", { ascending: false });

    if (drivesError) {
      toast.error(drivesError.message);
      setLoadingData(false);
      return;
    }

    const { data: approvalRows, error: approvalsError } = await supabase
      .from("drive_college_approvals")
      .select("drive_id, status")
      .eq("college_user_id", user.id);

    if (approvalsError) {
      toast.error(approvalsError.message);
      setLoadingData(false);
      return;
    }

    setDrives((driveRows as Drive[]) ?? []);
    setApprovals((approvalRows as Approval[]) ?? []);
    setLoadingData(false);
  };

  useEffect(() => {
    if (!loading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading, collegeName]);

  const decide = async (driveId: string, status: ApprovalStatus) => {
    if (!user) return;
    if (!collegeName.trim()) {
      toast.error("Set your college name first.");
      return;
    }

    const { error } = await supabase.from("drive_college_approvals").upsert({
      drive_id: driveId,
      college_user_id: user.id,
      college_name: collegeName.trim(),
      status,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(status === "accepted" ? "Drive accepted for your college." : "Drive rejected for your college.");
    fetchData();
  };

  if (loadingData) {
    return (
      <DashboardLayout title="College Approvals" theme="college" sidebar={<CollegeSidebar />}>
        <div className="text-muted-foreground">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="College Companies" theme="college" sidebar={<CollegeSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Review Company Drives</h2>
          <p className="text-muted-foreground">Accept or reject drives so students from your college can apply.</p>
        </div>

        {!collegeName.trim() ? (
          <Card>
            <CardHeader>
              <CardTitle>Set your college name</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              You must set <span className="font-medium">college name</span> in{" "}
              <Link className="text-primary underline" to="/college/profile">
                Profile
              </Link>{" "}
              so approvals work correctly.
            </CardContent>
          </Card>
        ) : drives.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground">No drives posted yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {drives.map((d) => {
              const status = approvalByDriveId.get(d.id) ?? null;
              return (
                <Card key={d.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-4">
                      <span className="truncate">{d.company_name}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{d.package}</span>
                        {status ? (
                          <Badge variant={status === "accepted" ? "secondary" : "destructive"}>
                            {status === "accepted" ? "Accepted" : "Rejected"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Date: {d.visit_date}</span>
                      <span>{d.vacancies} vacancies</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={status === "accepted"}
                        onClick={() => decide(d.id, "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={status === "rejected"}
                        onClick={() => decide(d.id, "rejected")}
                      >
                        Reject
                      </Button>
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

export default CollegeCompanies;

