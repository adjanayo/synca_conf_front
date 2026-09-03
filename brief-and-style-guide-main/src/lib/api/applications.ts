import { apiFetch, apiFetchForm } from "./client";

export type SpeakerPublic = {
  id: number;
  first_name: string;
  last_name: string;
  title_role: string;
  company: string | null;
  country: string;
  linkedin_url: string | null;
  website_url: string | null;
  photo_url: string | null;
  intervention_format: string;
  intervention_title: string;
  theme: string;
  summary: string;
  audience_level: string | null;
  language: string | null;
};

export function getSpeakers() {
  return apiFetch<SpeakerPublic[]>("/api/speakers?limit=200");
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
  return apiFetch<AmbassadorPublic[]>("/api/ambassadors?limit=200");
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

export type PartnerPublic = {
  id: number;
  organization_name: string;
  website_url: string | null;
  logo_url: string | null;
  level_id: number;
};

export function getPartners() {
  return apiFetch<PartnerPublic[]>("/api/partners?limit=200");
}

export type ExhibitorPublic = {
  id: number;
  organization_name: string;
  website_url: string | null;
  stand_type: string;
};

export function getExhibitors() {
  return apiFetch<ExhibitorPublic[]>("/api/exhibitors?limit=200");
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
