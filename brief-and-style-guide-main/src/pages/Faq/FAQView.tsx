import { useEffect, useState } from "react";
import { PageHeader } from "../../components/site/PageHeader";
import { buildFaqCategories } from "../../data/faq";
import { useEventWindow } from "../../hooks/useEventWindow";
import { getFaqCategories, getFaqs, type FaqCategoryPublic, type FaqPublic } from "../../lib/api/faq";

type DisplayCategory = { id: string; label: string; items: { q: string; a: string }[] };

export function FAQView() {
  const { name, year, dateLabel, venue } = useEventWindow();
  const [remoteCategories, setRemoteCategories] = useState<FaqCategoryPublic[] | null>(null);
  const [remoteFaqs, setRemoteFaqs] = useState<FaqPublic[]>([]);

  useEffect(() => {
    Promise.all([getFaqCategories(), getFaqs()])
      .then(([categories, faqs]) => {
        setRemoteCategories(categories);
        setRemoteFaqs(faqs);
      })
      .catch(() => setRemoteCategories([]));
  }, []);

  const CATS: DisplayCategory[] =
    remoteCategories && remoteCategories.length > 0
      ? remoteCategories.map((c) => ({
          id: String(c.id),
          label: c.name,
          items: remoteFaqs
            .filter((f) => f.category_id === c.id)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((f) => ({ q: f.question, a: f.answer })),
        }))
      : buildFaqCategories({ name, year, dateLabel, venue });

  const [active, setActive] = useState<string | null>(null);
  const activeId = active ?? CATS[0]?.id;
  const cat = CATS.find((c) => c.id === activeId) ?? CATS[0];

  if (!cat) return null;

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title={<>On répond à <span className="text-primary">l'essentiel</span>.</>}
        description="Trouve les réponses aux questions les plus fréquentes, classées par catégorie."
      />
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CATS.map((c) => (
              <button key={c.id} onClick={() => setActive(c.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition border ${
                  activeId === c.id ? "bg-ink text-white border-ink" : "bg-white text-ink border-border hover:border-primary"
                }`}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="divide-y divide-border rounded-3xl bg-white border border-border overflow-hidden shadow-card">
            {cat.items.map((item, i) => (
              <details key={i} className="group p-6 open:bg-peach/40 transition-colors">
                <summary className="flex items-center justify-between gap-6 cursor-pointer list-none">
                  <span className="font-display font-semibold text-lg">{item.q}</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-primary text-lg group-open:rotate-45 transition-transform shrink-0">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
