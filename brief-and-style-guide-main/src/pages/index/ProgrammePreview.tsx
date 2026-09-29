import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DAYS } from "@/data/programme";

function ProgrammePreview() {
  return (
    <section className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              Programme
            </div>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">
              3 jours aux côtés de l'ACYBIA Forum.
            </h2>
          </div>
          <Link
            to="/programme"
            className="text-sm font-semibold text-ink inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            Programme complet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {DAYS.map((day) => (
            <article
              key={day.id}
              className={`group rounded-3xl border p-6 hover:-translate-y-1 transition-transform shadow-card ${
                day.external ? "bg-white border-border" : "bg-ink text-white border-ink"
              }`}
            >
              <h3 className="font-display font-bold text-2xl">{day.date}</h3>
              <div className={`mt-1 text-sm ${day.external ? "text-muted-foreground" : "text-primary"}`}>
                {day.theme}
              </div>
              <ul className="mt-6 space-y-3">
                {day.slots.map((it, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{it.t}</span>
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

export { ProgrammePreview };
