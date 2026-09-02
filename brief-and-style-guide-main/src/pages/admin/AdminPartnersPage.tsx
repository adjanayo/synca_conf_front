import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPartner,
  listPartners,
  updatePartnerStatus,
  type ExhibitorStatus,
  type Partner,
  type PartnerCreate,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { COUNTRIES, PARTNER_BUDGET, PARTNER_OBJECTIFS, PARTNER_SECTEURS } from "../../lib/forms/constants";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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

const STATUS_LABELS: Record<ExhibitorStatus, string> = {
  pending: "En attente",
  contacted: "Contacté",
  negotiating: "En négociation",
  confirmed: "Confirmé",
  rejected: "Rejeté",
};

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

type PartnerFormState = {
  organization_name: string;
  sector: string;
  country: string;
  city: string;
  website_url: string;
  contact_name: string;
  contact_position: string;
  contact_email: string;
  contact_phone: string;
  level_id: string;
  objectives: string;
  has_budget: string;
  message: string;
};

const EMPTY_PARTNER_FORM: PartnerFormState = {
  organization_name: "",
  sector: "",
  country: "",
  city: "",
  website_url: "",
  contact_name: "",
  contact_position: "",
  contact_email: "",
  contact_phone: "",
  level_id: "",
  objectives: "",
  has_budget: "",
  message: "",
};

function CreatePartnerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PartnerFormState>(EMPTY_PARTNER_FORM);

  const mutation = useMutation({
    mutationFn: () => {
      const body: PartnerCreate = {
        organization_name: form.organization_name,
        sector: form.sector,
        country: form.country,
        city: form.city,
        contact_name: form.contact_name,
        contact_position: form.contact_position,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        level_id: Number(form.level_id),
        objectives: form.objectives,
        website_url: form.website_url || undefined,
        has_budget: form.has_budget || undefined,
        message: form.message || undefined,
      };
      return createPartner(body);
    },
    onSuccess: () => {
      toast.success("Partenaire créé.");
      setForm(EMPTY_PARTNER_FORM);
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit =
    form.organization_name.trim() !== "" &&
    form.sector.trim() !== "" &&
    form.country.trim() !== "" &&
    form.city.trim() !== "" &&
    form.contact_name.trim() !== "" &&
    form.contact_position.trim() !== "" &&
    form.contact_email.trim() !== "" &&
    form.contact_phone.trim() !== "" &&
    form.level_id.trim() !== "" &&
    form.objectives.trim() !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setForm(EMPTY_PARTNER_FORM);
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau partenaire</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="pa-org">Organisation</Label>
              <Input
                id="pa-org"
                value={form.organization_name}
                onChange={(e) => setForm((f) => ({ ...f, organization_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pa-sector">Secteur</Label>
              <Select value={form.sector} onValueChange={(v) => setForm((f) => ({ ...f, sector: v }))}>
                <SelectTrigger id="pa-sector">
                  <SelectValue placeholder="Choisir un secteur" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNER_SECTEURS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="pa-country">Pays</Label>
              <Select value={form.country} onValueChange={(v) => setForm((f) => ({ ...f, country: v }))}>
                <SelectTrigger id="pa-country">
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
              <Label htmlFor="pa-city">Ville</Label>
              <Input
                id="pa-city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="pa-website">Site web</Label>
            <Input
              id="pa-website"
              value={form.website_url}
              onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="pa-contact-name">Contact</Label>
              <Input
                id="pa-contact-name"
                value={form.contact_name}
                onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pa-contact-position">Fonction</Label>
              <Input
                id="pa-contact-position"
                value={form.contact_position}
                onChange={(e) => setForm((f) => ({ ...f, contact_position: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="pa-contact-email">Email</Label>
              <Input
                id="pa-contact-email"
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pa-contact-phone">Téléphone</Label>
              <Input
                id="pa-contact-phone"
                value={form.contact_phone}
                onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="pa-level">ID niveau</Label>
              <Input
                id="pa-level"
                type="number"
                value={form.level_id}
                onChange={(e) => setForm((f) => ({ ...f, level_id: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pa-budget">Budget disponible</Label>
              <Select
                value={form.has_budget}
                onValueChange={(v) => setForm((f) => ({ ...f, has_budget: v }))}
              >
                <SelectTrigger id="pa-budget">
                  <SelectValue placeholder="Choisir une réponse" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNER_BUDGET.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="pa-objectives">Objectifs</Label>
            <Select
              value={form.objectives}
              onValueChange={(v) => setForm((f) => ({ ...f, objectives: v }))}
            >
              <SelectTrigger id="pa-objectives">
                <SelectValue placeholder="Choisir un objectif" />
              </SelectTrigger>
              <SelectContent>
                {PARTNER_OBJECTIFS.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="pa-message">Message</Label>
            <Textarea
              id="pa-message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
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
  const [createOpen, setCreateOpen] = useState(false);

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
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Créer
        </Button>
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

      <CreatePartnerDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
