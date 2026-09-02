import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mic } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { SPEAKERS } from "../../data/speaker";
import { getSpeakers, type SpeakerPublic } from "../../lib/api/applications";

export function SpeakersView() {
  const [speakers, setSpeakers] = useState<SpeakerPublic[] | null>(null);

  useEffect(() => {
    getSpeakers()
      .then(setSpeakers)
      .catch(() => setSpeakers([]));
  }, []);

  const confirmed = speakers ?? [];

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
            {confirmed.length > 0
              ? confirmed.map((s) => (
                  <div key={s.id} className="group">
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-ink/20">
                      {s.photo_url ? (
                        <img
                          src={s.photo_url}
                          alt={`${s.first_name} ${s.last_name}`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/0 transition-colors" />
                      <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                        <div className="text-[10px] uppercase tracking-widest font-bold">
                          {s.theme}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 font-display font-semibold text-lg">
                      {s.first_name} {s.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{s.title_role}</div>
                  </div>
                ))
              : SPEAKERS.map((s, i) => (
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
