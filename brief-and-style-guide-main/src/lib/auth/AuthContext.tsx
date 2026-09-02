import { useEffect, useMemo, useState, type ReactNode } from "react";
import { setAuthToken, setUnauthorizedHandler } from "../api/client";
import { AuthContext } from "./context";

const SESSION_STORAGE_KEY = "synca_participant_token";

function readStoredToken(): string | null {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Token lives in sessionStorage (survives a refresh, wiped when the tab
 * closes) -- never localStorage or a cookie, per security-hardening: an XSS
 * bug would otherwise be able to steal a token that outlives the tab.
 *
 * setAuthToken (the module-level var the api client reads) is set
 * synchronously in login/logout, not via a useEffect keyed on `token`: since
 * AuthProvider is an ancestor of every page, its effects commit *after* a
 * child page's (React fires effects leaf-first), so a query fired from
 * EspacePage's first render could run before an effect-based sync ever
 * happened and see a stale/null token right after login.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = readStoredToken();
    setAuthToken("participant", stored);
    return stored;
  });

  const login = (newToken: string) => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, newToken);
    } catch {
      // sessionStorage unavailable (private mode) -- token still works for
      // the current in-memory session, just won't survive a refresh.
    }
    setAuthToken("participant", newToken);
    setToken(newToken);
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    setAuthToken("participant", null);
    setToken(null);
  };

  useEffect(() => {
    setUnauthorizedHandler("participant", logout);
    return () => setUnauthorizedHandler("participant", null);
  }, []);

  const value = useMemo(
    () => ({ token, isAuthenticated: token !== null, login, logout }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
