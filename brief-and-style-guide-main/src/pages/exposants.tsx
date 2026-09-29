import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { useBrandedPageMeta } from "@/hooks/usePageMeta";

const STAND_TYPES = [
  { name: "Standard", description: "Un espace clé en main pour présenter vos produits et services." },
  { name: "Premium", description: "Un emplacement privilégié et une visibilité renforcée dans l'espace exposition." },
  { name: "Mutualisé", description: "Un stand partagé, idéal pour les startups et jeunes structures." },
];

const ACTIVITIES = ["Démo produit", "Jeu concours", "Atelier", "Networking"];

export function ExposantsPage() {
  useBrandedPageMeta(
    "Exposants",
    "Réservez votre stand et rencontrez en direct entreprises, talents et décideurs de la tech africaine.",
  );
  return (
    <>
      <PageHeader
        eyebrow="Exposants"
        title={
          <>
            Présentez vos produits <span className="text-primary">à l'écosystème tech</span>.
          </>
        }
        description="Réservez votre stand à Synca Conf et rencontrez en direct entreprises, talents et décideurs de la tech africaine."
      />

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Types de stands</div>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl">Choisissez votre format.</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {STAND_TYPES.map((s) => (
              <article key={s.name} className="rounded-3xl border border-border bg-white p-7 shadow-card">
                <h3 className="font-display font-bold text-xl">{s.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 text-xs uppercase tracking-[0.2em] text-primary font-semibold">Animations possibles</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {ACTIVITIES.map((a) => (
              <span key={a} className="rounded-full bg-peach px-4 py-2 text-sm font-medium text-ink">
                {a}
              </span>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-ink text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="font-display font-bold text-2xl">Réservez votre stand.</div>
              <p className="mt-2 text-white/70 max-w-2xl">
                Contactez notre équipe pour connaître les disponibilités et finaliser votre présence.
              </p>
            </div>
            <Link
              to="/contact"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-6 py-3 hover:brightness-110 transition"
            >
              Nous contacter <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
