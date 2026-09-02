import { apiFetch } from "./client";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactResponse = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

// Le back exige `captcha` (ContactCreate) mais ne vérifie rien tant que
// RECAPTCHA_SECRET_KEY n'est pas configuré côté serveur (services/recaptcha.py) --
// aucun widget reCAPTCHA n'est intégré côté front pour l'instant.
export function sendContactMessage(payload: ContactPayload) {
  return apiFetch<ContactResponse>("/api/contact", {
    method: "POST",
    body: { ...payload, captcha: "" },
  });
}
