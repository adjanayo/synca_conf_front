import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function PartnersTeaser() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Partenaires</div>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">Construisez l'avenir tech africain avec nous.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Six niveaux de partenariat — de 1,5M à 10M F CFA — pour aligner votre marque sur l'écosystème tech
            le plus dynamique du continent : recrutement, visibilité, B2B, impact.
          </p>
          <Link to="/partenaires" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-3 font-semibold text-sm hover:bg-ink/90 transition">
            Voir les offres <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="md:col-span-5 grid grid-cols-3 gap-3">
          {["Title", "Platinum", "Gold", "Silver", "Bronze", "Média"].map((t) => (
            <div key={t} className="aspect-square rounded-2xl bg-peach border border-primary/20 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-ink">
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export {PartnersTeaser}