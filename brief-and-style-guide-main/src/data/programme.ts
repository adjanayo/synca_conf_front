type Slot = {
  h: string;
  t: string;
  cat: "Masterclass" | "Cérémonie" | "Hackathon" | "ACYBIA";
  lieu?: string;
};
type Day = { id: string; date: string; theme: string; slots: Slot[]; external?: boolean };

// Le programme Synca Conf est intégré à celui d'ACYBIA Forum : les 15 et 16
// Mars suivent le programme officiel ACYBIA (lien PARAMETER.acybiaProgrammeUrl),
// seul le 17 Mars est une journée parallèle Synca Conf. Horaires et intitulés
// des masterclass encore à arrêter (TODO.md).
const DAYS: Day[] = [
  {
    id: "j1",
    date: "Lundi 15 Mars 2027",
    theme: "ACYBIA Forum · Hackathon",
    external: true,
    slots: [
      { h: "Journée", t: "Programme officiel ACYBIA Forum", cat: "ACYBIA" },
      { h: "Journée", t: "Lancement du Hackathon interuniversitaire (48h)", cat: "Hackathon" },
    ],
  },
  {
    id: "j2",
    date: "Mardi 16 Mars 2027",
    theme: "ACYBIA Forum · Hackathon",
    external: true,
    slots: [
      { h: "Journée", t: "Programme officiel ACYBIA Forum", cat: "ACYBIA" },
      { h: "Journée", t: "Hackathon interuniversitaire — suite des travaux", cat: "Hackathon" },
    ],
  },
  {
    id: "j3",
    date: "Mercredi 17 Mars 2027",
    theme: "Journée Synca Conf",
    slots: [
      { h: "À préciser", t: "Masterclass 1 — À annoncer", cat: "Masterclass" },
      { h: "À préciser", t: "Masterclass 2 — À annoncer", cat: "Masterclass" },
      { h: "À préciser", t: "Masterclass 3 — À annoncer", cat: "Masterclass" },
      {
        h: "À préciser",
        t: "Remise des prix du Hackathon interuniversitaire",
        cat: "Cérémonie",
      },
    ],
  },
];

const CAT_COLORS: Record<Slot["cat"], string> = {
  Masterclass: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cérémonie: "bg-primary/15 text-primary border-primary/30",
  Hackathon: "bg-purple-100 text-purple-700 border-purple-200",
  ACYBIA: "bg-blue-100 text-blue-700 border-blue-200",
};

export { DAYS, CAT_COLORS };

export type { Slot, Day };
