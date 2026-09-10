import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listCampaignWindows,
  updateCampaignWindow,
  type CampaignWindow,
  type CampaignWindowKey,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const KEY_LABELS: Record<CampaignWindowKey, string> = {
  call_for_speaker: "Appel à speakers",
  ticketing: "Billetterie",
  call_for_partner: "Appel à partenaires",
  call_for_ambassador: "Appel à ambassadeurs",
  call_for_exhibitor: "Appel à exposants",
  event: "Dates de l'événement",
  hackathon_universitaire: "Hackathon universitaire",
  call_for_community_certified: "Synca Community Certified",
};

// "Dates de l'événement" vit dans Réglages événement (AdminEventSettingsPage),
// pas ici — cette page n'affiche que les fenêtres de campagne à proprement parler.
const HIDDEN_KEYS: CampaignWindowKey[] = ["event"];

// datetime-local n'accepte ni le "Z" ni les secondes/microsecondes ISO renvoyées par l'API.
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function WindowCard({ window: w }: { window: CampaignWindow }) {
  const queryClient = useQueryClient();
  const [startAt, setStartAt] = useState(() => toLocalInputValue(w.start_at));
  const [endAt, setEndAt] = useState(() => toLocalInputValue(w.end_at));
  const [isActive, setIsActive] = useState(w.is_active);

  useEffect(() => {
    setStartAt(toLocalInputValue(w.start_at));
    setEndAt(toLocalInputValue(w.end_at));
    setIsActive(w.is_active);
  }, [w.start_at, w.end_at, w.is_active]);

  const mutation = useMutation({
    mutationFn: () =>
      updateCampaignWindow(w.key, {
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
        is_active: isActive,
      }),
    onSuccess: () => {
      toast.success(`${KEY_LABELS[w.key]} mis à jour.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "campaign-windows"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const dirty =
    startAt !== toLocalInputValue(w.start_at) ||
    endAt !== toLocalInputValue(w.end_at) ||
    isActive !== w.is_active;

  // Une fenêtre ne peut être activée/désactivée manuellement que pendant sa
  // période ; hors période (passée ou future) elle est désactivée par
  // défaut côté backend, quelle que soit la valeur enregistrée ici.
  const inPeriod = (() => {
    const start = new Date(startAt).getTime();
    const end = new Date(endAt).getTime();
    const now = Date.now();
    return Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end;
  })();
  const effectiveActive = w.is_active && (() => {
    const now = Date.now();
    return now >= new Date(w.start_at).getTime() && now <= new Date(w.end_at).getTime();
  })();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-ink">{KEY_LABELS[w.key]}</CardTitle>
        <Badge variant={effectiveActive ? "default" : "secondary"}>
          {effectiveActive ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor={`start-${w.key}`}>Début</Label>
            <Input
              id={`start-${w.key}`}
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`end-${w.key}`}>Fin</Label>
            <Input
              id={`end-${w.key}`}
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Switch
                id={`active-${w.key}`}
                checked={inPeriod && isActive}
                disabled={!inPeriod}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor={`active-${w.key}`}>Fenêtre active</Label>
            </div>
            {!inPeriod && (
              <p className="text-xs text-muted-foreground">
                Désactivée par défaut hors période. Activable manuellement pendant la période définie.
              </p>
            )}
          </div>
          <Button
            size="sm"
            disabled={!dirty || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminCampaignWindowsPage() {
  const windowsQuery = useQuery({
    queryKey: ["admin", "campaign-windows"],
    queryFn: listCampaignWindows,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Fenêtres de campagne</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      {windowsQuery.isPending && (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      )}

      {windowsQuery.isError &&
        !(windowsQuery.error instanceof ApiError && windowsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {windowsQuery.error instanceof ApiError
              ? windowsQuery.error.detail
              : "Impossible de charger les fenêtres de campagne."}
          </p>
        )}

      {windowsQuery.data && (
        <div className="grid gap-4">
          {windowsQuery.data
            .filter((w) => !HIDDEN_KEYS.includes(w.key))
            .map((w) => (
              <WindowCard key={w.key} window={w} />
            ))}
        </div>
      )}
    </div>
  );
}
