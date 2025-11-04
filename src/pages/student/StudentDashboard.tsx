import { Building2, FileText, CheckCircle, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentSidebar from "@/components/StudentSidebar";

const StudentDashboard = () => {
  const stats = [
    { title: "Available Opportunities", value: "56", icon: Building2, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Applications Sent", value: "12", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Shortlisted", value: "3", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { title: "Pending Review", value: "5", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
  ];

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} p-2 rounded-full`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Opportunities & My Applications */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { company: "Google", position: "Software Engineer", package: "₹25 LPA" },
                  { company: "Microsoft", position: "Data Analyst", package: "₹22 LPA" },
                  { company: "Amazon", position: "Cloud Engineer", package: "₹28 LPA" },
                ].map((opportunity, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium">{opportunity.position}</p>
                      <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                    </div>
                    <span className="font-semibold text-purple-600">{opportunity.package}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { company: "Tech Corp", position: "Frontend Developer", status: "Shortlisted", color: "green" },
                  { company: "Innovate Inc", position: "Backend Developer", status: "Under Review", color: "yellow" },
                  { company: "StartUp XYZ", position: "Full Stack", status: "Applied", color: "blue" },
                ].map((application, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{application.position}</p>
                      <p className="text-sm text-muted-foreground">{application.company}</p>
                    </div>
                    <span className={`text-xs bg-${application.color}-100 text-${application.color}-800 px-2 py-1 rounded-full`}>
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
