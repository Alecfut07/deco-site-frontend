import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  FolderTree,
  Briefcase,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/portfolio", label: "Portfolio Items", icon: Image },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/business", label: "Business Info", icon: Info },
];

function SidebarContent({ onLinkClick }) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onLinkClick}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

const AdminSidebar = ({ mobile, open, onOpenChange }) => {
  // Mobile version - Sheet component
  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-4">
          <SheetHeader>
            <SheetTitle className="text-left">Navigation</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SidebarContent onLinkClick={() => onOpenChange?.(false)} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version - Fixed sidebar
  return (
    <aside className="w-64 bg-card border-r min-h-[calc(100vh-4rem)] p-4">
      <SidebarContent />
    </aside>
  );
};

export default AdminSidebar;
