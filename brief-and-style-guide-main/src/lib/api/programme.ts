import { z } from "zod";
import { apiFetch, apiFetchAll } from "./client";
import { publicDaySchema, publicSessionSchema } from "../schemas/public";

export type PublicDay = z.infer<typeof publicDaySchema>;
export type PublicSession = z.infer<typeof publicSessionSchema>;

export async function getDays() {
  const data = await apiFetch<unknown>("/api/days");
  return z.array(publicDaySchema).parse(data);
}

export async function getSessions() {
  const data = await apiFetchAll<unknown>("/api/sessions");
  return z.array(publicSessionSchema).parse(data);
}
