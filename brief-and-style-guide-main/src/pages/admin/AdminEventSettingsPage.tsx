import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getEventSettings, updateEventSettings } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

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

  useEffect(() => {
    if (settingsQuery.data) {
      setName(settingsQuery.data.name);
      setVenue(settingsQuery.data.venue);
    }
  }, [settingsQuery.data]);

  const mutation = useMutation({
    mutationFn: () => updateEventSettings({ name, venue }),
    onSuccess: () => {
      toast.success("Réglages de l'événement mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin", "event-settings"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const dirty =
    !!settingsQuery.data &&
    (name !== settingsQuery.data.name || venue !== settingsQuery.data.venue);

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
    </div>
  );
}
