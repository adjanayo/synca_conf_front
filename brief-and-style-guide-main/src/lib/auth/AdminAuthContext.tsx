import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getAuthToken, setAdminRefreshToken, setAuthToken, setUnauthorizedHandler } from "../api/client";
import { getAdminMe } from "../api/admin";
import { AdminAuthContext } from "./adminContext";

/**
 * Token mirrors to sessionStorage (client.ts) so a page refresh doesn't
 * force a re-login -- cleared on tab close, same exposure window as
 * memory-only. On mount we re-validate any stored token against
 * GET /api/admin/me instead of trusting it blindly (it may have expired).
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  const logout = useCallback(() => {
    setAuthToken("admin", null);
    setAdminRefreshToken(null);
    setIsAuthenticated(false);
    setRole(null);
    setPermissions([]);
  }, []);

  const login = useCallback(async (token: string, refreshToken: string) => {
    setAuthToken("admin", token);
    setAdminRefreshToken(refreshToken);
    // ROADMAP_ADMIN.md A4 -- rôle + permissions viennent de GET /api/admin/me,
    // pas du login lui-même (le login ne renvoie qu'une paire de tokens).
    try {
      const me = await getAdminMe();
      setRole(me.role);
      setPermissions(me.permission_codes);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthToken("admin", null);
      setAdminRefreshToken(null);
      throw err;
    }
  }, []);

  const hasPermission = useCallback((code: string) => permissions.includes(code), [permissions]);

  useEffect(() => {
    setUnauthorizedHandler("admin", logout);
    return () => setUnauthorizedHandler("admin", null);
  }, [logout]);

  useEffect(() => {
    const token = getAuthToken("admin");
    if (!token) {
      setIsLoading(false);
      return;
    }
    getAdminMe()
      .then((me) => {
        setRole(me.role);
        setPermissions(me.permission_codes);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setAuthToken("admin", null);
        setAdminRefreshToken(null);
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, role, permissions, hasPermission, login, logout }),
    [isAuthenticated, isLoading, role, permissions, hasPermission, login, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
