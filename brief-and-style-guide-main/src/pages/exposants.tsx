import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { FormShell, FormSection, Field, inputCls, textareaCls } from "../components/site/FormShell";
import { CampaignWindowGate } from "@/components/site/CampaignWindowGate";

import {
  COUNTRIES,
  PARTNER_SECTEURS,
  EXHIBITOR_STAND_TYPES,
  EXHIBITOR_PAYMENT_METHODS,
  EXHIBITOR_EQUIPMENT,
  EXHIBITOR_ACTIVITIES,
} from "../lib/forms/constants";
import { applyAsExhibitor } from "../lib/api/applications";
import { ApiError } from "../lib/api/client";

type Form = {
  denomination: string;
  secteur: string;
  pays: string;
  ville: string;
  siteWeb: string;
  contactNom: string;
  contactPoste: string;
  email: string;
  phone: string;
  standType: string;
  repsCount: string;
  produits: string;
  equipements: string[];
  activites: string[];
  visuel: File | null;
  paiement: string;
  reglement: boolean;
  rgpd: boolean;
};

const empty: Form = {
  denomination: "",
  secteur: "",
  pays: "",
  ville: "",
  siteWeb: "",
  contactNom: "",
  contactPoste: "",
  email: "",
  phone: "",
  standType: "",
  repsCount: "",
  produits: "",
  equipements: [],
  activites: [],
  visuel: null,
  paiement: "",
  reglement: false,
  rgpd: false,
};

export function ExposantsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Exposants"
        title={
          <>
            Présentez vos produits <span className="text-primary">à l'écosystème tech</span>.
          </>
        }
        description="Réservez votre stand à Synca Conf et rencontrez en direct entreprises, talents et décideurs de la tech africaine."
      />

      <CampaignWindowGate windowKey="call_for_exhibitor" label="Les candidatures exposants">
        <ExhibitorForm />
      </CampaignWindowGate>
    </>
  );
}

function ExhibitorForm() {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const toggle = (list: "equipements" | "activites", v: string) => {
    setF((p) => ({
      ...p,
      [list]: p[list].includes(v) ? p[list].filter((x) => x !== v) : [...p[list], v],
    }));
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const e: Record<string, string> = {};

    if (!f.denomination.trim()) e.denomination = "Requis";
    if (!f.secteur) e.secteur = "Requis";
    if (!f.pays) e.pays = "Requis";
    if (!f.ville.trim()) e.ville = "Requis";
    if (!f.contactNom.trim()) e.contactNom = "Requis";
    if (!f.contactPoste.trim()) e.contactPoste = "Requis";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email invalide";
    if (!/^\+?[0-9 -]{7,}$/.test(f.phone)) e.phone = "Numéro invalide";
    if (!f.standType) e.standType = "Requis";

    const reps = Number(f.repsCount);
    if (!f.repsCount || !Number.isInteger(reps) || reps < 1) {
      e.repsCount = "Nombre requis (≥ 1)";
    }

    if (!f.produits.trim()) e.produits = "Requis";
    if (!f.reglement) e.reglement = "À accepter pour continuer";
    if (!f.rgpd) e.rgpd = "Consentement requis";

    setErrors(e);

    if (Object.keys(e).length) {
      toast.error("Merci de corriger les champs.");
      return;
    }

    const fd = new FormData();
    fd.set("organization_name", f.denomination.trim());
    fd.set("sector", f.secteur);
    fd.set("country", f.pays);
    fd.set("city", f.ville.trim());
    if (f.siteWeb.trim()) fd.set("website_url", f.siteWeb.trim());
    fd.set("contact_name", f.contactNom.trim());
    fd.set("contact_position", f.contactPoste.trim());
    fd.set("contact_email", f.email.trim());
    fd.set("contact_phone", f.phone.trim());
    fd.set("stand_type", f.standType);
    fd.set("reps_count", String(reps));
    fd.set("products_services", f.produits.trim());
    for (const eq of f.equipements) fd.append("equipment_needs", eq);
    for (const act of f.activites) fd.append("side_activities", act);
    if (f.paiement) fd.set("payment_method", f.paiement);
    fd.set("rules_accepted", String(f.reglement));
    fd.set("gdpr_consent", String(f.rgpd));
    if (f.visuel) fd.set("visuals", f.visuel);

    setPending(true);
    try {
      await applyAsExhibitor(fd);
      toast.success("Demande envoyée !", {
        description: "L'équipe exposition te recontacte sous 48h.",
      });
      setF(empty);
      setErrors({});
    } catch (err) {
      toast.error(err instanceof ApiError ? err.detail : "Une erreur est survenue.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="bg-background py-4">
      <div className="mx-auto max-w-3xl px-6 pt-10">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Devenir exposant
          </div>

          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl">
            Réservez votre stand.
          </h2>

          <p className="mt-4 text-muted-foreground">
            Remplissez le formulaire et notre équipe exposition reviendra vers vous pour finaliser
            votre présence.
          </p>
        </div>
      </div>

      <FormShell>
        <form onSubmit={submit} noValidate>
          <FormSection title="Organisation">
            <Field label="Dénomination sociale" required error={errors.denomination} full>
              <input
                className={inputCls}
                value={f.denomination}
                onChange={(e) => set("denomination", e.target.value)}
              />
            </Field>

            <Field label="Secteur d'activité" required error={errors.secteur}>
              <select
                className={inputCls}
                value={f.secteur}
                onChange={(e) => set("secteur", e.target.value)}
              >
                <option value="">— Sélectionner —</option>
                {PARTNER_SECTEURS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Pays du siège" required error={errors.pays}>
              <select
                className={inputCls}
                value={f.pays}
                onChange={(e) => set("pays", e.target.value)}
              >
                <option value="">— Sélectionner —</option>
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Ville du siège" required error={errors.ville}>
              <input
                className={inputCls}
                value={f.ville}
                onChange={(e) => set("ville", e.target.value)}
                placeholder="Dakar"
              />
            </Field>

            <Field label="Site web" full>
              <input
                type="url"
                className={inputCls}
                value={f.siteWeb}
                onChange={(e) => set("siteWeb", e.target.value)}
                placeholder="https://…"
              />
            </Field>
          </FormSection>

          <FormSection title="Contact responsable">
            <Field label="Nom & Prénom du contact" required error={errors.contactNom}>
              <input
                className={inputCls}
                value={f.contactNom}
                onChange={(e) => set("contactNom", e.target.value)}
              />
            </Field>

            <Field label="Poste / Fonction" required error={errors.contactPoste}>
              <input
                className={inputCls}
                value={f.contactPoste}
                onChange={(e) => set("contactPoste", e.target.value)}
              />
            </Field>

            <Field label="Email professionnel" required error={errors.email}>
              <input
                type="email"
                className={inputCls}
                value={f.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>

            <Field label="Téléphone WhatsApp" required error={errors.phone}>
              <input
                type="tel"
                placeholder="+221 77…"
                className={inputCls}
                value={f.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
          </FormSection>

          <FormSection title="Stand & besoins">
            <Field label="Type de stand" required error={errors.standType}>
              <select
                className={inputCls}
                value={f.standType}
                onChange={(e) => set("standType", e.target.value)}
              >
                <option value="">— Sélectionner —</option>
                {EXHIBITOR_STAND_TYPES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Nombre de représentants sur place" required error={errors.repsCount}>
              <input
                type="number"
                min={1}
                className={inputCls}
                value={f.repsCount}
                onChange={(e) => set("repsCount", e.target.value)}
              />
            </Field>

            <Field label="Produits / services présentés" required error={errors.produits} full>
              <textarea
                className={textareaCls}
                value={f.produits}
                onChange={(e) => set("produits", e.target.value)}
                placeholder="Ce que vous comptez présenter sur le stand…"
              />
            </Field>

            <Field label="Besoins matériel" full>
              <div className="flex flex-wrap gap-2 pt-1">
                {EXHIBITOR_EQUIPMENT.map((o) => {
                  const active = f.equipements.includes(o);
                  return (
                    <button
                      type="button"
                      key={o}
                      onClick={() => toggle("equipements", o)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                        active
                          ? "bg-primary text-ink border-primary"
                          : "bg-white text-ink border-border hover:border-primary/40"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Animations souhaitées sur le stand" full>
              <div className="flex flex-wrap gap-2 pt-1">
                {EXHIBITOR_ACTIVITIES.map((o) => {
                  const active = f.activites.includes(o);
                  return (
                    <button
                      type="button"
                      key={o}
                      onClick={() => toggle("activites", o)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                        active
                          ? "bg-primary text-ink border-primary"
                          : "bg-white text-ink border-border hover:border-primary/40"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Logo / visuel du stand (optionnel)" full>
              <input
                type="file"
                accept="image/jpeg,image/png"
                className={inputCls}
                onChange={(e) => set("visuel", e.target.files?.[0] ?? null)}
              />
            </Field>

            <Field label="Mode de paiement envisagé">
              <select
                className={inputCls}
                value={f.paiement}
                onChange={(e) => set("paiement", e.target.value)}
              >
                <option value="">— Sélectionner —</option>
                {EXHIBITOR_PAYMENT_METHODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>

            <label className="flex items-start gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={f.reglement}
                onChange={(e) => set("reglement", e.target.checked)}
                className="mt-1 accent-primary"
              />
              <span className={`text-sm ${errors.reglement ? "text-destructive" : ""}`}>
                J'accepte le règlement des exposants Synca Conf.{" "}
                <span className="text-primary">*</span>
              </span>
            </label>

            <label className="flex items-start gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={f.rgpd}
                onChange={(e) => set("rgpd", e.target.checked)}
                className="mt-1 accent-primary"
              />
              <span className={`text-sm ${errors.rgpd ? "text-destructive" : ""}`}>
                J'accepte le traitement de mes données conformément à la politique RGPD et
                j'autorise Synca à me recontacter à des fins commerciales.{" "}
                <span className="text-primary">*</span>
              </span>
            </label>
          </FormSection>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-3.5 hover:brightness-110 transition shadow-glow disabled:opacity-60"
            >
              {pending ? "Envoi…" : "Envoyer ma demande"}
            </button>
          </div>
        </form>
      </FormShell>
    </div>
  );
}
