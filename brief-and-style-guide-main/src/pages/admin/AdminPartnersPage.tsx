import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listPartners,
  updatePartnerStatus,
  type ExhibitorStatus,
  type Partner,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

const STATUS_LABELS: Record<ExhibitorStatus, string> = {
  pending: "En attente",
  contacted: "Contacté",
  negotiating: "En négociation",
  confirmed: "Confirmé",
  rejected: "Rejeté",
};

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

function statusVariant(status: ExhibitorStatus): "default" | "secondary" | "destructive" {
  if (status === "confirmed") return "default";
  if (status === "rejected") return "destructive";
  return "secondary";
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}

export function AdminPartnersPage() {
  const [status, setStatus] = useState<ExhibitorStatus | "all">("pending");
  const [selected, setSelected] = useState<Partner | null>(null);

  const queryClient = useQueryClient();

  const filters = {
    status: status === "all" ? undefined : status,
  };

  const partnersQuery = useQuery({
    queryKey: ["admin", "partners", filters],
    queryFn: () => listPartners(filters),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ExhibitorStatus }) =>
      updatePartnerStatus(id, status),
    onSuccess: (updated) => {
      toast.success(`Statut mis à jour : ${STATUS_LABELS[updated.status]}.`);
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Candidatures partenaires</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={status} onValueChange={(v) => setStatus(v as ExhibitorStatus | "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {partnersQuery.isPending && <Skeleton className="h-64" />}

      {partnersQuery.isError &&
        !(partnersQuery.error instanceof ApiError && partnersQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {partnersQuery.error instanceof ApiError
              ? partnersQuery.error.detail
              : "Impossible de charger les candidatures."}
          </p>
        )}

      {partnersQuery.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organisation</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnersQuery.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucune candidature pour ces filtres.
                </TableCell>
              </TableRow>
            )}
            {partnersQuery.data.map((p) => (
              <TableRow key={p.id} className="cursor-pointer" onClick={() => setSelected(p)}>
                <TableCell>
                  <div className="font-medium">{p.organization_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.city}, {p.country}
                  </div>
                </TableCell>
                <TableCell>#{p.level_id}</TableCell>
                <TableCell>{p.contact_name}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(p.status)}>{STATUS_LABELS[p.status]}</Badge>
                </TableCell>
                <TableCell>{dateTime.format(new Date(p.created_at))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.organization_name}</DialogTitle>
              </DialogHeader>

              <dl className="grid grid-cols-2 gap-4">
                <DetailRow label="Secteur" value={selected.sector} />
                <DetailRow label="Pays" value={selected.country} />
                <DetailRow label="Ville" value={selected.city} />
                <DetailRow label="Site web" value={selected.website_url} />
                <DetailRow label="Contact" value={selected.contact_name} />
                <DetailRow label="Fonction" value={selected.contact_position} />
                <DetailRow label="Email" value={selected.contact_email} />
                <DetailRow label="Téléphone" value={selected.contact_phone} />
                <DetailRow label="Niveau" value={`#${selected.level_id}`} />
                <DetailRow label="Budget disponible" value={selected.has_budget} />
                <DetailRow label="Déjà sponsor" value={selected.previous_sponsor ? "Oui" : "Non"} />
                <DetailRow label="Connu via" value={selected.heard_from} />
                <DetailRow
                  label="Consentement RGPD"
                  value={selected.gdpr_consent ? "Oui" : "Non"}
                />
              </dl>

              <div className="space-y-3">
                <DetailRow label="Objectifs" value={selected.objectives} />
                <DetailRow label="Message" value={selected.message} />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Badge variant={statusVariant(selected.status)}>
                  {STATUS_LABELS[selected.status]}
                </Badge>
                <Select
                  value={selected.status}
                  onValueChange={(v) =>
                    statusMutation.mutate({ id: selected.id, status: v as ExhibitorStatus })
                  }
                  disabled={statusMutation.isPending}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Changer le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
