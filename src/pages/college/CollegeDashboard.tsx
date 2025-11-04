import { Users, Building2, CheckCircle, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CollegeSidebar from "@/components/CollegeSidebar";

const CollegeDashboard = () => {
  const stats = [
    { title: "Total Students", value: "1,234", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Active Companies", value: "56", icon: Building2, color: "text-green-600", bg: "bg-green-100" },
    { title: "Placements This Year", value: "892", icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Placement Rate", value: "89%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <DashboardLayout
      title="College Dashboard"
      theme="college"
      sidebar={<CollegeSidebar />}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">Here's what's happening with your placements today.</p>
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

        {/* Recent Activities */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Placements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { student: "John Doe", company: "Google", package: "₹25 LPA" },
                  { student: "Jane Smith", company: "Microsoft", package: "₹22 LPA" },
                  { student: "Mike Johnson", company: "Amazon", package: "₹28 LPA" },
                ].map((placement, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{placement.student}</p>
                      <p className="text-sm text-muted-foreground">{placement.company}</p>
                    </div>
                    <span className="font-semibold text-blue-600">{placement.package}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { company: "Tech Corp", type: "Campus Drive" },
                  { company: "Innovate Inc", type: "Internship" },
                  { company: "StartUp XYZ", type: "Job Posting" },
                ].map((approval, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{approval.company}</p>
                      <p className="text-sm text-muted-foreground">{approval.type}</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Pending
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

export default CollegeDashboard;
