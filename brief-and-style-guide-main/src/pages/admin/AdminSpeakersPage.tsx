import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listSpeakers,
  updateSpeakerStatus,
  type Speaker,
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

const THEMES = ["IA", "EdTech", "Entrepreneuriat", "Carrières", "Impact", "Cybersec"];
const FORMATS = ["Keynote", "Panel", "Workshop", "Lightning Talk", "Fireside Chat"];

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

export function AdminSpeakersPage() {
  const [status, setStatus] = useState<SpeakerApplicationStatus | "all">("pending");
  const [theme, setTheme] = useState<string | "all">("all");
  const [format, setFormat] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Speaker | null>(null);

  const queryClient = useQueryClient();

  const filters = {
    status: status === "all" ? undefined : status,
    theme: theme === "all" ? undefined : theme,
    format: format === "all" ? undefined : format,
  };

  const speakersQuery = useQuery({
    queryKey: ["admin", "speakers", filters],
    queryFn: () => listSpeakers(filters),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: SpeakerApplicationStatus }) =>
      updateSpeakerStatus(id, status),
    onSuccess: (updated) => {
      toast.success(
        updated.status === "accepted" ? "Candidature acceptée." : "Candidature rejetée.",
      );
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "speakers"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Candidatures speakers</h1>
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

        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Thème" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les thèmes</SelectItem>
            {THEMES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les formats</SelectItem>
            {FORMATS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {speakersQuery.isPending && <Skeleton className="h-64" />}

      {speakersQuery.isError &&
        !(speakersQuery.error instanceof ApiError && speakersQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {speakersQuery.error instanceof ApiError
              ? speakersQuery.error.detail
              : "Impossible de charger les candidatures."}
          </p>
        )}

      {speakersQuery.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidat</TableHead>
              <TableHead>Thème</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {speakersQuery.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucune candidature pour ces filtres.
                </TableCell>
              </TableRow>
            )}
            {speakersQuery.data.map((s) => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => setSelected(s)}>
                <TableCell>
                  <div className="font-medium">
                    {s.first_name} {s.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.title_role}</div>
                </TableCell>
                <TableCell>{s.theme}</TableCell>
                <TableCell>{s.intervention_format}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(s.status)}>{STATUS_LABELS[s.status]}</Badge>
                </TableCell>
                <TableCell>{dateTime.format(new Date(s.created_at))}</TableCell>
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
                <DetailRow label="Rôle / titre" value={selected.title_role} />
                <DetailRow label="Entreprise" value={selected.company} />
                <DetailRow label="Pays" value={selected.country} />
                <DetailRow label="Ville de départ" value={selected.departure_city} />
                <DetailRow label="Email" value={selected.email} />
                <DetailRow label="WhatsApp" value={selected.phone_whatsapp} />
                <DetailRow label="LinkedIn" value={selected.linkedin_url} />
                <DetailRow label="Site web" value={selected.website_url} />
                <DetailRow label="Thème" value={selected.theme} />
                <DetailRow label="Format" value={selected.intervention_format} />
                <DetailRow label="Niveau audience" value={selected.audience_level} />
                <DetailRow label="Langue" value={selected.language} />
                <DetailRow label="Disponibilité" value={selected.availability} />
                <DetailRow label="Vidéo" value={selected.video_link} />
                <DetailRow
                  label="Hébergement nécessaire"
                  value={selected.needs_accommodation ? "Oui" : "Non"}
                />
                <DetailRow label="Consentement vidéo" value={selected.video_consent} />
                <DetailRow
                  label="Consentement RGPD"
                  value={selected.gdpr_consent ? "Oui" : "Non"}
                />
              </dl>

              <div className="space-y-3">
                <DetailRow label="Titre de l'intervention" value={selected.intervention_title} />
                <DetailRow label="Résumé" value={selected.summary} />
                <DetailRow label="Expérience passée" value={selected.past_experience} />
                <DetailRow label="Motivation" value={selected.motivation} />
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
