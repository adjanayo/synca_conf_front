import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white pt-32 pb-16">
      <div className="pointer-events-none absolute -top-32 -right-20 w-[35rem] h-[35rem] rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="relative mx-auto max-w-7xl px-6">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 uppercase tracking-widest">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-5 font-display font-bold text-5xl md:text-6xl tracking-tighter leading-[0.95]">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg text-white/70">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
