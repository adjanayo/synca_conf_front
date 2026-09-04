# SEO — à configurer manuellement

Généré en lisant l'état réel de la base (dev, `synca_conf_back`, 2026-09-03) et le code SEO livré (`DEVLOG.md` suite 16). Rien ici n'est du code à écrire — ce sont des données/comptes à renseigner, par toi, avant la mise en ligne. Coche au fur et à mesure.

## 0. Données événement actuellement en base (lues le 2026-09-03)

C'est exactement ce que le site utilise aujourd'hui pour les meta OG/Twitter et le JSON-LD `Event` de la page d'accueil (`GET /api/event-settings` + fenêtre de campagne `event` sur `GET /api/campaign-windows`) :

| Champ | Valeur en base | Source |
|---|---|---|
| Nom | `Synca Conf` | `EventSettings.name` |
| Année | `2027` | `EventSettings.year` |
| Lieu | `Dakar, Sénégal` | `EventSettings.venue` |
| Dates de l'événement | `18 août 2027` → `20 août 2027` | fenêtre de campagne `event` (`start_at`/`end_at`) |
| Fenêtre `event` active ? | **Non** (`is_active: false`) | idem |

Tout ça se modifie au dashboard admin (`Réglages événement` pour nom/lieu/année, `Fenêtres de campagne` pour les dates) — jamais dans le code. Le point à trancher : la fenêtre `event` est inactive alors que ses dates apparaissent déjà partout sur le site (Nav, Hero, JSON-LD) — si les dates du 18-20 août 2027 ne sont pas encore à annoncer publiquement, il faut le dire ; sinon, l'activer.

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

## 5. Données de la base à vérifier avant mise en ligne

Lues en direct sur la base de dev — à vérifier/corriger en production via le dashboard admin (`Réglages événement` et `Fenêtres de campagne`), pas du code. Nom/année/lieu/dates : voir section 0 ci-dessus.

- [ ] **Fenêtre `ticketing`** : contient encore une plage de **test** (`2026-09-02 22:20` → `2026-09-02 22:25`, 5 minutes) au lieu des vraies dates d'ouverture/fermeture de la billetterie. À remplacer par les vraies dates avant d'activer les inscriptions — sinon la billetterie s'ouvrira/fermera sur ce créneau de test.
- [ ] **Aucun `pass-type` actif en base** (`GET /api/pass-types` renvoie `[]`) — la page d'accueil affichera "les pass seront annoncés prochainement" tant que ce n'est pas rempli. Pas un blocage SEO en soi, mais impacte ce qu'un crawler/visiteur voit sur la page la plus indexée du site.
- [ ] **Aucun `day`/`session`/`speaker`/`partner`/`exhibitor` en base** — même remarque : les pages `/programme`, `/speakers`, `/partenaires`, `/exposants` afficheront leurs messages "pas encore disponible" tant que le contenu n'est pas saisi au dashboard.

## 6. Pré-rendu (S1.6 — fait, deux points à surveiller en production)

Implémenté (`scripts/prerender.mjs`, lancé automatiquement après `npm run build` via `postbuild`) : sert le build localement (`vite preview`, port fixe `4666`), visite chaque route publique statique avec Chromium headless (Puppeteer), et remplace `dist/<route>/index.html` par le HTML réellement rendu (title/meta/JSON-LD/contenu réel inclus). Un vrai visiteur charge ensuite le JS normalement par-dessus (pas de SSR, juste un instantané pour les crawlers/aperçus qui n'exécutent pas de JS).

- [ ] **CORS en production** : le backend doit autoriser l'origine `http://localhost:4666` (celle de `vite preview` pendant le build) dans `CORS_ORIGINS`, en plus du vrai domaine du site — sinon chaque page pré-rendue capture l'état "pas encore disponible" au lieu du vrai contenu (bloqué silencieusement par CORS, pas une erreur qui casse le build). Déjà fait en dev (`synca_conf_back/.env` et le défaut dans `app/core/config.py`) ; à reporter dans la config de l'environnement où tourne le build de prod.
- [ ] **Le backend doit être joignable et rempli de vraies données pendant `npm run build`** en production (déjà signalé en tête de ce fichier) — sinon les pages pré-rendues capturent les états "pas encore disponible" au lieu du vrai contenu, gelés jusqu'au prochain build.
- Coût : `puppeteer` (~300 Mo de Chromium téléchargé) en devDependency, et le build prend quelques secondes de plus (une page headless par route). Accepté par toi le 2026-09-04.
