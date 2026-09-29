// Pré-rendu post-build (ROADMAP_PUBLIC_SEO.md S1.6, "postbuild" dans
// package.json) : SPA pur (aucun SSR), donc un crawler qui n'exécute pas le
// JS ne voit que le HTML générique d'index.html -- ce script sert le build
// localement, visite chaque route publique statique avec un Chromium headless
// (Puppeteer), et écrase
// dist/<route>/index.html par le HTML réellement rendu. Le bundle JS reste
// chargé normalement ensuite pour un vrai visiteur (hydratation React
// classique, pas de SSR) -- ce n'est qu'un instantané pour les crawlers/
// aperçus de partage qui n'exécutent pas de JS.
//
// Contenu 100 % statique (src/data/) : aucun backend requis pendant le build.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import puppeteer from "puppeteer";
import { PUBLIC_ROUTES } from "./public-routes.mjs";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const PORT = 4666;
// "localhost" plutôt que 127.0.0.1 -- `vite preview` (sans --host) écoute
// sur ::1, pas forcément sur l'IPv4 loopback selon la résolution système.
const BASE_URL = `http://localhost:${PORT}`;

async function waitForServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok || res.status < 500) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`vite preview did not respond on ${BASE_URL} within ${timeoutMs}ms`);
}

async function startPreviewServer() {
  const proc = spawn(
    "npx",
    ["vite", "preview", "--port", String(PORT), "--strictPort"],
    { cwd: rootDir, stdio: ["ignore", "pipe", "pipe"] },
  );
  let exited = false;
  proc.on("exit", () => {
    exited = true;
  });
  try {
    await waitForServer(15000);
  } catch (err) {
    proc.kill();
    throw err;
  }
  if (exited) throw new Error("vite preview exited before serving any request");
  return proc;
}

// Sortie en fichier plat : dist/programme.html, et non dist/programme/index.html.
//
// Pourquoi : avec un dossier, Apache/LiteSpeed (mod_dir, DirectorySlash) répond
// par un 301 vers /programme/ AVANT que mod_rewrite ne puisse l'intercepter
// depuis un .htaccess. Or les <link rel="canonical"> et le sitemap annoncent
// /programme sans slash final : chaque page coûtait un aller-retour et le
// canonical pointait vers une URL qui redirige. En fichier, l'URL canonique
// est servie directement en 200, et le .htaccess fait le routage.
function outputPathFor(route) {
  if (route === "/") return join(rootDir, "dist", "index.html");
  return join(rootDir, "dist", `${route.replace(/^\//, "")}.html`);
}

async function main() {
  if (!existsSync(join(rootDir, "dist", "index.html"))) {
    console.warn("[prerender] dist/index.html introuvable -- build manquant, rien à pré-rendre.");
    return;
  }

  // Tourne dans le conteneur Docker (root, Chromium système via
  // PUPPETEER_EXECUTABLE_PATH) -- d'où --no-sandbox. Sur un hébergeur sans
  // Chromium, on garde le build SPA tel quel plutôt que de faire échouer
  // le déploiement (seul le HTML pré-rendu pour les crawlers manque).
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
  } catch (err) {
    console.warn(`[prerender] Chromium indisponible (${err.message}) -- pré-rendu ignoré, build SPA conservé.`);
    return;
  }
  const preview = await startPreviewServer();

  try {
    for (const route of PUBLIC_ROUTES) {
      const page = await browser.newPage();
      try {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
        await page.waitForSelector("h1", { timeout: 10000 }).catch(() => {});
        const html = await page.evaluate(() => "<!doctype html>\n" + document.documentElement.outerHTML);

        const outPath = outputPathFor(route);
        mkdirSync(dirname(outPath), { recursive: true });
        writeFileSync(outPath, html);
        console.log(`[prerender] ${route} -> ${outPath.replace(rootDir + "/", "")}`);
      } catch (err) {
        console.warn(`[prerender] échec sur ${route} : ${err.message} -- fichier laissé tel quel.`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    preview.kill();
  }
}

main().catch((err) => {
  console.error("[prerender]", err);
  process.exit(1);
});
