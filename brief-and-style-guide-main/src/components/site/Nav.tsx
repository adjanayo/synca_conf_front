import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/programme", label: "Programme" },
  { to: "/speakers", label: "Speakers" },
  { to: "/partenaires", label: "Partenaires" },
  { to: "/ambassadeur", label: "Ambassadeur" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[oklch(0.18_0_0_/_0.75)] border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between text-white">
        <Link to="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-ink">S</span>
          <span>Synca Conf <span className="text-primary">'27</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-white transition"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/inscription"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold text-sm px-4 py-2 hover:brightness-110 transition"
          >
            S'inscrire <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden text-white"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-ink">
          <div className="px-6 py-4 flex flex-col gap-3 text-white/80">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-1.5"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/inscription"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary text-ink font-semibold text-sm px-4 py-2"
            >
              S'inscrire <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
