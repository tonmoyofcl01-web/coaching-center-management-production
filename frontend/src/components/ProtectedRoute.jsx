import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/${allowedRole.toLowerCase()}`} replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
