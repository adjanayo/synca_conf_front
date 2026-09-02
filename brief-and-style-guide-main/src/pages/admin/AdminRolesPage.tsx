import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listPermissions, listRoles, updateRolePermissions, type Role } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/client";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export function AdminRolesPage() {
  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ["admin", "roles"],
    queryFn: listRoles,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });
  const permissionsQuery = useQuery({
    queryKey: ["admin", "permissions"],
    queryFn: listPermissions,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status !== 401 && failureCount < 2,
  });

  const [draft, setDraft] = useState<Record<number, string[]>>({});

  useEffect(() => {
    if (!rolesQuery.data) return;
    setDraft((prev) => {
      const next = { ...prev };
      for (const role of rolesQuery.data as Role[]) {
        if (!(role.id in next)) next[role.id] = role.permission_codes;
      }
      return next;
    });
  }, [rolesQuery.data]);

  const updateMutation = useMutation({
    mutationFn: ({ roleId, codes }: { roleId: number; codes: string[] }) =>
      updateRolePermissions(roleId, codes),
    onSuccess: (updated) => {
      toast.success(`Permissions du rôle ${updated.name} mises à jour.`);
      setDraft((prev) => ({ ...prev, [updated.id]: updated.permission_codes }));
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue.");
    },
  });

  function toggle(roleId: number, code: string, checked: boolean) {
    setDraft((prev) => {
      const current = prev[roleId] ?? [];
      const next = checked ? [...current, code] : current.filter((c) => c !== code);
      return { ...prev, [roleId]: next };
    });
  }

  const isLoading = rolesQuery.isPending || permissionsQuery.isPending;
  const isError = rolesQuery.isError || permissionsQuery.isError;
  const error = rolesQuery.error ?? permissionsQuery.error;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Gestion des rôles</h1>
          <Link to=".." className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      {isLoading && <Skeleton className="h-64" />}

      {isError && !(error instanceof ApiError && error.status === 401) && (
        <p role="alert" className="text-sm text-destructive">
          {error instanceof ApiError ? error.detail : "Impossible de charger les rôles."}
        </p>
      )}

      {rolesQuery.data && permissionsQuery.data && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                {rolesQuery.data.map((role) => (
                  <TableHead key={role.id} className="text-center">
                    {role.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionsQuery.data.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-mono text-xs">{permission.code}</TableCell>
                  {rolesQuery.data.map((role) => (
                    <TableCell key={role.id} className="text-center">
                      <Checkbox
                        checked={(draft[role.id] ?? role.permission_codes).includes(
                          permission.code,
                        )}
                        onCheckedChange={(checked) =>
                          toggle(role.id, permission.code, checked === true)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell />
                {rolesQuery.data.map((role) => {
                  const codes = draft[role.id] ?? role.permission_codes;
                  const dirty =
                    JSON.stringify([...codes].sort()) !==
                    JSON.stringify([...role.permission_codes].sort());
                  return (
                    <TableCell key={role.id} className="text-center">
                      <Button
                        size="sm"
                        disabled={!dirty || updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ roleId: role.id, codes })}
                      >
                        Enregistrer
                      </Button>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
