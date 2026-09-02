import { useEffect, useMemo, useState, type ReactNode } from "react";
import { setAuthToken } from "../api/client";
import { AuthContext } from "./context";

const SESSION_STORAGE_KEY = "synca_participant_token";

/**
 * Token lives in sessionStorage (survives a refresh, wiped when the tab
 * closes) -- never localStorage or a cookie, per security-hardening: an XSS
 * bug would otherwise be able to steal a token that outlives the tab.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = (newToken: string) => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, newToken);
    } catch {
      // sessionStorage unavailable (private mode) -- token still works for
      // the current in-memory session, just won't survive a refresh.
    }
    setToken(newToken);
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    setToken(null);
  };

  const value = useMemo(
    () => ({ token, isAuthenticated: token !== null, login, logout }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
