import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createExhibitor,
  listExhibitors,
  updateExhibitorStatus,
  type Exhibitor,
  type ExhibitorCreate,
  type ExhibitorStatus,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { COUNTRIES, PARTNER_SECTEURS } from "../../lib/forms/constants";
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

const STAND_TYPES = ["Standard", "Premium", "Mutualisé"];

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

type ExhibitorFormState = {
  organization_name: string;
  sector: string;
  country: string;
  city: string;
  website_url: string;
  contact_name: string;
  contact_position: string;
  contact_email: string;
  contact_phone: string;
  stand_type: string;
  reps_count: string;
  products_services: string;
  equipment_needs: string;
};

const EMPTY_EXHIBITOR_FORM: ExhibitorFormState = {
  organization_name: "",
  sector: "",
  country: "",
  city: "",
  website_url: "",
  contact_name: "",
  contact_position: "",
  contact_email: "",
  contact_phone: "",
  stand_type: "",
  reps_count: "",
  products_services: "",
  equipment_needs: "",
};

function CreateExhibitorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ExhibitorFormState>(EMPTY_EXHIBITOR_FORM);

  const mutation = useMutation({
    mutationFn: () => {
      const body: ExhibitorCreate = {
        organization_name: form.organization_name,
        sector: form.sector,
        country: form.country,
        city: form.city,
        contact_name: form.contact_name,
        contact_position: form.contact_position,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        stand_type: form.stand_type,
        reps_count: Number(form.reps_count),
        products_services: form.products_services,
        website_url: form.website_url || undefined,
        equipment_needs: form.equipment_needs || undefined,
      };
      return createExhibitor(body);
    },
    onSuccess: () => {
      toast.success("Exposant créé.");
      setForm(EMPTY_EXHIBITOR_FORM);
      queryClient.invalidateQueries({ queryKey: ["admin", "exhibitors"] });
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
    form.stand_type.trim() !== "" &&
    form.reps_count.trim() !== "" &&
    form.products_services.trim() !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setForm(EMPTY_EXHIBITOR_FORM);
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvel exposant</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="ex-org">Organisation</Label>
              <Input
                id="ex-org"
                value={form.organization_name}
                onChange={(e) => setForm((f) => ({ ...f, organization_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ex-sector">Secteur</Label>
              <Select value={form.sector} onValueChange={(v) => setForm((f) => ({ ...f, sector: v }))}>
                <SelectTrigger id="ex-sector">
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
              <Label htmlFor="ex-country">Pays</Label>
              <Select value={form.country} onValueChange={(v) => setForm((f) => ({ ...f, country: v }))}>
                <SelectTrigger id="ex-country">
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
              <Label htmlFor="ex-city">Ville</Label>
              <Input
                id="ex-city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="ex-website">Site web</Label>
            <Input
              id="ex-website"
              value={form.website_url}
              onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="ex-contact-name">Contact</Label>
              <Input
                id="ex-contact-name"
                value={form.contact_name}
                onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ex-contact-position">Fonction</Label>
              <Input
                id="ex-contact-position"
                value={form.contact_position}
                onChange={(e) => setForm((f) => ({ ...f, contact_position: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="ex-contact-email">Email</Label>
              <Input
                id="ex-contact-email"
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ex-contact-phone">Téléphone</Label>
              <Input
                id="ex-contact-phone"
                value={form.contact_phone}
                onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="ex-stand-type">Type de stand</Label>
              <Select
                value={form.stand_type}
                onValueChange={(v) => setForm((f) => ({ ...f, stand_type: v }))}
              >
                <SelectTrigger id="ex-stand-type">
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  {STAND_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="ex-reps">Nombre de représentants</Label>
              <Input
                id="ex-reps"
                type="number"
                value={form.reps_count}
                onChange={(e) => setForm((f) => ({ ...f, reps_count: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="ex-products">Produits / services</Label>
            <Textarea
              id="ex-products"
              value={form.products_services}
              onChange={(e) => setForm((f) => ({ ...f, products_services: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="ex-equipment">Besoins équipement</Label>
            <Textarea
              id="ex-equipment"
              value={form.equipment_needs}
              onChange={(e) => setForm((f) => ({ ...f, equipment_needs: e.target.value }))}
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

export function AdminExhibitorsPage() {
  const [status, setStatus] = useState<ExhibitorStatus | "all">("pending");
  const [standType, setStandType] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Exhibitor | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const queryClient = useQueryClient();

  const filters = {
    status: status === "all" ? undefined : status,
    stand_type: standType === "all" ? undefined : standType,
  };

  const exhibitorsQuery = useQuery({
    queryKey: ["admin", "exhibitors", filters],
    queryFn: () => listExhibitors(filters),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ExhibitorStatus }) =>
      updateExhibitorStatus(id, status),
    onSuccess: (updated) => {
      toast.success(`Statut mis à jour : ${STATUS_LABELS[updated.status]}.`);
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "exhibitors"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Candidatures exposants</h1>
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

        <Select value={standType} onValueChange={setStandType}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Type de stand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types de stand</SelectItem>
            {STAND_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {exhibitorsQuery.isPending && <Skeleton className="h-64" />}

      {exhibitorsQuery.isError &&
        !(exhibitorsQuery.error instanceof ApiError && exhibitorsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {exhibitorsQuery.error instanceof ApiError
              ? exhibitorsQuery.error.detail
              : "Impossible de charger les candidatures."}
          </p>
        )}

      {exhibitorsQuery.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organisation</TableHead>
              <TableHead>Stand</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exhibitorsQuery.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucune candidature pour ces filtres.
                </TableCell>
              </TableRow>
            )}
            {exhibitorsQuery.data.map((e) => (
              <TableRow key={e.id} className="cursor-pointer" onClick={() => setSelected(e)}>
                <TableCell>
                  <div className="font-medium">{e.organization_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.city}, {e.country}
                  </div>
                </TableCell>
                <TableCell>{e.stand_type}</TableCell>
                <TableCell>{e.contact_name}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(e.status)}>{STATUS_LABELS[e.status]}</Badge>
                </TableCell>
                <TableCell>{dateTime.format(new Date(e.created_at))}</TableCell>
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
                <DetailRow label="Type de stand" value={selected.stand_type} />
                <DetailRow label="Nombre de représentants" value={selected.reps_count.toString()} />
                <DetailRow label="Niveau partenaire lié" value={selected.linked_partner_level} />
                <DetailRow label="Moyen de paiement" value={selected.payment_method} />
                <DetailRow
                  label="Règlement accepté"
                  value={selected.rules_accepted ? "Oui" : "Non"}
                />
                <DetailRow
                  label="Consentement RGPD"
                  value={selected.gdpr_consent ? "Oui" : "Non"}
                />
              </dl>

              <div className="space-y-3">
                <DetailRow label="Produits / services" value={selected.products_services} />
                <DetailRow label="Besoins équipement" value={selected.equipment_needs} />
                <DetailRow label="Activités annexes" value={selected.side_activities} />
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

      <CreateExhibitorDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
