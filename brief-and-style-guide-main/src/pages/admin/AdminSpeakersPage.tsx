import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSpeaker,
  listSpeakers,
  updateSpeakerStatus,
  type Speaker,
  type SpeakerApplicationStatus,
  type SpeakerCreate,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import {
  COUNTRIES,
  SPEAKER_AUDIENCE,
  SPEAKER_FORMATS,
  SPEAKER_LANGUES,
  SPEAKER_THEMES,
} from "../../lib/forms/constants";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Textarea } from "../../components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const STATUS_LABELS: Record<SpeakerApplicationStatus, string> = {
  pending: "En attente",
  accepted: "Accepté",
  rejected: "Rejeté",
};

const THEMES = ["IA", "EdTech", "Entrepreneuriat", "Carrières", "Impact", "Cybersec"];
const FORMATS = ["Keynote", "Panel", "Workshop", "Lightning Talk", "Fireside Chat"];

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

type SpeakerFormState = {
  first_name: string;
  last_name: string;
  title_role: string;
  company: string;
  country: string;
  email: string;
  phone_whatsapp: string;
  linkedin_url: string;
  intervention_format: string;
  intervention_title: string;
  theme: string;
  summary: string;
  audience_level: string;
  language: string;
  motivation: string;
  needs_accommodation: boolean;
};

const EMPTY_SPEAKER_FORM: SpeakerFormState = {
  first_name: "",
  last_name: "",
  title_role: "",
  company: "",
  country: "",
  email: "",
  phone_whatsapp: "",
  linkedin_url: "",
  intervention_format: "",
  intervention_title: "",
  theme: "",
  summary: "",
  audience_level: "",
  language: "",
  motivation: "",
  needs_accommodation: false,
};

function CreateSpeakerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SpeakerFormState>(EMPTY_SPEAKER_FORM);

  const mutation = useMutation({
    mutationFn: () => {
      const body: SpeakerCreate = {
        first_name: form.first_name,
        last_name: form.last_name,
        title_role: form.title_role,
        country: form.country,
        email: form.email,
        phone_whatsapp: form.phone_whatsapp,
        intervention_format: form.intervention_format,
        intervention_title: form.intervention_title,
        theme: form.theme,
        summary: form.summary,
        motivation: form.motivation,
        company: form.company || undefined,
        linkedin_url: form.linkedin_url || undefined,
        audience_level: form.audience_level || undefined,
        language: form.language || undefined,
        needs_accommodation: form.needs_accommodation,
      };
      return createSpeaker(body);
    },
    onSuccess: () => {
      toast.success("Speaker créé.");
      setForm(EMPTY_SPEAKER_FORM);
      queryClient.invalidateQueries({ queryKey: ["admin", "speakers"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit =
    form.first_name.trim() !== "" &&
    form.last_name.trim() !== "" &&
    form.title_role.trim() !== "" &&
    form.country.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone_whatsapp.trim() !== "" &&
    form.intervention_format.trim() !== "" &&
    form.intervention_title.trim() !== "" &&
    form.theme.trim() !== "" &&
    form.summary.trim() !== "" &&
    form.motivation.trim() !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setForm(EMPTY_SPEAKER_FORM);
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau speaker</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="sp-first-name">Prénom</Label>
              <Input
                id="sp-first-name"
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sp-last-name">Nom</Label>
              <Input
                id="sp-last-name"
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="sp-title-role">Rôle / titre</Label>
              <Input
                id="sp-title-role"
                value={form.title_role}
                onChange={(e) => setForm((f) => ({ ...f, title_role: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sp-company">Entreprise</Label>
              <Input
                id="sp-company"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="sp-country">Pays</Label>
              <Select value={form.country} onValueChange={(v) => setForm((f) => ({ ...f, country: v }))}>
                <SelectTrigger id="sp-country">
                  <SelectValue placeholder="Choisir un pays" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="sp-email">Email</Label>
              <Input
                id="sp-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="sp-phone">WhatsApp</Label>
              <Input
                id="sp-phone"
                value={form.phone_whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, phone_whatsapp: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sp-linkedin">LinkedIn</Label>
              <Input
                id="sp-linkedin"
                value={form.linkedin_url}
                onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="sp-format">Format</Label>
              <Select
                value={form.intervention_format}
                onValueChange={(v) => setForm((f) => ({ ...f, intervention_format: v }))}
              >
                <SelectTrigger id="sp-format">
                  <SelectValue placeholder="Choisir un format" />
                </SelectTrigger>
                <SelectContent>
                  {SPEAKER_FORMATS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="sp-theme">Thème</Label>
              <Select value={form.theme} onValueChange={(v) => setForm((f) => ({ ...f, theme: v }))}>
                <SelectTrigger id="sp-theme">
                  <SelectValue placeholder="Choisir un thème" />
                </SelectTrigger>
                <SelectContent>
                  {SPEAKER_THEMES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="sp-intervention-title">Titre de l'intervention</Label>
            <Input
              id="sp-intervention-title"
              value={form.intervention_title}
              onChange={(e) => setForm((f) => ({ ...f, intervention_title: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="sp-summary">Résumé</Label>
            <Textarea
              id="sp-summary"
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="sp-motivation">Motivation</Label>
            <Textarea
              id="sp-motivation"
              value={form.motivation}
              onChange={(e) => setForm((f) => ({ ...f, motivation: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="sp-audience">Niveau audience</Label>
              <Select
                value={form.audience_level}
                onValueChange={(v) => setForm((f) => ({ ...f, audience_level: v }))}
              >
                <SelectTrigger id="sp-audience">
                  <SelectValue placeholder="Choisir un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {SPEAKER_AUDIENCE.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="sp-language">Langue</Label>
              <Select
                value={form.language}
                onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}
              >
                <SelectTrigger id="sp-language">
                  <SelectValue placeholder="Choisir une langue" />
                </SelectTrigger>
                <SelectContent>
                  {SPEAKER_LANGUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="sp-accommodation"
              checked={form.needs_accommodation}
              onCheckedChange={(v) => setForm((f) => ({ ...f, needs_accommodation: v }))}
            />
            <Label htmlFor="sp-accommodation">Hébergement nécessaire</Label>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  const [createOpen, setCreateOpen] = useState(false);

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
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Créer
        </Button>
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

      <CreateSpeakerDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
