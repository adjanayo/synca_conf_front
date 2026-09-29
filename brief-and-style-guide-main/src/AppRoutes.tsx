import { Outlet, Route, Routes } from "react-router-dom";
import { Footer } from "./components/site/Footer";
import { Nav } from "./components/site/Nav";
import { useBrandedPageMeta } from "./hooks/usePageMeta";
import { ContactView } from "./pages/contacts/ContactView";
import { FAQView } from "./pages/Faq/FAQView";
import { PartenairesPage } from "./pages/partenaires";
import { ExposantsPage } from "./pages/exposants";
import { ProgrammeView } from "./pages/programmes/ProgrammeView";
import { SpeakersView } from "./pages/speakers/SpeakersView";
import { SpeakerDetailView } from "./pages/speakers/SpeakerDetailView";
import { HackathonView } from "./pages/hackathon/HackathonView";
import { IndexView } from "./pages/index/IndexView";

function AppLayout() {
  // Le titre/meta par route vit désormais dans chaque page (useBrandedPageMeta,
  // ROADMAP_PUBLIC_SEO.md S1.2) -- rien à faire ici. index.html porte un
  // <title>/meta statiques en dur, seul ce qu'un crawler qui n'exécute pas le
  // JS verra (pas de pré-rendu/SSR sur ce site, S1.6).
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
  useBrandedPageMeta("Page introuvable");
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
        <Route path="programme" element={<ProgrammeView />} />
        <Route path="speakers" element={<SpeakersView />} />
        <Route path="speakers/:id" element={<SpeakerDetailView />} />
        <Route path="partenaires" element={<PartenairesPage />} />
        <Route path="exposants" element={<ExposantsPage />} />
        <Route path="hackathon-universitaire" element={<HackathonView />} />
        <Route path="faq" element={<FAQView />} />
        <Route path="contact" element={<ContactView />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
