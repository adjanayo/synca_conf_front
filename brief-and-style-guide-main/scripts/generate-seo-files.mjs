// Génère public/robots.txt et public/sitemap.xml avant chaque build (voir
// "prebuild" dans package.json) -- ROADMAP_PUBLIC_SEO.md S1.3/S1.4. Lit
// VITE_SITE_URL depuis .env à la main (les variables VITE_* ne sont exposées
// qu'au code client par Vite, jamais à process.env côté Node) plutôt que
// d'ajouter une dépendance dotenv pour ce seul besoin.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

function readSiteUrl() {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) return null;
  const match = readFileSync(envPath, "utf-8").match(/^VITE_SITE_URL=(.+)$/m);
  return match ? match[1].trim().replace(/\/$/, "") : null;
}

// Routes publiques statiques uniquement -- pas les pages détail à id
// dynamique (/speakers/:id, /ambassadeurs/:id, non énumérables sans appeler
// l'API ici) ni les routes participant (/connexion, /espace, comptes
// personnels, aucune valeur SEO).
const ROUTES = [
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

const siteUrl = readSiteUrl();

// robots.txt : le chemin admin est un chemin aléatoire tiré d'une variable
// d'env au build (VITE_ADMIN_PATH, jamais "/admin") -- volontairement jamais
// mentionné ici (ni Allow ni Disallow), discrétion par obscurité + noindex +
// auth (ROADMAP_ADMIN.md A3). Écrit même sans domaine connu (Sitemap: omis).
const robotsLines = ["User-agent: *", "Allow: /"];
if (siteUrl) robotsLines.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
writeFileSync(join(rootDir, "public", "robots.txt"), robotsLines.join("\n") + "\n");
console.log("[generate-seo-files] public/robots.txt régénéré.");

if (!siteUrl) {
  console.warn(
    "[generate-seo-files] VITE_SITE_URL absent de .env -- public/sitemap.xml non régénéré (placeholder à définir avant mise en ligne, voir .env.example).",
  );
  process.exit(0);
}

const urlEntries = ROUTES.map(
  (route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`,
).join("\n");
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
writeFileSync(join(rootDir, "public", "sitemap.xml"), sitemapXml);
console.log(`[generate-seo-files] public/sitemap.xml régénéré (${ROUTES.length} routes, ${siteUrl}).`);
