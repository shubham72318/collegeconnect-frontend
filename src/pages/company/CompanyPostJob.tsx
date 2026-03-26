import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import CompanySidebar from "@/components/CompanySidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, Briefcase, Users } from "lucide-react";

type Drive = {
  id: string;
  company_name: string;
  package: string;
  vacancies: number;
  visit_date: string;
  created_at?: string;
};

const CompanyPostJob = () => {
  const { user, profile, loading } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [vacancies, setVacancies] = useState<number>(0);
  const [visitDate, setVisitDate] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [applicationsCountByDrive, setApplicationsCountByDrive] = useState<Record<string, number>>({});
  const [loadingDrives, setLoadingDrives] = useState(false);

  useEffect(() => {
    if (!loading && profile?.company_name) setCompanyName(profile.company_name);
  }, [loading, profile?.company_name]);

  const fetchMyDrives = async () => {
    if (!user) return;
    setLoadingDrives(true);
    const { data, error } = await supabase
      .from("drives")
      .select("id, company_name, package, vacancies, visit_date, created_at")
      .eq("company_user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      const driveRows = (data as Drive[]) ?? [];
      setDrives(driveRows);

      if (driveRows.length === 0) {
        setApplicationsCountByDrive({});
      } else {
        const driveIds = driveRows.map((d) => d.id);
        const { data: appRows, error: appsError } = await supabase
          .from("applications")
          .select("drive_id")
          .in("drive_id", driveIds);

        if (appsError) {
          toast.error(appsError.message);
          setApplicationsCountByDrive({});
        } else {
          const counts: Record<string, number> = {};
          for (const row of (appRows as { drive_id: string }[])) {
            counts[row.drive_id] = (counts[row.drive_id] ?? 0) + 1;
          }
          setApplicationsCountByDrive(counts);
        }
      }
    }
    setLoadingDrives(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchMyDrives();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const canSubmit = useMemo(() => {
    return (
      !!user &&
      companyName.trim().length > 0 &&
      packageName.trim().length > 0 &&
      vacancies >= 0 &&
      !!visitDate
    );
  }, [user, companyName, packageName, vacancies, visitDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!canSubmit) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("drives").insert({
      company_user_id: user.id,
      company_name: companyName.trim(),
      package: packageName.trim(),
      vacancies,
      visit_date: visitDate,
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    toast.success("Drive posted. Colleges can accept or reject it.");
    setPackageName("");
    setVacancies(0);
    setVisitDate("");
    setSubmitting(false);
    fetchMyDrives();
  };

  return (
    <DashboardLayout title="Post Job" theme="company" sidebar={<CompanySidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Create a Drive</h2>
          <p className="text-muted-foreground">Colleges will review and decide which students can apply.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Drive Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Tech Corp"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="packageName">Package</Label>
                <Input
                  id="packageName"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="e.g., ₹25 LPA"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vacancies">Vacancies</Label>
                  <Input
                    id="vacancies"
                    type="number"
                    min={0}
                    value={Number.isNaN(vacancies) ? 0 : vacancies}
                    onChange={(e) => setVacancies(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitDate">Date of Visit</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={!canSubmit || submitting}>
                {submitting ? "Posting..." : "Post Drive"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Posted Drives</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDrives ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : drives.length === 0 ? (
              <p className="text-muted-foreground">No drives posted yet.</p>
            ) : (
              <div className="space-y-3">
                {drives.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{d.company_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {d.package} • {d.vacancies} seats
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {d.visit_date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        Drive
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {applicationsCountByDrive[d.id] ?? 0} apps
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompanyPostJob;

