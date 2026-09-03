import { apiFetch } from "./client";

export type PublicDay = {
  id: number;
  date: string;
  label: string;
};

export type PublicSession = {
  id: number;
  day_id: number;
  title: string;
  description: string | null;
  category: string;
  start_time: string;
  end_time: string;
  room: string | null;
  speaker_id: number | null;
};

export function getDays() {
  return apiFetch<PublicDay[]>("/api/days");
}

export function getSessions() {
  return apiFetch<PublicSession[]>("/api/sessions?limit=200");
}
