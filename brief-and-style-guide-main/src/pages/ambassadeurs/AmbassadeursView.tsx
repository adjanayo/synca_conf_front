import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { getAmbassadors, type AmbassadorPublic } from "../../lib/api/applications";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";

export function AmbassadeursView() {
  useBrandedPageMeta(
    "Ambassadeurs",
    "Étudiants, professionnels et créateurs de contenu qui mobilisent leur communauté pour l'édition à venir.",
  );
  const [ambassadors, setAmbassadors] = useState<AmbassadorPublic[] | null>(null);

  useEffect(() => {
    getAmbassadors()
      .then(setAmbassadors)
      .catch(() => setAmbassadors([]));
  }, []);

  const confirmed = ambassadors ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Ambassadeurs"
        title={<>Ceux qui portent <span className="text-primary">la voix de Synca Conf</span>.</>}
        description="Étudiants, professionnels et créateurs de contenu qui mobilisent leur communauté pour l'édition à venir."
      >
        <div className="mt-8">
          <Link to="/ambassadeur" className="inline-flex items-center gap-2 rounded-full bg-primary text-ink font-semibold px-6 py-3 hover:brightness-110 transition">
            <Megaphone className="w-4 h-4" /> Devenir ambassadeur
          </Link>
        </div>
      </PageHeader>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          {confirmed.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {confirmed.map((a) => (
                <Link key={a.id} to={`/ambassadeurs/${a.id}`} className="group">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-ink/20">
                    {a.photo_url ? (
                      <img
                        src={a.photo_url}
                        alt={`${a.first_name} ${a.last_name}`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/0 transition-colors" />
                    {a.current_profile && (
                      <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                        <div className="text-[10px] uppercase tracking-widest font-bold">
                          {a.current_profile}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 font-display font-semibold text-lg">
                    {a.first_name} {a.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">{a.city}, {a.country}</div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mx-auto max-w-xl text-center text-muted-foreground">
              Les ambassadeurs seront annoncés prochainement. Suis nos pages Synca Conf pour ne rien
              manquer de l'annonce.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
