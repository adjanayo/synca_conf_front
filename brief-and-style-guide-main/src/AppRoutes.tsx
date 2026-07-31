import { Outlet, Route, Routes } from "react-router-dom";
import { Footer } from "./components/site/Footer";
import { Nav } from "./components/site/Nav";
import { AmbassadeurPage } from "./pages/ambassadeur";
import { ContactPage } from "./pages/contact";
import { FAQPage } from "./pages/faq";
import { InscriptionPage } from "./pages/inscription";
import { PartenairesPage } from "./pages/partenaires";
import { ProgrammePage } from "./pages/programme";
import { SpeakersPage } from "./pages/speakers";
import { SpeakerPage } from "./pages/candidature-speaker";
import { IndexView } from "./pages/index/IndexView";

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
      <Route path="/" element={<AppLayout />}>
        <Route index element={<IndexView />} />
        <Route path="programme" element={<ProgrammePage />} />
        <Route path="speakers" element={<SpeakersPage />} />
        <Route path="partenaires" element={<PartenairesPage />} />
        <Route path="ambassadeur" element={<AmbassadeurPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="inscription" element={<InscriptionPage />} />
        <Route path="candidature-speaker" element={<SpeakerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
