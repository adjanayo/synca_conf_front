import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { exportPaymentsCsv, exportRegistrationsCsv } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

type ExportKind = "registrations" | "payments";

const EXPORTS: { kind: ExportKind; label: string; run: () => Promise<void> }[] = [
  { kind: "registrations", label: "Inscriptions", run: exportRegistrationsCsv },
  { kind: "payments", label: "Paiements", run: exportPaymentsCsv },
];

export function AdminExportsPage() {
  const [pending, setPending] = useState<ExportKind | null>(null);

  async function handleExport(kind: ExportKind, run: () => Promise<void>) {
    setPending(kind);
    try {
      await run();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Exports CSV</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPORTS.map(({ kind, label, run }) => (
          <Card key={kind}>
            <CardHeader>
              <CardTitle className="text-base">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button disabled={pending === kind} onClick={() => handleExport(kind, run)}>
                {pending === kind ? "Téléchargement…" : "Télécharger le CSV"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
