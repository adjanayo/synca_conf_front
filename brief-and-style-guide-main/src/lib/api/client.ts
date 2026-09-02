import { extractErrorMessage } from "./errors";

const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

type AuthScope = "participant" | "admin";

const ADMIN_TOKEN_KEY = "admin_token";

/**
 * Central place each JWT lives in memory — never localStorage (XSS risk,
 * plus survives across browser restarts). The admin token also mirrors to
 * sessionStorage so a page refresh doesn't force a re-login; sessionStorage
 * is cleared when the tab closes, same exposure window as before, just
 * surviving F5.
 */
const tokens: Record<AuthScope, string | null> = {
  participant: null,
  admin: typeof sessionStorage !== "undefined" ? sessionStorage.getItem(ADMIN_TOKEN_KEY) : null,
};

export function getAuthToken(scope: AuthScope) {
  return tokens[scope];
}

export function setAuthToken(scope: AuthScope, token: string | null) {
  tokens[scope] = token;
  if (scope === "admin") {
    if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

const unauthorizedHandlers: Record<AuthScope, (() => void) | null> = {
  participant: null,
  admin: null,
};

/**
 * Chaque provider d'auth (Auth/AdminAuthContext) s'enregistre ici avec son
 * logout -- ainsi apiFetch peut déclencher une déconnexion globale sur 401
 * sans que chaque page appelante ait à vérifier l'erreur elle-même.
 */
export function setUnauthorizedHandler(scope: AuthScope, handler: (() => void) | null) {
  unauthorizedHandlers[scope] = handler;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: AuthScope;
};

/**
 * Every API call goes through here so the bearer header and error parsing
 * happen in one place, never copy-pasted per call site.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL n'est pas configuré (voir .env.example).");
  }

  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.auth) {
    const token = tokens[options.auth];
    if (!token) throw new ApiError(401, "Session expirée.");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    // FastAPI's `detail` is a string for most errors but a Pydantic
    // validation array for 422 (error-handling skill) -- extractErrorMessage
    // handles both instead of assuming a string.
    let detail = "Une erreur est survenue.";
    try {
      const body = (await response.json()) as { detail?: unknown };
      detail = extractErrorMessage(body.detail, detail);
    } catch {
      // response wasn't JSON -- keep the generic message
    }
    if (response.status === 401 && options.auth) {
      unauthorizedHandlers[options.auth]?.();
    }
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
