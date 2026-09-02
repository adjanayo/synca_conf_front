import { apiFetch } from "./client";

export type ParticipantProfile = {
  id: number;
  first_name: string;
  last_name: string;
  gender: string | null;
  email: string;
  email_verified: boolean;
  phone_whatsapp: string;
  country: string;
  city: string;
  sector: string | null;
  experience_level: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  special_needs: string | null;
  heard_from: string | null;
  gdpr_consent: boolean;
  newsletter_consent: boolean;
  created_at: string;
  updated_at: string;
};

export type Ticket = {
  id: number;
  ticket_number: string;
  pdf_url: string;
  is_scanned: boolean;
  created_at: string;
};

export function requestOtp(email: string) {
  return apiFetch<{ detail: string }>("/api/auth/otp/request", {
    method: "POST",
    body: { email },
  });
}

export function verifyOtp(email: string, code: string) {
  return apiFetch<{ access_token: string; token_type: string }>("/api/auth/otp/verify", {
    method: "POST",
    body: { email, code },
  });
}

export function getMyProfile() {
  return apiFetch<ParticipantProfile>("/api/user/me", { auth: true });
}

export function getMyTickets() {
  return apiFetch<Ticket[]>("/api/user/me/tickets", { auth: true });
}

export function deleteMyAccount() {
  return apiFetch<{ detail: string }>("/api/user/me", { method: "DELETE", auth: true });
}
