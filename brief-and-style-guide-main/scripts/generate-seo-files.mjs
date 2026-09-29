// Génère public/robots.txt et public/sitemap.xml avant chaque build (voir
// "prebuild" dans package.json). Lit VITE_SITE_URL à la main (les variables
// VITE_* ne sont exposées qu'au code client par Vite) : variable
// d'environnement du build si présente, sinon .env.production (committé,
// valeur publique), sinon .env local.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PUBLIC_ROUTES as ROUTES } from "./public-routes.mjs";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

function readSiteUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL.trim().replace(/\/$/, "");
  for (const file of [".env.production", ".env"]) {
    const envPath = join(rootDir, file);
    if (!existsSync(envPath)) continue;
    const match = readFileSync(envPath, "utf-8").match(/^VITE_SITE_URL=(.+)$/m);
    if (match) return match[1].trim().replace(/\/$/, "");
  }
  return null;
}

const siteUrl = readSiteUrl();

// robots.txt : tout le site est public. Écrit même sans domaine connu
// (Sitemap: omis).
const robotsLines = ["User-agent: *", "Allow: /"];
if (siteUrl) robotsLines.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
writeFileSync(join(rootDir, "public", "robots.txt"), robotsLines.join("\n") + "\n");
console.log("[generate-seo-files] public/robots.txt régénéré.");

if (!siteUrl) {
  console.warn(
    "[generate-seo-files] VITE_SITE_URL absent (.env.production / .env) -- public/sitemap.xml non régénéré (placeholder à définir avant mise en ligne, voir .env.example).",
  );
  process.exit(0);
}

const urlEntries = ROUTES.map(
  (route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`,
).join("\n");
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
writeFileSync(join(rootDir, "public", "sitemap.xml"), sitemapXml);
console.log(`[generate-seo-files] public/sitemap.xml régénéré (${ROUTES.length} routes, ${siteUrl}).`);
