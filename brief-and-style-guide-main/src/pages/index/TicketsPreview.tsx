import { getPassTypes } from "@/lib/api/registration";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

function TicketsPreview() {
  const passTypesQuery = useQuery({ queryKey: ["public", "pass-types"], queryFn: getPassTypes });
  const activePassTypes = (passTypesQuery.data ?? []).filter((p) => p.is_active);

  if (passTypesQuery.isLoading) return null;

  const cards = activePassTypes.map((p) => ({
    key: `pass-${p.id}`,
    name: p.name,
    price: currency.format(p.price),
    target: p.description,
    perks: p.inclusions
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    badge: "",
  }));

  return (
    <section className="py-24 bg-peach">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Tickets
          </div>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">Choisis ton pass.</h2>
          <p className="mt-3 text-muted-foreground">
            Paiement par carte, Wave, Orange Money ou virement. Codes promo Early Bird disponibles.
          </p>
        </div>
        {cards.length === 0 ? (
          <p className="mt-8 max-w-xl text-muted-foreground">
            Les pass seront annoncés prochainement. Suis nos pages Synca Conf pour ne rien manquer
            de l'ouverture de la billetterie.
          </p>
        ) : (
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((t) => {
            const featured = t.badge === "Populaire";
            return (
              <article
                key={t.key}
                className={`relative rounded-3xl p-7 flex flex-col ${featured ? "bg-ink text-white shadow-glow" : "bg-white text-ink border border-border"}`}
              >
                {t.badge && (
                  <span
                    className={`absolute -top-3 left-7 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${featured ? "bg-primary text-ink" : "bg-ink text-primary"}`}
                  >
                    {t.badge}
                  </span>
                )}
                <div className="font-display font-bold text-2xl">{t.name}</div>
                <div
                  className={`text-sm mt-1 ${featured ? "text-white/60" : "text-muted-foreground"}`}
                >
                  {t.target}
                </div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display font-bold text-4xl">{t.price}</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm flex-1">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/inscription"
                  className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-sm transition ${featured ? "bg-primary text-ink hover:brightness-110" : "bg-ink text-white hover:bg-ink/90"}`}
                >
                  Réserver <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}

export { TicketsPreview };
