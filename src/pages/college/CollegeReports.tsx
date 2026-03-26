import DashboardLayout from "@/components/DashboardLayout";
import CollegeSidebar from "@/components/CollegeSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CollegeReports = () => {
  return (
    <DashboardLayout title="Reports" theme="college" sidebar={<CollegeSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Reports</h2>
          <p className="text-muted-foreground">Add analytics and exports later if needed.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            This MVP focuses on approvals and student/company dashboards.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CollegeReports;

