import { z } from "zod";
import { apiFetchAll } from "./client";
import { hackathonTeamSchema } from "../schemas/public";

export type HackathonTeam = z.infer<typeof hackathonTeamSchema>;

export async function getHackathonTeams() {
  const data = await apiFetchAll<unknown>("/api/hackathon-teams");
  return z.array(hackathonTeamSchema).parse(data);
}
