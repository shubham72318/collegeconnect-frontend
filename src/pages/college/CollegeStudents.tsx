import DashboardLayout from "@/components/DashboardLayout";
import CollegeSidebar from "@/components/CollegeSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const CollegeStudents = () => {
  const { profile } = useAuth();
  const collegeName = profile?.college_name ?? "";

  return (
    <DashboardLayout title="Students" theme="college" sidebar={<CollegeSidebar />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Students</h2>
          <p className="text-muted-foreground">Student application details appear once drives are accepted.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            This page is currently informational. Use <span className="font-medium">Companies</span> /{" "}
            <span className="font-medium">Approvals</span> to accept or reject drive submissions.
            {collegeName ? ` Your college: ${collegeName}.` : null}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CollegeStudents;

