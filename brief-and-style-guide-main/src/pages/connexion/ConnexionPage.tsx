import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormShell, FormSection, Field, inputCls } from "../../components/site/FormShell";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";
import { ApiError } from "../../lib/api/client";
import { requestOtp, verifyOtp } from "../../lib/api/participant";
import { useAuth } from "../../lib/auth/useAuth";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";

type Step = "email" | "code";

export function ConnexionPage() {
  useBrandedPageMeta("Connexion");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  // Client-side validation (zod-style) renders at the field; server/API
  // errors render as a global banner -- two states so the two never get
  // mixed into the same slot (error-handling skill).
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/espace";

  const submitEmail = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFieldError(null);
    setServerError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFieldError("Email invalide.");
      return;
    }
    setPending(true);
    try {
      await requestOtp(email);
      toast.success("Code envoyé", { description: "Vérifie ta boîte mail." });
      setStep("code");
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 429
          ? "Trop de tentatives — réessaie dans quelques minutes."
          : err instanceof ApiError
            ? err.detail
            : "Une erreur est survenue.";
      setServerError(message);
    } finally {
      setPending(false);
    }
  };

  const submitCode = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFieldError(null);
    setServerError(null);
    if (code.length !== 6) {
      setFieldError("Le code doit contenir 6 chiffres.");
      return;
    }
    setPending(true);
    try {
      const { access_token } = await verifyOtp(email, code);
      login(access_token);
      toast.success("Connexion réussie");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "Code invalide ou expiré."
          : err instanceof ApiError && err.status === 429
            ? "Trop de tentatives — réessaie dans quelques minutes."
            : err instanceof ApiError
              ? err.detail
              : "Une erreur est survenue.";
      setServerError(message);
    } finally {
      setPending(false);
    }
  };

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
      {step === "email" ? (
        <form onSubmit={submitEmail} noValidate>
          <FormSection title="Accéder à mon espace">
            <Field label="Email" required error={fieldError ?? undefined} full>
              <input
                type="email"
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </Field>
          </FormSection>
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-3.5 hover:brightness-110 transition shadow-glow disabled:opacity-60"
            >
              {pending ? "Envoi…" : "Recevoir un code"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitCode} noValidate>
          <FormSection title="Code de connexion">
            <Field
              label={`Code envoyé à ${email}`}
              required
              error={fieldError ?? undefined}
              hint="Valable 10 minutes."
              full
            >
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </Field>
          </FormSection>
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition"
              onClick={() => {
                setStep("email");
                setCode("");
                setFieldError(null);
                setServerError(null);
              }}
            >
              Changer d'email
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-3.5 hover:brightness-110 transition shadow-glow disabled:opacity-60"
            >
              {pending ? "Vérification…" : "Se connecter"}
            </button>
          </div>
        </form>
      )}
    </FormShell>
  );
}
