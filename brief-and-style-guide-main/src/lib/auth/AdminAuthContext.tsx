import { useMemo, useState, type ReactNode } from "react";
import { setAuthToken } from "../api/client";
import { AdminAuthContext } from "./adminContext";

/**
 * Memory-only by design (ROADMAP_ADMIN.md A2 default) -- no sessionStorage:
 * the admin access_token is short-lived (15 min, no refresh flow wired up
 * yet) and a closed tab should not leave a resumable admin session lying
 * around. A refresh happens by logging in again.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string) => {
    setAuthToken("admin", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setAuthToken("admin", null);
    setIsAuthenticated(false);
  };

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
