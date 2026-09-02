import { apiFetch } from "./client";

export type AdminTokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export function adminLogin(email: string, password: string) {
  return apiFetch<AdminTokenPair>("/api/admin/login", {
    method: "POST",
    body: { email, password },
  });
}

export type AdminMe = {
  id: number;
  email: string;
  role: string;
  permission_codes: string[];
};

export function getAdminMe() {
  return apiFetch<AdminMe>("/api/admin/me", { auth: "admin" });
}

export type AdminStats = {
  total_registrations: number;
  total_revenue: number;
  completed_payments: number;
  payments_with_promo: number;
  promo_conversion_rate: number;
  applications_by_status: Record<string, Record<string, number>>;
};

export function getAdminStats() {
  return apiFetch<AdminStats>("/api/admin/stats", { auth: "admin" });
}

export type AdminRegistration = {
  payment_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  pass_type_name: string;
  amount_paid: number;
  status: string;
  ticket_number: string | null;
  created_at: string;
};

export function listRegistrations(limit = 5) {
  return apiFetch<AdminRegistration[]>(`/api/admin/registrations?limit=${limit}`, {
    auth: "admin",
  });
}

export type SpeakerApplicationStatus = "pending" | "accepted" | "rejected";

export type Speaker = {
  id: number;
  first_name: string;
  last_name: string;
  title_role: string;
  company: string | null;
  country: string;
  email: string;
  phone_whatsapp: string;
  linkedin_url: string | null;
  website_url: string | null;
  photo_url: string | null;
  intervention_format: string;
  intervention_title: string;
  theme: string;
  summary: string;
  audience_level: string | null;
  language: string | null;
  past_experience: string | null;
  video_link: string | null;
  availability: string | null;
  departure_city: string | null;
  needs_accommodation: boolean;
  motivation: string;
  video_consent: string | null;
  gdpr_consent: boolean;
  status: SpeakerApplicationStatus;
  is_public: boolean;
  created_at: string;
};

export type SpeakerFilters = {
  status?: SpeakerApplicationStatus;
  theme?: string;
  format?: string;
};

export function listSpeakers(filters: SpeakerFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.theme) params.set("theme", filters.theme);
  if (filters.format) params.set("format", filters.format);
  const query = params.toString();
  return apiFetch<Speaker[]>(`/api/admin/speakers${query ? `?${query}` : ""}`, {
    auth: "admin",
  });
}

export function updateSpeakerStatus(id: number, status: SpeakerApplicationStatus) {
  return apiFetch<Speaker>(`/api/admin/speakers/${id}`, {
    method: "PATCH",
    auth: "admin",
    body: { status },
  });
}

export type Ambassador = {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  country: string;
  city: string;
  email: string;
  phone_whatsapp: string;
  current_profile: string | null;
  institution_company: string | null;
  linkedin_url: string | null;
  social_handles: Record<string, string> | null;
  followers_range: string | null;
  motivation: string;
  mobilization_plan: string;
  estimated_reach: string | null;
  previous_synca: boolean;
  preferred_channels: string;
  availability_pre: string | null;
  gdpr_consent: boolean;
  promo_code_id: number | null;
  status: SpeakerApplicationStatus;
  created_at: string;
};

export type AmbassadorFilters = {
  status?: SpeakerApplicationStatus;
  current_profile?: string;
};

export function listAmbassadors(filters: AmbassadorFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.current_profile) params.set("current_profile", filters.current_profile);
  const query = params.toString();
  return apiFetch<Ambassador[]>(`/api/admin/ambassadors${query ? `?${query}` : ""}`, {
    auth: "admin",
  });
}

export function updateAmbassadorStatus(id: number, status: SpeakerApplicationStatus) {
  return apiFetch<Ambassador>(`/api/admin/ambassadors/${id}`, {
    method: "PATCH",
    auth: "admin",
    body: { status },
  });
}

export type ExhibitorStatus = "pending" | "contacted" | "negotiating" | "confirmed" | "rejected";

export type Exhibitor = {
  id: number;
  organization_name: string;
  sector: string;
  country: string;
  city: string;
  website_url: string | null;
  contact_name: string;
  contact_position: string;
  contact_email: string;
  contact_phone: string;
  stand_type: string;
  reps_count: number;
  linked_partner_level: string | null;
  products_services: string;
  equipment_needs: string | null;
  side_activities: string | null;
  visuals_url: string | null;
  payment_method: string | null;
  rules_accepted: boolean;
  gdpr_consent: boolean;
  status: ExhibitorStatus;
  is_public: boolean;
  created_at: string;
};

export type ExhibitorFilters = {
  status?: ExhibitorStatus;
  stand_type?: string;
};

export function listExhibitors(filters: ExhibitorFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.stand_type) params.set("stand_type", filters.stand_type);
  const query = params.toString();
  return apiFetch<Exhibitor[]>(`/api/admin/exhibitors${query ? `?${query}` : ""}`, {
    auth: "admin",
  });
}

export function updateExhibitorStatus(id: number, status: ExhibitorStatus) {
  return apiFetch<Exhibitor>(`/api/admin/exhibitors/${id}`, {
    method: "PATCH",
    auth: "admin",
    body: { status },
  });
}
