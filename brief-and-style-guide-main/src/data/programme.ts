
type Slot = { h: string; t: string; cat: "Keynote" | "Panel" | "Workshop" | "Networking" | "Side"; lieu?: string };
type Day = { id: string; date: string; theme: string; slots: Slot[] };

const DAYS: Day[] = [
  {
    id: "j1", date: "Lundi 18 Août 2027", theme: "Opening · Vision",
    slots: [
      { h: "08:30", t: "Accueil & badges", cat: "Networking" },
      { h: "09:30", t: "Cérémonie d'ouverture officielle", cat: "Keynote", lieu: "Grand Auditorium" },
      { h: "10:15", t: "Keynote inaugurale — État de la tech en Afrique", cat: "Keynote" },
      { h: "11:00", t: "Panel — IA générative et souveraineté numérique africaine", cat: "Panel" },
      { h: "12:30", t: "Déjeuner & networking", cat: "Networking" },
      { h: "14:00", t: "Workshop — Construire avec les LLM open source", cat: "Workshop", lieu: "Salle A" },
      { h: "14:00", t: "Workshop — Product discovery en marché africain", cat: "Workshop", lieu: "Salle B" },
      { h: "16:00", t: "Panel — Carrières tech : freelance, salarié, founder", cat: "Panel" },
      { h: "18:00", t: "Welcome cocktail & networking", cat: "Networking" },
    ],
  },
  {
    id: "j2", date: "Mardi 19 Août 2027", theme: "Build · Hack",
    slots: [
      { h: "09:00", t: "Vibeathon IA & Impact — kick-off", cat: "Side", lieu: "Hall principal" },
      { h: "10:30", t: "CTF Cybersécurité — début compétition", cat: "Side", lieu: "Salle CTF" },
      { h: "11:00", t: "Keynote — Sécurité des systèmes critiques", cat: "Keynote" },
      { h: "12:30", t: "Déjeuner", cat: "Networking" },
      { h: "14:00", t: "Side event Women In Tech — Panel & mentoring", cat: "Side" },
      { h: "15:30", t: "Workshop — Data engineering moderne", cat: "Workshop" },
      { h: "17:00", t: "Fireside Chat — Investir dans la tech africaine", cat: "Panel" },
      { h: "19:00", t: "Dîner partenaires & speakers (sur invitation)", cat: "Networking" },
    ],
  },
  {
    id: "j3", date: "Mercredi 20 Août 2027", theme: "Connect · Celebrate",
    slots: [
      { h: "09:00", t: "Job Fair — ouverture · recruteurs & talents", cat: "Side", lieu: "Expo Hall" },
      { h: "10:30", t: "Lightning talks — 10 founders, 10 minutes chacun", cat: "Keynote" },
      { h: "12:00", t: "Pitching startups & demos", cat: "Side" },
      { h: "13:30", t: "Déjeuner B2B (rendez-vous matchmaking)", cat: "Networking" },
      { h: "15:00", t: "Panel — EdTech et formation aux métiers tech", cat: "Panel" },
      { h: "16:30", t: "Remise des prix Vibeathon & CTF", cat: "Keynote" },
      { h: "17:30", t: "Keynote de clôture", cat: "Keynote" },
      { h: "21:00", t: "After Party officielle Synca Conf", cat: "Networking" },
    ],
  },
];

const CAT_COLORS: Record<Slot["cat"], string> = {
  Keynote: "bg-primary/15 text-primary border-primary/30",
  Panel: "bg-blue-100 text-blue-700 border-blue-200",
  Workshop: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Networking: "bg-peach text-ink border-primary/20",
  Side: "bg-purple-100 text-purple-700 border-purple-200",
};


export { DAYS, CAT_COLORS }

export type { Slot, Day }