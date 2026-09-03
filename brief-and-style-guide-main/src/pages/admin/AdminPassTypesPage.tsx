import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPassContent,
  createPassType,
  deletePassContent,
  deletePassType,
  listPassContents,
  listPassTypes,
  updatePassType,
  type PassContent,
  type PassType,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function toggleId(ids: number[], id: number, checked: boolean): number[] {
  return checked ? [...ids, id] : ids.filter((x) => x !== id);
}

function ContentCheckboxList({
  contents,
  selectedIds,
  onToggle,
  idPrefix,
}: {
  contents: PassContent[];
  selectedIds: number[];
  onToggle: (id: number, checked: boolean) => void;
  idPrefix: string;
}) {
  if (contents.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun contenu dans le catalogue pour l'instant.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {contents.map((c) => (
        <label key={c.id} htmlFor={`${idPrefix}-content-${c.id}`} className="flex items-center gap-2 text-sm">
          <Checkbox
            id={`${idPrefix}-content-${c.id}`}
            checked={selectedIds.includes(c.id)}
            onCheckedChange={(checked) => onToggle(c.id, checked === true)}
          />
          {c.label}
        </label>
      ))}
    </div>
  );
}

function PassContentCatalog({ contents }: { contents: PassContent[] }) {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createPassContent(label),
    onSuccess: () => {
      toast.success("Contenu ajouté au catalogue.");
      setLabel("");
      queryClient.invalidateQueries({ queryKey: ["admin", "pass-contents"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePassContent(id),
    onSuccess: () => {
      toast.success("Contenu supprimé du catalogue.");
      queryClient.invalidateQueries({ queryKey: ["admin", "pass-contents"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "pass-types"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-ink">Catalogue des contenus de pass</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Bénéfices/inclusions réutilisables — coche ceux qui s'appliquent à chaque pass ci-dessous.
        </p>
        {contents.length > 0 && (
          <ul className="space-y-1.5">
            {contents.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{c.label}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (window.confirm(`Supprimer "${c.label}" du catalogue ?`)) {
                      deleteMutation.mutate(c.id);
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
            placeholder="Nouveau contenu (ex : Déjeuner inclus)"
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

function PassTypeCard({ passType: p, contents }: { passType: PassType; contents: PassContent[] }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(p.name);
  const [price, setPrice] = useState(String(p.price));
  const [description, setDescription] = useState(p.description ?? "");
  const [contentIds, setContentIds] = useState(p.contents.map((c) => c.id));
  const [maxDays, setMaxDays] = useState(String(p.max_days));
  const [isActive, setIsActive] = useState(p.is_active);

  useEffect(() => {
    setName(p.name);
    setPrice(String(p.price));
    setDescription(p.description ?? "");
    setContentIds(p.contents.map((c) => c.id));
    setMaxDays(String(p.max_days));
    setIsActive(p.is_active);
  }, [p.name, p.price, p.description, p.contents, p.max_days, p.is_active]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updatePassType(p.id, {
        name,
        price: Number(price),
        description: description || undefined,
        content_ids: contentIds,
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

  const deleteMutation = useMutation({
    mutationFn: () => deletePassType(p.id),
    onSuccess: () => {
      toast.success(`${p.name} supprimé.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "pass-types"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const sameContentIds =
    contentIds.length === p.contents.length &&
    contentIds.every((id) => p.contents.some((c) => c.id === id));
  const dirty =
    name !== p.name ||
    price !== String(p.price) ||
    description !== (p.description ?? "") ||
    !sameContentIds ||
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
          <Label>Contenus inclus</Label>
          <ContentCheckboxList
            contents={contents}
            selectedIds={contentIds}
            onToggle={(id, checked) => setContentIds((ids) => toggleId(ids, id, checked))}
            idPrefix={`pass-${p.id}`}
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
        <div className="flex justify-between">
          <Button
            size="sm"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (window.confirm(`Supprimer le pass "${p.name}" ?`)) deleteMutation.mutate();
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

function NewPassTypeForm({ contents }: { contents: PassContent[] }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [contentIds, setContentIds] = useState<number[]>([]);
  const [maxDays, setMaxDays] = useState("1");
  const [isActive, setIsActive] = useState(true);

  const mutation = useMutation({
    mutationFn: () =>
      createPassType({
        name,
        price: Number(price),
        description: description || undefined,
        content_ids: contentIds,
        max_days: Number(maxDays),
        is_active: isActive,
      }),
    onSuccess: () => {
      toast.success("Type de pass créé.");
      setName("");
      setPrice("");
      setDescription("");
      setContentIds([]);
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
          <Label>Contenus inclus</Label>
          <ContentCheckboxList
            contents={contents}
            selectedIds={contentIds}
            onToggle={(id, checked) => setContentIds((ids) => toggleId(ids, id, checked))}
            idPrefix="new-pass"
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
  const passContentsQuery = useQuery({
    queryKey: ["admin", "pass-contents"],
    queryFn: listPassContents,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });
  const contents = passContentsQuery.data ?? [];

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

      <PassContentCatalog contents={contents} />

      <NewPassTypeForm contents={contents} />

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
            <PassTypeCard key={p.id} passType={p} contents={contents} />
          ))}
        </div>
      )}
    </div>
  );
}
