import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Megaphone, Users, Gift } from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { DateGate } from "../components/site/DateGate";
import { FormShell, FormSection, Field, inputCls, textareaCls } from "../components/site/FormShell";
import {
  AMBASSADEUR_PROFILS,
  AMBASSADEUR_FOLLOWERS,
  AMBASSADEUR_REACH,
  AMBASSADEUR_CANAUX,
  AMBASSADEUR_DISPO,
} from "../lib/forms/constants";

export const Route = createFileRoute("/ambassadeur")({
  head: () => ({
    meta: [
      { title: "Programme ambassadeur · Synca Conf 2027" },
      { name: "description", content: "Deviens ambassadeur Synca dans ta ville ou ton université — code promo personnel, badge officiel, accès VIP." },
    ],
  }),
  component: AmbassadeurPage,
});

const OPENS_AT = new Date("2027-03-01T09:00:00+00:00");

const PERKS = [
  { i: <Gift className="w-5 h-5" />, t: "Code promo personnalisé", d: "Jusqu'à -30% pour ta communauté et commissions sur ventes." },
  { i: <Users className="w-5 h-5" />, t: "Badge officiel & accès VIP", d: "Pass Pro offert, dîner ambassadeurs, accès backstage." },
  { i: <Megaphone className="w-5 h-5" />, t: "Kit de communication", d: "Visuels, templates, contenus prêts à partager." },
];

function AmbassadeurPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programme ambassadeur"
        title={<>Représente la <span className="text-primary">Synca Conf</span> dans ta ville.</>}
        description="Étudiants, devs, leaders communauté : aide-nous à faire rayonner la conférence dans ta région et dans ton université."
      />

      <section className="py-20 bg-cream">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-5">
          {PERKS.map((p) => (
            <div key={p.t} className="rounded-3xl bg-white border border-border p-7 shadow-card">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-peach text-primary">{p.i}</div>
              <h3 className="mt-4 font-display font-bold text-xl">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <DateGate opensAt={OPENS_AT} label="Le programme ambassadeur ouvre en mars 2027.">
        <AmbassadeurForm />
      </DateGate>
    </>
  );
}

type Form = {
  nom: string;
  age: string;
  paysVille: string;
  email: string;
  phone: string;
  profil: string;
  etablissement: string;
  linkedin: string;
  reseaux: string;
  followers: string;
  motivation: string;
  mobilisation: string;
  reach: string;
  dejaParticipe: string;
  canaux: string[];
  dispo: string;
  rgpd: boolean;
};

const empty: Form = {
  nom: "", age: "", paysVille: "", email: "", phone: "", profil: "", etablissement: "",
  linkedin: "", reseaux: "", followers: "", motivation: "", mobilisation: "", reach: "",
  dejaParticipe: "", canaux: [], dispo: "", rgpd: false,
};

function countWords(s: string) { return s.trim() ? s.trim().split(/\s+/).length : 0; }

function AmbassadeurForm() {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const toggleCanal = (c: string) => {
    setF((p) => ({ ...p, canaux: p.canaux.includes(c) ? p.canaux.filter((x) => x !== c) : [...p.canaux, c] }));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!f.nom.trim()) e.nom = "Requis";
    if (!f.age || Number(f.age) < 15 || Number(f.age) > 99) e.age = "Âge invalide";
    if (!f.paysVille.trim()) e.paysVille = "Requis";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email invalide";
    if (!/^\+?[0-9 \-]{7,}$/.test(f.phone)) e.phone = "Numéro invalide";
    if (!f.profil) e.profil = "Requis";
    if (!f.motivation.trim()) e.motivation = "Requis";
    else if (countWords(f.motivation) > 150) e.motivation = "150 mots max";
    if (!f.mobilisation.trim()) e.mobilisation = "Requis";
    else if (countWords(f.mobilisation) > 100) e.mobilisation = "100 mots max";
    if (f.canaux.length === 0) e.canaux = "Sélectionne au moins un canal";
    if (!f.dispo) e.dispo = "Requis";
    if (!f.rgpd) e.rgpd = "Consentement requis";
    setErrors(e);
    if (Object.keys(e).length) return toast.error("Merci de corriger les champs.");
    console.log("[AMBASSADEUR]", f);
    toast.success("Candidature envoyée !", { description: "Réponse sous 2 semaines." });
    setF(empty);
  };

  return (
    <FormShell>
      <form onSubmit={submit} noValidate>
        <FormSection title="Identité">
          <Field label="Nom & Prénom" required error={errors.nom} full>
            <input className={inputCls} value={f.nom} onChange={(e) => set("nom", e.target.value)} />
          </Field>
          <Field label="Âge" required error={errors.age}>
            <input type="number" min={15} max={99} className={inputCls} value={f.age} onChange={(e) => set("age", e.target.value)} />
          </Field>
          <Field label="Pays & Ville" required error={errors.paysVille}>
            <input className={inputCls} value={f.paysVille} onChange={(e) => set("paysVille", e.target.value)} placeholder="Sénégal, Dakar" />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Téléphone WhatsApp" required error={errors.phone}>
            <input type="tel" placeholder="+221 77…" className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
        </FormSection>

        <FormSection title="Profil & réseau">
          <Field label="Profil actuel" required error={errors.profil}>
            <select className={inputCls} value={f.profil} onChange={(e) => set("profil", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {AMBASSADEUR_PROFILS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Établissement / Entreprise">
            <input className={inputCls} value={f.etablissement} onChange={(e) => set("etablissement", e.target.value)} />
          </Field>
          <Field label="Profil LinkedIn" hint="URL complète" full>
            <input type="url" className={inputCls} value={f.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/…" />
          </Field>
          <Field label="Comptes réseaux sociaux" hint="Instagram, X, TikTok…" full>
            <input className={inputCls} value={f.reseaux} onChange={(e) => set("reseaux", e.target.value)} placeholder="@handle Instagram, @handle X…" />
          </Field>
          <Field label="Nombre de followers (total estimé)">
            <select className={inputCls} value={f.followers} onChange={(e) => set("followers", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {AMBASSADEUR_FOLLOWERS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </FormSection>

        <FormSection title="Motivation & mobilisation">
          <Field label="Pourquoi veux-tu être ambassadeur Synca ?" required error={errors.motivation} hint={`${countWords(f.motivation)}/150 mots`} full>
            <textarea className={textareaCls} value={f.motivation} onChange={(e) => set("motivation", e.target.value)} />
          </Field>
          <Field label="Comment vas-tu mobiliser ton réseau ?" required error={errors.mobilisation} hint={`${countWords(f.mobilisation)}/100 mots`} full>
            <textarea className={textareaCls} value={f.mobilisation} onChange={(e) => set("mobilisation", e.target.value)} />
          </Field>
          <Field label="Combien de personnes penses-tu pouvoir amener ?">
            <select className={inputCls} value={f.reach} onChange={(e) => set("reach", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {AMBASSADEUR_REACH.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="As-tu déjà participé à un événement Synca ?">
            <div className="flex gap-4 h-10 items-center">
              {["Oui", "Non"].map((v) => (
                <label key={v} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="dejaParticipe" value={v} checked={f.dejaParticipe === v} onChange={(e) => set("dejaParticipe", e.target.value)} className="accent-primary" />
                  {v}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Canaux que tu utilises le plus" required error={errors.canaux} full>
            <div className="flex flex-wrap gap-2 pt-1">
              {AMBASSADEUR_CANAUX.map((c) => {
                const active = f.canaux.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCanal(c)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition ${active ? "bg-primary text-ink border-primary" : "bg-white text-ink border-border hover:border-primary/40"}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Disponibilité pour des actions pré-événement" required error={errors.dispo} full>
            <div className="flex gap-4 h-10 items-center">
              {AMBASSADEUR_DISPO.map((v) => (
                <label key={v} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="dispo" value={v} checked={f.dispo === v} onChange={(e) => set("dispo", e.target.value)} className="accent-primary" />
                  {v}
                </label>
              ))}
            </div>
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
            Envoyer ma candidature
          </button>
        </div>
      </form>
    </FormShell>
  );
}
