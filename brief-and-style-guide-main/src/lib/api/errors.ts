/**
 * FastAPI's error shape isn't uniform: `detail` is a string for most errors
 * but a Pydantic validation array for 422 (see error-handling skill). Every
 * caller that parses `detail` must go through this instead of assuming a
 * string, or a 422 renders as "[object Object]".
 */
export function extractErrorMessage(detail: unknown, fallback: string): string {
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (item && typeof item === "object" && "msg" in item ? String(item.msg) : null))
      .filter((msg): msg is string => Boolean(msg));
    if (messages.length > 0) return messages.join(" ");
  }

  return fallback;
}
