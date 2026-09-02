import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPassType,
  listPassTypes,
  updatePassType,
  type PassType,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function PassTypeCard({ passType: p }: { passType: PassType }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(p.name);
  const [price, setPrice] = useState(String(p.price));
  const [description, setDescription] = useState(p.description ?? "");
  const [inclusions, setInclusions] = useState(p.inclusions ?? "");
  const [maxDays, setMaxDays] = useState(String(p.max_days));
  const [isActive, setIsActive] = useState(p.is_active);

  useEffect(() => {
    setName(p.name);
    setPrice(String(p.price));
    setDescription(p.description ?? "");
    setInclusions(p.inclusions ?? "");
    setMaxDays(String(p.max_days));
    setIsActive(p.is_active);
  }, [p.name, p.price, p.description, p.inclusions, p.max_days, p.is_active]);

  const mutation = useMutation({
    mutationFn: () =>
      updatePassType(p.id, {
        name,
        price: Number(price),
        description: description || undefined,
        inclusions: inclusions || undefined,
        max_days: Number(maxDays),
        is_active: isActive,
      }),
    onSuccess: () => {
      toast.success(`${name} mis à jour.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "pass-types"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const dirty =
    name !== p.name ||
    price !== String(p.price) ||
    description !== (p.description ?? "") ||
    inclusions !== (p.inclusions ?? "") ||
    maxDays !== String(p.max_days) ||
    isActive !== p.is_active;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-ink">{p.name}</CardTitle>
        <Badge variant={p.is_active ? "default" : "secondary"}>
          {p.is_active ? "Actif" : "Inactif"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor={`name-${p.id}`}>Nom</Label>
            <Input id={`name-${p.id}`} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`price-${p.id}`}>Prix (FCFA)</Label>
            <Input
              id={`price-${p.id}`}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`description-${p.id}`}>Description</Label>
          <Textarea
            id={`description-${p.id}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`inclusions-${p.id}`}>Inclusions</Label>
          <Textarea
            id={`inclusions-${p.id}`}
            value={inclusions}
            onChange={(e) => setInclusions(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="space-y-1">
            <Label htmlFor={`max-days-${p.id}`}>Jours max</Label>
            <Input
              id={`max-days-${p.id}`}
              type="number"
              min={1}
              value={maxDays}
              onChange={(e) => setMaxDays(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch id={`active-${p.id}`} checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor={`active-${p.id}`}>Pass actif</Label>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={!dirty || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NewPassTypeForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [maxDays, setMaxDays] = useState("1");
  const [isActive, setIsActive] = useState(true);

  const mutation = useMutation({
    mutationFn: () =>
      createPassType({
        name,
        price: Number(price),
        description: description || undefined,
        inclusions: inclusions || undefined,
        max_days: Number(maxDays),
        is_active: isActive,
      }),
    onSuccess: () => {
      toast.success("Type de pass créé.");
      setName("");
      setPrice("");
      setDescription("");
      setInclusions("");
      setMaxDays("1");
      setIsActive(true);
      queryClient.invalidateQueries({ queryKey: ["admin", "pass-types"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit = name.trim() !== "" && price.trim() !== "";

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-ink">Nouveau type de pass</CardTitle>
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
          <Label htmlFor="new-description">Description</Label>
          <Textarea
            id="new-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-inclusions">Inclusions</Label>
          <Textarea
            id="new-inclusions"
            value={inclusions}
            onChange={(e) => setInclusions(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="space-y-1">
            <Label htmlFor="new-max-days">Jours max</Label>
            <Input
              id="new-max-days"
              type="number"
              min={1}
              value={maxDays}
              onChange={(e) => setMaxDays(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="new-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="new-active">Pass actif</Label>
          </div>
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

export function AdminPassTypesPage() {
  const passTypesQuery = useQuery({
    queryKey: ["admin", "pass-types"],
    queryFn: listPassTypes,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Types de pass</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <NewPassTypeForm />

      {passTypesQuery.isPending && (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      )}

      {passTypesQuery.isError &&
        !(passTypesQuery.error instanceof ApiError && passTypesQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {passTypesQuery.error instanceof ApiError
              ? passTypesQuery.error.detail
              : "Impossible de charger les types de pass."}
          </p>
        )}

      {passTypesQuery.data && (
        <div className="grid gap-4">
          {passTypesQuery.data.map((p) => (
            <PassTypeCard key={p.id} passType={p} />
          ))}
        </div>
      )}
    </div>
  );
}
