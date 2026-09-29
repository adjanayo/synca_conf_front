import { ArrowRight, Calendar, Clock, MapPin, Trophy } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { HACKATHON } from "../../data/hackathon";
import { MAILTO, PARAMETER } from "../../data/parameter";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";

export function HackathonView() {
  useBrandedPageMeta(
    "Hackathon interuniversitaire",
    "48h, du 15 au 17 mars 2027 à Dakar : protéger les PME africaines face aux cybermenaces avec des solutions accessibles, adaptées et réellement déployables.",
  );

  return (
    <>
      <PageHeader
        eyebrow="Hackathon interuniversitaire"
        title={<>Protéger les PME africaines <span className="text-primary">face aux cybermenaces</span>.</>}
        description={HACKATHON.theme}
      >
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/70">
          <span className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> {HACKATHON.duration}
          </span>
          <span className="inline-flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> {HACKATHON.dates}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> {PARAMETER.lieu}
          </span>
        </div>
      </PageHeader>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Contexte & vision</div>
            <h2 className="mt-3 font-display font-bold text-3xl">La digitalisation expose les PME.</h2>
          </div>
          <div className="md:col-span-8 space-y-5 text-muted-foreground text-lg leading-relaxed">
            {HACKATHON.context.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ul className="flex flex-wrap gap-2">
              {HACKATHON.threats.map((t) => (
                <li key={t} className="rounded-full bg-peach px-4 py-1.5 text-sm font-medium text-ink">
                  {t}
                </li>
              ))}
            </ul>
            {HACKATHON.contextEnd.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Enjeux du Hackathon</div>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl">Quatre enjeux majeurs.</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {HACKATHON.stakes.map((s, i) => (
              <article key={s.title} className="rounded-3xl border border-border bg-white p-7 shadow-card">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 font-display font-bold text-xl">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ink text-white">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Défi pour les équipes</div>
            <h2 className="mt-3 font-display font-bold text-3xl">Imaginer et prototyper.</h2>
            <p className="mt-4 text-white/70">
              Les participants devront imaginer et prototyper des solutions permettant aux PME
              africaines de :
            </p>
            <ul className="mt-5 space-y-3">
              {HACKATHON.challenge.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Vision</div>
            <div className="mt-4 space-y-4 text-white/80 leading-relaxed">
              {HACKATHON.vision.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl bg-peach p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-primary">
                <Trophy className="w-6 h-6" />
              </span>
              <div>
                <div className="font-display font-bold text-2xl text-ink">Remise des prix le 17 mars 2027</div>
                <p className="mt-1 text-muted-foreground">
                  Lors de la journée Synca Conf, en parallèle de l'ACYBIA Forum.
                </p>
              </div>
            </div>
            <a
              href={MAILTO.university}
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-ink text-white font-semibold px-6 py-3 hover:bg-ink/90 transition"
            >
              Inscrire mon université <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
