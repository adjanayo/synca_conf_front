import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Field, inputCls } from "../../components/site/FormShell";
import { ApiError } from "../../lib/api/client";
import { adminLogin } from "../../lib/api/admin";
import { useAdminAuth } from "../../lib/auth/useAdminAuth";

export function AdminLoginPage({ dashboardPath }: { dashboardPath: string }) {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
      setError("Email et mot de passe requis.");
      return;
    }
    setPending(true);
    try {
      const { access_token } = await adminLogin(email, password);
      await login(access_token);
      toast.success("Connexion réussie");
      navigate(dashboardPath, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Trop de tentatives — réessaie dans quelques minutes.");
      } else if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white shadow-card p-8">
        <h1 className="font-display font-bold text-xl text-ink mb-1">Backoffice</h1>
        <p className="text-sm text-muted-foreground mb-6">Synca Conf 2027 — accès administrateur</p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label="Email" required full>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="username"
            />
          </Field>
          <Field label="Mot de passe" required full>
            <input
              type="password"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>

          <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center rounded-lg bg-primary text-ink font-semibold px-4 py-2.5 hover:brightness-110 transition disabled:opacity-60"
          >
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
