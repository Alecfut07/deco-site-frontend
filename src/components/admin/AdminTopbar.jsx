import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { notify } from "@/utils/notify";

const AdminTopbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      notify({ title: "Signed out", description: "You have been logged out." });
    } catch (error) {
      notify({
        title: "Logout failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary">Deco Portfolio</span>
        <span className="text-sm text-muted-foreground">Admin</span>
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{user?.username || "Admin"}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default AdminTopbar;
