// Pré-rendu post-build (ROADMAP_PUBLIC_SEO.md S1.6, "postbuild" dans
// package.json) : SPA pur (aucun SSR), donc un crawler qui n'exécute pas le
// JS ne voit que le HTML générique d'index.html -- ce script sert le build
// localement, visite chaque route publique statique avec un Chromium headless
// (Puppeteer, attend que TanStack Query ait fini ses requêtes), et écrase
// dist/<route>/index.html par le HTML réellement rendu. Le bundle JS reste
// chargé normalement ensuite pour un vrai visiteur (hydratation React
// classique, pas de SSR) -- ce n'est qu'un instantané pour les crawlers/
// aperçus de partage qui n'exécutent pas de JS.
//
// Le backend (VITE_API_URL) doit être joignable pendant `npm run build` :
// sans données réelles en base, ce script capture des pages "pas encore
// disponible" au lieu du vrai contenu.
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

function outputPathFor(route) {
  if (route === "/") return join(rootDir, "dist", "index.html");
  return join(rootDir, "dist", route.replace(/^\//, ""), "index.html");
}

async function main() {
  if (!existsSync(join(rootDir, "dist", "index.html"))) {
    console.warn("[prerender] dist/index.html introuvable -- build manquant, rien à pré-rendre.");
    return;
  }

  const preview = await startPreviewServer();
  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const route of PUBLIC_ROUTES) {
      const page = await browser.newPage();
      try {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
        // `networkidle0` only means requests finished, not that React has
        // committed the resulting render -- every page here shows the same
        // "Chargement…" text while its query is pending, so wait for that to
        // clear rather than racing the next paint. Best-effort: falls back
        // to whatever's on screen if a page is still empty after 10s.
        await page
          .waitForFunction(() => !document.body.innerText.includes("Chargement"), {
            timeout: 10000,
          })
          .catch(() => {});
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
