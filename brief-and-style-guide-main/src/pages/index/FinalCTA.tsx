import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PARAMETER } from "@/data/parameter";

function FinalCTA() {
  const { date: dateLabel, lieu: venue } = PARAMETER;
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full bg-primary/20 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
          {venue} · {dateLabel}
        </div>
        <h2 className="mt-6 font-display font-bold text-5xl md:text-7xl leading-[0.95] tracking-tighter">
          Rejoins-nous à <span className="text-primary">Dakar</span>.
        </h2>
        <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto">
          Trois jours pour rencontrer, apprendre, recruter, pitcher, et célébrer la tech africaine.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={PARAMETER.registrationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-4 hover:brightness-110 transition shadow-glow">
            Je m'inscris <ArrowRight className="w-4 h-4" />
          </a>
          <Link to="/hackathon-universitaire" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-medium hover:bg-white/5 transition">
            Découvrir le Hackathon
          </Link>
        </div>
      </div>
    </section>
  );
}

export { FinalCTA };
