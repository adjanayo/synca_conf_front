import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Linkedin } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { getAmbassador, type AmbassadorPublic } from "../../lib/api/applications";
import { ApiError } from "../../lib/api/client";

export function AmbassadeurDetailView() {
  const { id } = useParams<{ id: string }>();
  const [ambassador, setAmbassador] = useState<AmbassadorPublic | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setAmbassador(null);
    setNotFound(false);
    getAmbassador(Number(id))
      .then(setAmbassador)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      });
  }, [id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display font-bold text-3xl">Ambassadeur introuvable</h1>
        <p className="mt-4 text-muted-foreground">Ce profil n'existe pas ou n'est plus public.</p>
        <Link to="/ambassadeurs" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour aux ambassadeurs
        </Link>
      </div>
    );
  }

  if (!ambassador) {
    return <div className="py-32" />;
  }

  const socialEntries = ambassador.social_handles ? Object.entries(ambassador.social_handles) : [];

  return (
    <>
      <PageHeader
        eyebrow={ambassador.current_profile ?? "Ambassadeur"}
        title={<>{ambassador.first_name} {ambassador.last_name}</>}
        description={`${ambassador.city}, ${ambassador.country}`}
      >
        <Link to="/ambassadeurs" className="mt-6 inline-flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour aux ambassadeurs
        </Link>
      </PageHeader>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-[280px_1fr] gap-10">
          <div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-ink/20">
              {ambassador.photo_url ? (
                <img
                  src={ambassador.photo_url}
                  alt={`${ambassador.first_name} ${ambassador.last_name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="mt-5 space-y-2 text-sm">
              {ambassador.institution_company && (
                <div className="text-muted-foreground">{ambassador.institution_company}</div>
              )}
              {ambassador.linkedin_url && (
                <a href={ambassador.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
              {socialEntries.map(([platform, handle]) => (
                <div key={platform} className="text-muted-foreground">
                  {platform} : {handle}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground leading-relaxed">
              {ambassador.first_name} représente Synca Conf et mobilise sa communauté pour faire
              rayonner l'événement au sein de son réseau.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
