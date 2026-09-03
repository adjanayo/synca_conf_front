import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "../components/site/PageHeader";
import { FormShell, FormSection, Field, inputCls, textareaCls } from "../components/site/FormShell";
import {
  COUNTRIES,
  AMBASSADEUR_PROFILS,
  AMBASSADEUR_FOLLOWERS,
  AMBASSADEUR_REACH,
  AMBASSADEUR_CANAUX,
  AMBASSADEUR_DISPO,
} from "../lib/forms/constants";
import { applyAsAmbassador } from "../lib/api/applications";
import { ApiError } from "../lib/api/client";
import { useEventWindow } from "@/hooks/useEventWindow";
import { CampaignWindowGate } from "@/components/site/CampaignWindowGate";
import { zodErrors } from "@/lib/forms/validation";

export function AmbassadeurPage() {
  const { year } = useEventWindow();
  const yearSuffix = year != null ? ` ${year}` : "";
  return (
    <>
      <PageHeader
        eyebrow="Programme ambassadeur"
        title={
          <>
            Représente la <span className="text-primary">Synca Conf</span> dans ta ville.
          </>
        }
        description="Étudiants, devs, leaders communauté : aide-nous à faire rayonner la conférence dans ta région et dans ton université."
      />

      {/*<section className="py-20 bg-cream">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-5">
          {PERKS.map((p) => (
            <div key={p.t} className="rounded-3xl bg-white border border-border p-7 shadow-card">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-peach text-primary">{p.i}</div>
              <h3 className="mt-4 font-display font-bold text-xl">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>*/}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-sm uppercase text-primary mb-2">Le rôle</div>
          <h2 className="text-3xl font-bold mb-4">Deviens un acteur clé de Synca Conf{yearSuffix}</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            En tant qu’ambassadeur, tu joues un rôle essentiel dans le succès de l’événement. Tu es
            le lien entre ta communauté et Synca.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: "01",
                t: "Relayer",
                d: `Fais connaître Synca Conf${yearSuffix} sur tes réseaux et dans ta communauté.`,
              },
              {
                id: "02",
                t: "Mobiliser",
                d: "Inspire et motive ton entourage à participer à un événement unique.",
              },
              {
                id: "03",
                t: "Recruter",
                d: "Attire de nouveaux participants et développe l’impact du projet.",
              },
              {
                id: "04",
                t: "Représenter",
                d: "Sois le visage de Synca dans ta ville et lors de l’événement.",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="group border rounded-2xl p-6 bg-cream hover:bg-primary hover:text-white transition duration-300 shadow-sm hover:shadow-lg"
              >
                <span className="text-primary group-hover:text-white font-bold text-lg">
                  {item.id}
                </span>
                <h4 className="mt-3 font-semibold text-lg">{item.t}</h4>
                <p className="text-sm mt-2 opacity-80">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-cream">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-sm uppercase text-primary mb-2">Pourquoi candidater</div>
          <h2 className="text-3xl font-bold mb-4">Ce que tu gagnes en devenant ambassadeur</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Rejoins une communauté dynamique et bénéficie d’avantages exclusifs pour booster ton
            réseau et ton expérience.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              `Badge officiel Synca Conf${yearSuffix}`,
              "Certificat valorisant pour ton CV",
              "Accès privilégié aux coulisses",
              "Opportunités de networking",
              "Kit ambassadeur exclusif",
              "Visibilité personnelle accrue",
            ].map((adv, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-bold">
                  ✓
                </div>
                <p className="font-medium">{adv}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CampaignWindowGate windowKey="call_for_ambassador" label="Les candidatures ambassadeur">
        <AmbassadeurForm />
      </CampaignWindowGate>
    </>
  );
}

type Form = {
  prenom: string;
  nom: string;
  age: string;
  pays: string;
  ville: string;
  email: string;
  phone: string;
  photo: File | null;
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
  prenom: "",
  nom: "",
  age: "",
  pays: "",
  ville: "",
  email: "",
  phone: "",
  photo: null,
  profil: "",
  etablissement: "",
  linkedin: "",
  reseaux: "",
  followers: "",
  motivation: "",
  mobilisation: "",
  reach: "",
  dejaParticipe: "",
  canaux: [],
  dispo: "",
  rgpd: false,
};

function countWords(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

const schema = z.object({
  prenom: z.string().trim().min(1, "Requis"),
  nom: z.string().trim().min(1, "Requis"),
  age: z.string().refine((v) => Number(v) >= 15 && Number(v) <= 99, "Âge invalide"),
  pays: z.string().min(1, "Requis"),
  ville: z.string().trim().min(1, "Requis"),
  email: z.string().trim().regex(/^\S+@\S+\.\S+$/, "Email invalide"),
  phone: z.string().regex(/^\+?[0-9 -]{7,}$/, "Numéro invalide"),
  profil: z.string().min(1, "Requis"),
  motivation: z
    .string()
    .trim()
    .min(1, "Requis")
    .refine((s) => countWords(s) <= 150, "150 mots max"),
  mobilisation: z
    .string()
    .trim()
    .min(1, "Requis")
    .refine((s) => countWords(s) <= 100, "100 mots max"),
  canaux: z.array(z.string()).min(1, "Sélectionne au moins un canal"),
  dispo: z.string().min(1, "Requis"),
  rgpd: z.boolean().refine((v) => v === true, "Consentement requis"),
});

function AmbassadeurForm() {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const toggleCanal = (c: string) => {
    setF((p) => ({
      ...p,
      canaux: p.canaux.includes(c) ? p.canaux.filter((x) => x !== c) : [...p.canaux, c],
    }));
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const parsed = schema.safeParse(f);
    const e = zodErrors(parsed);
    if (!f.photo) e.photo = "Photo requise";
    setErrors(e);
    if (Object.keys(e).length) return toast.error("Merci de corriger les champs.");

    const fd = new FormData();
    fd.set("first_name", f.prenom.trim());
    fd.set("last_name", f.nom.trim());
    fd.set("age", String(Number(f.age)));
    fd.set("country", f.pays);
    fd.set("city", f.ville.trim());
    fd.set("email", f.email.trim());
    fd.set("phone_whatsapp", f.phone.trim());
    fd.set("photo", f.photo as File);
    if (f.profil) fd.set("current_profile", f.profil);
    if (f.etablissement.trim()) fd.set("institution_company", f.etablissement.trim());
    if (f.linkedin.trim()) fd.set("linkedin_url", f.linkedin.trim());
    if (f.reseaux.trim()) fd.set("social_handles", JSON.stringify({ reseaux: f.reseaux.trim() }));
    if (f.followers) fd.set("followers_range", f.followers);
    fd.set("motivation", f.motivation.trim());
    fd.set("mobilization_plan", f.mobilisation.trim());
    if (f.reach) fd.set("estimated_reach", f.reach);
    fd.set("previous_synca", f.dejaParticipe === "Oui" ? "true" : "false");
    for (const canal of f.canaux) fd.append("preferred_channels", canal);
    if (f.dispo) fd.set("availability_pre", f.dispo);
    fd.set("gdpr_consent", "true");

    setPending(true);
    try {
      await applyAsAmbassador(fd);
      toast.success("Candidature envoyée !", { description: "Réponse sous 2 semaines." });
      setF(empty);
      setErrors({});
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        toast.error("Les candidatures ambassadeur sont fermées pour le moment.");
      } else {
        toast.error(err instanceof ApiError ? err.detail : "Une erreur est survenue.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <FormShell>
      <form onSubmit={submit} noValidate>
        <FormSection title="Identité">
          <Field label="Prénom" required error={errors.prenom}>
            <input
              className={inputCls}
              value={f.prenom}
              onChange={(e) => set("prenom", e.target.value)}
            />
          </Field>
          <Field label="Nom" required error={errors.nom}>
            <input
              className={inputCls}
              value={f.nom}
              onChange={(e) => set("nom", e.target.value)}
            />
          </Field>
          <Field label="Âge" required error={errors.age}>
            <input
              type="number"
              min={15}
              max={99}
              className={inputCls}
              value={f.age}
              onChange={(e) => set("age", e.target.value)}
            />
          </Field>
          <Field label="Pays" required error={errors.pays}>
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
          <Field label="Ville" required error={errors.ville}>
            <input
              className={inputCls}
              value={f.ville}
              onChange={(e) => set("ville", e.target.value)}
              placeholder="Dakar"
            />
          </Field>
          <Field label="Email" required error={errors.email}>
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
          <Field label="Photo" required error={errors.photo} hint="JPG/PNG" full>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => set("photo", e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </Field>
        </FormSection>

        <FormSection title="Profil & réseau">
          <Field label="Profil actuel" required error={errors.profil}>
            <select
              className={inputCls}
              value={f.profil}
              onChange={(e) => set("profil", e.target.value)}
            >
              <option value="">— Sélectionner —</option>
              {AMBASSADEUR_PROFILS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="Établissement / Entreprise">
            <input
              className={inputCls}
              value={f.etablissement}
              onChange={(e) => set("etablissement", e.target.value)}
            />
          </Field>
          <Field label="Profil LinkedIn" hint="URL complète" full>
            <input
              type="url"
              className={inputCls}
              value={f.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </Field>
          <Field label="Comptes réseaux sociaux" hint="Instagram, X, TikTok…" full>
            <input
              className={inputCls}
              value={f.reseaux}
              onChange={(e) => set("reseaux", e.target.value)}
              placeholder="@handle Instagram, @handle X…"
            />
          </Field>
          <Field label="Nombre de followers (total estimé)">
            <select
              className={inputCls}
              value={f.followers}
              onChange={(e) => set("followers", e.target.value)}
            >
              <option value="">— Sélectionner —</option>
              {AMBASSADEUR_FOLLOWERS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
        </FormSection>

        <FormSection title="Motivation & mobilisation">
          <Field
            label="Pourquoi veux-tu être ambassadeur Synca ?"
            required
            error={errors.motivation}
            hint={`${countWords(f.motivation)}/150 mots`}
            full
          >
            <textarea
              className={textareaCls}
              value={f.motivation}
              onChange={(e) => set("motivation", e.target.value)}
            />
          </Field>
          <Field
            label="Comment vas-tu mobiliser ton réseau ?"
            required
            error={errors.mobilisation}
            hint={`${countWords(f.mobilisation)}/100 mots`}
            full
          >
            <textarea
              className={textareaCls}
              value={f.mobilisation}
              onChange={(e) => set("mobilisation", e.target.value)}
            />
          </Field>
          <Field label="Combien de personnes penses-tu pouvoir amener ?">
            <select
              className={inputCls}
              value={f.reach}
              onChange={(e) => set("reach", e.target.value)}
            >
              <option value="">— Sélectionner —</option>
              {AMBASSADEUR_REACH.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="As-tu déjà participé à un événement Synca ?">
            <div className="flex gap-4 h-10 items-center">
              {["Oui", "Non"].map((v) => (
                <label key={v} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="dejaParticipe"
                    value={v}
                    checked={f.dejaParticipe === v}
                    onChange={(e) => set("dejaParticipe", e.target.value)}
                    className="accent-primary"
                  />
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
          <Field
            label="Disponibilité pour des actions pré-événement"
            required
            error={errors.dispo}
            full
          >
            <div className="flex gap-4 h-10 items-center">
              {AMBASSADEUR_DISPO.map((v) => (
                <label key={v} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="dispo"
                    value={v}
                    checked={f.dispo === v}
                    onChange={(e) => set("dispo", e.target.value)}
                    className="accent-primary"
                  />
                  {v}
                </label>
              ))}
            </div>
          </Field>
          <label className="flex items-start gap-3 md:col-span-2">
            <input
              type="checkbox"
              checked={f.rgpd}
              onChange={(e) => set("rgpd", e.target.checked)}
              className="mt-1 accent-primary"
            />
            <span className={`text-sm ${errors.rgpd ? "text-destructive" : ""}`}>
              J'accepte le traitement de mes données conformément à la politique RGPD.{" "}
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
            {pending ? "Envoi…" : "Envoyer ma candidature"}
          </button>
        </div>
      </form>
    </FormShell>
  );
}
