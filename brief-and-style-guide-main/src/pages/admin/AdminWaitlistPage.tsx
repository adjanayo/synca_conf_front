import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listWaitlist } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const LIMIT = 20;

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

type TriState = "all" | "true" | "false";

export function AdminWaitlistPage() {
  const [offset, setOffset] = useState(0);
  const [notified, setNotified] = useState<TriState>("all");
  const [registered, setRegistered] = useState<TriState>("all");

  const filters = {
    limit: LIMIT,
    offset,
    notified: notified === "all" ? undefined : notified === "true",
    registered: registered === "all" ? undefined : registered === "true",
  };

  const waitlistQuery = useQuery({
    queryKey: ["admin", "waitlist", filters],
    queryFn: () => listWaitlist(filters),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const hasMore = (waitlistQuery.data?.length ?? 0) === LIMIT;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Liste d'attente</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Une fois la billetterie ouverte, chaque inscrit non encore enregistré reçoit un rappel
        automatique tous les 3 jours, jusqu'à son inscription.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={notified}
          onValueChange={(v) => {
            setOffset(0);
            setNotified(v as TriState);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Notifié" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Notifié : tous</SelectItem>
            <SelectItem value="true">Notifié</SelectItem>
            <SelectItem value="false">Non notifié</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={registered}
          onValueChange={(v) => {
            setOffset(0);
            setRegistered(v as TriState);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Inscrit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Inscrit : tous</SelectItem>
            <SelectItem value="true">Inscrit</SelectItem>
            <SelectItem value="false">Non inscrit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {waitlistQuery.isPending && <Skeleton className="h-64" />}

      {waitlistQuery.isError &&
        !(waitlistQuery.error instanceof ApiError && waitlistQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {waitlistQuery.error instanceof ApiError
              ? waitlistQuery.error.detail
              : "Impossible de charger la liste d'attente."}
          </p>
        )}

      {waitlistQuery.data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Notifié</TableHead>
                <TableHead>Inscrit</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitlistQuery.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Aucune entrée pour ces filtres.
                  </TableCell>
                </TableRow>
              )}
              {waitlistQuery.data.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.email}</TableCell>
                  <TableCell>
                    <Badge variant={w.notified ? "default" : "secondary"}>
                      {w.notified ? "Oui" : "Non"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={w.registered ? "default" : "secondary"}>
                      {w.registered ? "Oui" : "Non"}
                    </Badge>
                  </TableCell>
                  <TableCell>{dateTime.format(new Date(w.created_at))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={offset === 0}
              onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
            >
              Précédent
            </Button>
            <span className="text-sm text-muted-foreground">
              {offset + 1}–{offset + waitlistQuery.data.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore}
              onClick={() => setOffset((o) => o + LIMIT)}
            >
              Suivant
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
