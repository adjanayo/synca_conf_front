import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPromoCode,
  listPromoCodes,
  updatePromoCode,
  type PromoCode,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function PromoCodeCard({ promoCode: p }: { promoCode: PromoCode }) {
  const queryClient = useQueryClient();
  const [discountPct, setDiscountPct] = useState(String(p.discount_pct));
  const [discountFixed, setDiscountFixed] = useState(
    p.discount_fixed !== null ? String(p.discount_fixed) : ""
  );
  const [usageLimit, setUsageLimit] = useState(p.usage_limit !== null ? String(p.usage_limit) : "");
  const [validFrom, setValidFrom] = useState(p.valid_from ?? "");
  const [validUntil, setValidUntil] = useState(p.valid_until ?? "");
  const [isActive, setIsActive] = useState(p.is_active);

  useEffect(() => {
    setDiscountPct(String(p.discount_pct));
    setDiscountFixed(p.discount_fixed !== null ? String(p.discount_fixed) : "");
    setUsageLimit(p.usage_limit !== null ? String(p.usage_limit) : "");
    setValidFrom(p.valid_from ?? "");
    setValidUntil(p.valid_until ?? "");
    setIsActive(p.is_active);
  }, [p.discount_pct, p.discount_fixed, p.usage_limit, p.valid_from, p.valid_until, p.is_active]);

  const mutation = useMutation({
    mutationFn: () =>
      updatePromoCode(p.id, {
        discount_pct: Number(discountPct),
        discount_fixed: discountFixed.trim() !== "" ? Number(discountFixed) : undefined,
        usage_limit: usageLimit.trim() !== "" ? Number(usageLimit) : undefined,
        valid_from: validFrom || undefined,
        valid_until: validUntil || undefined,
        is_active: isActive,
      }),
    onSuccess: () => {
      toast.success(`${p.code} mis à jour.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "promo-codes"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const dirty =
    discountPct !== String(p.discount_pct) ||
    discountFixed !== (p.discount_fixed !== null ? String(p.discount_fixed) : "") ||
    usageLimit !== (p.usage_limit !== null ? String(p.usage_limit) : "") ||
    validFrom !== (p.valid_from ?? "") ||
    validUntil !== (p.valid_until ?? "") ||
    isActive !== p.is_active;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-ink font-mono">{p.code}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {p.usage_count} utilisation{p.usage_count > 1 ? "s" : ""}
          </span>
          <Badge variant={p.is_active ? "default" : "secondary"}>
            {p.is_active ? "Actif" : "Inactif"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor={`pct-${p.id}`}>Réduction (%)</Label>
            <Input
              id={`pct-${p.id}`}
              type="number"
              min={0}
              max={100}
              value={discountPct}
              onChange={(e) => setDiscountPct(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`fixed-${p.id}`}>Réduction fixe (FCFA)</Label>
            <Input
              id={`fixed-${p.id}`}
              type="number"
              min={0}
              value={discountFixed}
              onChange={(e) => setDiscountFixed(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor={`limit-${p.id}`}>Limite d'utilisation</Label>
            <Input
              id={`limit-${p.id}`}
              type="number"
              min={0}
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`from-${p.id}`}>Valide à partir de</Label>
            <Input
              id={`from-${p.id}`}
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`until-${p.id}`}>Valide jusqu'au</Label>
            <Input
              id={`until-${p.id}`}
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch id={`active-${p.id}`} checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor={`active-${p.id}`}>Code actif</Label>
          </div>
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

function NewPromoCodeForm() {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [discountPct, setDiscountPct] = useState("0");
  const [discountFixed, setDiscountFixed] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [isActive, setIsActive] = useState(true);

  const mutation = useMutation({
    mutationFn: () =>
      createPromoCode({
        code: code.trim().toUpperCase(),
        discount_pct: Number(discountPct),
        discount_fixed: discountFixed.trim() !== "" ? Number(discountFixed) : undefined,
        usage_limit: usageLimit.trim() !== "" ? Number(usageLimit) : undefined,
        valid_from: validFrom || undefined,
        valid_until: validUntil || undefined,
        is_active: isActive,
      }),
    onSuccess: () => {
      toast.success("Code promo créé.");
      setCode("");
      setDiscountPct("0");
      setDiscountFixed("");
      setUsageLimit("");
      setValidFrom("");
      setValidUntil("");
      setIsActive(true);
      queryClient.invalidateQueries({ queryKey: ["admin", "promo-codes"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const canSubmit = code.trim() !== "";

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-ink">Nouveau code promo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="new-code">Code</Label>
          <Input
            id="new-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="EARLYBIRD2027"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="new-pct">Réduction (%)</Label>
            <Input
              id="new-pct"
              type="number"
              min={0}
              max={100}
              value={discountPct}
              onChange={(e) => setDiscountPct(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-fixed">Réduction fixe (FCFA)</Label>
            <Input
              id="new-fixed"
              type="number"
              min={0}
              value={discountFixed}
              onChange={(e) => setDiscountFixed(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="new-limit">Limite d'utilisation</Label>
            <Input
              id="new-limit"
              type="number"
              min={0}
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-from">Valide à partir de</Label>
            <Input
              id="new-from"
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-until">Valide jusqu'au</Label>
            <Input
              id="new-until"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch id="new-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="new-active">Code actif</Label>
          </div>
          <Button size="sm" disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()}>
            Créer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminPromoCodesPage() {
  const promoCodesQuery = useQuery({
    queryKey: ["admin", "promo-codes"],
    queryFn: listPromoCodes,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Codes promo</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <NewPromoCodeForm />

      {promoCodesQuery.isPending && (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {promoCodesQuery.isError &&
        !(promoCodesQuery.error instanceof ApiError && promoCodesQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {promoCodesQuery.error instanceof ApiError
              ? promoCodesQuery.error.detail
              : "Impossible de charger les codes promo."}
          </p>
        )}

      {promoCodesQuery.data && (
        <div className="grid gap-4">
          {promoCodesQuery.data.map((p) => (
            <PromoCodeCard key={p.id} promoCode={p} />
          ))}
        </div>
      )}
    </div>
  );
}
