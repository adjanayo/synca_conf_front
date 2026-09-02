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

const tokens: Record<AuthScope, string | null> = { participant: null, admin: null };

/**
 * Central place each JWT lives in memory — never localStorage/cookie (XSS
 * risk). Participant and admin tokens are separate slots: a browser tab
 * could plausibly hold both (participant self-service + admin backoffice),
 * and they must never be sent on the other's requests.
 */
export function setAuthToken(scope: AuthScope, token: string | null) {
  tokens[scope] = token;
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
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
