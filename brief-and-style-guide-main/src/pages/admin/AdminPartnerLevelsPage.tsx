import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPartnerLevel,
  deletePartnerLevel,
  listPartnerLevelsAdmin,
  updatePartnerLevel,
  type PartnerLevel,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function PartnerLevelCard({ level: l }: { level: PartnerLevel }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(l.name);
  const [price, setPrice] = useState(String(l.price));
  const [benefits, setBenefits] = useState(l.benefits ?? "");
  const [sortOrder, setSortOrder] = useState(String(l.sort_order));

  useEffect(() => {
    setName(l.name);
    setPrice(String(l.price));
    setBenefits(l.benefits ?? "");
    setSortOrder(String(l.sort_order));
  }, [l.name, l.price, l.benefits, l.sort_order]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updatePartnerLevel(l.id, {
        name,
        price: Number(price),
        benefits: benefits || undefined,
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

  const dirty =
    name !== l.name ||
    price !== String(l.price) ||
    benefits !== (l.benefits ?? "") ||
    sortOrder !== String(l.sort_order);

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
          <Label htmlFor={`benefits-${l.id}`}>Avantages</Label>
          <Textarea
            id={`benefits-${l.id}`}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
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

function NewPartnerLevelForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [benefits, setBenefits] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const mutation = useMutation({
    mutationFn: () =>
      createPartnerLevel({
        name,
        price: Number(price),
        benefits: benefits || undefined,
        sort_order: Number(sortOrder),
      }),
    onSuccess: () => {
      toast.success("Palier de partenariat créé.");
      setName("");
      setPrice("");
      setBenefits("");
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
          <Label htmlFor="new-benefits">Avantages</Label>
          <Textarea
            id="new-benefits"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
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

      <NewPartnerLevelForm />

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
            <PartnerLevelCard key={l.id} level={l} />
          ))}
        </div>
      )}
    </div>
  );
}
