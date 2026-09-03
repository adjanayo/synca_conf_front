import { z } from "zod";
import { apiFetch, apiFetchAll, apiFetchForm } from "./client";
import { speakerPublicSchema, partnerPublicSchema, exhibitorPublicSchema } from "../schemas/public";

export type SpeakerPublic = z.infer<typeof speakerPublicSchema>;

export async function getSpeakers() {
  const data = await apiFetchAll<unknown>("/api/speakers");
  return z.array(speakerPublicSchema).parse(data);
}

export function getSpeaker(id: number) {
  return apiFetch<SpeakerPublic>(`/api/speakers/${id}`);
}

export type AmbassadorPublic = {
  id: number;
  first_name: string;
  last_name: string;
  country: string;
  city: string;
  photo_url: string | null;
  current_profile: string | null;
  institution_company: string | null;
  linkedin_url: string | null;
  social_handles: Record<string, string> | null;
};

export function getAmbassadors() {
  return apiFetchAll<AmbassadorPublic>("/api/ambassadors");
}

export function getAmbassador(id: number) {
  return apiFetch<AmbassadorPublic>(`/api/ambassadors/${id}`);
}

export type PartnerLevel = {
  id: number;
  name: string;
  price: number;
  benefits: string | null;
  sort_order: number;
  created_at: string;
};

export function getPartnerLevels() {
  return apiFetch<PartnerLevel[]>("/api/partner-levels");
}

export type PartnerPublic = z.infer<typeof partnerPublicSchema>;

export async function getPartners() {
  const data = await apiFetchAll<unknown>("/api/partners");
  return z.array(partnerPublicSchema).parse(data);
}

export type ExhibitorPublic = z.infer<typeof exhibitorPublicSchema>;

export async function getExhibitors() {
  const data = await apiFetchAll<unknown>("/api/exhibitors");
  return z.array(exhibitorPublicSchema).parse(data);
}

export type SpeakerApplyResponse = { id: number };

export function applyAsSpeaker(formData: FormData) {
  return apiFetchForm<SpeakerApplyResponse>("/api/speakers/apply", formData);
}

export type AmbassadorApplyResponse = { id: number };

export function applyAsAmbassador(formData: FormData) {
  return apiFetchForm<AmbassadorApplyResponse>("/api/ambassadors/apply", formData);
}

export type PartnerApplyResponse = { id: number };

export function applyAsPartner(formData: FormData) {
  return apiFetchForm<PartnerApplyResponse>("/api/partners/apply", formData);
}

export type ExhibitorApplyResponse = { id: number };

export function applyAsExhibitor(formData: FormData) {
  return apiFetchForm<ExhibitorApplyResponse>("/api/exhibitors/apply", formData);
}
