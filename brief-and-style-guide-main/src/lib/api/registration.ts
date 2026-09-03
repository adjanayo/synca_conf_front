import { z } from "zod";
import { apiFetch } from "./client";
import type { ParticipantProfile } from "./participant";
import { passTypeSchema, campaignWindowSchema } from "../schemas/public";

export type PassType = z.infer<typeof passTypeSchema>;

export type CampaignWindow = z.infer<typeof campaignWindowSchema>;

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

export async function getPassTypes() {
  const data = await apiFetch<unknown>("/api/pass-types");
  return z.array(passTypeSchema).parse(data);
}

export async function getCampaignWindows() {
  const data = await apiFetch<unknown>("/api/campaign-windows");
  return z.array(campaignWindowSchema).parse(data);
}

export type EventSettings = {
  id: number;
  name: string;
  venue: string;
  year: number | null;
  updated_at: string;
};

export function getEventSettings() {
  return apiFetch<EventSettings>("/api/event-settings");
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

export type PromoValidateResponse = {
  code: string;
  discount_pct: number;
  discount_fixed: number | null;
};

export function validatePromoCode(code: string) {
  return apiFetch<PromoValidateResponse>("/api/promo/validate", {
    method: "POST",
    body: { code },
  });
}
