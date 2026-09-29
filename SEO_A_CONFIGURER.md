# SEO — à configurer manuellement

Rien ici n'est du code à écrire — ce sont des données/comptes à renseigner avant la mise en ligne. Coche au fur et à mesure.

## 0. Données événement

Site 100 % statique depuis le 2026-09-29 : nom, dates, lieu utilisés par les meta, le JSON-LD `Event` et les pages vivent dans `brief-and-style-guide-main/src/data/parameter.ts` (`PARAMETER`) — *Synca Conf & ACYBIA Forum*, 15–17 mars 2027, Noom Hôtel Sea Plaza, Dakar. `index.html` porte aussi ces valeurs en dur (title/description/OG) : les garder synchronisés.

## 1. Domaine de production (bloquant)

- [ ] Renseigner `VITE_SITE_URL` dans le `.env` de production (ex. `VITE_SITE_URL=https://syncaconf.com`, sans slash final).
- Tant que ce n'est pas fait, `canonical`, `og:url`, `og:image`, `twitter:image`, `public/robots.txt` (ligne `Sitemap:`) et `public/sitemap.xml` (toutes les `<loc>`) pointent vers le placeholder `https://TODO-DOMAINE-PRODUCTION-A-DEFINIR.example` — cassé pour de vrai en prod.
- `public/robots.txt`/`public/sitemap.xml` sont régénérés automatiquement à chaque `npm run build` (script `generate-seo-files.mjs`) — il suffit que la variable soit correcte dans l'environnement où tourne le build de prod, rien d'autre à faire à la main sur ces deux fichiers.

## 2. Image Open Graph (partage réseaux sociaux)

- [ ] Fournir un visuel dédié **1200×630px, PNG ou JPG** (le SVG actuel — logo — n'est pas rendu par la plupart des plateformes en aperçu de partage : Facebook, LinkedIn, WhatsApp, Slack ignorent généralement les `og:image` en SVG).
- Une fois le fichier prêt : le déposer dans `brief-and-style-guide-main/public/` (ex. `og-image.png`) et me dire de le brancher dans `index.html` (`og:image`/`twitter:image`) — c'est une modif de code, pas manuelle, mais il me faut le fichier d'abord.

## 3. Icônes (favicon / apple-touch-icon)

- [ ] Fournir un PNG carré **180×180px** pour `apple-touch-icon` (iOS ne supporte pas le SVG utilisé actuellement en favicon — les autres navigateurs l'affichent correctement, seul iOS manque).
- Optionnel mais recommandé : un vrai `favicon.ico` (16×16/32×32) pour la cohérence multi-navigateur/multi-OS la plus large.
- Comme pour l'image OG : dépose les fichiers, je branche les balises ensuite.

## 4. Google Search Console / Bing Webmaster Tools

- [ ] Créer (ou retrouver) la propriété du site sur [Google Search Console](https://search.google.com/search-console) une fois le domaine réel connu.
- [ ] Récupérer le code de vérification (balise `<meta name="google-site-verification" content="...">` ou fichier HTML à uploader) et me le transmettre pour l'ajouter à `index.html`.
- [ ] Soumettre `https://<ton-domaine>/sitemap.xml` dans Search Console une fois le site en ligne.
- [ ] Idem côté [Bing Webmaster Tools](https://www.bing.com/webmasters) si souhaité (optionnel).

## 5. Pré-rendu (fait)

Implémenté (`scripts/prerender.mjs`, lancé automatiquement après `npm run build` via `postbuild`) : sert le build localement (`vite preview`, port fixe `4666`), visite chaque route publique statique avec Chromium headless (Puppeteer), et remplace `dist/<route>/index.html` par le HTML réellement rendu (title/meta/JSON-LD/contenu réel inclus). Un vrai visiteur charge ensuite le JS normalement par-dessus (pas de SSR, juste un instantané pour les crawlers/aperçus qui n'exécutent pas de JS).

- Contenu statique : aucun backend requis pendant le build. Nouvelle page publique ou nouveau speaker → l'ajouter dans `scripts/public-routes.mjs`.
- Coût : `puppeteer` (~300 Mo de Chromium téléchargé) en devDependency, et le build prend quelques secondes de plus (une page headless par route). Accepté par toi le 2026-09-04.
