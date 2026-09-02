import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../../lib/auth/useAdminAuth";
import { getAdminStats, listRegistrations } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const ENTITY_LABELS: Record<string, string> = {
  speakers: "Speakers",
  ambassadors: "Ambassadeurs",
  partners: "Partenaires",
  exhibitors: "Exposants",
};

// price/amount_paid sont en francs CFA (FCFA), entiers sans décimales
// (FRONTEND_INTEGRATION.md) -- jamais divisés par 100 comme des centimes.
const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});
const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-ink">{value}</p>
      </CardContent>
    </Card>
  );
}

function statusVariant(status: string): "default" | "secondary" | "destructive" {
  if (status === "completed") return "default";
  if (status === "failed" || status === "refunded") return "destructive";
  return "secondary";
}

export function AdminDashboardPage() {
  const { logout } = useAdminAuth();

  const statsQuery = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });
  const registrationsQuery = useQuery({
    queryKey: ["admin", "registrations", "recent"],
    queryFn: () => listRegistrations(5),
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl text-ink">Tableau de bord</h1>
        <div className="flex items-center gap-4">
          <Link
            to="speakers"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Candidatures speakers
          </Link>
          <Button variant="destructive" size="sm" onClick={logout}>
            Se déconnecter
          </Button>
        </div>
      </div>

      {statsQuery.isPending && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}

      {statsQuery.isError &&
        !(statsQuery.error instanceof ApiError && statsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive mb-10">
            {statsQuery.error instanceof ApiError
              ? statsQuery.error.detail
              : "Impossible de charger les statistiques."}
          </p>
        )}

      {statsQuery.data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <KpiCard label="Inscriptions" value={statsQuery.data.total_registrations.toString()} />
            <KpiCard label="Revenu total" value={currency.format(statsQuery.data.total_revenue)} />
            <KpiCard
              label="Paiements complétés"
              value={statsQuery.data.completed_payments.toString()}
            />
            <KpiCard
              label="Conversion code promo"
              value={`${Math.round(statsQuery.data.promo_conversion_rate * 100)}%`}
            />
          </div>

          <h2 className="font-display font-semibold text-lg text-ink mb-4">
            Candidatures en attente de revue
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {Object.entries(statsQuery.data.applications_by_status).map(([entity, byStatus]) => (
              <KpiCard
                key={entity}
                label={ENTITY_LABELS[entity] ?? entity}
                value={(byStatus.pending ?? 0).toString()}
              />
            ))}
          </div>
        </>
      )}

      <h2 className="font-display font-semibold text-lg text-ink mb-4">Dernières inscriptions</h2>
      {registrationsQuery.isPending && <Skeleton className="h-40" />}
      {registrationsQuery.isError &&
        !(
          registrationsQuery.error instanceof ApiError && registrationsQuery.error.status === 401
        ) && (
          <p role="alert" className="text-sm text-destructive">
            {registrationsQuery.error instanceof ApiError
              ? registrationsQuery.error.detail
              : "Impossible de charger les inscriptions."}
          </p>
        )}
      {registrationsQuery.data && (
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
                  Aucune inscription pour l'instant.
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
      )}
    </div>
  );
}
