// Liste partagée des routes publiques statiques (id dynamique exclu :
// /speakers/:id, /ambassadeurs/:id -- non énumérables sans appeler l'API,
// et routes participant /connexion, /espace -- aucune valeur SEO/pré-rendu).
// Utilisée par generate-seo-files.mjs (sitemap.xml) et prerender.mjs.
export const PUBLIC_ROUTES = [
  "/",
  "/programme",
  "/speakers",
  "/partenaires",
  "/exposants",
  "/ambassadeur",
  "/ambassadeurs",
  "/hackathon-universitaire",
  "/faq",
  "/contact",
  "/inscription",
  "/candidature-speaker",
];
