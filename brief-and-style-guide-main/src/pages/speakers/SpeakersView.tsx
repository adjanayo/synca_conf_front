import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mic } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { getSpeakers } from "../../lib/api/applications";
import { useCampaignWindow, formatMonthYear } from "../../hooks/useEventWindow";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";

export function SpeakersView() {
  useBrandedPageMeta(
    "Speakers",
    "Les voix qui font bouger le continent — découvre les speakers confirmés de la conférence.",
  );
  const { startAt: speakersOpenAt } = useCampaignWindow("call_for_speaker");
  const speakers = useQuery({ queryKey: ["public", "speakers"], queryFn: getSpeakers });

  const confirmed = speakers.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Speakers"
        title={<>Les voix qui font bouger <span className="text-primary">le continent</span>.</>}
        description={`Les profils confirmés seront dévoilés progressivement au fil des sélections. Candidatures ouvertes dès ${speakersOpenAt ? formatMonthYear(speakersOpenAt) : "l'ouverture des candidatures"}.`}
      >
        <div className="mt-8">
          <Link to="/candidature-speaker" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-6 py-3 hover:brightness-110 transition">
            <Mic className="w-4 h-4" /> Candidater comme speaker
          </Link>
        </div>
      </PageHeader>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          {speakers.isLoading && (
            <p className="text-center text-muted-foreground py-10">Chargement des speakers…</p>
          )}
          {(speakers.isError || (speakers.isSuccess && confirmed.length === 0)) && (
            <p className="text-center text-muted-foreground py-10">
              Les speakers seront annoncés prochainement. Reviens bientôt pour découvrir les profils confirmés.
            </p>
          )}
          {speakers.isSuccess && confirmed.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {confirmed.map((s) => (
                <Link key={s.id} to={`/speakers/${s.id}`} className="group">
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
