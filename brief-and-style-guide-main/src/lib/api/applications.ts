import { apiFetch, apiFetchForm } from "./client";

export type SpeakerPublic = {
  id: number;
  first_name: string;
  last_name: string;
  title_role: string;
  company: string | null;
  country: string;
  photo_url: string | null;
  intervention_format: string;
  intervention_title: string;
  theme: string;
};

export function getSpeakers() {
  return apiFetch<SpeakerPublic[]>("/api/speakers");
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

export type SpeakerApplyResponse = { id: number };

export function applyAsSpeaker(formData: FormData) {
  return apiFetchForm<SpeakerApplyResponse>("/api/speakers/apply", formData);
}

export type AmbassadorApplyPayload = {
  first_name: string;
  last_name: string;
  age: number;
  country: string;
  city: string;
  email: string;
  phone_whatsapp: string;
  current_profile?: string;
  institution_company?: string;
  linkedin_url?: string;
  social_handles?: Record<string, string>;
  followers_range?: string;
  motivation: string;
  mobilization_plan: string;
  estimated_reach?: string;
  previous_synca: boolean;
  preferred_channels: string[];
  availability_pre?: string;
  gdpr_consent: boolean;
};

export type AmbassadorApplyResponse = { id: number };

export function applyAsAmbassador(payload: AmbassadorApplyPayload) {
  return apiFetch<AmbassadorApplyResponse>("/api/ambassadors/apply", {
    method: "POST",
    body: payload,
  });
}

export type PartnerApplyResponse = { id: number };

export function applyAsPartner(formData: FormData) {
  return apiFetchForm<PartnerApplyResponse>("/api/partners/apply", formData);
}
