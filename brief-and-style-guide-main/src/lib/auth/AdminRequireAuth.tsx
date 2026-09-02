import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";

/**
 * ROADMAP_ADMIN.md A4 -- une session absente/expirée (401) redirige vers le
 * login ; une permission manquante (403, admin authentifié mais pas
 * habilité) affiche un message métier distinct au lieu de rediriger.
 */
export function AdminRequireAuth({
  loginPath,
  permission,
  children,
}: {
  loginPath: string;
  permission?: string;
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading, hasPermission } = useAdminAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display font-bold text-xl text-ink mb-2">Accès refusé</h1>
        <p className="text-sm text-muted-foreground">
          Ton compte n'a pas la permission requise ({permission}) pour accéder à cette page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
