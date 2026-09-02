import { apiDownload, apiFetch } from "./client";

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

export type Partner = {
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
  level_id: number;
  has_budget: string | null;
  objectives: string;
  previous_sponsor: boolean;
  message: string | null;
  heard_from: string | null;
  gdpr_consent: boolean;
  status: ExhibitorStatus;
  logo_url: string | null;
  is_public: boolean;
  created_at: string;
};

export type PartnerFilters = {
  status?: ExhibitorStatus;
  level_id?: number;
};

export function listPartners(filters: PartnerFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.level_id !== undefined) params.set("level_id", String(filters.level_id));
  const query = params.toString();
  return apiFetch<Partner[]>(`/api/admin/partners${query ? `?${query}` : ""}`, {
    auth: "admin",
  });
}

export function updatePartnerStatus(id: number, status: ExhibitorStatus) {
  return apiFetch<Partner>(`/api/admin/partners/${id}`, {
    method: "PATCH",
    auth: "admin",
    body: { status },
  });
}

export type CampaignWindowKey =
  | "call_for_speaker"
  | "ticketing"
  | "call_for_partner"
  | "call_for_ambassador"
  | "call_for_exhibitor";

export type CampaignWindow = {
  id: number;
  key: CampaignWindowKey;
  start_at: string;
  end_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CampaignWindowUpdate = {
  start_at?: string;
  end_at?: string;
  is_active?: boolean;
};

export function listCampaignWindows() {
  return apiFetch<CampaignWindow[]>("/api/admin/campaign-windows", { auth: "admin" });
}

export function updateCampaignWindow(key: CampaignWindowKey, body: CampaignWindowUpdate) {
  return apiFetch<CampaignWindow>(`/api/admin/campaign-windows/${key}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type ContactMessageFilters = {
  is_read?: boolean;
};

export function listContacts(filters: ContactMessageFilters = {}) {
  const params = new URLSearchParams();
  if (filters.is_read !== undefined) params.set("is_read", String(filters.is_read));
  const query = params.toString();
  return apiFetch<ContactMessage[]>(`/api/admin/contacts${query ? `?${query}` : ""}`, {
    auth: "admin",
  });
}

export function updateContactReadStatus(id: number, is_read: boolean) {
  return apiFetch<ContactMessage>(`/api/admin/contacts/${id}`, {
    method: "PATCH",
    auth: "admin",
    body: { is_read },
  });
}

export type Role = {
  id: number;
  name: string;
  permission_codes: string[];
};

export type Permission = {
  id: number;
  code: string;
};

export function listRoles() {
  return apiFetch<Role[]>("/api/admin/roles", { auth: "admin" });
}

export function listPermissions() {
  return apiFetch<Permission[]>("/api/admin/permissions", { auth: "admin" });
}

export function updateRolePermissions(roleId: number, permission_codes: string[]) {
  return apiFetch<Role>(`/api/admin/roles/${roleId}`, {
    method: "PATCH",
    auth: "admin",
    body: { permission_codes },
  });
}

export type AuditLog = {
  id: number;
  event: string;
  email: string;
  ip_address: string | null;
  success: boolean;
  created_at: string;
};

export type AuditLogFilters = {
  event?: string;
  email?: string;
  success?: boolean;
};

export function listAuditLogs(filters: AuditLogFilters = {}) {
  const params = new URLSearchParams();
  if (filters.event) params.set("event", filters.event);
  if (filters.email) params.set("email", filters.email);
  if (filters.success !== undefined) params.set("success", String(filters.success));
  const query = params.toString();
  return apiFetch<AuditLog[]>(`/api/admin/audit-logs${query ? `?${query}` : ""}`, {
    auth: "admin",
  });
}

export function exportRegistrationsCsv() {
  return apiDownload("/api/admin/export/registrations", "admin", "registrations.csv");
}

export function exportPaymentsCsv() {
  return apiDownload("/api/admin/export/payments", "admin", "payments.csv");
}
