import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { FormShell, FormSection, Field, inputCls, textareaCls } from "../components/site/FormShell";
import { CONTACT_SUBJECTS } from "../lib/forms/constants";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · Synca Conf 2027" },
      { name: "description", content: "Contactez l'équipe Synca Conf 2027 — questions générales, billetterie, partenariats, speakers, presse." },
    ],
  }),
  component: ContactPage,
});

const TEAM = [
  { i: <Mail className="w-5 h-5" />, t: "Email général", v: "contact@sync-africa.com" },
  { i: <Mail className="w-5 h-5" />, t: "Partenariats", v: "partenariats@sync-africa.com" },
  { i: <Mail className="w-5 h-5" />, t: "Speakers", v: "speakers@sync-africa.com" },
  { i: <Phone className="w-5 h-5" />, t: "WhatsApp", v: "+221 77 000 00 00" },
  { i: <MapPin className="w-5 h-5" />, t: "Adresse", v: "Dakar, Sénégal" },
];

type Form = { nom: string; email: string; sujet: string; message: string; rgpd: boolean };
const empty: Form = { nom: "", email: "", sujet: "", message: "", rgpd: false };

function ContactPage() {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!f.nom.trim()) e.nom = "Requis";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email invalide";
    if (!f.sujet) e.sujet = "Requis";
    if (!f.message.trim()) e.message = "Requis";
    if (!f.rgpd) e.rgpd = "Consentement requis";
    setErrors(e);
    if (Object.keys(e).length) return toast.error("Merci de corriger les champs.");
    console.log("[CONTACT]", f);
    toast.success("Message envoyé !", { description: "Réponse sous 48h." });
    setF(empty);
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Parlons <span className="text-primary">ensemble</span>.</>}
        description="Une question, un projet, une suggestion ? Écris-nous, l'équipe Synca te répond sous 48h."
      />

      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-3 gap-4">
          {TEAM.map((c) => (
            <div key={c.t} className="rounded-2xl bg-white border border-border p-5 shadow-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-peach text-primary">{c.i}</div>
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{c.t}</div>
              <div className="mt-1 font-semibold text-foreground">{c.v}</div>
            </div>
          ))}
        </div>
      </section>

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
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-3.5 hover:brightness-110 transition shadow-glow">
              Envoyer
            </button>
          </div>
        </form>
      </FormShell>
    </>
  );
}
