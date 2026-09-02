import { useAdminAuth } from "../../lib/auth/useAdminAuth";

/**
 * Placeholder landing page after admin login -- proves the auth flow works
 * end to end. The real dashboard (KPIs, moderation queues, etc.) is
 * ROADMAP_ADMIN.md Phase B onward, out of scope here.
 */
export function AdminDashboardPage() {
  const { logout } = useAdminAuth();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl text-ink">Backoffice</h1>
        <button
          onClick={logout}
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          Se déconnecter
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        Connecté. Le tableau de bord (statistiques, modération) sera construit dans une
        prochaine étape.
      </p>
    </div>
  );
}
