import { Briefcase, Code2, PartyPopper, Shield, Sparkles, Users } from "lucide-react";

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


export {
    About
};