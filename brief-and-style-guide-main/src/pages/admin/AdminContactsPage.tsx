import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listContacts, updateContactReadStatus, type ContactMessage } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

export function AdminContactsPage() {
  const [isRead, setIsRead] = useState<"all" | "true" | "false">("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const queryClient = useQueryClient();

  const filters = { is_read: isRead === "all" ? undefined : isRead === "true" };

  const contactsQuery = useQuery({
    queryKey: ["admin", "contacts", filters],
    queryFn: () => listContacts(filters),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const readMutation = useMutation({
    mutationFn: ({ id, is_read }: { id: number; is_read: boolean }) =>
      updateContactReadStatus(id, is_read),
    onSuccess: (updated) => {
      toast.success(updated.is_read ? "Marqué comme lu." : "Marqué comme non lu.");
      setSelected(updated);
      queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Messages de contact</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={isRead} onValueChange={(v) => setIsRead(v as typeof isRead)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="false">Non lus</SelectItem>
            <SelectItem value="true">Lus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {contactsQuery.isPending && <Skeleton className="h-64" />}

      {contactsQuery.isError &&
        !(contactsQuery.error instanceof ApiError && contactsQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {contactsQuery.error instanceof ApiError
              ? contactsQuery.error.detail
              : "Impossible de charger les messages."}
          </p>
        )}

      {contactsQuery.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expéditeur</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactsQuery.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Aucun message pour ces filtres.
                </TableCell>
              </TableRow>
            )}
            {contactsQuery.data.map((c) => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                <TableCell>
                  <div className={c.is_read ? "font-normal" : "font-semibold"}>{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                </TableCell>
                <TableCell>{c.subject ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={c.is_read ? "secondary" : "default"}>
                    {c.is_read ? "Lu" : "Non lu"}
                  </Badge>
                </TableCell>
                <TableCell>{dateTime.format(new Date(c.created_at))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject ?? "Sans sujet"}</DialogTitle>
              </DialogHeader>

              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Nom</dt>
                  <dd className="text-sm text-ink">{selected.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Email</dt>
                  <dd className="text-sm text-ink">{selected.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Date</dt>
                  <dd className="text-sm text-ink">
                    {dateTime.format(new Date(selected.created_at))}
                  </dd>
                </div>
              </dl>

              <div>
                <dt className="text-xs font-medium text-muted-foreground mb-1">Message</dt>
                <dd className="text-sm text-ink whitespace-pre-wrap">{selected.message}</dd>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Badge variant={selected.is_read ? "secondary" : "default"}>
                  {selected.is_read ? "Lu" : "Non lu"}
                </Badge>
                <Button
                  size="sm"
                  disabled={readMutation.isPending}
                  onClick={() =>
                    readMutation.mutate({ id: selected.id, is_read: !selected.is_read })
                  }
                >
                  {selected.is_read ? "Marquer non lu" : "Marquer lu"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
