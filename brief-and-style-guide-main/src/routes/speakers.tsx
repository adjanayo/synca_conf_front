import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";

export const Route = createFileRoute("/speakers")({
  head: () => ({
    meta: [
      { title: "Speakers · Synca Conf 2027" },
      { name: "description", content: "Découvrez les speakers de la Synca Conf 2027 — fondateurs, ingénieurs, chercheurs et opérateurs qui font bouger la tech africaine." },
    ],
  }),
  component: SpeakersPage,
});

const SPEAKERS = Array.from({ length: 10 }).map((_, i) => ({
  n: "À annoncer",
  r: ["Keynote · IA", "Panel · Cyber", "Fireside · Product", "Workshop · Data", "Keynote · WIT", "Panel · EdTech", "Lightning · Founders", "Workshop · DevOps", "Panel · Carrières", "Keynote · Impact"][i],
  c: ["from-orange-200 to-orange-400", "from-amber-100 to-orange-300", "from-orange-100 to-rose-300", "from-yellow-100 to-orange-300", "from-pink-100 to-orange-300", "from-orange-200 to-amber-300", "from-rose-200 to-orange-300", "from-amber-200 to-orange-400", "from-orange-100 to-amber-200", "from-orange-200 to-rose-300"][i],
}));

function SpeakersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Speakers"
        title={<>Les voix qui font bouger <span className="text-primary">le continent</span>.</>}
        description="Les profils confirmés seront dévoilés progressivement à partir d'avril 2027. Candidatures ouvertes dès mars 2027."
      >
        <div className="mt-8">
          <Link to="/candidature-speaker" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-6 py-3 hover:brightness-110 transition">
            <Mic className="w-4 h-4" /> Candidater comme speaker
          </Link>
        </div>
      </PageHeader>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {SPEAKERS.map((s, i) => (
              <div key={i} className="group">
                <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br ${s.c}`}>
                  <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/0 transition-colors" />
                  <div className="absolute bottom-0 inset-x-0 p-4 text-ink">
                    <div className="text-[10px] uppercase tracking-widest font-bold">{s.r}</div>
                  </div>
                </div>
                <div className="mt-3 font-display font-semibold text-lg">{s.n}</div>
                <div className="text-sm text-muted-foreground">Profil dévoilé bientôt</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
