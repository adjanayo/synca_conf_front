import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getEventSettings,
  listCampaignWindows,
  updateCampaignWindow,
  updateEventSettings,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

// datetime-local n'accepte ni le "Z" ni les secondes/microsecondes ISO renvoyées par l'API.
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EventDatesCard() {
  const queryClient = useQueryClient();

  const windowsQuery = useQuery({
    queryKey: ["admin", "campaign-windows"],
    queryFn: listCampaignWindows,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const eventWindow = windowsQuery.data?.find((w) => w.key === "event");

  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (eventWindow) {
      setStartAt(toLocalInputValue(eventWindow.start_at));
      setEndAt(toLocalInputValue(eventWindow.end_at));
      setIsActive(eventWindow.is_active);
    }
  }, [eventWindow]);

  const mutation = useMutation({
    mutationFn: () =>
      updateCampaignWindow("event", {
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
        is_active: isActive,
      }),
    onSuccess: () => {
      toast.success("Dates de l'événement mises à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin", "campaign-windows"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  if (windowsQuery.isPending) return <Skeleton className="h-40" />;
  if (!eventWindow) return null;

  const dirty =
    startAt !== toLocalInputValue(eventWindow.start_at) ||
    endAt !== toLocalInputValue(eventWindow.end_at) ||
    isActive !== eventWindow.is_active;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-ink">Dates de l'événement</CardTitle>
        <Badge variant={eventWindow.is_active ? "default" : "secondary"}>
          {eventWindow.is_active ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="event-start-at">Début</Label>
            <Input
              id="event-start-at"
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="event-end-at">Fin</Label>
            <Input
              id="event-end-at"
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch id="event-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="event-active">Fenêtre active</Label>
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

export function AdminEventSettingsPage() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["admin", "event-settings"],
    queryFn: getEventSettings,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (settingsQuery.data) {
      setName(settingsQuery.data.name);
      setVenue(settingsQuery.data.venue);
      setYear(settingsQuery.data.year != null ? String(settingsQuery.data.year) : "");
    }
  }, [settingsQuery.data]);

  const mutation = useMutation({
    mutationFn: () =>
      updateEventSettings({ name, venue, year: year.trim() === "" ? null : Number(year) }),
    onSuccess: () => {
      toast.success("Réglages de l'événement mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin", "event-settings"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const currentYear = settingsQuery.data?.year != null ? String(settingsQuery.data.year) : "";
  const dirty =
    !!settingsQuery.data &&
    (name !== settingsQuery.data.name || venue !== settingsQuery.data.venue || year !== currentYear);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Réglages événement</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      {settingsQuery.isPending && <Skeleton className="h-56" />}

      {settingsQuery.isError &&
        !(settingsQuery.error instanceof ApiError && settingsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {settingsQuery.error instanceof ApiError
              ? settingsQuery.error.detail
              : "Impossible de charger les réglages de l'événement."}
          </p>
        )}

      <div className="space-y-6">
        {settingsQuery.data && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-ink">
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="event-name">Nom de l'événement</Label>
                <Input id="event-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-venue">Lieu</Label>
                <Input id="event-venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-year">Année (affichée dans "Synca Conf &lt;année&gt;" — laisser vide pour ne rien afficher)</Label>
                <Input
                  id="event-year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
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
        )}

        <EventDatesCard />
      </div>
    </div>
  );
}
