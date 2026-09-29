// Liste partagée des routes publiques statiques, utilisée par
// generate-seo-files.mjs (sitemap.xml) et prerender.mjs. Les pages speakers
// sont en dur (src/data/speaker.ts) : garder SPEAKER_IDS synchronisé.
const SPEAKER_IDS = ["christian-kpolo", "leonel-ngoya", "marylin-marchal"];

export const PUBLIC_ROUTES = [
  "/",
  "/programme",
  "/speakers",
  ...SPEAKER_IDS.map((id) => `/speakers/${id}`),
  "/partenaires",
  "/exposants",
  "/hackathon-universitaire",
  "/faq",
  "/contact",
];
