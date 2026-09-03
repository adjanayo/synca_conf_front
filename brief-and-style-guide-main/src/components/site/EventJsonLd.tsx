import { useEventWindow } from "../../hooks/useEventWindow";

/**
 * JSON-LD `Event` sur l'index (ROADMAP_PUBLIC_SEO.md S1.5) -- synchronisé
 * avec les vraies dates/lieu (fenêtre de campagne "event" + EventSettings),
 * jamais de valeurs en dur. N'apparaît qu'une fois ces requêtes chargées :
 * pas de pré-rendu/SSR sur ce site (S1.6), seuls les crawlers qui exécutent
 * le JS (Googlebot le fait) le verront de toute façon.
 */
export function EventJsonLd() {
  const { name, year, venue, startAt, endAt } = useEventWindow();

  if (!startAt || !endAt) return null;

  const siteUrl = window.location.origin;
  const eventName = year != null ? `${name} ${year}` : name;

  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventName,
    startDate: startAt.toISOString(),
    endDate: endAt.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: venue,
      address: venue,
    },
    image: [`${siteUrl}/parameter/Logoicone%20principale_CMJN.svg`],
    description: eventName,
    url: siteUrl,
  };

  // `<` échappé pour empêcher un champ admin-configuré (name/venue, jamais
  // saisie utilisateur non filtrée, mais on ne prend pas le risque) de
  // fermer prématurément la balise <script> via "</script>".
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
