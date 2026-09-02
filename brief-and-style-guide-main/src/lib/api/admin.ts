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
