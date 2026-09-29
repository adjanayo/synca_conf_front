
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";

const TEAM = [
  { i: <Mail className="w-5 h-5" />, t: "Email général", v: "contact@sync-africa.com", href: "mailto:contact@sync-africa.com" },
  { i: <Mail className="w-5 h-5" />, t: "Partenariats", v: "astou.diakhate@sync-africa.com", href: "mailto:astou.diakhate@sync-africa.com" },
  // { i: <Mail className="w-5 h-5" />, t: "Speakers", v: "speakers@sync-africa.com" },
  { i: <Phone className="w-5 h-5" />, t: "Appel", v: "+221 77 830 60 46", href: "tel:+221778306046" },
  { i: <Phone className="w-5 h-5" />, t: "Appel", v: "+228 70 48 41 64", href: "tel:+22870484164" },
  { i: <MapPin className="w-5 h-5" />, t: "Adresse", v: "Dakar, Sénégal", href: undefined },
];



export function ContactView() {
  useBrandedPageMeta(
    "Contact",
    "Une question, un projet, une suggestion ? Écris-nous ou appelle-nous, l'équipe Synca te répond sous 48h.",
  );

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Parlons <span className="text-primary">ensemble</span>.</>}
        description="Une question, un projet, une suggestion ? Écris-nous ou appelle-nous, l'équipe Synca te répond sous 48h."
      />

      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-3 gap-4">
          {TEAM.map((c) => (
            <div key={c.v} className="rounded-2xl bg-white border border-border p-5 shadow-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-peach text-primary">{c.i}</div>
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{c.t}</div>
              <div className="mt-1 font-semibold text-foreground break-words">
                {c.href ? (
                  <a href={c.href} className="hover:text-primary transition">
                    {c.v}
                  </a>
                ) : (
                  c.v
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
