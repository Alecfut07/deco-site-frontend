import { NavLink } from "react-router-dom";
import {
  Briefcase,
  FolderTree,
  Image,
  Info,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/portfolio", label: "Portfolio Items", icon: Image },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/business", label: "Business Info", icon: Info },
];

const AdminSidebar = () => {
  return (
    <aside className="min-h-[calc(100vh-4rem)] w-64 border-r bg-card p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
