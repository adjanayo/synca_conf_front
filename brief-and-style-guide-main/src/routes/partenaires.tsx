import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { FormShell, FormSection, Field, inputCls, textareaCls } from "../components/site/FormShell";
import { PARTNER_TIERS, PARTNER_SECTEURS, PARTNER_BUDGET, PARTNER_OBJECTIFS, SOURCES } from "../lib/forms/constants";

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Partenaires · Synca Conf 2027" },
      { name: "description", content: "Six niveaux de partenariat pour la Synca Conf 2027 — Title, Platinum, Gold, Silver, Bronze, Média. Avantages détaillés." },
    ],
  }),
  component: PartenairesPage,
});

const TIERS = [
  { name: "Title", price: "10 000 000 F CFA", color: "bg-ink text-white border-ink", featured: true,
    perks: ["Naming officiel de l'événement", "Logo sur tous les supports", "Keynote dédiée 30 min", "Stand premium 36 m²", "20 pass VIP", "Accès dîner gala", "Campagne presse dédiée", "Rapport d'impact post-event"] },
  { name: "Platinum", price: "7 000 000 F CFA", color: "bg-white text-ink border-primary",
    perks: ["Logo top des supports", "Slot panel ou keynote", "Stand 24 m²", "12 pass VIP", "Dîner gala", "Mention presse"] },
  { name: "Gold", price: "5 000 000 F CFA", color: "bg-white text-ink border-border",
    perks: ["Logo supports principaux", "Workshop sponsorisé", "Stand 18 m²", "8 pass Pro", "Accès networking VIP"] },
  { name: "Silver", price: "3 000 000 F CFA", color: "bg-white text-ink border-border",
    perks: ["Logo communication", "Stand 12 m²", "5 pass Pro", "Job Fair recruteur"] },
  { name: "Bronze", price: "1 500 000 F CFA", color: "bg-white text-ink border-border",
    perks: ["Logo site & badges", "Stand 6 m²", "3 pass Pro"] },
  { name: "Partenaire média", price: "Échange visibilité", color: "bg-peach text-ink border-primary/30",
    perks: ["Logo presse", "Accès interviews", "2 pass Presse", "Contenu co-produit"] },
];

function PartenairesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partenaires"
        title={<>Construisez l'avenir tech africain <span className="text-primary">avec nous</span>.</>}
        description="Six niveaux de partenariat pour aligner votre marque sur l'écosystème tech le plus dynamique du continent. Recrutement, visibilité, B2B, impact."
      />

      <section className="py-20 bg-cream">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <article key={t.name} className={`relative rounded-3xl p-7 border-2 flex flex-col ${t.color} ${t.featured ? "shadow-glow" : "shadow-card"}`}>
              {t.featured && <span className="absolute -top-3 left-7 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-primary text-ink">Vedette</span>}
              <div className="font-display font-bold text-2xl">{t.name}</div>
              <div className={`mt-2 text-sm ${t.featured ? "text-white/70" : "text-muted-foreground"}`}>À partir de</div>
              <div className="font-display font-bold text-3xl mt-1">{t.price}</div>
              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <PartnerForm />
    </>
  );
}

type Form = {
  denomination: string;
  secteur: string;
  paysVille: string;
  siteWeb: string;
  contactNom: string;
  contactPoste: string;
  email: string;
  phone: string;
  tier: string;
  budget: string;
  objectifs: string[];
  dejaSponsor: string;
  message: string;
  source: string;
  sourceAutre: string;
  rgpd: boolean;
};
const empty: Form = {
  denomination: "", secteur: "", paysVille: "", siteWeb: "",
  contactNom: "", contactPoste: "", email: "", phone: "",
  tier: "", budget: "", objectifs: [], dejaSponsor: "",
  message: "", source: "", sourceAutre: "", rgpd: false,
};

function PartnerForm() {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const toggleObjectif = (o: string) => {
    setF((p) => ({ ...p, objectifs: p.objectifs.includes(o) ? p.objectifs.filter((x) => x !== o) : [...p.objectifs, o] }));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!f.denomination.trim()) e.denomination = "Requis";
    if (!f.secteur) e.secteur = "Requis";
    if (!f.paysVille.trim()) e.paysVille = "Requis";
    if (!f.contactNom.trim()) e.contactNom = "Requis";
    if (!f.contactPoste.trim()) e.contactPoste = "Requis";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email invalide";
    if (!/^\+?[0-9 \-]{7,}$/.test(f.phone)) e.phone = "Numéro invalide";
    if (!f.tier) e.tier = "Requis";
    if (f.objectifs.length === 0) e.objectifs = "Sélectionne au moins un objectif";
    if (!f.rgpd) e.rgpd = "Consentement requis";
    setErrors(e);
    if (Object.keys(e).length) return toast.error("Merci de corriger les champs.");
    console.log("[PARTENAIRE]", f);
    toast.success("Demande envoyée !", { description: "L'équipe partenariats te recontacte sous 48h." });
    setF(empty);
  };

  return (
    <div id="form" className="bg-background py-4">
      <div className="mx-auto max-w-3xl px-6 pt-10">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Devenir partenaire</div>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl">Parlons de votre projet.</h2>
        </div>
      </div>
      <FormShell>
        <form onSubmit={submit} noValidate>
          <FormSection title="Organisation">
            <Field label="Dénomination sociale" required error={errors.denomination} full>
              <input className={inputCls} value={f.denomination} onChange={(e) => set("denomination", e.target.value)} />
            </Field>
            <Field label="Secteur d'activité" required error={errors.secteur}>
              <select className={inputCls} value={f.secteur} onChange={(e) => set("secteur", e.target.value)}>
                <option value="">— Sélectionner —</option>
                {PARTNER_SECTEURS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Pays & Ville du siège" required error={errors.paysVille}>
              <input className={inputCls} value={f.paysVille} onChange={(e) => set("paysVille", e.target.value)} placeholder="Sénégal, Dakar" />
            </Field>
            <Field label="Site web" full>
              <input type="url" className={inputCls} value={f.siteWeb} onChange={(e) => set("siteWeb", e.target.value)} placeholder="https://…" />
            </Field>
          </FormSection>

          <FormSection title="Contact responsable">
            <Field label="Nom & Prénom du contact" required error={errors.contactNom}>
              <input className={inputCls} value={f.contactNom} onChange={(e) => set("contactNom", e.target.value)} />
            </Field>
            <Field label="Poste / Fonction" required error={errors.contactPoste}>
              <input className={inputCls} value={f.contactPoste} onChange={(e) => set("contactPoste", e.target.value)} />
            </Field>
            <Field label="Email professionnel" required error={errors.email}>
              <input type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Téléphone WhatsApp" required error={errors.phone}>
              <input type="tel" placeholder="+221 77…" className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
          </FormSection>

          <FormSection title="Intérêt de partenariat">
            <Field label="Offre souhaitée" required error={errors.tier}>
              <select className={inputCls} value={f.tier} onChange={(e) => set("tier", e.target.value)}>
                <option value="">— Sélectionner —</option>
                {PARTNER_TIERS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Avez-vous un budget défini ?">
              <select className={inputCls} value={f.budget} onChange={(e) => set("budget", e.target.value)}>
                <option value="">— Sélectionner —</option>
                {PARTNER_BUDGET.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Objectifs prioritaires" required error={errors.objectifs} full>
              <div className="flex flex-wrap gap-2 pt-1">
                {PARTNER_OBJECTIFS.map((o) => {
                  const active = f.objectifs.includes(o);
                  return (
                    <button
                      type="button"
                      key={o}
                      onClick={() => toggleObjectif(o)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${active ? "bg-primary text-ink border-primary" : "bg-white text-ink border-border hover:border-primary/40"}`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Avez-vous déjà sponsorisé un événement tech ?" full>
              <div className="flex gap-4 h-10 items-center">
                {["Oui", "Non"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="dejaSponsor" value={v} checked={f.dejaSponsor === v} onChange={(e) => set("dejaSponsor", e.target.value)} className="accent-primary" />
                    {v}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Message ou demande spécifique" full>
              <textarea className={textareaCls} value={f.message} onChange={(e) => set("message", e.target.value)} placeholder="Vos objectifs, contraintes, questions…" />
            </Field>
            <Field label="Comment avez-vous entendu parler de Synca ?">
              <select className={inputCls} value={f.source} onChange={(e) => set("source", e.target.value)}>
                <option value="">— Sélectionner —</option>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Précisez (optionnel)">
              <input className={inputCls} value={f.sourceAutre} onChange={(e) => set("sourceAutre", e.target.value)} />
            </Field>
            <label className="flex items-start gap-3 md:col-span-2">
              <input type="checkbox" checked={f.rgpd} onChange={(e) => set("rgpd", e.target.checked)} className="mt-1 accent-primary" />
              <span className={`text-sm ${errors.rgpd ? "text-destructive" : ""}`}>
                J'accepte le traitement de mes données conformément à la politique RGPD et j'autorise Synca à me recontacter à des fins commerciales. <span className="text-primary">*</span>
              </span>
            </label>
          </FormSection>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-3.5 hover:brightness-110 transition shadow-glow">
              Envoyer ma demande
            </button>
          </div>
        </form>
      </FormShell>
    </div>
  );
}

