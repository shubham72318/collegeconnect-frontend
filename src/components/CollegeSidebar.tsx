import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Building2, CheckSquare, FileText, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CollegeSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/college/dashboard" },
    { icon: Users, label: "Students", path: "/college/students" },
    { icon: Building2, label: "Companies", path: "/college/companies" },
    { icon: CheckSquare, label: "Approvals", path: "/college/approvals" },
    { icon: FileText, label: "Reports", path: "/college/reports" },
    { icon: UserCircle, label: "Profile", path: "/college/profile" },
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
                  ? "bg-blue-100 text-blue-700 font-medium"
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

export default CollegeSidebar;
