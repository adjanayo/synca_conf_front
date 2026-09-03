import { useState } from "react";
import { PageHeader } from "../../components/site/PageHeader";
import { DAYS, CAT_COLORS } from "../../data/programme";
import { useEventWindow, formatDayLabel } from "../../hooks/useEventWindow";


export function ProgrammeView() {
  const [active, setActive] = useState<string | "all">("j1");
  const visible = active === "all" ? DAYS : DAYS.filter((d) => d.id === active);
  const { startAt, dateLabel, venue } = useEventWindow();

  // Libellés de jour ("Lundi 18 Août 2027") calculés depuis le début de
  // l'événement (fenêtre `event`) plutôt que codés en dur -- repli sur le
  // libellé statique de data/programme.ts tant que la fenêtre n'a pas chargé.
  const dayLabel = (index: number, fallback: string) =>
    startAt
      ? formatDayLabel(new Date(startAt.getTime() + index * 86400000))
      : fallback;

  return (
    <>
      <PageHeader
        eyebrow="Programme"
        title={<>3 jours, une cadence <span className="text-primary">intense</span>.</>}
        description={`Du ${dateLabel} à ${venue} — keynotes, panels, workshops, hackathon IA, CTF, Job Fair et After Party.`}
      />
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap gap-2 mb-10">
            {[
              { id: "all", l: "Tout" },
              ...DAYS.map((d, i) => ({
                id: d.id,
                l: dayLabel(i, d.date).split(" ").slice(0, 2).join(" "),
              })),
            ].map((b) => (
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
                <h2 className="font-display font-bold text-2xl">
                  {dayLabel(DAYS.findIndex((d) => d.id === day.id), day.date)}
                </h2>
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
