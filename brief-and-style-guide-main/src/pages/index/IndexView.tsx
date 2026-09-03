import { About } from "./About";
import { FinalCTA } from "./FinalCTA";
import { Hero } from "./Hero";
import { PartnersTeaser } from "./PartenersTeaser";
import { ProgrammePreview } from "./ProgrammePreview";
import { Stats } from "./Stats";
import { TicketsPreview } from "./TicketsPreview";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";
import { EventJsonLd } from "../../components/site/EventJsonLd";

export function IndexView() {
  useBrandedPageMeta(
    null,
    "+2000 fondateurs, décideurs, professionnels et étudiants autour de l'économie numérique, des nouvelles technologies et de la formation Tech en Afrique — 18-20 août 2027, Dakar, Sénégal.",
  );

  return (
    <>
      <EventJsonLd />
      <Hero />
      <Stats />
      <About />
      <ProgrammePreview />
      <TicketsPreview />
      <PartnersTeaser />
      <FinalCTA />
    </>
  );
}
