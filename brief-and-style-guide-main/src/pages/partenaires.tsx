import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "../components/site/PageHeader";
import { FormShell, FormSection, Field, inputCls, textareaCls } from "../components/site/FormShell";

import {
  COUNTRIES,
  PARTNER_SECTEURS,
  PARTNER_BUDGET,
  PARTNER_OBJECTIFS,
  SOURCES,
} from "../lib/forms/constants";
import { applyAsPartner, getPartnerLevels, type PartnerLevel } from "../lib/api/applications";
import { ApiError } from "../lib/api/client";
import { useEventWindow } from "@/hooks/useEventWindow";
import { CampaignWindowGate } from "@/components/site/CampaignWindowGate";

const WHY_PARTNER = [
  {
    number: "01",
    title: "Gagnez en visibilité",
    description:
      "Positionnez votre marque auprès d’une audience qualifiée de professionnels, entrepreneurs, décideurs et passionnés de technologie.",
  },
  {
    number: "02",
    title: "Développez votre réseau",
    description:
      "Créez des connexions stratégiques avec des entreprises, startups, investisseurs et acteurs publics venus de différents marchés africains.",
  },
  {
    number: "03",
    title: "Attirez les meilleurs talents",
    description:
      "Présentez votre entreprise, vos métiers et vos opportunités à une communauté de talents tech, de jeunes diplômés et de professionnels.",
  },
  {
    number: "04",
    title: "Prenez la parole",
    description:
      "Partagez votre expertise à travers des panels, workshops, prises de parole et activations adaptées à vos objectifs.",
  },
  {
    number: "05",
    title: "Créez des opportunités business",
    description:
      "Utilisez Synca Conf comme un espace privilégié pour rencontrer de nouveaux clients, partenaires et prospects.",
  },
  {
    number: "06",
    title: "Contribuez à l’écosystème",
    description:
      "Soutenez le développement de l’innovation et des compétences numériques en Afrique tout en renforçant votre impact local et régional.",
  },
];

export function PartenairesPage() {
  const { year } = useEventWindow();
  const yearSuffix = year != null ? ` ${year}` : "";
  return (
    <>
      <PageHeader
        eyebrow="Partenaires"
        title={
          <>
            Construisez l'avenir tech africain <span className="text-primary">avec nous</span>.
          </>
        }
        description="Quatre niveaux de partenariat pour aligner votre marque sur l'écosystème tech le plus dynamique du continent. Recrutement, visibilité, B2B, impact."
      />

      {/*<section className="py-20 bg-cream">
        <div className="mx-auto max-w-7xl px-6 space-y-6">
          {Array.from(
            { length: Math.ceil(TIERS.length / 2) },
            (_, i) => {
              const group = TIERS.slice(i * 2, i * 2 + 2);

              return (
                <div key={i} className="grid md:grid-cols-2 gap-6">
                  {group.map((t) => (
                    <article
                      key={t.name}
                      className={`relative rounded-3xl p-7 border-2 flex flex-col ${t.color} ${
                        t.featured ? "shadow-glow" : "shadow-card"
                      }`}
                    >
                      {t.featured && (
                        <span className="absolute -top-3 left-7 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-primary text-ink">
                          Vedette
                        </span>
                      )}

                      <div className="font-display font-bold text-2xl">
                        {t.name}
                      </div>

                      <div
                        className={`mt-2 text-sm ${
                          t.featured
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        À partir de
                      </div>

                      <div className="font-display font-bold text-3xl mt-1">
                        {t.price}
                      </div>

                      <ul className="mt-6 space-y-2.5 text-sm flex-1">
                        {t.perks.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-2"
                          >
                            <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href="#form"
                        className={`mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition ${
                          t.featured
                            ? "bg-primary text-ink hover:brightness-110"
                            : "bg-ink text-white hover:bg-ink/90"
                        }`}
                      >
                        Devenir partenaire
                      </a>
                    </article>
                  ))}
                </div>
              );
            }
          )}
        </div>
      </section>*/}

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          {/* Intro */}
          <div className="max-w-3xl mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              Pourquoi devenir partenaire ?
            </div>

            <h2 className="mt-3 font-display font-bold text-3xl md:text-5xl">
              Faites de Synca Conf{yearSuffix} un{" "}
              <span className="text-primary">levier pour votre marque</span>.
            </h2>

            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              Synca Conf{yearSuffix} rassemble entreprises, startups, investisseurs, talents,
              décideurs et acteurs majeurs de la technologie africaine. Devenir partenaire, c’est
              associer votre marque à une dynamique panafricaine tournée vers l’innovation et les
              opportunités.
            </p>
          </div>

          {/* Avantages */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_PARTNER.map((item) => (
              <article
                key={item.number}
                className="rounded-3xl border border-border bg-white p-7 shadow-card hover:border-primary/40 hover:-translate-y-1 transition"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-sm">
                  {item.number}
                </div>

                <h3 className="mt-6 font-display font-bold text-xl">{item.title}</h3>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-3xl bg-ink text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="font-display font-bold text-2xl">
                Votre marque. Votre impact. Votre place dans la conversation.
              </div>

              <p className="mt-2 text-white/70 max-w-2xl">
                Quel que soit votre objectif — visibilité, recrutement, networking, business ou
                impact — nous construisons avec vous une expérience de partenariat adaptée.
              </p>
            </div>

            <a
              href="#form"
              className="shrink-0 inline-flex items-center justify-center rounded-full bg-primary text-ink font-semibold px-6 py-3 hover:brightness-110 transition"
            >
              Devenir partenaire
            </a>
          </div>
        </div>
      </section>

      <div id="form">
        <CampaignWindowGate windowKey="call_for_partner" label="Les candidatures partenaires">
          <PartnerForm />
        </CampaignWindowGate>
      </div>
    </>
  );
}

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
  denomination: "",
  secteur: "",
  pays: "",
  ville: "",
  siteWeb: "",
  contactNom: "",
  contactPoste: "",
  email: "",
  phone: "",
  tier: "",
  budget: "",
  objectifs: [],
  dejaSponsor: "",
  message: "",
  source: "",
  sourceAutre: "",
  rgpd: false,
};

function PartnerForm() {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [levels, setLevels] = useState<PartnerLevel[]>([]);

  useEffect(() => {
    getPartnerLevels()
      .then(setLevels)
      .catch(() => setLevels([]));
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const toggleObjectif = (o: string) => {
    setF((p) => ({
      ...p,
      objectifs: p.objectifs.includes(o) ? p.objectifs.filter((x) => x !== o) : [...p.objectifs, o],
    }));
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const e: Record<string, string> = {};

    if (!f.denomination.trim()) {
      e.denomination = "Requis";
    }

    if (!f.secteur) {
      e.secteur = "Requis";
    }

    if (!f.pays) {
      e.pays = "Requis";
    }

    if (!f.ville.trim()) {
      e.ville = "Requis";
    }

    if (!f.contactNom.trim()) {
      e.contactNom = "Requis";
    }

    if (!f.contactPoste.trim()) {
      e.contactPoste = "Requis";
    }

    if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      e.email = "Email invalide";
    }

    if (!/^\+?[0-9 -]{7,}$/.test(f.phone)) {
      e.phone = "Numéro invalide";
    }

    if (!f.tier) {
      e.tier = "Requis";
    }

    if (f.objectifs.length === 0) {
      e.objectifs = "Sélectionne au moins un objectif";
    }

    if (!f.rgpd) {
      e.rgpd = "Consentement requis";
    }

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
    fd.set("level_id", f.tier);
    if (f.budget) fd.set("has_budget", f.budget);
    for (const o of f.objectifs) fd.append("objectives", o);
    fd.set("previous_sponsor", f.dejaSponsor === "Oui" ? "true" : "false");
    if (f.message.trim()) fd.set("message", f.message.trim());
    if (f.source) fd.set("heard_from", f.sourceAutre.trim() || f.source);
    fd.set("gdpr_consent", "true");

    setPending(true);
    try {
      await applyAsPartner(fd);
      toast.success("Demande envoyée !", {
        description: "L'équipe partenariats te recontacte sous 48h.",
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
      {/* Intro formulaire */}
      <div className="mx-auto max-w-3xl px-6 pt-10">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Devenir partenaire
          </div>

          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl">
            Parlons de votre projet.
          </h2>

          <p className="mt-4 text-muted-foreground">
            Remplissez le formulaire et notre équipe partenariats reviendra vers vous pour
            construire une proposition adaptée à vos objectifs.
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
          <FormSection title="Intérêt de partenariat">
            <Field label="Offre souhaitée" required error={errors.tier}>
              <select
                className={inputCls}
                value={f.tier}
                onChange={(e) => set("tier", e.target.value)}
              >
                <option value="">— Sélectionner —</option>

                {levels.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.price.toLocaleString("fr-FR")} F CFA)
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Avez-vous un budget défini ?">
              <select
                className={inputCls}
                value={f.budget}
                onChange={(e) => set("budget", e.target.value)}
              >
                <option value="">— Sélectionner —</option>

                {PARTNER_BUDGET.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>

            {/* Objectifs */}
            <Field label="Objectifs prioritaires" required error={errors.objectifs} full>
              <div className="flex flex-wrap gap-2 pt-1">
                {PARTNER_OBJECTIFS.map((o) => {
                  const active = f.objectifs.includes(o);

                  return (
                    <button
                      type="button"
                      key={o}
                      onClick={() => toggleObjectif(o)}
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

            {/* Sponsoring précédent */}
            <Field label="Avez-vous déjà sponsorisé un événement tech ?" full>
              <div className="flex gap-4 h-10 items-center">
                {["Oui", "Non"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="dejaSponsor"
                      value={v}
                      checked={f.dejaSponsor === v}
                      onChange={(e) => set("dejaSponsor", e.target.value)}
                      className="accent-primary"
                    />

                    {v}
                  </label>
                ))}
              </div>
            </Field>

            {/* Message */}
            <Field label="Message ou demande spécifique" full>
              <textarea
                className={textareaCls}
                value={f.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Vos objectifs, contraintes, questions…"
              />
            </Field>

            {/* Source */}
            <Field label="Comment avez-vous entendu parler de Synca ?">
              <select
                className={inputCls}
                value={f.source}
                onChange={(e) => set("source", e.target.value)}
              >
                <option value="">— Sélectionner —</option>

                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Précisez (optionnel)">
              <input
                className={inputCls}
                value={f.sourceAutre}
                onChange={(e) => set("sourceAutre", e.target.value)}
              />
            </Field>

            {/* RGPD */}
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

          {/* =====================================================
              SUBMIT
          ===================================================== */}
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
