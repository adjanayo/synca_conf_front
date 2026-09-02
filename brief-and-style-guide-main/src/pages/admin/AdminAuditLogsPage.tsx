import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listAuditLogs } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
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

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "medium" });

export function AdminAuditLogsPage() {
  const [success, setSuccess] = useState<"all" | "true" | "false">("all");
  const [email, setEmail] = useState("");

  const filters = {
    success: success === "all" ? undefined : success === "true",
    email: email.trim() || undefined,
  };

  const logsQuery = useQuery({
    queryKey: ["admin", "audit-logs", filters],
    queryFn: () => listAuditLogs(filters),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Journal d'audit</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={success} onValueChange={(v) => setSuccess(v as typeof success)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Résultat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="true">Réussites</SelectItem>
            <SelectItem value="false">Échecs</SelectItem>
          </SelectContent>
        </Select>
        <Input
          className="w-64"
          placeholder="Filtrer par email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {logsQuery.isPending && <Skeleton className="h-64" />}

      {logsQuery.isError &&
        !(logsQuery.error instanceof ApiError && logsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {logsQuery.error instanceof ApiError
              ? logsQuery.error.detail
              : "Impossible de charger le journal d'audit."}
          </p>
        )}

      {logsQuery.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Événement</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Résultat</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logsQuery.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucune entrée pour ces filtres.
                </TableCell>
              </TableRow>
            )}
            {logsQuery.data.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.event}</TableCell>
                <TableCell>{log.email}</TableCell>
                <TableCell>{log.ip_address ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={log.success ? "secondary" : "destructive"}>
                    {log.success ? "Réussi" : "Échoué"}
                  </Badge>
                </TableCell>
                <TableCell>{dateTime.format(new Date(log.created_at))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
