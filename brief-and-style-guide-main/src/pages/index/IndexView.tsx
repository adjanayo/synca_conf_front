import { About } from "./About";
import { FinalCTA } from "./FinalCTA";
import { Hero } from "./Hero";
import { PartnersTeaser } from "./PartenersTeaser";
import { ProgrammePreview } from "./ProgrammePreview";
import { Stats } from "./Stats";
import { useBrandedPageMeta } from "../../hooks/usePageMeta";
import { EventJsonLd } from "../../components/site/EventJsonLd";

export function IndexView() {
  useBrandedPageMeta(
    null,
    "+2000 fondateurs, décideurs, professionnels et étudiants autour de l'économie numérique, des nouvelles technologies et de la formation Tech en Afrique — Synca Conf & ACYBIA Forum, 15-17 mars 2027, Noom Hôtel Sea Plaza, Dakar.",
  );

  return (
    <>
      <EventJsonLd />
      <Hero />
      <Stats />
      <About />
      <ProgrammePreview />
      <PartnersTeaser />
      <FinalCTA />
    </>
  );
}
