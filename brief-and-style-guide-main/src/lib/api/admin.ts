import { apiDownload, apiFetch, apiFetchForm } from "./client";

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

export type RegistrationFilters = {
  limit?: number;
  offset?: number;
};

export function listRegistrations({ limit = 5, offset = 0 }: RegistrationFilters = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  return apiFetch<AdminRegistration[]>(`/api/admin/registrations?${params.toString()}`, {
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

export type SpeakerCreate = {
  first_name: string;
  last_name: string;
  title_role: string;
  country: string;
  email: string;
  phone_whatsapp: string;
  intervention_format: string;
  intervention_title: string;
  theme: string;
  summary: string;
  motivation: string;
  company?: string;
  linkedin_url?: string;
  website_url?: string;
  photo_url?: string;
  audience_level?: string;
  language?: string;
  past_experience?: string;
  video_link?: string;
  availability?: string;
  departure_city?: string;
  needs_accommodation?: boolean;
  video_consent?: string;
  gdpr_consent?: boolean;
  status?: SpeakerApplicationStatus;
  is_public?: boolean;
};

export function createSpeaker(body: SpeakerCreate) {
  return apiFetch<Speaker>("/api/admin/speakers", {
    method: "POST",
    auth: "admin",
    body,
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
  photo_url: string | null;
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

export type AmbassadorCreate = {
  first_name: string;
  last_name: string;
  age: number;
  country: string;
  city: string;
  email: string;
  phone_whatsapp: string;
  motivation: string;
  mobilization_plan: string;
  preferred_channels: string;
  current_profile?: string;
  institution_company?: string;
  linkedin_url?: string;
  social_handles?: Record<string, string>;
  followers_range?: string;
  estimated_reach?: string;
  previous_synca?: boolean;
  availability_pre?: string;
  gdpr_consent?: boolean;
  status?: SpeakerApplicationStatus;
};

export function createAmbassador(body: AmbassadorCreate) {
  return apiFetch<Ambassador>("/api/admin/ambassadors", {
    method: "POST",
    auth: "admin",
    body,
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

export type ExhibitorCreate = {
  organization_name: string;
  sector: string;
  country: string;
  city: string;
  contact_name: string;
  contact_position: string;
  contact_email: string;
  contact_phone: string;
  stand_type: string;
  reps_count: number;
  products_services: string;
  website_url?: string;
  linked_partner_level?: string;
  equipment_needs?: string;
  side_activities?: string;
  visuals_url?: string;
  payment_method?: string;
  rules_accepted?: boolean;
  gdpr_consent?: boolean;
  status?: ExhibitorStatus;
  is_public?: boolean;
};

export function createExhibitor(body: ExhibitorCreate) {
  return apiFetch<Exhibitor>("/api/admin/exhibitors", {
    method: "POST",
    auth: "admin",
    body,
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

export type PartnerCreate = {
  organization_name: string;
  sector: string;
  country: string;
  city: string;
  contact_name: string;
  contact_position: string;
  contact_email: string;
  contact_phone: string;
  level_id: number;
  objectives: string;
  website_url?: string;
  has_budget?: string;
  previous_sponsor?: boolean;
  message?: string;
  heard_from?: string;
  gdpr_consent?: boolean;
  status?: ExhibitorStatus;
  logo_url?: string;
  is_public?: boolean;
};

export function createPartner(body: PartnerCreate) {
  return apiFetch<Partner>("/api/admin/partners", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export type CampaignWindowKey =
  | "call_for_speaker"
  | "ticketing"
  | "call_for_partner"
  | "call_for_ambassador"
  | "call_for_exhibitor"
  | "event";

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

export type PassContent = {
  id: number;
  label: string;
  created_at: string;
};

export type PassType = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  max_days: number;
  is_active: boolean;
  created_at: string;
  contents: PassContent[];
};

export type PassTypeCreate = {
  name: string;
  price: number;
  description?: string;
  max_days?: number;
  is_active?: boolean;
  content_ids?: number[];
};

export type PassTypeUpdate = {
  name?: string;
  price?: number;
  description?: string;
  max_days?: number;
  is_active?: boolean;
  content_ids?: number[];
};

export function listPassTypes() {
  return apiFetch<PassType[]>("/api/admin/pass-types", { auth: "admin" });
}

export function createPassType(body: PassTypeCreate) {
  return apiFetch<PassType>("/api/admin/pass-types", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export function updatePassType(id: number, body: PassTypeUpdate) {
  return apiFetch<PassType>(`/api/admin/pass-types/${id}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export function deletePassType(id: number) {
  return apiFetch<void>(`/api/admin/pass-types/${id}`, {
    method: "DELETE",
    auth: "admin",
  });
}

export function listPassContents() {
  return apiFetch<PassContent[]>("/api/admin/pass-contents", { auth: "admin" });
}

export function createPassContent(label: string) {
  return apiFetch<PassContent>("/api/admin/pass-contents", {
    method: "POST",
    auth: "admin",
    body: { label },
  });
}

export function deletePassContent(id: number) {
  return apiFetch<void>(`/api/admin/pass-contents/${id}`, {
    method: "DELETE",
    auth: "admin",
  });
}

export type PartnerLevel = {
  id: number;
  name: string;
  price: number;
  benefits: string | null;
  sort_order: number;
  created_at: string;
};

export type PartnerLevelCreate = {
  name: string;
  price: number;
  benefits?: string;
  sort_order?: number;
};

export type PartnerLevelUpdate = {
  name?: string;
  price?: number;
  benefits?: string;
  sort_order?: number;
};

export function listPartnerLevelsAdmin() {
  return apiFetch<PartnerLevel[]>("/api/admin/partner-levels", { auth: "admin" });
}

export function createPartnerLevel(body: PartnerLevelCreate) {
  return apiFetch<PartnerLevel>("/api/admin/partner-levels", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export function updatePartnerLevel(id: number, body: PartnerLevelUpdate) {
  return apiFetch<PartnerLevel>(`/api/admin/partner-levels/${id}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export function deletePartnerLevel(id: number) {
  return apiFetch<void>(`/api/admin/partner-levels/${id}`, {
    method: "DELETE",
    auth: "admin",
  });
}

export type PromoCode = {
  id: number;
  code: string;
  discount_pct: number;
  discount_fixed: number | null;
  usage_limit: number | null;
  usage_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
};

export type PromoCodeCreate = {
  code: string;
  discount_pct?: number;
  discount_fixed?: number;
  usage_limit?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
};

export type PromoCodeUpdate = {
  discount_pct?: number;
  discount_fixed?: number;
  usage_limit?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
};

export function listPromoCodes() {
  return apiFetch<PromoCode[]>("/api/admin/promo-codes", { auth: "admin" });
}

export function createPromoCode(body: PromoCodeCreate) {
  return apiFetch<PromoCode>("/api/admin/promo-codes", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export function updatePromoCode(id: number, body: PromoCodeUpdate) {
  return apiFetch<PromoCode>(`/api/admin/promo-codes/${id}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export type EventSettings = {
  id: number;
  name: string;
  venue: string;
  year: number | null;
  updated_at: string;
};

export type EventSettingsUpdate = {
  name?: string;
  venue?: string;
  year?: number | null;
};

export function getEventSettings() {
  return apiFetch<EventSettings>("/api/admin/event-settings", { auth: "admin" });
}

export function updateEventSettings(body: EventSettingsUpdate) {
  return apiFetch<EventSettings>("/api/admin/event-settings", {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export type Day = {
  id: number;
  date: string;
  label: string;
  created_at: string;
};

export type DayCreate = {
  date: string;
  label: string;
};

export type DayUpdate = {
  date?: string;
  label?: string;
};

export function listDays() {
  return apiFetch<Day[]>("/api/admin/days", { auth: "admin" });
}

export function createDay(body: DayCreate) {
  return apiFetch<Day>("/api/admin/days", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export function updateDay(id: number, body: DayUpdate) {
  return apiFetch<Day>(`/api/admin/days/${id}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export function deleteDay(id: number) {
  return apiFetch<void>(`/api/admin/days/${id}`, {
    method: "DELETE",
    auth: "admin",
  });
}

export type SessionCategory =
  | "panel"
  | "workshop"
  | "competition"
  | "keynote"
  | "lightning_talk"
  | "fireside_chat"
  | "b2b"
  | "job_fair"
  | "networking"
  | "after_party";

export type Session = {
  id: number;
  day_id: number;
  title: string;
  description: string | null;
  category: string;
  start_time: string;
  end_time: string;
  room: string | null;
  speaker_id: number | null;
  is_public: boolean;
  created_at: string;
};

export type SessionFilters = {
  day_id?: number;
  category?: string;
};

export type SessionCreate = {
  day_id: number;
  title: string;
  description?: string;
  category: string;
  start_time: string;
  end_time: string;
  room?: string;
  speaker_id?: number;
  is_public?: boolean;
};

export type SessionUpdate = {
  day_id?: number;
  title?: string;
  description?: string;
  category?: string;
  start_time?: string;
  end_time?: string;
  room?: string;
  speaker_id?: number;
  is_public?: boolean;
};

export function listSessions(filters: SessionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.day_id !== undefined) params.set("day_id", String(filters.day_id));
  if (filters.category) params.set("category", filters.category);
  const query = params.toString();
  return apiFetch<Session[]>(`/api/admin/sessions${query ? `?${query}` : ""}`, {
    auth: "admin",
  });
}

export function createSession(body: SessionCreate) {
  return apiFetch<Session>("/api/admin/sessions", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export function updateSession(id: number, body: SessionUpdate) {
  return apiFetch<Session>(`/api/admin/sessions/${id}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export function deleteSession(id: number) {
  return apiFetch<void>(`/api/admin/sessions/${id}`, {
    method: "DELETE",
    auth: "admin",
  });
}

export type FaqCategory = {
  id: number;
  name: string;
};

export type FaqCategoryCreate = { name: string };
export type FaqCategoryUpdate = { name?: string };

export function listFaqCategories() {
  return apiFetch<FaqCategory[]>("/api/admin/faq-categories", { auth: "admin" });
}

export function createFaqCategory(body: FaqCategoryCreate) {
  return apiFetch<FaqCategory>("/api/admin/faq-categories", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export function updateFaqCategory(id: number, body: FaqCategoryUpdate) {
  return apiFetch<FaqCategory>(`/api/admin/faq-categories/${id}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export function deleteFaqCategory(id: number) {
  return apiFetch<void>(`/api/admin/faq-categories/${id}`, {
    method: "DELETE",
    auth: "admin",
  });
}

export type Faq = {
  id: number;
  category_id: number;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
};

export type FaqFilters = { category_id?: number };

export type FaqCreate = {
  category_id: number;
  question: string;
  answer: string;
  sort_order?: number;
};

export type FaqUpdate = {
  category_id?: number;
  question?: string;
  answer?: string;
  sort_order?: number;
};

export function listFaqs(filters: FaqFilters = {}) {
  const params = new URLSearchParams();
  if (filters.category_id !== undefined) params.set("category_id", String(filters.category_id));
  const query = params.toString();
  return apiFetch<Faq[]>(`/api/admin/faqs${query ? `?${query}` : ""}`, { auth: "admin" });
}

export function createFaq(body: FaqCreate) {
  return apiFetch<Faq>("/api/admin/faqs", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export function updateFaq(id: number, body: FaqUpdate) {
  return apiFetch<Faq>(`/api/admin/faqs/${id}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export function deleteFaq(id: number) {
  return apiFetch<void>(`/api/admin/faqs/${id}`, {
    method: "DELETE",
    auth: "admin",
  });
}

export type Waitlist = {
  id: number;
  email: string;
  notified: boolean;
  registered: boolean;
  created_at: string;
};

export type WaitlistFilters = {
  limit?: number;
  offset?: number;
  notified?: boolean;
  registered?: boolean;
};

export function listWaitlist({ limit = 50, offset = 0, notified, registered }: WaitlistFilters = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  if (notified !== undefined) params.set("notified", String(notified));
  if (registered !== undefined) params.set("registered", String(registered));
  return apiFetch<Waitlist[]>(`/api/admin/waitlist?${params.toString()}`, {
    auth: "admin",
  });
}

export type AdminUserStatus = "active" | "disabled" | "archived";

export type AdminUserAccount = {
  id: number;
  email: string;
  role_id: number;
  role_name: string;
  status: AdminUserStatus;
  last_login: string | null;
  created_at: string;
};

export type AdminUserFilters = {
  limit?: number;
  offset?: number;
};

export function listAdminUsers({ limit = 50, offset = 0 }: AdminUserFilters = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  return apiFetch<AdminUserAccount[]>(`/api/admin/users?${params.toString()}`, {
    auth: "admin",
  });
}

export type AdminUserCreate = {
  email: string;
  password: string;
  role_id: number;
};

export function createAdminUser(body: AdminUserCreate) {
  return apiFetch<AdminUserAccount>("/api/admin/users", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export type AdminUserUpdate = {
  email?: string;
  role_id?: number;
  status?: AdminUserStatus;
  password?: string;
};

export function updateAdminUser(id: number, body: AdminUserUpdate) {
  return apiFetch<AdminUserAccount>(`/api/admin/users/${id}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export function exportRegistrationsCsv() {
  return apiDownload("/api/admin/export/registrations", "admin", "registrations.csv");
}

export function exportPaymentsCsv() {
  return apiDownload("/api/admin/export/payments", "admin", "payments.csv");
}

export type HackathonTeamMember = {
  id: number;
  team_id: number;
  full_name: string;
  study_level: string;
  specialty: string;
  photo_url: string | null;
  created_at: string;
};

export type HackathonTeam = {
  id: number;
  university_name: string;
  name: string;
  project_name: string;
  project_description: string;
  created_at: string;
  members: HackathonTeamMember[];
};

export type HackathonTeamCreate = {
  university_name: string;
  name: string;
  project_name: string;
  project_description: string;
};

export type HackathonTeamUpdate = Partial<HackathonTeamCreate>;

export function listHackathonTeams() {
  return apiFetch<HackathonTeam[]>("/api/admin/hackathon/teams", { auth: "admin" });
}

export function createHackathonTeam(body: HackathonTeamCreate) {
  return apiFetch<HackathonTeam>("/api/admin/hackathon/teams", {
    method: "POST",
    auth: "admin",
    body,
  });
}

export function updateHackathonTeam(id: number, body: HackathonTeamUpdate) {
  return apiFetch<HackathonTeam>(`/api/admin/hackathon/teams/${id}`, {
    method: "PATCH",
    auth: "admin",
    body,
  });
}

export function deleteHackathonTeam(id: number) {
  return apiFetch<void>(`/api/admin/hackathon/teams/${id}`, {
    method: "DELETE",
    auth: "admin",
  });
}

export type HackathonTeamMemberFields = {
  full_name: string;
  study_level: string;
  specialty: string;
};

export function createHackathonTeamMember(
  teamId: number,
  fields: HackathonTeamMemberFields,
  photo: File | null,
) {
  const formData = new FormData();
  formData.set("full_name", fields.full_name);
  formData.set("study_level", fields.study_level);
  formData.set("specialty", fields.specialty);
  if (photo) formData.set("photo", photo);
  return apiFetchForm<HackathonTeamMember>(
    `/api/admin/hackathon/teams/${teamId}/members`,
    formData,
    { auth: "admin" },
  );
}

export function updateHackathonTeamMember(
  teamId: number,
  memberId: number,
  fields: Partial<HackathonTeamMemberFields>,
  photo: File | null,
) {
  const formData = new FormData();
  if (fields.full_name !== undefined) formData.set("full_name", fields.full_name);
  if (fields.study_level !== undefined) formData.set("study_level", fields.study_level);
  if (fields.specialty !== undefined) formData.set("specialty", fields.specialty);
  if (photo) formData.set("photo", photo);
  return apiFetchForm<HackathonTeamMember>(
    `/api/admin/hackathon/teams/${teamId}/members/${memberId}`,
    formData,
    { method: "PATCH", auth: "admin" },
  );
}

export function deleteHackathonTeamMember(teamId: number, memberId: number) {
  return apiFetch<void>(`/api/admin/hackathon/teams/${teamId}/members/${memberId}`, {
    method: "DELETE",
    auth: "admin",
  });
}
