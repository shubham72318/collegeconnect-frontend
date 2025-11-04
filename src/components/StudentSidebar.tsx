import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, FileText, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const StudentSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
    { icon: Building2, label: "Companies", path: "/student/companies" },
    { icon: FileText, label: "Applications", path: "/student/applications" },
    { icon: UserCircle, label: "Profile", path: "/student/profile" },
  ];

  return (
    <div className="py-6">
      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default StudentSidebar;
