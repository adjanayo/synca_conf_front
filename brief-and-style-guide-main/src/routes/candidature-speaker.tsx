import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../components/site/PageHeader";
import { DateGate } from "../components/site/DateGate";
import { FormShell, FormSection, Field, inputCls, textareaCls } from "../components/site/FormShell";
import {
  COUNTRIES, SPEAKER_FORMATS, SPEAKER_THEMES, SPEAKER_AUDIENCE,
  SPEAKER_LANGUES, SPEAKER_DISPO, SPEAKER_DIFFUSION,
} from "../lib/forms/constants";

export const Route = createFileRoute("/candidature-speaker")({
  head: () => ({
    meta: [
      { title: "Candidature speaker · Synca Conf 2027" },
      { name: "description", content: "Postulez pour intervenir à la Synca Conf 2027 à Dakar. Keynote, panel, workshop, lightning talk ou fireside chat." },
    ],
  }),
  component: SpeakerPage,
});

const OPENS_AT = new Date("2027-03-01T09:00:00+00:00");

function SpeakerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Candidature speaker"
        title={<>Partage ton expertise sur scène <span className="text-primary">à Dakar</span>.</>}
        description="Candidature ouverte dès mars 2027 — formats keynote, panel, workshop, lightning talk ou fireside chat. Sélection sur dossier."
      />
      <DateGate opensAt={OPENS_AT} label="Les candidatures speakers ouvrent en mars 2027.">
        <SpeakerForm />
      </DateGate>
    </>
  );
}

type Form = {
  nom: string; titre: string; entreprise: string; pays: string; email: string;
  phone: string; linkedin: string; site: string; photo: File | null;
  format: string; titreIntervention: string; thematique: string; resume: string;
  audience: string; langue: string; experiences: string; videoUrl: string;
  dispo: string; villeDepart: string; hebergement: string; motivation: string;
  diffusion: string; rgpd: boolean;
};

const empty: Form = {
  nom: "", titre: "", entreprise: "", pays: "", email: "", phone: "",
  linkedin: "", site: "", photo: null, format: "", titreIntervention: "",
  thematique: "", resume: "", audience: "", langue: "", experiences: "",
  videoUrl: "", dispo: "", villeDepart: "", hebergement: "", motivation: "",
  diffusion: "", rgpd: false,
};

function countWords(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function SpeakerForm() {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!f.nom.trim()) e.nom = "Requis";
    if (!f.titre.trim()) e.titre = "Requis";
    if (!f.entreprise.trim()) e.entreprise = "Requis";
    if (!f.pays) e.pays = "Requis";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email invalide";
    if (!/^\+?[0-9 \-]{7,}$/.test(f.phone)) e.phone = "Numéro invalide";
    if (!/^https?:\/\//.test(f.linkedin)) e.linkedin = "URL LinkedIn requise";
    if (!f.photo) e.photo = "Photo HD requise";
    else if (f.photo.size < 1024 * 1024) e.photo = "Minimum 1 MB";
    if (!f.format) e.format = "Requis";
    if (!f.titreIntervention.trim()) e.titreIntervention = "Requis";
    else if (f.titreIntervention.length > 100) e.titreIntervention = "Max 100 caractères";
    if (!f.thematique) e.thematique = "Requis";
    if (!f.resume.trim()) e.resume = "Requis";
    else if (countWords(f.resume) > 200) e.resume = "Max 200 mots";
    if (!f.audience) e.audience = "Requis";
    if (!f.langue) e.langue = "Requis";
    if (!f.dispo) e.dispo = "Requis";
    if (!f.motivation.trim()) e.motivation = "Requis";
    else if (countWords(f.motivation) > 150) e.motivation = "Max 150 mots";
    if (!f.diffusion) e.diffusion = "Requis";
    if (!f.rgpd) e.rgpd = "Consentement requis";
    setErrors(e);
    if (Object.keys(e).length) return toast.error("Merci de corriger les champs en erreur.");
    console.log("[SPEAKER]", { ...f, photo: f.photo?.name });
    toast.success("Candidature envoyée !", { description: "Tu recevras une réponse sous 4 semaines." });
  };

  return (
    <FormShell>
      <form onSubmit={submit} noValidate>
        <FormSection title="Identité">
          <Field label="Nom & prénom" required error={errors.nom} full>
            <input className={inputCls} value={f.nom} onChange={(e) => set("nom", e.target.value)} />
          </Field>
          <Field label="Titre / poste actuel" required error={errors.titre}>
            <input className={inputCls} value={f.titre} onChange={(e) => set("titre", e.target.value)} />
          </Field>
          <Field label="Entreprise / organisation" required error={errors.entreprise}>
            <input className={inputCls} value={f.entreprise} onChange={(e) => set("entreprise", e.target.value)} />
          </Field>
          <Field label="Pays de résidence" required error={errors.pays}>
            <select className={inputCls} value={f.pays} onChange={(e) => set("pays", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Email professionnel" required error={errors.email}>
            <input type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Téléphone WhatsApp" required error={errors.phone}>
            <input type="tel" placeholder="+221 77 000 00 00" className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Profil LinkedIn" required error={errors.linkedin}>
            <input type="url" placeholder="https://linkedin.com/in/…" className={inputCls} value={f.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
          </Field>
          <Field label="Site web / portfolio">
            <input type="url" placeholder="https://" className={inputCls} value={f.site} onChange={(e) => set("site", e.target.value)} />
          </Field>
          <Field label="Photo professionnelle HD" required error={errors.photo} hint="JPG/PNG, min 1 MB, fond neutre" full>
            <input type="file" accept="image/jpeg,image/png" onChange={(e) => set("photo", e.target.files?.[0] ?? null)} className="text-sm" />
          </Field>
        </FormSection>

        <FormSection title="Votre intervention">
          <Field label="Format souhaité" required error={errors.format}>
            <select className={inputCls} value={f.format} onChange={(e) => set("format", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {SPEAKER_FORMATS.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Thématique principale" required error={errors.thematique}>
            <select className={inputCls} value={f.thematique} onChange={(e) => set("thematique", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {SPEAKER_THEMES.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Titre provisoire" required error={errors.titreIntervention} hint={`${f.titreIntervention.length}/100`} full>
            <input className={inputCls} maxLength={100} value={f.titreIntervention} onChange={(e) => set("titreIntervention", e.target.value)} />
          </Field>
          <Field label="Résumé de l'intervention" required error={errors.resume} hint={`${countWords(f.resume)}/200 mots`} full>
            <textarea className={textareaCls} value={f.resume} onChange={(e) => set("resume", e.target.value)} />
          </Field>
          <Field label="Niveau d'audience ciblée" required error={errors.audience}>
            <select className={inputCls} value={f.audience} onChange={(e) => set("audience", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {SPEAKER_AUDIENCE.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Langue d'intervention" required error={errors.langue}>
            <select className={inputCls} value={f.langue} onChange={(e) => set("langue", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {SPEAKER_LANGUES.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Expériences speaker passées" hint="Événement · Année · Audience" full>
            <textarea className={textareaCls} value={f.experiences} onChange={(e) => set("experiences", e.target.value)} />
          </Field>
          <Field label="Lien vidéo d'une intervention" hint="YouTube, Vimeo, Drive…" full>
            <input type="url" placeholder="https://" className={inputCls} value={f.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} />
          </Field>
        </FormSection>

        <FormSection title="Logistique & motivation">
          <Field label="Disponibilité 18–20 août 2027" required error={errors.dispo}>
            <select className={inputCls} value={f.dispo} onChange={(e) => set("dispo", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {SPEAKER_DISPO.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Ville de départ (si déplacement)">
            <input className={inputCls} value={f.villeDepart} onChange={(e) => set("villeDepart", e.target.value)} />
          </Field>
          <Field label="Besoin d'hébergement ?">
            <div className="flex gap-4 mt-2">
              {["Oui", "Non"].map((v) => (
                <label key={v} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="heb" checked={f.hebergement === v} onChange={() => set("hebergement", v)} className="accent-primary" /> {v}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Pourquoi intervenir à Synca Conf ?" required error={errors.motivation} hint={`${countWords(f.motivation)}/150 mots`} full>
            <textarea className={textareaCls} value={f.motivation} onChange={(e) => set("motivation", e.target.value)} />
          </Field>
          <Field label="Accord diffusion vidéo" required error={errors.diffusion} full>
            <select className={inputCls} value={f.diffusion} onChange={(e) => set("diffusion", e.target.value)}>
              <option value="">— Sélectionner —</option>
              {SPEAKER_DIFFUSION.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <label className="flex items-start gap-3 md:col-span-2">
            <input type="checkbox" checked={f.rgpd} onChange={(e) => set("rgpd", e.target.checked)} className="mt-1 accent-primary" />
            <span className={`text-sm ${errors.rgpd ? "text-destructive" : ""}`}>
              J'accepte le traitement de mes données conformément à la politique RGPD. <span className="text-primary">*</span>
            </span>
          </label>
        </FormSection>

        <div className="mt-10 flex justify-end">
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-3.5 hover:brightness-110 transition shadow-glow">
            Envoyer ma candidature
          </button>
        </div>
      </form>
    </FormShell>
  );
}
