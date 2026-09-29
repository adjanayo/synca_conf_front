import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { SPEAKERS } from "../../data/speaker";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";

export function SpeakerDetailView() {
  const { id } = useParams<{ id: string }>();
  const speaker = SPEAKERS.find((s) => s.id === id);
  useBrandedPageMeta(speaker ? speaker.name : "Speaker introuvable", speaker?.role);

  if (!speaker) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display font-bold text-3xl">Speaker introuvable</h1>
        <p className="mt-4 text-muted-foreground">Ce profil n'existe pas.</p>
        <Link to="/speakers" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour aux speakers
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Speaker" title={<>{speaker.name}</>} description={speaker.role}>
        <Link to="/speakers" className="mt-6 inline-flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour aux speakers
        </Link>
      </PageHeader>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-[280px_1fr] gap-10">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-ink/20">
            <img
              src={speaker.photo}
              alt={speaker.name}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Biographie</div>
            <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">{speaker.bio}</p>
          </div>
        </div>
      </section>
    </>
  );
}
