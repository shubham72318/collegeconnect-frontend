import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, FileText, UserCheck, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CompanySidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/company/dashboard" },
    { icon: PlusCircle, label: "Post Job", path: "/company/post-job" },
    { icon: FileText, label: "Applications", path: "/company/applications" },
    { icon: UserCheck, label: "Shortlisted", path: "/company/shortlisted" },
    { icon: UserCircle, label: "Profile", path: "/company/profile" },
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
                  ? "bg-green-100 text-green-700 font-medium"
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

export default CompanySidebar;
