import { apiFetch } from "./client";
import type { ParticipantProfile } from "./participant";

export type PassType = {
  id: number;
  name: string;
  price: number;
  description: string;
  inclusions: string;
  max_days: number;
  is_active: boolean;
  created_at: string;
};

export type CampaignWindow = {
  id: number;
  key: string;
  start_at: string;
  end_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  gender?: string;
  email: string;
  phone_whatsapp: string;
  country: string;
  city: string;
  profiles: string[];
  sector?: string;
  experience_level?: string;
  pass_type_id: number;
  promo_code?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  special_needs?: string;
  heard_from?: string;
  gdpr_consent: boolean;
  newsletter_consent?: boolean;
};

export type RegisterResponse = ParticipantProfile & { access_token: string };

export function getPassTypes() {
  return apiFetch<PassType[]>("/api/pass-types");
}

export function getCampaignWindows() {
  return apiFetch<CampaignWindow[]>("/api/campaign-windows");
}

export function registerParticipant(payload: RegisterPayload) {
  return apiFetch<RegisterResponse>("/api/register", { method: "POST", body: payload });
}

export type WaitlistEntry = {
  id: number;
  email: string;
  notified: boolean;
  registered: boolean;
  created_at: string;
};

export function joinWaitlist(email: string) {
  return apiFetch<WaitlistEntry>("/api/waitlist", { method: "POST", body: { email } });
}
