import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDays, getSessions } from "@/lib/api/programme";
import { formatDayLabel } from "@/hooks/useEventWindow";

const PREVIEW_SLOTS_PER_DAY = 4;

function ProgrammePreview() {
  const days = useQuery({ queryKey: ["public", "days"], queryFn: getDays });
  const sessions = useQuery({ queryKey: ["public", "sessions"], queryFn: getSessions, enabled: days.isSuccess });

  const isLoading = days.isLoading || (days.isSuccess && sessions.isLoading);
  const isError = days.isError || sessions.isError;
  const isEmpty = days.isSuccess && sessions.isSuccess && days.data.length === 0;

  const preview =
    days.isSuccess && sessions.isSuccess
      ? days.data.map((day) => {
          const daySessions = sessions.data
            .filter((s) => s.day_id === day.id)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
          return {
            id: String(day.id),
            headerLabel: formatDayLabel(new Date(`${day.date}T00:00:00`)),
            total: daySessions.length,
            slots: daySessions.slice(0, PREVIEW_SLOTS_PER_DAY).map((s) => ({
              h: s.start_time.slice(0, 5),
              t: s.title,
            })),
          };
        })
      : [];

  return (
    <section className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              Programme
            </div>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">
              3 jours, une cadence intense.
            </h2>
          </div>
          <Link
            to="/programme"
            className="text-sm font-semibold text-ink inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            Programme complet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading && (
          <p className="mt-12 text-center text-muted-foreground">Chargement du programme…</p>
        )}
        {(isError || isEmpty) && !isLoading && (
          <p className="mt-12 text-center text-muted-foreground">
            Le programme n'est pas encore disponible. Reviens bientôt pour le découvrir.
          </p>
        )}
        {!isLoading && !isError && !isEmpty && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {preview.map((day) => (
              <article
                key={day.id}
                className="group rounded-3xl bg-white border border-border p-6 hover:-translate-y-1 transition-transform shadow-card"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-2xl">{day.headerLabel}</h3>
                  <span className="text-xs text-muted-foreground">{day.total} sessions</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {day.slots.map((it, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-sm font-semibold text-primary tabular-nums w-12 shrink-0">
                        {it.h}
                      </span>
                      <span className="text-sm text-foreground">{it.t}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export { ProgrammePreview };
