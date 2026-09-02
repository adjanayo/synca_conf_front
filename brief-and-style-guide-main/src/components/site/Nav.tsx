import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../lib/auth/useAuth";
import { useEventWindow } from "@/hooks/useEventWindow";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/programme", label: "Programme" },
  { to: "/speakers", label: "Speakers" },
  { to: "/partenaires", label: "Partenaires" },
  { to: "/ambassadeur", label: "Ambassadeur" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { year } = useEventWindow();
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[oklch(0.18_0_0_/_0.75)] border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between text-white">
        <Link to="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
          <img src="/parameter/Logoicone orange blanc_CMJN.svg" alt="Logo CMJN" className="h-12 w-12"/>
          <span>
            Synca Conf {year != null && <span className="text-primary">'{String(year).slice(-2)}</span>}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }: { isActive: boolean }) =>
                `transition ${isActive ? "text-primary" : "text-white/70 hover:text-white"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to={isAuthenticated ? "/espace" : "/connexion"}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition"
          >
            <User className="w-4 h-4" /> {isAuthenticated ? "Mon espace" : "Connexion"}
          </Link>
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
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }: { isActive: boolean }) =>
                  `py-1.5 transition ${isActive ? "text-primary" : "text-white/80 hover:text-white"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to={isAuthenticated ? "/espace" : "/connexion"}
              onClick={() => setOpen(false)}
              className="py-1.5 inline-flex items-center gap-1.5 text-white/80 hover:text-white transition"
            >
              <User className="w-4 h-4" /> {isAuthenticated ? "Mon espace" : "Connexion"}
            </Link>
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
