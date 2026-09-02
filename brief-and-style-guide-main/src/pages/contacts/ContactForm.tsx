import { FormShell, FormSection, Field, inputCls, textareaCls } from "../../components/site/FormShell";
import { CONTACT_SUBJECTS } from "../../lib/forms/constants";
import { useState } from "react";
import { toast } from "sonner";
import { sendContactMessage } from "../../lib/api/contact";
import { ApiError } from "../../lib/api/client";



type Form = { nom: string; email: string; sujet: string; message: string; rgpd: boolean };
const empty: Form = { nom: "", email: "", sujet: "", message: "", rgpd: false };

export function ContactForm() {

      const [f, setF] = useState<Form>(empty);
      const [errors, setErrors] = useState<Record<string, string>>({});
      const [submitting, setSubmitting] = useState(false);
      const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

      const submit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        const e: Record<string, string> = {};
        if (!f.nom.trim()) e.nom = "Requis";
        if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email invalide";
        if (!f.sujet) e.sujet = "Requis";
        if (!f.message.trim()) e.message = "Requis";
        if (!f.rgpd) e.rgpd = "Consentement requis";
        setErrors(e);
        if (Object.keys(e).length) return toast.error("Merci de corriger les champs.");

        setSubmitting(true);
        try {
          await sendContactMessage({
            name: f.nom,
            email: f.email,
            subject: f.sujet,
            message: f.message,
          });
          toast.success("Message envoyé !", { description: "Réponse sous 48h." });
          setF(empty);
        } catch (error) {
          toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
        } finally {
          setSubmitting(false);
        }
      };


      return (

        <FormShell>
        <form onSubmit={submit} noValidate>
          <FormSection title="Ton message">
            <Field label="Nom" required error={errors.nom}>
              <input className={inputCls} value={f.nom} onChange={(e) => set("nom", e.target.value)} />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Sujet" required error={errors.sujet} full>
              <select className={inputCls} value={f.sujet} onChange={(e) => set("sujet", e.target.value)}>
                <option value="">— Sélectionner —</option>
                {CONTACT_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Message" required error={errors.message} full>
              <textarea className={textareaCls} value={f.message} onChange={(e) => set("message", e.target.value)} />
            </Field>
            <label className="flex items-start gap-3 md:col-span-2">
              <input type="checkbox" checked={f.rgpd} onChange={(e) => set("rgpd", e.target.checked)} className="mt-1 accent-primary" />
              <span className={`text-sm ${errors.rgpd ? "text-destructive" : ""}`}>
                J'accepte le traitement de mes données conformément à la politique RGPD. <span className="text-primary">*</span>
              </span>
            </label>
          </FormSection>
          <div className="mt-8 flex justify-end">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-3.5 hover:brightness-110 transition shadow-glow disabled:opacity-60">
              {submitting ? "Envoi…" : "Envoyer"}
            </button>
          </div>
        </form>
      </FormShell>
      );
}