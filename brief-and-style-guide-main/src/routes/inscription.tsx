import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../components/site/PageHeader";
import { DateGate } from "../components/site/DateGate";
import { FormShell, FormSection, Field, inputCls, textareaCls } from "../components/site/FormShell";
import {
  COUNTRIES, SECTEURS, NIVEAUX, PROFILS, PASS, GENRES, SOURCES,
} from "../lib/forms/constants";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Inscription · Synca Conf 2027" },
      { name: "description", content: "Réservez votre place à la Synca Conf 2027 à Dakar — pass Étudiant, Pro, Startup, Diaspora, VIP ou Online." },
    ],
  }),
  component: InscriptionPage,
});

const OPENS_AT = new Date("2026-07-01T00:00:00+00:00");

function InscriptionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Inscription participant"
        title={<>Rejoins la Synca Conf <span className="text-primary">2027</span>.</>}
        description="Remplis le formulaire d'inscription pour réserver ton pass. Tu recevras un email de confirmation avec ton billet."
      />
      <DateGate opensAt={OPENS_AT} label="Les inscriptions participants ouvrent en mars 2027.">
        <InscriptionForm />
      </DateGate>
    </>
  );
}

type Form = {
  nom: string; prenom: string; genre: string; email: string; phone: string;
  pays: string; ville: string; profils: string[]; secteur: string; niveau: string;
  pass: string; source: string; sourceAutre: string; promo: string; linkedin: string;
  besoins: string; rgpd: boolean; opt: boolean;
};

const empty: Form = {
  nom: "", prenom: "", genre: "", email: "", phone: "", pays: "", ville: "",
  profils: [], secteur: "", niveau: "", pass: "", source: "", sourceAutre: "",
  promo: "", linkedin: "", besoins: "", rgpd: false, opt: false,
};

function InscriptionForm() {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.nom.trim()) e.nom = "Requis";
    if (!f.prenom.trim()) e.prenom = "Requis";
    if (!f.genre) e.genre = "Requis";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email invalide";
    if (!/^\+?[0-9 \-]{7,}$/.test(f.phone)) e.phone = "Numéro avec indicatif (ex : +221 77 000 00 00)";
    if (!f.pays) e.pays = "Requis";
    if (!f.ville.trim()) e.ville = "Requis";
    if (f.profils.length === 0) e.profils = "Choisis au moins un profil";
    if (!f.secteur) e.secteur = "Requis";
    if (!f.niveau) e.niveau = "Requis";
    if (!f.pass) e.pass = "Requis";
    if (!f.rgpd) e.rgpd = "Tu dois accepter la politique RGPD";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Merci de corriger les champs en erreur.");
      return;
    }
    console.log("[INSCRIPTION]", f);
    toast.success("Inscription envoyée !", { description: "Un email de confirmation t'a été envoyé." });
    setF(empty);
  };

  const toggleProfil = (p: string) =>
    set("profils", f.profils.includes(p) ? f.profils.filter((x) => x !== p) : [...f.profils, p]);

  return (
    <FormShell>
      <form onSubmit={onSubmit} noValidate>
        <FormSection title="Identité">
          <Field label="Nom de famille" required error={errors.nom}>
            <input className={inputCls} value={f.nom} onChange={(e) => set("nom", e.target.value)} />
          </Field>
          <Field label="Prénom(s)" required error={errors.prenom}>
            <input className={inputCls} value={f.prenom} onChange={(e) => set("prenom", e.target.value)} />
          </Field>
          <Field label="Genre" required error={errors.genre}>
            <select className={inputCls} value={f.genre} onChange={(e) => set("genre", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {GENRES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Email" required error={errors.email} hint="Tu recevras un lien de confirmation">
            <input type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Téléphone WhatsApp" required error={errors.phone} hint="Avec indicatif pays" full>
            <input type="tel" placeholder="+221 77 000 00 00" className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
        </FormSection>

        <FormSection title="Localisation">
          <Field label="Pays de résidence" required error={errors.pays}>
            <select className={inputCls} value={f.pays} onChange={(e) => set("pays", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Ville" required error={errors.ville}>
            <input className={inputCls} value={f.ville} onChange={(e) => set("ville", e.target.value)} />
          </Field>
        </FormSection>

        <FormSection title="Profil professionnel">
          <Field label="Profil (plusieurs choix possibles)" required error={errors.profils} full>
            <div className="flex flex-wrap gap-2 mt-1">
              {PROFILS.map((p) => {
                const on = f.profils.includes(p);
                return (
                  <button type="button" key={p} onClick={() => toggleProfil(p)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      on ? "bg-ink text-white border-ink" : "bg-white text-ink border-border hover:border-primary"
                    }`}>
                    {p}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Secteur d'activité" required error={errors.secteur}>
            <select className={inputCls} value={f.secteur} onChange={(e) => set("secteur", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {SECTEURS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Niveau d'expérience" required error={errors.niveau}>
            <select className={inputCls} value={f.niveau} onChange={(e) => set("niveau", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {NIVEAUX.map((n) => <option key={n}>{n}</option>)}
            </select>
          </Field>
        </FormSection>

        <FormSection title="Ton pass">
          <Field label="Type de pass choisi" required error={errors.pass} full>
            <div className="grid sm:grid-cols-2 gap-2">
              {PASS.map((p) => (
                <label key={p} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                  f.pass === p ? "border-primary bg-peach" : "border-border hover:border-primary/60"
                }`}>
                  <input type="radio" name="pass" value={p} checked={f.pass === p} onChange={() => set("pass", p)} className="accent-primary" />
                  <span className="text-sm font-medium">{p}</span>
                </label>
              ))}
            </div>
          </Field>
        </FormSection>

        <FormSection title="Comment nous as-tu connus ?">
          <Field label="Source" hint="Optionnel">
            <select className={inputCls} value={f.source} onChange={(e) => set("source", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          {f.source === "Autre" && (
            <Field label="Précise">
              <input className={inputCls} value={f.sourceAutre} onChange={(e) => set("sourceAutre", e.target.value)} />
            </Field>
          )}
          <Field label="Code promo">
            <input className={inputCls} value={f.promo} onChange={(e) => set("promo", e.target.value)} />
          </Field>
          <Field label="LinkedIn / Portfolio" hint="URL">
            <input type="url" placeholder="https://" className={inputCls} value={f.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
          </Field>
          <Field label="Besoins spéciaux" hint="Accessibilité, allergies, régime alimentaire…" full>
            <textarea className={textareaCls} value={f.besoins} onChange={(e) => set("besoins", e.target.value)} />
          </Field>
        </FormSection>

        <FormSection title="Consentements">
          <label className={`flex items-start gap-3 md:col-span-2 ${errors.rgpd ? "text-destructive" : ""}`}>
            <input type="checkbox" checked={f.rgpd} onChange={(e) => set("rgpd", e.target.checked)} className="mt-1 accent-primary" />
            <span className="text-sm">
              J'accepte que mes données soient traitées conformément à la politique RGPD de Synca. <span className="text-primary">*</span>
            </span>
          </label>
          {errors.rgpd && <span className="text-xs text-destructive md:col-span-2 -mt-3">{errors.rgpd}</span>}
          <label className="flex items-start gap-3 md:col-span-2">
            <input type="checkbox" checked={f.opt} onChange={(e) => set("opt", e.target.checked)} className="mt-1 accent-primary" />
            <span className="text-sm text-muted-foreground">
              J'accepte de recevoir les communications de Synca (newsletter, futures éditions).
            </span>
          </label>
        </FormSection>

        <div className="mt-10 flex justify-end">
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-3.5 hover:brightness-110 transition shadow-glow">
            Valider mon inscription
          </button>
        </div>
      </form>
    </FormShell>
  );
}
