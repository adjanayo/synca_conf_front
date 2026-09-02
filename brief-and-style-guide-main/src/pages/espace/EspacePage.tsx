import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "../../lib/api/client";
import { deleteMyAccount, getMyProfile, getMyTickets } from "../../lib/api/participant";
import { useAuth } from "../../lib/auth/useAuth";
import { Button } from "../../components/ui/button";

export function EspacePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAuthError = (err: unknown) => {
    if (err instanceof ApiError && err.status === 401) {
      logout();
      navigate("/connexion", { replace: true });
    }
  };

  const profile = useQuery({
    queryKey: ["participant", "me"],
    queryFn: getMyProfile,
    retry: false,
  });

  const tickets = useQuery({
    queryKey: ["participant", "tickets"],
    queryFn: getMyTickets,
    retry: false,
    enabled: profile.isSuccess,
  });

  if (profile.error) handleAuthError(profile.error);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMyAccount();
      toast.success("Compte supprimé", { description: "Tes données ont été anonymisées." });
      logout();
      queryClient.clear();
      navigate("/", { replace: true });
    } catch (err) {
      handleAuthError(err);
      const message = err instanceof ApiError ? err.detail : "Une erreur est survenue.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-cream pt-32 pb-16">
      <div className="mx-auto max-w-3xl px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-ink">Mon espace</h1>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>

        <section className="rounded-3xl bg-white border border-border shadow-card p-8">
          <h2 className="font-display font-bold text-lg text-ink mb-4">Mon profil</h2>
          {profile.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {profile.isError && (
            <p role="alert" className="text-sm text-destructive">
              Impossible de charger ton profil.
            </p>
          )}
          {profile.data && (
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Nom</dt>
                <dd className="font-medium text-foreground">
                  {profile.data.first_name} {profile.data.last_name}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-foreground">{profile.data.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Ville</dt>
                <dd className="font-medium text-foreground">{profile.data.city}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Pays</dt>
                <dd className="font-medium text-foreground">{profile.data.country}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="rounded-3xl bg-white border border-border shadow-card p-8">
          <h2 className="font-display font-bold text-lg text-ink mb-4">Mes billets</h2>
          {tickets.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {tickets.isError && (
            <p role="alert" className="text-sm text-destructive">
              Impossible de charger tes billets.
            </p>
          )}
          {tickets.data && tickets.data.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucun billet pour le moment — reviens ici une fois ton paiement confirmé.
            </p>
          )}
          {tickets.data && tickets.data.length > 0 && (
            <ul className="space-y-3">
              {tickets.data.map((ticket) => (
                <li
                  key={ticket.id}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    {ticket.ticket_number}
                  </span>
                  <a
                    href={ticket.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Télécharger le PDF
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-white border border-destructive/30 shadow-card p-8">
          <h2 className="font-display font-bold text-lg text-destructive mb-2">
            Supprimer mon compte
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Anonymise définitivement tes données personnelles (droit à l'effacement RGPD).
            Tes billets et paiements restent conservés pour l'audit, sans lien avec ton
            identité. Cette action est irréversible.
          </p>
          {!confirmingDelete ? (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="text-sm font-medium text-destructive hover:underline"
            >
              Supprimer mon compte
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground">Confirmer la suppression ?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full bg-destructive text-destructive-foreground text-sm font-semibold px-5 py-2 disabled:opacity-60"
              >
                {deleting ? "Suppression…" : "Oui, supprimer"}
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Annuler
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
