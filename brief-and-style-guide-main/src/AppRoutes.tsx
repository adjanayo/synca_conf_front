import { useEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Footer } from "./components/site/Footer";
import { Nav } from "./components/site/Nav";
import { useEventWindow } from "./hooks/useEventWindow";
import { AmbassadeurPage } from "./pages/ambassadeur";
import { ContactView } from "./pages/contacts/ContactView";
import { FAQView } from "./pages/Faq/FAQView";
import { InscriptionPage } from "./pages/inscriptions/inscription";
import { PartenairesPage } from "./pages/partenaires";
import { ProgrammeView } from "./pages/programmes/ProgrammeView";
import { SpeakersView } from "./pages/speakers/SpeakersView";
import { SpeakerPage } from "./pages/candidature-speaker";
import { IndexView } from "./pages/index/IndexView";
import { ConnexionPage } from "./pages/connexion/ConnexionPage";
import { EspacePage } from "./pages/espace/EspacePage";
import { RequireAuth } from "./lib/auth/RequireAuth";
import { AdminRequireAuth } from "./lib/auth/AdminRequireAuth";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminSpeakersPage } from "./pages/admin/AdminSpeakersPage";
import { AdminAmbassadorsPage } from "./pages/admin/AdminAmbassadorsPage";
import { AdminExhibitorsPage } from "./pages/admin/AdminExhibitorsPage";
import { AdminPartnersPage } from "./pages/admin/AdminPartnersPage";
import { AdminCampaignWindowsPage } from "./pages/admin/AdminCampaignWindowsPage";
import { AdminContactsPage } from "./pages/admin/AdminContactsPage";
import { AdminRolesPage } from "./pages/admin/AdminRolesPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminExportsPage } from "./pages/admin/AdminExportsPage";
import { AdminAuditLogsPage } from "./pages/admin/AdminAuditLogsPage";
import { AdminPassTypesPage } from "./pages/admin/AdminPassTypesPage";
import { AdminPromoCodesPage } from "./pages/admin/AdminPromoCodesPage";
import { AdminEventSettingsPage } from "./pages/admin/AdminEventSettingsPage";
import { AdminProgramPage } from "./pages/admin/AdminProgramPage";
import { AdminFaqPage } from "./pages/admin/AdminFaqPage";
import { AdminRegistrationsPage } from "./pages/admin/AdminRegistrationsPage";
import { AdminWaitlistPage } from "./pages/admin/AdminWaitlistPage";

// Backoffice path is never "/admin" in the source (ROADMAP_ADMIN.md A3): it
// comes from a build-time env var so the real path isn't hardcoded/greppable
// and isn't guessable from the repo. Absent at build time -> no admin routes
// are mounted at all (404s instead of a discoverable login screen).
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH as string | undefined;
const ADMIN_BASE = ADMIN_PATH ? `/${ADMIN_PATH}` : null;

function AppLayout() {
  const { name, year } = useEventWindow();

  // index.html porte un <title> statique en dur (seul ce qu'un crawler qui
  // n'exécute pas le JS verra -- pas de pré-rendu/SSR sur ce site, cf.
  // ROADMAP_PUBLIC_SEO.md S1) ; ceci le met à jour au chargement côté
  // client une fois EventSettings récupéré, pour tout onglet réellement
  // ouvert dans un navigateur. Un <title> par route (usePageMeta) reste à
  // faire séparément (S1, hors périmètre admin en cours).
  useEffect(() => {
    document.title = year != null ? `${name} ${year}` : name;
  }, [name, year]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Désolé, la page demandée n’a pas été trouvée.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l’accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {ADMIN_BASE && (
        <Route path={ADMIN_BASE} element={<AdminLayout />}>
          <Route path="login" element={<AdminLoginPage dashboardPath={ADMIN_BASE} />} />
          <Route
            index
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="payments.view">
                <AdminDashboardPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="speakers"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="speakers.approve">
                <AdminSpeakersPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="ambassadors"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="ambassadors.approve">
                <AdminAmbassadorsPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="exhibitors"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="exhibitors.manage">
                <AdminExhibitorsPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="partners"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="partners.manage">
                <AdminPartnersPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="campaign-windows"
            element={
              <AdminRequireAuth
                loginPath={`${ADMIN_BASE}/login`}
                permission="campaign_windows.manage"
              >
                <AdminCampaignWindowsPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="contacts"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`}>
                <AdminContactsPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="roles"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="roles.manage">
                <AdminRolesPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="users"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="admin_users.manage">
                <AdminUsersPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="exports"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="export.data">
                <AdminExportsPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="audit-logs"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`}>
                <AdminAuditLogsPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="pass-types"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="pass_types.manage">
                <AdminPassTypesPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="promo-codes"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="promo_codes.manage">
                <AdminPromoCodesPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="event-settings"
            element={
              <AdminRequireAuth
                loginPath={`${ADMIN_BASE}/login`}
                permission="event_settings.manage"
              >
                <AdminEventSettingsPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="programme"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="sessions.manage">
                <AdminProgramPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="faq"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="faqs.manage">
                <AdminFaqPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="registrations"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="payments.view">
                <AdminRegistrationsPage />
              </AdminRequireAuth>
            }
          />
          <Route
            path="waitlist"
            element={
              <AdminRequireAuth loginPath={`${ADMIN_BASE}/login`} permission="waitlist.view">
                <AdminWaitlistPage />
              </AdminRequireAuth>
            }
          />
        </Route>
      )}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<IndexView />} />
        <Route path="programme" element={<ProgrammeView />} />
        <Route path="speakers" element={<SpeakersView />} />
        <Route path="partenaires" element={<PartenairesPage />} />
        <Route path="ambassadeur" element={<AmbassadeurPage />} />
        <Route path="faq" element={<FAQView />} />
        <Route path="contact" element={<ContactView />} />
        <Route path="inscription" element={<InscriptionPage />} />
        <Route path="candidature-speaker" element={<SpeakerPage />} />
        <Route path="connexion" element={<ConnexionPage />} />
        <Route
          path="espace"
          element={
            <RequireAuth>
              <EspacePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
