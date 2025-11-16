import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const DEV_BYPASS = false; // flip to true only while designing the UI

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (DEV_BYPASS) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Checking access...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
