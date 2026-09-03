import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "../../components/site/PageHeader";
import { DB_CATEGORY_LABELS, DB_CATEGORY_COLORS } from "../../data/programme";
import { useEventWindow, formatDayLabel } from "../../hooks/useEventWindow";
import { getDays, getSessions } from "../../lib/api/programme";

type DisplaySlot = { h: string; t: string; catLabel: string; catColor: string; lieu?: string };
type DisplayDay = { id: string; tabLabel: string; headerLabel: string; theme?: string; slots: DisplaySlot[] };

export function ProgrammeView() {
  const [active, setActive] = useState<string | "all">("all");
  const { dateLabel, venue } = useEventWindow();

  const days = useQuery({ queryKey: ["public", "days"], queryFn: getDays });
  const sessions = useQuery({ queryKey: ["public", "sessions"], queryFn: getSessions, enabled: days.isSuccess });

  const isLoading = days.isLoading || (days.isSuccess && sessions.isLoading);
  const isError = days.isError || sessions.isError;
  const isEmpty = days.isSuccess && sessions.isSuccess && days.data.length === 0;

  const displayDays: DisplayDay[] =
    days.isSuccess && sessions.isSuccess
      ? days.data.map((d) => ({
          id: String(d.id),
          tabLabel: d.label,
          headerLabel: formatDayLabel(new Date(`${d.date}T00:00:00`)),
          slots: sessions.data
            .filter((s) => s.day_id === d.id)
            .map((s) => ({
              h: s.start_time.slice(0, 5),
              t: s.title,
              catLabel: DB_CATEGORY_LABELS[s.category] ?? s.category,
              catColor: DB_CATEGORY_COLORS[s.category] ?? "bg-muted text-muted-foreground border-border",
              lieu: s.room ?? undefined,
            })),
        }))
      : [];

  const visible = active === "all" ? displayDays : displayDays.filter((d) => d.id === active);

  return (
    <>
      <PageHeader
        eyebrow="Programme"
        title={<>3 jours, une cadence <span className="text-primary">intense</span>.</>}
        description={`Du ${dateLabel} à ${venue} — keynotes, panels, workshops, hackathon IA, CTF, Job Fair et After Party.`}
      />
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          {isLoading && (
            <p className="text-center text-muted-foreground py-10">Chargement du programme…</p>
          )}
          {(isError || isEmpty) && !isLoading && (
            <p className="text-center text-muted-foreground py-10">
              Le programme n'est pas encore disponible. Reviens bientôt pour le découvrir.
            </p>
          )}
          {!isLoading && !isError && !isEmpty && (
            <>
              <div className="flex flex-wrap gap-2 mb-10">
                {[{ id: "all", l: "Tout" }, ...displayDays.map((d) => ({ id: d.id, l: d.tabLabel }))].map((b) => (
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
                    <h2 className="font-display font-bold text-2xl">{day.headerLabel}</h2>
                    {day.theme && <span className="text-xs uppercase tracking-widest text-primary">{day.theme}</span>}
                  </header>
                  <ul className="divide-y divide-border">
                    {day.slots.map((s, i) => (
                      <li key={i} className="px-6 py-4 flex items-start gap-5 hover:bg-peach/30 transition-colors">
                        <span className="text-sm font-bold text-primary tabular-nums w-16 shrink-0 pt-0.5">{s.h}</span>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{s.t}</div>
                          {s.lieu && <div className="text-xs text-muted-foreground mt-0.5">📍 {s.lieu}</div>}
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${s.catColor}`}>
                          {s.catLabel}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
