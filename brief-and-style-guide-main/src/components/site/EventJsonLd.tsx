import { PARAMETER } from "../../data/parameter";
import { siteOrigin } from "../../hooks/usePageMeta";

/**
 * JSON-LD `Event` sur l'index (ROADMAP_PUBLIC_SEO.md S1.5) -- valeurs en dur
 * depuis PARAMETER (plus de back-office).
 */
export function EventJsonLd() {
  const siteUrl = siteOrigin();
  const eventName = `${PARAMETER.title} ${PARAMETER.year}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventName,
    startDate: PARAMETER.startDate,
    endDate: PARAMETER.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Noom Hôtel Sea Plaza",
      address: PARAMETER.lieu,
    },
    image: [`${siteUrl}/parameter/Logoicone%20principale_CMJN.svg`],
    description: eventName,
    url: siteUrl,
  };

  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
