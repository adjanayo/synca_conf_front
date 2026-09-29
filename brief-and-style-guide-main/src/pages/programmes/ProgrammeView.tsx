import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { CAT_COLORS, DAYS } from "../../data/programme";
import { PARAMETER } from "../../data/parameter";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";

export function ProgrammeView() {
  const [active, setActive] = useState<string>("all");
  const { date: dateLabel, lieu: venue, acybiaProgrammeUrl } = PARAMETER;
  useBrandedPageMeta(
    "Programme",
    `Synca Conf & ACYBIA Forum, du ${dateLabel} au ${venue} — programme ACYBIA les 15 et 16 mars, journée Synca Conf le 17 mars : 3 masterclasses et remise des prix du Hackathon.`,
  );

  const visible = active === "all" ? DAYS : DAYS.filter((d) => d.id === active);

  return (
    <>
      <PageHeader
        eyebrow="Programme"
        title={<>3 jours aux côtés de l'<span className="text-primary">ACYBIA Forum</span>.</>}
        description={`Du ${dateLabel} au ${venue}. Le programme Synca Conf est intégré à celui de l'ACYBIA Forum ; le 17 mars est une journée parallèle dédiée à Synca Conf.`}
      >
        <div className="mt-8">
          <a
            href={acybiaProgrammeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-6 py-3 hover:brightness-110 transition"
          >
            Programme ACYBIA Forum <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </PageHeader>
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap gap-2 mb-10">
            {[{ id: "all", l: "Tout" }, ...DAYS.map((d) => ({ id: d.id, l: d.date }))].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActive(b.id)}
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
                    <span className="text-sm font-bold text-primary w-24 shrink-0 pt-0.5">{s.h}</span>
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
              {day.external && (
                <div className="px-6 py-4 border-t border-border text-sm">
                  <a
                    href={acybiaProgrammeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                  >
                    Voir le programme détaillé de l'ACYBIA Forum <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
