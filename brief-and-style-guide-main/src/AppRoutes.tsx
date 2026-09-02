import { Outlet, Route, Routes } from "react-router-dom";
import { Footer } from "./components/site/Footer";
import { Nav } from "./components/site/Nav";
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

// Backoffice path is never "/admin" in the source (ROADMAP_ADMIN.md A3): it
// comes from a build-time env var so the real path isn't hardcoded/greppable
// and isn't guessable from the repo. Absent at build time -> no admin routes
// are mounted at all (404s instead of a discoverable login screen).
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH as string | undefined;
const ADMIN_BASE = ADMIN_PATH ? `/${ADMIN_PATH}` : null;

function AppLayout() {
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
