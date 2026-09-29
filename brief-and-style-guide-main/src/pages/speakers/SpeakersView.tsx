import { Link } from "react-router-dom";
import { Mic } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { SPEAKERS } from "../../data/speaker";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";
import { MAILTO } from "../../data/parameter";

export function SpeakersView() {
  useBrandedPageMeta(
    "Speakers",
    "Les voix qui font bouger le continent — découvre les speakers confirmés de la conférence.",
  );

  return (
    <>
      <PageHeader
        eyebrow="Speakers"
        title={<>Les voix qui font bouger <span className="text-primary">le continent</span>.</>}
        description="Les profils confirmés sont dévoilés progressivement. D'autres speakers seront annoncés prochainement."
      >
        <div className="mt-8">
          <a href={MAILTO.speaker} className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-6 py-3 hover:brightness-110 transition">
            <Mic className="w-4 h-4" /> Devenir speaker
          </a>
        </div>
      </PageHeader>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {SPEAKERS.map((s) => (
              <Link key={s.id} to={`/speakers/${s.id}`} className="group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-ink/20">
                  <img
                    src={s.photo}
                    alt={s.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/0 transition-colors" />
                </div>
                <div className="mt-3 font-display font-semibold text-lg">{s.name}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{s.role}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
