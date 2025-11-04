import { Briefcase, Users, UserCheck, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompanySidebar from "@/components/CompanySidebar";

const CompanyDashboard = () => {
  const stats = [
    { title: "Active Postings", value: "12", icon: Briefcase, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Applications", value: "284", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Shortlisted", value: "45", icon: UserCheck, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Hired This Month", value: "8", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ];

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

        {/* Active Postings & Recent Applications */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Software Engineer", applications: 45, type: "Full-time" },
                  { title: "Data Analyst", applications: 32, type: "Internship" },
                  { title: "Product Manager", applications: 28, type: "Full-time" },
                ].map((job, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.applications} applications</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Alice Johnson", position: "Software Engineer", college: "MIT" },
                  { name: "Bob Smith", position: "Data Analyst", college: "Stanford" },
                  { name: "Carol Davis", position: "Product Manager", college: "Harvard" },
                ].map((application, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{application.name}</p>
                      <p className="text-sm text-muted-foreground">{application.position}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {application.college}
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

export default CompanyDashboard;
