import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Globe, Linkedin } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { getSpeaker, type SpeakerPublic } from "../../lib/api/applications";
import { ApiError } from "../../lib/api/client";

export function SpeakerDetailView() {
  const { id } = useParams<{ id: string }>();
  const [speaker, setSpeaker] = useState<SpeakerPublic | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setSpeaker(null);
    setNotFound(false);
    getSpeaker(Number(id))
      .then(setSpeaker)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      });
  }, [id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display font-bold text-3xl">Speaker introuvable</h1>
        <p className="mt-4 text-muted-foreground">Ce profil n'existe pas ou n'est plus public.</p>
        <Link to="/speakers" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour aux speakers
        </Link>
      </div>
    );
  }

  if (!speaker) {
    return <div className="py-32" />;
  }

  return (
    <>
      <PageHeader
        eyebrow={speaker.theme}
        title={<>{speaker.first_name} {speaker.last_name}</>}
        description={speaker.title_role + (speaker.company ? ` · ${speaker.company}` : "")}
      >
        <Link to="/speakers" className="mt-6 inline-flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour aux speakers
        </Link>
      </PageHeader>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-[280px_1fr] gap-10">
          <div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-ink/20">
              {speaker.photo_url ? (
                <img
                  src={speaker.photo_url}
                  alt={`${speaker.first_name} ${speaker.last_name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="text-muted-foreground">{speaker.country}</div>
              {speaker.linkedin_url && (
                <a href={speaker.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
              {speaker.website_url && (
                <a href={speaker.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                  <Globe className="w-4 h-4" /> Site web
                </a>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              {speaker.intervention_format}
            </div>
            <h2 className="mt-2 font-display font-bold text-2xl md:text-3xl">
              {speaker.intervention_title}
            </h2>

            <p className="mt-5 text-muted-foreground leading-relaxed whitespace-pre-line">
              {speaker.summary}
            </p>

            {(speaker.audience_level || speaker.language) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {speaker.audience_level && (
                  <span className="rounded-full border border-border px-3.5 py-1.5 text-sm">
                    Niveau : {speaker.audience_level}
                  </span>
                )}
                {speaker.language && (
                  <span className="rounded-full border border-border px-3.5 py-1.5 text-sm">
                    Langue : {speaker.language}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
