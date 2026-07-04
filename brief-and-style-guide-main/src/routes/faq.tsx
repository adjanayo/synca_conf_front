import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "../components/site/PageHeader";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ · Synca Conf 2027" },
      { name: "description", content: "Questions fréquentes sur la Synca Conf 2027 — participants, sponsors, speakers." },
    ],
  }),
  component: FAQPage,
});

type Item = { q: string; a: string };
type Cat = { id: string; label: string; items: Item[] };

const CATS: Cat[] = [
  {
    id: "participants", label: "Participants",
    items: [
      { q: "Quand et où se tient la Synca Conf 2027 ?", a: "Du 18 au 20 août 2027 à Dakar, Sénégal. Le lieu exact est communiqué aux participants confirmés." },
      { q: "Quels moyens de paiement sont acceptés ?", a: "Carte bancaire, Wave, Orange Money, MTN Mobile Money, virement bancaire." },
      { q: "Y a-t-il un tarif Early Bird ?", a: "Oui — jusqu'à -30% via les codes Early Bird et codes ambassadeurs jusqu'à une date limite annoncée." },
      { q: "Puis-je participer en ligne ?", a: "Oui, un pass Online permet de suivre les keynotes et panels principaux à distance." },
      { q: "Les pass sont-ils remboursables ?", a: "Annulations remboursées à 100% jusqu'à 60 jours avant l'événement, 50% jusqu'à 30 jours, non remboursables ensuite." },
    ],
  },
  {
    id: "sponsors", label: "Sponsors",
    items: [
      { q: "Quels niveaux de partenariat proposez-vous ?", a: "Six niveaux : Title, Platinum, Gold, Silver, Bronze, et Partenaire média." },
      { q: "Puis-je avoir un pack sur-mesure ?", a: "Oui, écris à partenariats@sync-africa.com pour un dossier personnalisé." },
      { q: "Recevons-nous un rapport post-event ?", a: "Oui, à partir du niveau Gold — données d'engagement, audience, retombées presse." },
    ],
  },
  {
    id: "speakers", label: "Speakers",
    items: [
      { q: "Comment candidater ?", a: "Via le formulaire dédié, ouvert dès mars 2027." },
      { q: "Quels formats d'intervention sont possibles ?", a: "Keynote (30 min), Panel (45 min), Workshop (90 min), Lightning Talk (10 min), Fireside Chat (30 min)." },
      { q: "Les frais de déplacement sont-ils pris en charge ?", a: "Pour les keynote speakers internationaux : vol + hébergement. Pour les autres formats, étudié au cas par cas." },
      { q: "Quand recevrai-je une réponse ?", a: "Sous 4 semaines après la clôture des candidatures." },
    ],
  },
];

function FAQPage() {
  const [active, setActive] = useState(CATS[0].id);
  const cat = CATS.find((c) => c.id === active)!;
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
                  active === c.id ? "bg-ink text-white border-ink" : "bg-white text-ink border-border hover:border-primary"
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
