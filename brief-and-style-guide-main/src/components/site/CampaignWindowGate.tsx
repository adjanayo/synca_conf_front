import { useEffect, useState, type ReactNode } from "react";
import { Lock, Bell } from "lucide-react";
import { useCampaignWindow } from "../../hooks/useEventWindow";

/**
 * Affiche `children` uniquement si la fenêtre de campagne `windowKey` est
 * ouverte (même règle que `require_open_campaign` côté back : actif + dans
 * la plage [début, fin]) — sinon un message d'invitation à suivre les pages
 * Synca Conf, avec un compte à rebours si une date d'ouverture future est
 * connue.
 */
export function CampaignWindowGate({
  windowKey,
  label,
  children,
}: {
  windowKey: string;
  label: string;
  children: ReactNode;
}) {
  const { startAt, isActive, isOpen, isLoading } = useCampaignWindow(windowKey);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) return null;
  if (isOpen) return <>{children}</>;

  const notYetOpen = isActive && startAt !== null && now < startAt.getTime();

  if (notYetOpen) {
    const diff = startAt.getTime() - now;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-peach text-primary">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="mt-6 font-display font-bold text-3xl">Bientôt disponible</h2>
          <p className="mt-3 text-muted-foreground">{label} ouvrent bientôt.</p>
          <div className="mt-8 grid grid-cols-4 gap-3">
            {[
              { v: d, l: "Jours" },
              { v: h, l: "Heures" },
              { v: m, l: "Min" },
              { v: s, l: "Sec" },
            ].map((c) => (
              <div key={c.l} className="rounded-2xl bg-peach p-4">
                <div className="font-display font-bold text-3xl tabular-nums text-ink">
                  {String(c.v).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{c.l}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Ouverture le{" "}
            <strong className="text-foreground">
              {startAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="rounded-3xl border border-border bg-white p-10 text-center shadow-card">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-peach text-primary">
          <Bell className="w-6 h-6" />
        </div>
        <h2 className="mt-6 font-display font-bold text-3xl">Pas encore ouvert</h2>
        <p className="mt-3 text-muted-foreground">
          {label} ne sont pas ouvertes pour le moment. Suis nos pages pour être informé de l'annonce d'ouverture et
          reviens candidater ensuite.
        </p>
      </div>
    </div>
  );
}
