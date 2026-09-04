import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPartnerBenefit,
  createPartnerLevel,
  deletePartnerBenefit,
  deletePartnerLevel,
  listPartnerBenefits,
  listPartnerLevelsAdmin,
  updatePartnerLevel,
  type PartnerBenefit,
  type PartnerLevel,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function toggleId(ids: number[], id: number, checked: boolean): number[] {
  return checked ? [...ids, id] : ids.filter((x) => x !== id);
}

function BenefitCheckboxList({
  benefits,
  selectedIds,
  onToggle,
  idPrefix,
}: {
  benefits: PartnerBenefit[];
  selectedIds: number[];
  onToggle: (id: number, checked: boolean) => void;
  idPrefix: string;
}) {
  if (benefits.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun avantage dans le catalogue pour l'instant.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {benefits.map((b) => (
        <label key={b.id} htmlFor={`${idPrefix}-benefit-${b.id}`} className="flex items-center gap-2 text-sm">
          <Checkbox
            id={`${idPrefix}-benefit-${b.id}`}
            checked={selectedIds.includes(b.id)}
            onCheckedChange={(checked) => onToggle(b.id, checked === true)}
          />
          {b.label}
        </label>
      ))}
    </div>
  );
}

function PartnerBenefitCatalog({ benefits }: { benefits: PartnerBenefit[] }) {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createPartnerBenefit(label),
    onSuccess: () => {
      toast.success("Avantage ajouté au catalogue.");
      setLabel("");
      queryClient.invalidateQueries({ queryKey: ["admin", "partner-benefits"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePartnerBenefit(id),
    onSuccess: () => {
      toast.success("Avantage supprimé du catalogue.");
      queryClient.invalidateQueries({ queryKey: ["admin", "partner-benefits"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "partner-levels"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-ink">Catalogue des avantages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Avantages réutilisables — coche ceux qui s'appliquent à chaque palier ci-dessous.
        </p>
        {benefits.length > 0 && (
          <ul className="space-y-1.5">
            {benefits.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{b.label}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (window.confirm(`Supprimer "${b.label}" du catalogue ?`)) {
                      deleteMutation.mutate(b.id);
                    }
                  }}
                >
                  Supprimer
                </Button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Nouvel avantage (ex : Logo sur le site)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Button
            size="sm"
            disabled={label.trim() === "" || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PartnerLevelCard({ level: l, benefits }: { level: PartnerLevel; benefits: PartnerBenefit[] }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(l.name);
  const [price, setPrice] = useState(String(l.price));
  const [benefitIds, setBenefitIds] = useState(l.benefits.map((b) => b.id));
  const [sortOrder, setSortOrder] = useState(String(l.sort_order));

  useEffect(() => {
    setName(l.name);
    setPrice(String(l.price));
    setBenefitIds(l.benefits.map((b) => b.id));
    setSortOrder(String(l.sort_order));
  }, [l.name, l.price, l.benefits, l.sort_order]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updatePartnerLevel(l.id, {
        name,
        price: Number(price),
        benefit_ids: benefitIds,
        sort_order: Number(sortOrder),
      }),
    onSuccess: () => {
      toast.success(`${name} mis à jour.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "partner-levels"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePartnerLevel(l.id),
    onSuccess: () => {
      toast.success(`${l.name} supprimé.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "partner-levels"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const sameBenefitIds =
    benefitIds.length === l.benefits.length &&
    benefitIds.every((id) => l.benefits.some((b) => b.id === id));
  const dirty =
    name !== l.name || price !== String(l.price) || !sameBenefitIds || sortOrder !== String(l.sort_order);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-ink">{l.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor={`name-${l.id}`}>Nom</Label>
            <Input id={`name-${l.id}`} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`price-${l.id}`}>Prix (FCFA)</Label>
            <Input
              id={`price-${l.id}`}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Avantages inclus</Label>
          <BenefitCheckboxList
            benefits={benefits}
            selectedIds={benefitIds}
            onToggle={(id, checked) => setBenefitIds((ids) => toggleId(ids, id, checked))}
            idPrefix={`level-${l.id}`}
          />
        </div>
        <div className="space-y-1 w-40">
          <Label htmlFor={`sort-${l.id}`}>Ordre d'affichage</Label>
          <Input
            id={`sort-${l.id}`}
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <Button
            size="sm"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (window.confirm(`Supprimer le palier "${l.name}" ?`)) deleteMutation.mutate();
            }}
          >
            Supprimer
          </Button>
          <Button
            size="sm"
            disabled={!dirty || updateMutation.isPending}
            onClick={() => updateMutation.mutate()}
          >
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NewPartnerLevelForm({ benefits }: { benefits: PartnerBenefit[] }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [benefitIds, setBenefitIds] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState("0");

  const mutation = useMutation({
    mutationFn: () =>
      createPartnerLevel({
        name,
        price: Number(price),
        benefit_ids: benefitIds,
        sort_order: Number(sortOrder),
      }),
    onSuccess: () => {
      toast.success("Palier de partenariat créé.");
      setName("");
      setPrice("");
      setBenefitIds([]);
      setSortOrder("0");
      queryClient.invalidateQueries({ queryKey: ["admin", "partner-levels"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit = name.trim() !== "" && price.trim() !== "";

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-ink">Nouveau palier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="new-name">Nom</Label>
            <Input id="new-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-price">Prix (FCFA)</Label>
            <Input
              id="new-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Avantages inclus</Label>
          <BenefitCheckboxList
            benefits={benefits}
            selectedIds={benefitIds}
            onToggle={(id, checked) => setBenefitIds((ids) => toggleId(ids, id, checked))}
            idPrefix="new-level"
          />
        </div>
        <div className="space-y-1 w-40">
          <Label htmlFor="new-sort">Ordre d'affichage</Label>
          <Input
            id="new-sort"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={!canSubmit || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Créer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminPartnerLevelsPage() {
  const levelsQuery = useQuery({
    queryKey: ["admin", "partner-levels"],
    queryFn: listPartnerLevelsAdmin,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });
  const benefitsQuery = useQuery({
    queryKey: ["admin", "partner-benefits"],
    queryFn: listPartnerBenefits,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });
  const benefits = benefitsQuery.data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Paliers de partenariat</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <PartnerBenefitCatalog benefits={benefits} />

      <NewPartnerLevelForm benefits={benefits} />

      {levelsQuery.isPending && (
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {levelsQuery.isError &&
        !(levelsQuery.error instanceof ApiError && levelsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {levelsQuery.error instanceof ApiError
              ? levelsQuery.error.detail
              : "Impossible de charger les paliers."}
          </p>
        )}

      {levelsQuery.data && (
        <div className="grid gap-4">
          {levelsQuery.data.map((l) => (
            <PartnerLevelCard key={l.id} level={l} benefits={benefits} />
          ))}
        </div>
      )}
    </div>
  );
}
