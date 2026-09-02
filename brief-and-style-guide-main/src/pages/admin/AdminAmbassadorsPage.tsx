import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAmbassador,
  listAmbassadors,
  updateAmbassadorStatus,
  type Ambassador,
  type AmbassadorCreate,
  type SpeakerApplicationStatus,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import {
  AMBASSADEUR_CANAUX,
  AMBASSADEUR_FOLLOWERS,
  AMBASSADEUR_PROFILS,
  AMBASSADEUR_REACH,
  COUNTRIES,
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

const PROFILES = ["Étudiant", "Professionnel", "Créateur de contenu", "Entrepreneur"];

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

type AmbassadorFormState = {
  first_name: string;
  last_name: string;
  age: string;
  country: string;
  city: string;
  email: string;
  phone_whatsapp: string;
  motivation: string;
  mobilization_plan: string;
  preferred_channels: string;
  current_profile: string;
  institution_company: string;
  linkedin_url: string;
  followers_range: string;
  estimated_reach: string;
  previous_synca: boolean;
};

const EMPTY_AMBASSADOR_FORM: AmbassadorFormState = {
  first_name: "",
  last_name: "",
  age: "",
  country: "",
  city: "",
  email: "",
  phone_whatsapp: "",
  motivation: "",
  mobilization_plan: "",
  preferred_channels: "",
  current_profile: "",
  institution_company: "",
  linkedin_url: "",
  followers_range: "",
  estimated_reach: "",
  previous_synca: false,
};

function CreateAmbassadorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AmbassadorFormState>(EMPTY_AMBASSADOR_FORM);

  const mutation = useMutation({
    mutationFn: () => {
      const body: AmbassadorCreate = {
        first_name: form.first_name,
        last_name: form.last_name,
        age: Number(form.age),
        country: form.country,
        city: form.city,
        email: form.email,
        phone_whatsapp: form.phone_whatsapp,
        motivation: form.motivation,
        mobilization_plan: form.mobilization_plan,
        preferred_channels: form.preferred_channels,
        current_profile: form.current_profile || undefined,
        institution_company: form.institution_company || undefined,
        linkedin_url: form.linkedin_url || undefined,
        followers_range: form.followers_range || undefined,
        estimated_reach: form.estimated_reach || undefined,
        previous_synca: form.previous_synca,
      };
      return createAmbassador(body);
    },
    onSuccess: () => {
      toast.success("Ambassadeur créé.");
      setForm(EMPTY_AMBASSADOR_FORM);
      queryClient.invalidateQueries({ queryKey: ["admin", "ambassadors"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit =
    form.first_name.trim() !== "" &&
    form.last_name.trim() !== "" &&
    form.age.trim() !== "" &&
    form.country.trim() !== "" &&
    form.city.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone_whatsapp.trim() !== "" &&
    form.motivation.trim() !== "" &&
    form.mobilization_plan.trim() !== "" &&
    form.preferred_channels.trim() !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setForm(EMPTY_AMBASSADOR_FORM);
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvel ambassadeur</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="am-first-name">Prénom</Label>
              <Input
                id="am-first-name"
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="am-last-name">Nom</Label>
              <Input
                id="am-last-name"
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="am-age">Âge</Label>
              <Input
                id="am-age"
                type="number"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="am-country">Pays</Label>
              <Select value={form.country} onValueChange={(v) => setForm((f) => ({ ...f, country: v }))}>
                <SelectTrigger id="am-country">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="am-city">Ville</Label>
              <Input
                id="am-city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="am-email">Email</Label>
              <Input
                id="am-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="am-phone">WhatsApp</Label>
              <Input
                id="am-phone"
                value={form.phone_whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, phone_whatsapp: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="am-profile">Profil</Label>
              <Select
                value={form.current_profile}
                onValueChange={(v) => setForm((f) => ({ ...f, current_profile: v }))}
              >
                <SelectTrigger id="am-profile">
                  <SelectValue placeholder="Choisir un profil" />
                </SelectTrigger>
                <SelectContent>
                  {AMBASSADEUR_PROFILS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="am-institution">Établissement / entreprise</Label>
            <Input
              id="am-institution"
              value={form.institution_company}
              onChange={(e) => setForm((f) => ({ ...f, institution_company: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="am-linkedin">LinkedIn</Label>
            <Input
              id="am-linkedin"
              value={form.linkedin_url}
              onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="am-followers">Audience</Label>
              <Select
                value={form.followers_range}
                onValueChange={(v) => setForm((f) => ({ ...f, followers_range: v }))}
              >
                <SelectTrigger id="am-followers">
                  <SelectValue placeholder="Choisir une tranche" />
                </SelectTrigger>
                <SelectContent>
                  {AMBASSADEUR_FOLLOWERS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="am-reach">Portée estimée</Label>
              <Select
                value={form.estimated_reach}
                onValueChange={(v) => setForm((f) => ({ ...f, estimated_reach: v }))}
              >
                <SelectTrigger id="am-reach">
                  <SelectValue placeholder="Choisir une portée" />
                </SelectTrigger>
                <SelectContent>
                  {AMBASSADEUR_REACH.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="am-channels">Canaux préférés</Label>
            <Select
              value={form.preferred_channels}
              onValueChange={(v) => setForm((f) => ({ ...f, preferred_channels: v }))}
            >
              <SelectTrigger id="am-channels">
                <SelectValue placeholder="Choisir un canal" />
              </SelectTrigger>
              <SelectContent>
                {AMBASSADEUR_CANAUX.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="am-motivation">Motivation</Label>
            <Textarea
              id="am-motivation"
              value={form.motivation}
              onChange={(e) => setForm((f) => ({ ...f, motivation: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="am-plan">Plan de mobilisation</Label>
            <Textarea
              id="am-plan"
              value={form.mobilization_plan}
              onChange={(e) => setForm((f) => ({ ...f, mobilization_plan: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="am-previous"
              checked={form.previous_synca}
              onCheckedChange={(v) => setForm((f) => ({ ...f, previous_synca: v }))}
            />
            <Label htmlFor="am-previous">Déjà participé à Synca</Label>
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

export function AdminAmbassadorsPage() {
  const [status, setStatus] = useState<SpeakerApplicationStatus | "all">("pending");
  const [profile, setProfile] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Ambassador | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

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

      <CreateAmbassadorDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
