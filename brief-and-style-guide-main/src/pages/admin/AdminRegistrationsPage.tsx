import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listRegistrations } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const LIMIT = 20;

// price/amount_paid sont en francs CFA (FCFA), entiers sans décimales
// (FRONTEND_INTEGRATION.md) -- jamais divisés par 100 comme des centimes.
const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});
const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

function statusVariant(status: string): "default" | "secondary" | "destructive" {
  if (status === "completed") return "default";
  if (status === "failed" || status === "refunded") return "destructive";
  return "secondary";
}

export function AdminRegistrationsPage() {
  const [offset, setOffset] = useState(0);

  const registrationsQuery = useQuery({
    queryKey: ["admin", "registrations", { limit: LIMIT, offset }],
    queryFn: () => listRegistrations({ limit: LIMIT, offset }),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const hasMore = (registrationsQuery.data?.length ?? 0) === LIMIT;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Inscriptions</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      {registrationsQuery.isPending && <Skeleton className="h-64" />}

      {registrationsQuery.isError &&
        !(registrationsQuery.error instanceof ApiError && registrationsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {registrationsQuery.error instanceof ApiError
              ? registrationsQuery.error.detail
              : "Impossible de charger les inscriptions."}
          </p>
        )}

      {registrationsQuery.data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Pass</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationsQuery.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Aucune inscription pour ces filtres.
                  </TableCell>
                </TableRow>
              )}
              {registrationsQuery.data.map((r) => (
                <TableRow key={r.payment_id}>
                  <TableCell>
                    <div className="font-medium">{r.user_name}</div>
                    <div className="text-xs text-muted-foreground">{r.user_email}</div>
                  </TableCell>
                  <TableCell>{r.pass_type_name}</TableCell>
                  <TableCell>{currency.format(r.amount_paid)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                  </TableCell>
                  <TableCell>{dateTime.format(new Date(r.created_at))}</TableCell>
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
              {offset + 1}–{offset + registrationsQuery.data.length}
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
