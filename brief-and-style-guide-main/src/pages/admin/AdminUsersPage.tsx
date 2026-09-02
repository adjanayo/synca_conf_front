import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAdminUser,
  getAdminMe,
  listAdminUsers,
  listRoles,
  updateAdminUser,
  type AdminUserAccount,
  type AdminUserStatus,
} from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
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

const LIMIT = 20;

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

function statusVariant(status: AdminUserStatus): "default" | "secondary" | "destructive" {
  if (status === "active") return "default";
  if (status === "disabled") return "destructive";
  return "secondary";
}

const STATUS_LABELS: Record<AdminUserStatus, string> = {
  active: "Actif",
  disabled: "Désactivé",
  archived: "Archivé",
};

function CreateUserDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<string>("");

  const rolesQuery = useQuery({ queryKey: ["admin", "roles"], queryFn: listRoles });

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      toast.success("Compte créé.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setOpen(false);
      setEmail("");
      setPassword("");
      setRoleId("");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Créer un compte</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau compte admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-user-email">Email</Label>
            <Input
              id="new-user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-user-password">Mot de passe</Label>
            <Input
              id="new-user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Min. 12 caractères, majuscule, minuscule, chiffre, symbole.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Rôle</Label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un rôle" />
              </SelectTrigger>
              <SelectContent>
                {rolesQuery.data?.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!email || !password || !roleId || createMutation.isPending}
            onClick={() =>
              createMutation.mutate({ email, password, role_id: Number(roleId) })
            }
          >
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserRowActions({ user, currentUserId }: { user: AdminUserAccount; currentUserId?: number }) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: (status: AdminUserStatus) => updateAdminUser(user.id, { status }),
    onSuccess: (updated) => {
      toast.success(`Compte ${updated.email} : ${STATUS_LABELS[updated.status]}.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  const isSelf = user.id === currentUserId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isSelf}>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.status !== "active" && (
          <DropdownMenuItem onClick={() => statusMutation.mutate("active")}>
            Activer
          </DropdownMenuItem>
        )}
        {user.status !== "disabled" && (
          <DropdownMenuItem onClick={() => statusMutation.mutate("disabled")}>
            Désactiver
          </DropdownMenuItem>
        )}
        {user.status !== "archived" && (
          <DropdownMenuItem onClick={() => statusMutation.mutate("archived")}>
            Archiver
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminUsersPage() {
  const [offset, setOffset] = useState(0);

  const meQuery = useQuery({ queryKey: ["admin", "me"], queryFn: getAdminMe });

  const usersQuery = useQuery({
    queryKey: ["admin", "users", offset],
    queryFn: () => listAdminUsers({ limit: LIMIT, offset }),
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const hasMore = (usersQuery.data?.length ?? 0) === LIMIT;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Comptes admin</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
        <CreateUserDialog />
      </div>

      {usersQuery.isPending && <Skeleton className="h-64" />}

      {usersQuery.isError &&
        !(usersQuery.error instanceof ApiError && usersQuery.error.status === 401) && (
          <p role="alert" className="text-sm text-destructive">
            {usersQuery.error instanceof ApiError
              ? usersQuery.error.detail
              : "Impossible de charger les comptes."}
          </p>
        )}

      {usersQuery.data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersQuery.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Aucun compte.
                  </TableCell>
                </TableRow>
              )}
              {usersQuery.data.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.email}
                    {u.id === meQuery.data?.id && (
                      <span className="ml-2 text-xs text-muted-foreground">(vous)</span>
                    )}
                  </TableCell>
                  <TableCell>{u.role_name}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(u.status)}>{STATUS_LABELS[u.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    {u.last_login ? dateTime.format(new Date(u.last_login)) : "—"}
                  </TableCell>
                  <TableCell>{dateTime.format(new Date(u.created_at))}</TableCell>
                  <TableCell className="text-right">
                    <UserRowActions user={u} currentUserId={meQuery.data?.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={offset === 0}
              onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
            >
              Précédent
            </Button>
            <span className="text-sm text-muted-foreground">
              {offset + 1}–{offset + usersQuery.data.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore}
              onClick={() => setOffset((o) => o + LIMIT)}
            >
              Suivant
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
