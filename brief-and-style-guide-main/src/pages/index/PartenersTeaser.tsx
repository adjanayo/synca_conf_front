import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PARTNERS } from "@/data/sponsor";

function PartnersTeaser() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-6">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Partenaires
          </div>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">
            Construisez l'avenir tech africain avec nous.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Alignez votre marque sur l'écosystème tech le plus dynamique du continent :
            recrutement, visibilité, B2B, impact.
          </p>
          <Link to="/partenaires" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-3 font-semibold text-sm hover:bg-ink/90 transition">
            Devenir partenaire <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="md:col-span-6 grid sm:grid-cols-2 gap-4">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="h-32 rounded-2xl bg-white border border-border shadow-card flex items-center justify-center p-6"
            >
              <img src={p.logo} alt={p.name} loading="lazy" className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { PartnersTeaser };
