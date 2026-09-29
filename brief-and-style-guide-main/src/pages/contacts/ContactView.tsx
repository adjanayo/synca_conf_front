
import { ArrowRight, ExternalLink, Handshake, Mail, MapPin, Phone, Store } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";
import { MAILTO, PARAMETER } from "../../data/parameter";

const TEAM = [
  { i: <Mail className="w-5 h-5" />, t: "Email général", v: "contact@sync-africa.com", href: "mailto:contact@sync-africa.com" },
  { i: <Mail className="w-5 h-5" />, t: "Partenariats", v: "astou.diakhate@sync-africa.com", href: "mailto:astou.diakhate@sync-africa.com" },
  // { i: <Mail className="w-5 h-5" />, t: "Speakers", v: "speakers@sync-africa.com" },
  { i: <Phone className="w-5 h-5" />, t: "Appel", v: "+221 77 830 60 46", href: "tel:+221778306046" },
  { i: <Phone className="w-5 h-5" />, t: "Appel", v: "+228 70 48 41 64", href: "tel:+22870484164" },
  { i: <MapPin className="w-5 h-5" />, t: "Adresse", v: "Dakar, Sénégal", href: undefined },
];

const REQUESTS = [
  { i: <Handshake className="w-5 h-5" />, t: "Devenir partenaire", d: "Associez votre marque à Synca Conf 2027.", href: MAILTO.partner },
  { i: <Store className="w-5 h-5" />, t: "Devenir exposant", d: "Réservez votre stand dans l'espace exposition.", href: MAILTO.exhibitor },
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

      <section className="pt-16 bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl bg-ink text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Participants</div>
              <div className="mt-2 font-display font-bold text-2xl">Tu veux participer à l'événement ?</div>
              <p className="mt-2 text-white/70 max-w-2xl">
                Les inscriptions des participants se font sur la plateforme de l'ACYBIA Forum.
              </p>
            </div>
            <a
              href={PARAMETER.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-6 py-3 hover:brightness-110 transition"
            >
              Je m'inscris <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {REQUESTS.map((r) => (
              <a
                key={r.t}
                href={r.href}
                className="group rounded-2xl bg-white border border-border p-6 shadow-card hover:border-primary/40 transition flex items-start gap-4"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-peach text-primary">{r.i}</span>
                <span className="flex-1">
                  <span className="block font-display font-bold text-lg">{r.t}</span>
                  <span className="block mt-1 text-sm text-muted-foreground">{r.d}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Nous écrire <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">L'équipe Synca</div>
          <div className="grid md:grid-cols-3 gap-4">
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
        </div>
      </section>
    </>
  );
}
