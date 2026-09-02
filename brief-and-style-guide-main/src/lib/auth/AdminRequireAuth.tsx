import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";

export function AdminRequireAuth({
  loginPath,
  children,
}: {
  loginPath: string;
  children: ReactNode;
}) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
}
