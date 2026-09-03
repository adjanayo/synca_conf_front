import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { DateGate } from "../../components/site/DateGate";
import { Skeleton } from "../../components/ui/skeleton";
import {
  FormShell,
  FormSection,
  Field,
  inputCls,
  textareaCls,
} from "../../components/site/FormShell";
import { COUNTRIES, SECTEURS, NIVEAUX, PROFILS, GENRES, SOURCES } from "../../lib/forms/constants";
import { ApiError } from "../../lib/api/client";
import {
  getCampaignWindows,
  getPassTypes,
  joinWaitlist,
  registerParticipant,
  validatePromoCode,
  type PromoValidateResponse,
} from "../../lib/api/registration";
import { useAuth } from "../../lib/auth/useAuth";
import { useEventWindow } from "@/hooks/useEventWindow";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

function StatusBanner({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 md:p-6 flex items-start gap-4 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive text-white shadow-sm">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display font-bold text-destructive text-base md:text-lg">{title}</h3>
          <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function WaitlistSignup() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setPending(true);
    try {
      await joinWaitlist(email.trim());
      setDone(true);
      toast.success("Tu es sur la liste d'attente !");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setDone(true);
      } else {
        toast.error(
          err instanceof ApiError ? err.detail : "Une erreur est survenue.",
        );
      }
    } finally {
      setPending(false);
    }
  };

  if (done) {
    return (
      <p className="mt-6 text-sm font-medium text-foreground">
        Tu recevras un email dès que la billetterie ouvrira.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
      <input
        type="email"
        required
        placeholder="ton@email.com"
        className="rounded-full border border-border px-4 py-2.5 text-sm w-full sm:w-72"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-full bg-primary text-ink font-semibold px-6 py-2.5 hover:brightness-110 transition disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Rejoindre la liste d'attente"}
      </button>
    </form>
  );
}

export function InscriptionPage() {
  const windowsQuery = useQuery({
    queryKey: ["public", "campaign-windows"],
    queryFn: getCampaignWindows,
  });
  const { year } = useEventWindow();
  const ticketing = windowsQuery.data?.find((w) => w.key === "ticketing");
  const closed = ticketing && (!ticketing.is_active || new Date(ticketing.end_at) < new Date());

  return (
    <section className="bg-cream">
      <PageHeader
        eyebrow="Inscription participant"
        title={
          <>
            Rejoins la Synca Conf{year != null && <> <span className="text-primary">{year}</span></>}.
          </>
        }
        description="Remplis le formulaire d'inscription pour réserver ton pass. Tu recevras un email de confirmation avec ton billet."
      />

      {windowsQuery.isPending && (
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Skeleton className="h-32" />
        </div>
      )}

      {windowsQuery.isError && (
        <StatusBanner
          title="Impossible de vérifier l'état des inscriptions"
          description="Une erreur réseau nous empêche de charger le formulaire. Merci de réessayer dans quelques instants."
        />
      )}

      {ticketing && closed && (
        <>
          <StatusBanner
            title="Inscriptions closes"
            description="La fenêtre d'inscription participant n'est plus ouverte. Rejoins la liste d'attente pour être averti·e d'une prochaine ouverture."
          />
          <div className="mx-auto max-w-2xl px-6 pb-16 -mt-4 text-center">
            <WaitlistSignup />
          </div>
        </>
      )}

      {ticketing && !closed && (
        <DateGate
          opensAt={new Date(ticketing.start_at)}
          label="Les inscriptions participants ouvrent bientôt."
        >
          <InscriptionForm />
        </DateGate>
      )}

      {ticketing && !closed && new Date(ticketing.start_at) > new Date() && (
        <div className="mx-auto max-w-2xl px-6 pb-16 text-center -mt-10">
          <p className="text-sm text-muted-foreground">
            Inscris-toi sur la liste d'attente pour être notifié·e dès l'ouverture.
          </p>
          <WaitlistSignup />
        </div>
      )}
    </section>
  );
}

type Form = {
  nom: string;
  prenom: string;
  genre: string;
  email: string;
  phone: string;
  pays: string;
  ville: string;
  profils: string[];
  secteur: string;
  niveau: string;
  passTypeId: number | null;
  source: string;
  sourceAutre: string;
  promo: string;
  linkedin: string;
  besoins: string;
  rgpd: boolean;
  opt: boolean;
};

const empty: Form = {
  nom: "",
  prenom: "",
  genre: "",
  email: "",
  phone: "",
  pays: "",
  ville: "",
  profils: [],
  secteur: "",
  niveau: "",
  passTypeId: null,
  source: "",
  sourceAutre: "",
  promo: "",
  linkedin: "",
  besoins: "",
  rgpd: false,
  opt: false,
};

function InscriptionForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [promoStatus, setPromoStatus] = useState<
    { state: "idle" } | { state: "checking" } | { state: "valid"; data: PromoValidateResponse } | { state: "invalid" }
  >({ state: "idle" });
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const checkPromoCode = async () => {
    const code = f.promo.trim();
    if (!code) {
      setPromoStatus({ state: "idle" });
      return;
    }
    setPromoStatus({ state: "checking" });
    try {
      const data = await validatePromoCode(code);
      setPromoStatus({ state: "valid", data });
    } catch {
      setPromoStatus({ state: "invalid" });
    }
  };

  const passTypesQuery = useQuery({ queryKey: ["public", "pass-types"], queryFn: getPassTypes });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.nom.trim()) e.nom = "Requis";
    if (!f.prenom.trim()) e.prenom = "Requis";
    if (!f.genre) e.genre = "Requis";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email invalide";
    if (!/^\+?[0-9 -]{7,}$/.test(f.phone))
      e.phone = "Numéro avec indicatif (ex : +221 77 000 00 00)";
    if (!f.pays) e.pays = "Requis";
    if (!f.ville.trim()) e.ville = "Requis";
    if (f.profils.length === 0) e.profils = "Choisis au moins un profil";
    if (!f.secteur) e.secteur = "Requis";
    if (!f.niveau) e.niveau = "Requis";
    if (!f.passTypeId) e.passTypeId = "Requis";
    if (!f.rgpd) e.rgpd = "Tu dois accepter la politique RGPD";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) {
      toast.error("Merci de corriger les champs en erreur.");
      return;
    }
    setPending(true);
    try {
      const { access_token } = await registerParticipant({
        first_name: f.prenom.trim(),
        last_name: f.nom.trim(),
        gender: f.genre,
        email: f.email.trim(),
        phone_whatsapp: f.phone.trim(),
        country: f.pays,
        city: f.ville.trim(),
        profiles: f.profils,
        sector: f.secteur || undefined,
        experience_level: f.niveau || undefined,
        // f.passTypeId validated non-null just above
        pass_type_id: f.passTypeId as number,
        promo_code: f.promo.trim() || undefined,
        linkedin_url: f.linkedin.trim() || undefined,
        special_needs: f.besoins.trim() || undefined,
        heard_from:
          f.source === "Autre" ? f.sourceAutre.trim() || undefined : f.source || undefined,
        gdpr_consent: f.rgpd,
        newsletter_consent: f.opt,
      });
      login(access_token);
      toast.success("Inscription envoyée !", {
        description: "Un email de confirmation t'a été envoyé.",
      });
      navigate("/espace", { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? "Cet email est déjà inscrit — connecte-toi via ton espace inscrit."
          : err instanceof ApiError && err.status === 429
            ? "Trop de tentatives — réessaie dans quelques minutes."
            : err instanceof ApiError && err.status === 403
              ? "La billetterie est fermée pour le moment."
              : err instanceof ApiError
                ? err.detail
                : "Une erreur est survenue.";
      setServerError(message);
    } finally {
      setPending(false);
    }
  };

  const toggleProfil = (p: string) =>
    set("profils", f.profils.includes(p) ? f.profils.filter((x) => x !== p) : [...f.profils, p]);

  return (
    <FormShell>
      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}
      <form onSubmit={onSubmit} noValidate>
        <FormSection title="Identité">
          <Field label="Nom de famille" required error={errors.nom}>
            <input
              className={inputCls}
              value={f.nom}
              onChange={(e) => set("nom", e.target.value)}
            />
          </Field>
          <Field label="Prénom(s)" required error={errors.prenom}>
            <input
              className={inputCls}
              value={f.prenom}
              onChange={(e) => set("prenom", e.target.value)}
            />
          </Field>
          <Field label="Genre" required error={errors.genre}>
            <select
              className={inputCls}
              value={f.genre}
              onChange={(e) => set("genre", e.target.value)}
            >
              <option value="">— Sélectionner —</option>
              {GENRES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field
            label="Email"
            required
            error={errors.email}
            hint="Tu recevras un lien de confirmation"
          >
            <input
              type="email"
              className={inputCls}
              value={f.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field
            label="Téléphone WhatsApp"
            required
            error={errors.phone}
            hint="Avec indicatif pays"
            full
          >
            <input
              type="tel"
              placeholder="+221 77 000 00 00"
              className={inputCls}
              value={f.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
        </FormSection>

        <FormSection title="Localisation">
          <Field label="Pays de résidence" required error={errors.pays}>
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
            />
          </Field>
        </FormSection>

        <FormSection title="Profil professionnel">
          <Field label="Profil (plusieurs choix possibles)" required error={errors.profils} full>
            <div className="flex flex-wrap gap-2 mt-1">
              {PROFILS.map((p) => {
                const on = f.profils.includes(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => toggleProfil(p)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      on
                        ? "bg-ink text-white border-ink"
                        : "bg-white text-ink border-border hover:border-primary"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Secteur d'activité" required error={errors.secteur}>
            <select
              className={inputCls}
              value={f.secteur}
              onChange={(e) => set("secteur", e.target.value)}
            >
              <option value="">— Sélectionner —</option>
              {SECTEURS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Niveau d'expérience" required error={errors.niveau}>
            <select
              className={inputCls}
              value={f.niveau}
              onChange={(e) => set("niveau", e.target.value)}
            >
              <option value="">— Sélectionner —</option>
              {NIVEAUX.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </Field>
        </FormSection>

        <FormSection title="Ton pass">
          <Field label="Type de pass choisi" required error={errors.passTypeId} full>
            {passTypesQuery.isPending && <Skeleton className="h-24" />}
            {passTypesQuery.isError && (
              <p role="alert" className="text-sm text-destructive">
                Impossible de charger les types de pass.
              </p>
            )}
            {passTypesQuery.data && (
              <div className="grid sm:grid-cols-2 gap-2">
                {passTypesQuery.data.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      f.passTypeId === p.id
                        ? "border-primary bg-peach"
                        : "border-border hover:border-primary/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pass"
                      value={p.id}
                      checked={f.passTypeId === p.id}
                      onChange={() => set("passTypeId", p.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm font-medium">
                      {p.name} ({currency.format(p.price)})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </Field>
        </FormSection>

        <FormSection title="Comment nous as-tu connus ?">
          <Field label="Source" hint="Optionnel">
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
          {f.source === "Autre" && (
            <Field label="Précise">
              <input
                className={inputCls}
                value={f.sourceAutre}
                onChange={(e) => set("sourceAutre", e.target.value)}
              />
            </Field>
          )}
          <Field
            label="Code promo"
            hint={
              promoStatus.state === "valid"
                ? `Code valide — ${
                    promoStatus.data.discount_fixed !== null
                      ? `${currency.format(promoStatus.data.discount_fixed)} de réduction`
                      : `${promoStatus.data.discount_pct}% de réduction`
                  }`
                : promoStatus.state === "invalid"
                  ? "Ce code promo n'est pas valide."
                  : "Optionnel"
            }
          >
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={f.promo}
                onChange={(e) => {
                  set("promo", e.target.value);
                  setPromoStatus({ state: "idle" });
                }}
              />
              <button
                type="button"
                onClick={checkPromoCode}
                disabled={promoStatus.state === "checking" || !f.promo.trim()}
                className="shrink-0 rounded-lg border border-border px-4 text-sm font-medium hover:border-primary transition disabled:opacity-60"
              >
                {promoStatus.state === "checking" ? "…" : "Vérifier"}
              </button>
            </div>
          </Field>
          <Field label="LinkedIn / Portfolio" hint="URL">
            <input
              type="url"
              placeholder="https://"
              className={inputCls}
              value={f.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
            />
          </Field>
          <Field label="Besoins spéciaux" hint="Accessibilité, allergies, régime alimentaire…" full>
            <textarea
              className={textareaCls}
              value={f.besoins}
              onChange={(e) => set("besoins", e.target.value)}
            />
          </Field>
        </FormSection>

        <FormSection title="Consentements">
          <label
            className={`flex items-start gap-3 md:col-span-2 ${errors.rgpd ? "text-destructive" : ""}`}
          >
            <input
              type="checkbox"
              checked={f.rgpd}
              onChange={(e) => set("rgpd", e.target.checked)}
              className="mt-1 accent-primary"
            />
            <span className="text-sm">
              J'accepte que mes données soient traitées conformément à la politique RGPD de Synca.{" "}
              <span className="text-primary">*</span>
            </span>
          </label>
          {errors.rgpd && (
            <span className="text-xs text-destructive md:col-span-2 -mt-3">{errors.rgpd}</span>
          )}
          <label className="flex items-start gap-3 md:col-span-2">
            <input
              type="checkbox"
              checked={f.opt}
              onChange={(e) => set("opt", e.target.checked)}
              className="mt-1 accent-primary"
            />
            <span className="text-sm text-muted-foreground">
              J'accepte de recevoir les communications de Synca (newsletter, futures éditions).
            </span>
          </label>
        </FormSection>

        <div className="mt-10 flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-3.5 hover:brightness-110 transition shadow-glow disabled:opacity-60"
          >
            {pending ? "Envoi…" : "Valider mon inscription"}
          </button>
        </div>
      </form>
    </FormShell>
  );
}
