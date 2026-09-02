import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listAmbassadors,
  updateAmbassadorStatus,
  type Ambassador,
  type SpeakerApplicationStatus,
} from "../../lib/api/admin";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

const STATUS_LABELS: Record<SpeakerApplicationStatus, string> = {
  pending: "En attente",
  accepted: "Accepté",
  rejected: "Rejeté",
};

const PROFILES = ["Étudiant", "Professionnel", "Créateur de contenu", "Entrepreneur"];

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

function statusVariant(status: SpeakerApplicationStatus): "default" | "secondary" | "destructive" {
  if (status === "accepted") return "default";
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

export function AdminAmbassadorsPage() {
  const [status, setStatus] = useState<SpeakerApplicationStatus | "all">("pending");
  const [profile, setProfile] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Ambassador | null>(null);

  const queryClient = useQueryClient();

  const filters = {
    status: status === "all" ? undefined : status,
    current_profile: profile === "all" ? undefined : profile,
  };

  const ambassadorsQuery = useQuery({
    queryKey: ["admin", "ambassadors", filters],
    queryFn: () => listAmbassadors(filters),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: SpeakerApplicationStatus }) =>
      updateAmbassadorStatus(id, status),
    onSuccess: (updated) => {
      toast.success(
        updated.status === "accepted" ? "Candidature acceptée." : "Candidature rejetée.",
      );
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "ambassadors"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Candidatures ambassadeurs</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as SpeakerApplicationStatus | "all")}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="accepted">Accepté</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>

        <Select value={profile} onValueChange={setProfile}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Profil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les profils</SelectItem>
            {PROFILES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {ambassadorsQuery.isPending && <Skeleton className="h-64" />}

      {ambassadorsQuery.isError &&
        !(ambassadorsQuery.error instanceof ApiError && ambassadorsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {ambassadorsQuery.error instanceof ApiError
              ? ambassadorsQuery.error.detail
              : "Impossible de charger les candidatures."}
          </p>
        )}

      {ambassadorsQuery.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidat</TableHead>
              <TableHead>Profil</TableHead>
              <TableHead>Portée estimée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ambassadorsQuery.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucune candidature pour ces filtres.
                </TableCell>
              </TableRow>
            )}
            {ambassadorsQuery.data.map((a) => (
              <TableRow key={a.id} className="cursor-pointer" onClick={() => setSelected(a)}>
                <TableCell>
                  <div className="font-medium">
                    {a.first_name} {a.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {a.city}, {a.country}
                  </div>
                </TableCell>
                <TableCell>{a.current_profile ?? "—"}</TableCell>
                <TableCell>{a.estimated_reach ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(a.status)}>{STATUS_LABELS[a.status]}</Badge>
                </TableCell>
                <TableCell>{dateTime.format(new Date(a.created_at))}</TableCell>
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
                <DialogTitle>
                  {selected.first_name} {selected.last_name}
                </DialogTitle>
              </DialogHeader>

              <dl className="grid grid-cols-2 gap-4">
                <DetailRow label="Âge" value={selected.age.toString()} />
                <DetailRow label="Pays" value={selected.country} />
                <DetailRow label="Ville" value={selected.city} />
                <DetailRow label="Email" value={selected.email} />
                <DetailRow label="WhatsApp" value={selected.phone_whatsapp} />
                <DetailRow label="Profil" value={selected.current_profile} />
                <DetailRow
                  label="Établissement / entreprise"
                  value={selected.institution_company}
                />
                <DetailRow label="LinkedIn" value={selected.linkedin_url} />
                <DetailRow label="Audience" value={selected.followers_range} />
                <DetailRow label="Portée estimée" value={selected.estimated_reach} />
                <DetailRow
                  label="Déjà participé à Synca"
                  value={selected.previous_synca ? "Oui" : "Non"}
                />
                <DetailRow label="Disponibilité pré-événement" value={selected.availability_pre} />
                <DetailRow
                  label="Consentement RGPD"
                  value={selected.gdpr_consent ? "Oui" : "Non"}
                />
              </dl>

              <div className="space-y-3">
                <DetailRow label="Canaux préférés" value={selected.preferred_channels} />
                <DetailRow label="Motivation" value={selected.motivation} />
                <DetailRow label="Plan de mobilisation" value={selected.mobilization_plan} />
              </div>

              {selected.status === "pending" && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    disabled={statusMutation.isPending}
                    onClick={() => statusMutation.mutate({ id: selected.id, status: "rejected" })}
                  >
                    Rejeter
                  </Button>
                  <Button
                    disabled={statusMutation.isPending}
                    onClick={() => statusMutation.mutate({ id: selected.id, status: "accepted" })}
                  >
                    Accepter
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
