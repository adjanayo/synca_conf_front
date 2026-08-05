import { useEffect, useState } from "react";
import {
  ArrowRight, Calendar, MapPin, Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { PARAMETER } from "@/data/parameter";

const TARGET = new Date("2027-03-16T09:00:00+00:00").getTime();





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
    { v: t.d, l: "Jours" },
    { v: t.h, l: "Heures" },
    { v: t.m, l: "Min" },
    { v: t.s, l: "Sec" },
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
          Synca Cyber <span className="text-primary">Challenge</span><br />
          {/* <span className="text-white/90">Dakar · Africa builds.</span> */}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70">
          {PARAMETER.slogan}
        </p>
        {/* <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/inscription" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-6 py-3.5 hover:brightness-110 transition shadow-glow">
            Prendre mon ticket <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/partenaires" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-medium hover:bg-white/5 transition">
            Devenir partenaire
          </Link>
        </div> */}
        <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
          <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {PARAMETER.date}</span>
          <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {PARAMETER.lieu}</span>
          <span className="inline-flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {PARAMETER.participants}</span>
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


export { 
    Hero
};