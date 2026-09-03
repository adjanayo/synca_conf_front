import type { z } from "zod";

/**
 * Convertit le résultat d'un `schema.safeParse()` en `Record<champ, message>`
 * -- même forme que les objets d'erreurs construits à la main historiquement,
 * pour brancher zod sans changer l'affichage des <Field error=...>.
 */
export function zodErrors(result: z.SafeParseReturnType<unknown, unknown>): Record<string, string> {
  if (result.success) return {};
  const out: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) out[key] = issue.message;
  }
  return out;
}
