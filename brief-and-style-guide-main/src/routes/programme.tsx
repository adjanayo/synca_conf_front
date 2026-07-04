import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "../components/site/PageHeader";

export const Route = createFileRoute("/programme")({
  head: () => ({
    meta: [
      { title: "Programme · Synca Conf 2027" },
      { name: "description", content: "Planning détaillé des 3 jours de la Synca Conf 2027 à Dakar : 18, 19 et 20 août 2027." },
    ],
  }),
  component: ProgrammePage,
});

type Slot = { h: string; t: string; cat: "Keynote" | "Panel" | "Workshop" | "Networking" | "Side"; lieu?: string };
type Day = { id: string; date: string; theme: string; slots: Slot[] };

const DAYS: Day[] = [
  {
    id: "j1", date: "Lundi 18 Août 2027", theme: "Opening · Vision",
    slots: [
      { h: "08:30", t: "Accueil & badges", cat: "Networking" },
      { h: "09:30", t: "Cérémonie d'ouverture officielle", cat: "Keynote", lieu: "Grand Auditorium" },
      { h: "10:15", t: "Keynote inaugurale — État de la tech en Afrique", cat: "Keynote" },
      { h: "11:00", t: "Panel — IA générative et souveraineté numérique africaine", cat: "Panel" },
      { h: "12:30", t: "Déjeuner & networking", cat: "Networking" },
      { h: "14:00", t: "Workshop — Construire avec les LLM open source", cat: "Workshop", lieu: "Salle A" },
      { h: "14:00", t: "Workshop — Product discovery en marché africain", cat: "Workshop", lieu: "Salle B" },
      { h: "16:00", t: "Panel — Carrières tech : freelance, salarié, founder", cat: "Panel" },
      { h: "18:00", t: "Welcome cocktail & networking", cat: "Networking" },
    ],
  },
  {
    id: "j2", date: "Mardi 19 Août 2027", theme: "Build · Hack",
    slots: [
      { h: "09:00", t: "Vibeathon IA & Impact — kick-off", cat: "Side", lieu: "Hall principal" },
      { h: "10:30", t: "CTF Cybersécurité — début compétition", cat: "Side", lieu: "Salle CTF" },
      { h: "11:00", t: "Keynote — Sécurité des systèmes critiques", cat: "Keynote" },
      { h: "12:30", t: "Déjeuner", cat: "Networking" },
      { h: "14:00", t: "Side event Women In Tech — Panel & mentoring", cat: "Side" },
      { h: "15:30", t: "Workshop — Data engineering moderne", cat: "Workshop" },
      { h: "17:00", t: "Fireside Chat — Investir dans la tech africaine", cat: "Panel" },
      { h: "19:00", t: "Dîner partenaires & speakers (sur invitation)", cat: "Networking" },
    ],
  },
  {
    id: "j3", date: "Mercredi 20 Août 2027", theme: "Connect · Celebrate",
    slots: [
      { h: "09:00", t: "Job Fair — ouverture · recruteurs & talents", cat: "Side", lieu: "Expo Hall" },
      { h: "10:30", t: "Lightning talks — 10 founders, 10 minutes chacun", cat: "Keynote" },
      { h: "12:00", t: "Pitching startups & demos", cat: "Side" },
      { h: "13:30", t: "Déjeuner B2B (rendez-vous matchmaking)", cat: "Networking" },
      { h: "15:00", t: "Panel — EdTech et formation aux métiers tech", cat: "Panel" },
      { h: "16:30", t: "Remise des prix Vibeathon & CTF", cat: "Keynote" },
      { h: "17:30", t: "Keynote de clôture", cat: "Keynote" },
      { h: "21:00", t: "After Party officielle Synca Conf", cat: "Networking" },
    ],
  },
];

const CAT_COLORS: Record<Slot["cat"], string> = {
  Keynote: "bg-primary/15 text-primary border-primary/30",
  Panel: "bg-blue-100 text-blue-700 border-blue-200",
  Workshop: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Networking: "bg-peach text-ink border-primary/20",
  Side: "bg-purple-100 text-purple-700 border-purple-200",
};

function ProgrammePage() {
  const [active, setActive] = useState<string | "all">("j1");
  const visible = active === "all" ? DAYS : DAYS.filter((d) => d.id === active);

  return (
    <>
      <PageHeader
        eyebrow="Programme"
        title={<>3 jours, une cadence <span className="text-primary">intense</span>.</>}
        description="Du 18 au 20 août 2027 à Dakar — keynotes, panels, workshops, hackathon IA, CTF, Job Fair et After Party."
      />
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap gap-2 mb-10">
            {[{ id: "all", l: "Tout" }, ...DAYS.map((d) => ({ id: d.id, l: d.date.split(" ").slice(0, 2).join(" ") }))].map((b) => (
              <button
                key={b.id}
                onClick={() => setActive(b.id as typeof active)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition border ${
                  active === b.id ? "bg-ink text-white border-ink" : "bg-white text-ink border-border hover:border-primary"
                }`}
              >
                {b.l}
              </button>
            ))}
          </div>

          {visible.map((day) => (
            <article key={day.id} className="mb-10 rounded-3xl bg-white border border-border shadow-card overflow-hidden">
              <header className="px-6 py-5 bg-ink text-white flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-display font-bold text-2xl">{day.date}</h2>
                <span className="text-xs uppercase tracking-widest text-primary">{day.theme}</span>
              </header>
              <ul className="divide-y divide-border">
                {day.slots.map((s, i) => (
                  <li key={i} className="px-6 py-4 flex items-start gap-5 hover:bg-peach/30 transition-colors">
                    <span className="text-sm font-bold text-primary tabular-nums w-16 shrink-0 pt-0.5">{s.h}</span>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{s.t}</div>
                      {s.lieu && <div className="text-xs text-muted-foreground mt-0.5">📍 {s.lieu}</div>}
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${CAT_COLORS[s.cat]}`}>
                      {s.cat}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
