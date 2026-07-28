import { About } from "./About";
import { FinalCTA } from "./FinalCTA";
import { Hero } from "./Hero";
import { PartnersTeaser } from "./PartenersTeaser";
import { ProgrammePreview } from "./ProgrammePreview";
import { Stats } from "./Stats";
import { TicketsPreview } from "./TicketsPreview";

export function IndexView() {
  return (
    <>
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
