import { DAYS } from "@/data/programme";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function ProgrammePreview() {
  const days = [
    { d: "Jour 1 · Lun 18 Août", tag: "Opening", items: [
      { h: "09:00", t: "Cérémonie d'ouverture & Keynote" },
      { h: "11:00", t: "Panel — L'Afrique à l'ère de l'IA" },
      { h: "14:00", t: "Workshops produit · cyber · data" },
      { h: "18:00", t: "Welcome cocktail" },
    ]},
    { d: "Jour 2 · Mar 19 Août", tag: "Build", items: [
      { h: "09:00", t: "Vibeathon IA & Impact" },
      { h: "10:30", t: "CTF Cybersécurité" },
      { h: "14:00", t: "Side event Women In Tech" },
      { h: "19:00", t: "Dîner partenaires" },
    ]},
    { d: "Jour 3 · Mer 20 Août", tag: "Connect", items: [
      { h: "09:00", t: "Job Fair" },
      { h: "12:00", t: "Pitching startups" },
      { h: "16:00", t: "Keynote de clôture" },
      { h: "21:00", t: "After Party officielle" },
    ]},
  ];
  return (
    <section className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Programme</div>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">3 jours, une cadence intense.</h2>
          </div>
          <Link to="/programme" className="text-sm font-semibold text-ink inline-flex items-center gap-1 hover:gap-2 transition-all">
            Programme complet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {DAYS.map((day) => (
            <article key={day.id} className="group rounded-3xl bg-white border border-border p-6 hover:-translate-y-1 transition-transform shadow-card">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">{day.theme}</div>
                <span className="text-xs text-muted-foreground">4 sessions clés</span>
              </div>
              <h3 className="mt-3 font-display font-bold text-2xl">{day.date}</h3>
              <ul className="mt-6 space-y-4">
                {day.slots.map((it) => (
                  <li key={it.h} className="flex gap-4">
                    <span className="text-sm font-semibold text-primary tabular-nums w-12 shrink-0">{it.h}</span>
                    <span className="text-sm text-foreground">{it.t}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export {
    ProgrammePreview
}