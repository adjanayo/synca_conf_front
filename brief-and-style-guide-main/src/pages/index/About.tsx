import { FEATURES } from "@/data/parameter";
import {
  Briefcase,
  Code2,
  PartyPopper,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

function About() {
  const themes = [
    "Cybersécurité, Data et IA",
    "Cloud, infrastructures et souveraineté numérique",
    "Fintech, Innovation et Digital Leadership",
    "EdTech, E-learning et RH Technologies",
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">

        {/* À propos */}
        <div className="grid md:grid-cols-12 gap-12 items-start">
          
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              À propos
            </div>

            <h2 className="mt-4 font-display font-bold text-4xl md:text-5xl leading-tight">
              Une scène panafricaine pour ceux qui{" "}
              <span className="text-primary">construisent</span>.
            </h2>

            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed pt-3">
              <p>
                La <strong className="text-foreground">Synca Conf</strong> est
                la conférence annuelle organisée par Synca pour rendre la tech
                africaine accessible, inclusive et ambitieuse.
              </p>
            </div>
          </div>

          {/* Éléments */}
          <div className="md:col-span-7">
            <div className="grid sm:grid-cols-2 gap-3 pt-4">
              {FEATURES.map((x) => (
                <div
                  key={x.t}
                  className="flex items-center gap-3 rounded-xl bg-peach px-4 py-3 text-ink"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-primary">
                    <x.i className="w-4 h-4" />
                  </span>

                  <span className="font-medium">
                    {x.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session Thématiques */}
        <div className="mt-20 pt-10 border-t border-border">
          <div className="grid md:grid-cols-12 gap-12 items-start">

            {/* Texte à gauche */}
            <div className="md:col-span-5">
              <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                Session
              </div>

              <h3 className="mt-3 font-display font-bold text-3xl md:text-4xl leading-tight">
                Thématiques{" "}
                <span className="text-primary">
                  Synca Conf 2027
                </span>
              </h3>

              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                Découvrez les grandes thématiques qui seront au cœur de la
                Synca Conf 2027 et qui réuniront experts, entrepreneurs,
                innovateurs et acteurs de la transformation numérique
                africaine.
              </p>
            </div>

            {/* Éléments à droite */}
            <div className="md:col-span-7">
              <div className="grid sm:grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <div
                    key={theme}
                    className="flex items-center gap-3 rounded-xl bg-peach px-4 py-3 text-ink"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-primary">
                      <Sparkles className="w-4 h-4" />
                    </span>

                    <span className="font-medium">
                      {theme}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export { About };