import { Navigate, Outlet } from "react-router";
import { readAuth, roleFromSession } from "../../lib/auth-api";
import { ROLES } from "../../lib/roles";

export function PublicOnly() {
  const session = readAuth();
  if (!session?.accessToken) {
    return <Outlet />;
  }

  const role = roleFromSession(session) ?? "teacher";
  return <Navigate to={ROLES[role].home} replace />;
}

