import { Link } from "react-router-dom";
import { LINKS } from "@/data/parameter";
import { useEventWindow } from "@/hooks/useEventWindow";

export function Footer() {
  const { startAt } = useEventWindow();
  const year = startAt ? startAt.getFullYear() : new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/70 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-white text-xl"
          >
            <img
              src="/parameter/Logoicone orange blanc_CMJN.svg"
              alt="Logo CMJN"
              className="h-12 w-12"
            />
            Synca Conf <span className="text-primary">{year}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm">
            La conférence tech panafricaine. Organisée par la communauté Synca à Dakar, Sénégal.
          </p>
          <div className="mt-5 flex gap-3">
            {LINKS.map((link, i) => (
              <a
                key={i}
                href={link.to}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:bg-primary hover:text-ink hover:border-primary transition"
              >
                <link.icon className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-white font-semibold text-sm uppercase tracking-widest">
            Événement
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/programme" className="hover:text-white">
                Programme
              </Link>
            </li>
            <li>
              <Link to="/speakers" className="hover:text-white">
                Speakers
              </Link>
            </li>
            <li>
              <Link to="/inscription" className="hover:text-white">
                Billetterie
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold text-sm uppercase tracking-widest">
            Participer
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/candidature-speaker" className="hover:text-white">
                Candidater speaker
              </Link>
            </li>
            <li>
              <Link to="/ambassadeur" className="hover:text-white">
                Devenir ambassadeur
              </Link>
            </li>
            <li>
              <Link to="/partenaires" className="hover:text-white">
                Devenir partenaire
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span>© {year} Synca · Tous droits réservés</span>
          {/* <div className="flex gap-5">
            <a href="#" className="hover:text-white">Mentions légales</a>
            <a href="#" className="hover:text-white">Confidentialité</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
