import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Role = "student" | "client" | "admin";

type Props = {
  children: React.ReactNode;
  requiredRole?: Role;
};

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { user, userRole, loading } = useAuth();
  const [waited, setWaited] = React.useState(false);

  // Safety valve for any slow/failed auth fetch: stop showing spinner after 5s
  React.useEffect(() => {
    const id = setTimeout(() => setWaited(true), 5000);
    return () => clearTimeout(id);
  }, []);

  if (loading && !waited) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Not authenticated → go to auth
  if (!user) return <Navigate to="/auth" replace />;

  // Authenticated, but wrong role for this page → send to their dashboard
  if (requiredRole && userRole && userRole !== requiredRole) {
    const dest =
      userRole === "admin"
        ? "/admin-dashboard"
        : userRole === "student"
        ? "/student-dashboard"
        : "/client-dashboard";
    return <Navigate to={dest} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

