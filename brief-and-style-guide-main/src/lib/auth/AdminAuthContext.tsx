import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { setAuthToken, setUnauthorizedHandler } from "../api/client";
import { getAdminMe } from "../api/admin";
import { AdminAuthContext } from "./adminContext";

/**
 * Memory-only by design (ROADMAP_ADMIN.md A2 default) -- no sessionStorage:
 * the admin access_token is short-lived (15 min, no refresh flow wired up
 * yet) and a closed tab should not leave a resumable admin session lying
 * around. A refresh happens by logging in again.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  const logout = useCallback(() => {
    setAuthToken("admin", null);
    setIsAuthenticated(false);
    setRole(null);
    setPermissions([]);
  }, []);

  const login = useCallback(async (token: string) => {
    setAuthToken("admin", token);
    // ROADMAP_ADMIN.md A4 -- rôle + permissions viennent de GET /api/admin/me,
    // pas du login lui-même (le login ne renvoie qu'une paire de tokens).
    try {
      const me = await getAdminMe();
      setRole(me.role);
      setPermissions(me.permission_codes);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthToken("admin", null);
      throw err;
    }
  }, []);

  const hasPermission = useCallback(
    (code: string) => permissions.includes(code),
    [permissions],
  );

  useEffect(() => {
    setUnauthorizedHandler("admin", logout);
    return () => setUnauthorizedHandler("admin", null);
  }, [logout]);

  const value = useMemo(
    () => ({ isAuthenticated, role, permissions, hasPermission, login, logout }),
    [isAuthenticated, role, permissions, hasPermission, login, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
