import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { clearAuth, me, readAuth, refresh, roleFromSession, saveAuth } from "../../lib/auth-api";
import { useApp } from "../../store/app-context";

export function RequireAuth() {
  const location = useLocation();
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");
  const { setRole, setServerContext, setPermissions } = useApp();

  useEffect(() => {
    let cancelled = false;
    const session = readAuth();
    if (!session?.accessToken || !session.refreshToken) {
      setStatus("unauthorized");
      return;
    }

    me(session.accessToken)
      .catch(() => refresh(session.refreshToken))
      .then((serverSession) => {
        if (cancelled) return;
        const mergedSession = { ...session, ...serverSession };
        saveAuth(mergedSession);
        const role = roleFromSession(mergedSession);
        if (role) setRole(role);
        const firstRole = mergedSession.roles?.[0];
        setPermissions(firstRole?.permissions ?? []);
        setServerContext({
          school: firstRole?.tenantName,
          branch: firstRole?.branchName,
        });
        setStatus("authorized");
      })
      .catch(() => {
        if (cancelled) return;
        clearAuth();
        setStatus("unauthorized");
      });

    return () => {
      cancelled = true;
    };
  }, [setRole, setServerContext, setPermissions]);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-[14px] text-muted-foreground">
        Checking session...
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
