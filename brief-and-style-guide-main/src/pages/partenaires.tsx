import { Link } from "react-router-dom";
import { PageHeader } from "../components/site/PageHeader";
import { useBrandedPageMeta } from "@/hooks/usePageMeta";
import { PARTNERS } from "@/data/sponsor";
import { MAILTO } from "@/data/parameter";

const WHY_PARTNER = [
  {
    number: "01",
    title: "Gagnez en visibilité",
    description:
      "Positionnez votre marque auprès d’une audience qualifiée de professionnels, entrepreneurs, décideurs et passionnés de technologie.",
  },
  {
    number: "02",
    title: "Développez votre réseau",
    description:
      "Créez des connexions stratégiques avec des entreprises, startups, investisseurs et acteurs publics venus de différents marchés africains.",
  },
  {
    number: "03",
    title: "Attirez les meilleurs talents",
    description:
      "Présentez votre entreprise, vos métiers et vos opportunités à une communauté de talents tech, de jeunes diplômés et de professionnels.",
  },
  {
    number: "04",
    title: "Prenez la parole",
    description:
      "Partagez votre expertise à travers des panels, workshops, prises de parole et activations adaptées à vos objectifs.",
  },
  {
    number: "05",
    title: "Créez des opportunités business",
    description:
      "Utilisez Synca Conf comme un espace privilégié pour rencontrer de nouveaux clients, partenaires et prospects.",
  },
  {
    number: "06",
    title: "Contribuez à l’écosystème",
    description:
      "Soutenez le développement de l’innovation et des compétences numériques en Afrique tout en renforçant votre impact local et régional.",
  },
];

export function PartenairesPage() {
  useBrandedPageMeta(
    "Partenaires",
    "Associez votre marque à Synca Conf & ACYBIA Forum 2027 et à l'écosystème tech le plus dynamique du continent.",
  );
  return (
    <>
      <PageHeader
        eyebrow="Partenaires"
        title={
          <>
            Construisez l'avenir tech africain <span className="text-primary">avec nous</span>.
          </>
        }
        description="Alignez votre marque sur l'écosystème tech le plus dynamique du continent. Recrutement, visibilité, B2B, impact."
      />

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          {/* Intro */}
          <div className="max-w-3xl mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              Pourquoi devenir partenaire ?
            </div>

            <h2 className="mt-3 font-display font-bold text-3xl md:text-5xl">
              Faites de Synca Conf 2027 un{" "}
              <span className="text-primary">levier pour votre marque</span>.
            </h2>

            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              Synca Conf 2027 rassemble entreprises, startups, investisseurs, talents,
              décideurs et acteurs majeurs de la technologie africaine. Devenir partenaire, c’est
              associer votre marque à une dynamique panafricaine tournée vers l’innovation et les
              opportunités.
            </p>
          </div>

          {/* Avantages */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_PARTNER.map((item) => (
              <article
                key={item.number}
                className="rounded-3xl border border-border bg-white p-7 shadow-card hover:border-primary/40 hover:-translate-y-1 transition"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-sm">
                  {item.number}
                </div>

                <h3 className="mt-6 font-display font-bold text-xl">{item.title}</h3>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-3xl bg-ink text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="font-display font-bold text-2xl">
                Votre marque. Votre impact. Votre place dans la conversation.
              </div>

              <p className="mt-2 text-white/70 max-w-2xl">
                Quel que soit votre objectif — visibilité, recrutement, networking, business ou
                impact — nous construisons avec vous une expérience de partenariat adaptée.
              </p>
            </div>

            <a
              href={MAILTO.partner}
              className="shrink-0 inline-flex items-center justify-center rounded-full bg-primary text-ink font-semibold px-6 py-3 hover:brightness-110 transition"
            >
              Devenir partenaire
            </a>
          </div>
        </div>
      </section>

      <PartnersShowcase />
    </>
  );
}

function PartnersShowcase() {
  return (
    <section className="py-16 bg-cream">
      <div className="mx-auto max-w-7xl px-6 space-y-14">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold text-center">
            Ils nous soutiennent
          </div>
          <h2 className="mt-3 font-display font-bold text-3xl text-center">Nos partenaires</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="flex h-28 w-64 items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-card"
              >
                <img src={p.logo} alt={p.name} loading="lazy" className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            D'autres partenaires seront annoncés prochainement.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold text-center">
            Espace exposition
          </div>
          <h2 className="mt-3 font-display font-bold text-3xl text-center">Nos exposants</h2>
          <p className="mt-6 mx-auto max-w-xl text-center text-muted-foreground">
            Nos exposants seront annoncés prochainement. Suis nos pages Synca Conf pour ne rien
            manquer de l'annonce.
          </p>
          <div className="mt-3 text-center">
            <Link to="/exposants" className="text-sm font-semibold text-primary hover:underline">
              Devenir exposant →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
