import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, Calendar, MapPin, Users, Sparkles, Code2, Shield,
  Briefcase, PartyPopper, Mic, Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Synca Conf 2027 — Dakar · 18–20 Août" },
      {
        name: "description",
        content:
          "La conférence tech panafricaine. Dakar, 18–20 Août 2027. +2000 participants, +10 pays. Vibeathon IA, CTF, Women In Tech, Job Fair.",
      },
    ],
  }),
  component: Home,
});

const TARGET = new Date("2027-08-18T09:00:00+00:00").getTime();

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, TARGET - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

function Hero() {
  const t = useCountdown();
  const cells = [
    { v: t.d, l: "Jours" }, { v: t.h, l: "Heures" }, { v: t.m, l: "Min" }, { v: t.s, l: "Sec" },
  ];
  return (
    <section className="relative overflow-hidden bg-ink text-white pt-32 pb-24">
      <div className="pointer-events-none absolute -top-32 -right-20 w-[40rem] h-[40rem] rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 w-[35rem] h-[35rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          La conférence tech panafricaine · Édition 2027
        </div>
        <h1 className="mt-6 font-display font-bold text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] tracking-tighter">
          Synca Conf <span className="text-primary">2027</span><br />
          <span className="text-white/90">Dakar · Africa builds.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70">
          3 jours pour réunir +2 000 builders, designers, fondateurs et décideurs autour de l'IA,
          du produit, de la cybersécurité et de l'impact à travers l'Afrique.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/inscription" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-6 py-3.5 hover:brightness-110 transition shadow-glow">
            Prendre mon ticket <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/partenaires" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-medium hover:bg-white/5 transition">
            Devenir partenaire
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
          <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> 18–20 Août 2027</span>
          <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Dakar, Sénégal</span>
          <span className="inline-flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> +2 000 participants</span>
        </div>
        <div className="mt-14 grid grid-cols-4 max-w-xl gap-3">
          {cells.map((c) => (
            <div key={c.l} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-4 text-center">
              <div className="font-display font-bold text-4xl md:text-5xl tabular-nums text-white">
                {String(c.v).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-white/50">{c.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: "+2 000", l: "Participants" },
    { v: "+10", l: "Pays représentés" },
    { v: "+30", l: "Startups" },
    { v: "3", l: "Jours d'événement" },
  ];
  return (
    <section className="bg-primary text-ink">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((i) => (
          <div key={i.l} className="text-center">
            <div className="font-display font-bold text-4xl md:text-5xl">{i.v}</div>
            <div className="mt-1 text-sm font-medium opacity-80">{i.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  const features = [
    { i: <Sparkles className="w-4 h-4" />, t: "Conférence principale" },
    { i: <Code2 className="w-4 h-4" />, t: "Vibeathon IA & Impact" },
    { i: <Shield className="w-4 h-4" />, t: "CTF Cybersécurité" },
    { i: <Briefcase className="w-4 h-4" />, t: "Job Fair & B2B" },
    { i: <Users className="w-4 h-4" />, t: "Women In Tech" },
    { i: <PartyPopper className="w-4 h-4" />, t: "After Party Dakar" },
  ];
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">À propos</div>
          <h2 className="mt-4 font-display font-bold text-4xl md:text-5xl leading-tight">
            Une scène panafricaine pour ceux qui <span className="text-primary">construisent</span>.
          </h2>
        </div>
        <div className="md:col-span-7 space-y-5 text-muted-foreground text-lg leading-relaxed">
          <p>
            La <strong className="text-foreground">Synca Conf</strong> est la conférence annuelle organisée par
            la communauté Synca pour rendre la tech africaine accessible, inclusive et ambitieuse.
          </p>
          <p>
            L'édition 2027 réunit à Dakar plus de 2 000 participants autour d'une conférence principale,
            d'un <strong className="text-foreground">Vibeathon IA</strong>, d'un <strong className="text-foreground">CTF cybersécurité</strong>,
            de workshops B2B, d'un side event <strong className="text-foreground">Women In Tech</strong>,
            d'une Job Fair et d'une After Party mémorable.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-4">
            {features.map((x) => (
              <div key={x.t} className="flex items-center gap-3 rounded-xl bg-peach px-4 py-3 text-ink">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-primary">{x.i}</span>
                <span className="font-medium">{x.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgrammePreview() {
  const days = [
    { d: "Jour 1 · Lun 18 Août", tag: "Opening", items: [
      { h: "09:00", t: "Cérémonie d'ouverture & Keynote" },
      { h: "11:00", t: "Panel — L'Afrique à l'ère de l'IA" },
      { h: "14:00", t: "Workshops produit · cyber · data" },
      { h: "18:00", t: "Welcome cocktail" },
    ]},
    { d: "Jour 2 · Mar 19 Août", tag: "Build", items: [
      { h: "09:00", t: "Vibeathon IA & Impact" },
      { h: "10:30", t: "CTF Cybersécurité" },
      { h: "14:00", t: "Side event Women In Tech" },
      { h: "19:00", t: "Dîner partenaires" },
    ]},
    { d: "Jour 3 · Mer 20 Août", tag: "Connect", items: [
      { h: "09:00", t: "Job Fair" },
      { h: "12:00", t: "Pitching startups" },
      { h: "16:00", t: "Keynote de clôture" },
      { h: "21:00", t: "After Party officielle" },
    ]},
  ];
  return (
    <section className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Programme</div>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">3 jours, une cadence intense.</h2>
          </div>
          <Link to="/programme" className="text-sm font-semibold text-ink inline-flex items-center gap-1 hover:gap-2 transition-all">
            Programme complet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {days.map((day) => (
            <article key={day.d} className="group rounded-3xl bg-white border border-border p-6 hover:-translate-y-1 transition-transform shadow-card">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">{day.tag}</div>
                <span className="text-xs text-muted-foreground">4 sessions clés</span>
              </div>
              <h3 className="mt-3 font-display font-bold text-2xl">{day.d}</h3>
              <ul className="mt-6 space-y-4">
                {day.items.map((it) => (
                  <li key={it.h} className="flex gap-4">
                    <span className="text-sm font-semibold text-primary tabular-nums w-12 shrink-0">{it.h}</span>
                    <span className="text-sm text-foreground">{it.t}</span>
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

function TicketsPreview() {
  const tickets = [
    { name: "Étudiant", price: "5 000", target: "Étudiants & lycéens", perks: ["Conf + Expo", "CTF / Hackathon", "Accès 2 jours"], badge: "" },
    { name: "Professionnel", price: "25 000", target: "Devs, designers, PMs", perks: ["Conf + Expo", "Networking", "1 déjeuner inclus"], badge: "Populaire" },
    { name: "Startup", price: "35 000", target: "Fondateurs", perks: ["Pitching B2B", "Networking VIP", "Accès complet"], badge: "" },
    { name: "VIP", price: "100 000", target: "Décideurs & partenaires", perks: ["Tout inclus 3 jours", "Dîner gala", "After party"], badge: "Premium" },
  ];
  return (
    <section className="py-24 bg-peach">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Tickets</div>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">Choisis ton pass.</h2>
          <p className="mt-3 text-muted-foreground">
            Paiement par carte, Wave, Orange Money ou virement. Codes promo Early Bird disponibles.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tickets.map((t) => {
            const featured = t.badge === "Populaire";
            return (
              <article key={t.name} className={`relative rounded-3xl p-7 flex flex-col ${featured ? "bg-ink text-white shadow-glow" : "bg-white text-ink border border-border"}`}>
                {t.badge && (
                  <span className={`absolute -top-3 left-7 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${featured ? "bg-primary text-ink" : "bg-ink text-primary"}`}>
                    {t.badge}
                  </span>
                )}
                <div className="font-display font-bold text-2xl">{t.name}</div>
                <div className={`text-sm mt-1 ${featured ? "text-white/60" : "text-muted-foreground"}`}>{t.target}</div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display font-bold text-4xl">{t.price}</span>
                  <span className={`text-sm ${featured ? "text-white/60" : "text-muted-foreground"}`}>F CFA</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm flex-1">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/inscription" className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-sm transition ${featured ? "bg-primary text-ink hover:brightness-110" : "bg-ink text-white hover:bg-ink/90"}`}>
                  Réserver <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PartnersTeaser() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Partenaires</div>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl">Construisez l'avenir tech africain avec nous.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Six niveaux de partenariat — de 1,5M à 10M F CFA — pour aligner votre marque sur l'écosystème tech
            le plus dynamique du continent : recrutement, visibilité, B2B, impact.
          </p>
          <Link to="/partenaires" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-3 font-semibold text-sm hover:bg-ink/90 transition">
            Voir les offres <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="md:col-span-5 grid grid-cols-3 gap-3">
          {["Title", "Platinum", "Gold", "Silver", "Bronze", "Média"].map((t) => (
            <div key={t} className="aspect-square rounded-2xl bg-peach border border-primary/20 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-ink">
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full bg-primary/20 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Dakar · 18–20 Août 2027</div>
        <h2 className="mt-6 font-display font-bold text-5xl md:text-7xl leading-[0.95] tracking-tighter">
          Rejoins-nous à <span className="text-primary">Dakar</span>.
        </h2>
        <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto">
          Trois jours pour rencontrer, apprendre, recruter, pitcher, et célébrer la tech africaine.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/inscription" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-7 py-4 hover:brightness-110 transition shadow-glow">
            Je prends mon ticket <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/ambassadeur" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-medium hover:bg-white/5 transition">
            Devenir ambassadeur
          </Link>
          <Link to="/candidature-speaker" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-medium hover:bg-white/5 transition">
            <Mic className="w-4 h-4" /> Candidater speaker
          </Link>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <ProgrammePreview />
      <TicketsPreview />
      <PartnersTeaser />
      <FinalCTA />
    </>
  );
}
