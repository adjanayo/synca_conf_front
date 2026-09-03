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

export type PartnerPublic = {
  id: number;
  organization_name: string;
  website_url: string | null;
  logo_url: string | null;
  level_id: number;
};

export function getPartners() {
  return apiFetch<PartnerPublic[]>("/api/partners");
}

export type ExhibitorPublic = {
  id: number;
  organization_name: string;
  website_url: string | null;
  stand_type: string;
};

export function getExhibitors() {
  return apiFetch<ExhibitorPublic[]>("/api/exhibitors");
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

export type ExhibitorApplyPayload = {
  organization_name: string;
  sector: string;
  country: string;
  city: string;
  website_url?: string;
  contact_name: string;
  contact_position: string;
  contact_email: string;
  contact_phone: string;
  stand_type: string;
  reps_count: number;
  linked_partner_level?: string;
  products_services: string;
  equipment_needs?: string[];
  side_activities?: string[];
  visuals_url?: string;
  payment_method?: string;
  rules_accepted: boolean;
  gdpr_consent: boolean;
};

export type ExhibitorApplyResponse = { id: number };

export function applyAsExhibitor(payload: ExhibitorApplyPayload) {
  return apiFetch<ExhibitorApplyResponse>("/api/exhibitors/apply", {
    method: "POST",
    body: payload,
  });
}
