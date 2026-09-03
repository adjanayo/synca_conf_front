# SEO — à configurer manuellement

Généré en lisant l'état réel de la base (dev, `synca_conf_back`, 2026-09-03) et le code SEO livré (`DEVLOG.md` suite 16). Rien ici n'est du code à écrire — ce sont des données/comptes à renseigner, par toi, avant la mise en ligne. Coche au fur et à mesure.

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

Lues en direct sur la base de dev — à vérifier/corriger en production via le dashboard admin (`Réglages événement` et `Fenêtres de campagne`), pas du code :

- [ ] **Fenêtre `event`** (dates de la conférence, utilisées telles quelles dans le JSON-LD `Event` de la page d'accueil) : actuellement `18-20 août 2027`, mais **`is_active: false`** en base. Le site affiche ces dates partout (Nav, Hero, JSON-LD) qu'elle soit active ou non — si `false` est volontaire (dates pas encore confirmées publiquement), très bien ; sinon, penser à l'activer avant l'annonce officielle.
- [ ] **Fenêtre `ticketing`** : contient encore une plage de **test** (`2026-09-02 22:20` → `2026-09-02 22:25`, 5 minutes) au lieu des vraies dates d'ouverture/fermeture de la billetterie. À remplacer par les vraies dates avant d'activer les inscriptions — sinon la billetterie s'ouvrira/fermera sur ce créneau de test.
- [ ] **`EventSettings`** (nom/lieu/année) : `"Synca Conf"` / `"Dakar, Sénégal"` / `2027` — correct au moment de la rédaction, à revalider une dernière fois avant le lancement (repris tel quel dans les meta OG/Twitter et le JSON-LD).
- [ ] **Aucun `pass-type` actif en base** (`GET /api/pass-types` renvoie `[]`) — la page d'accueil affichera "les pass seront annoncés prochainement" tant que ce n'est pas rempli. Pas un blocage SEO en soi, mais impacte ce qu'un crawler/visiteur voit sur la page la plus indexée du site.
- [ ] **Aucun `day`/`session`/`speaker`/`partner`/`exhibitor` en base** — même remarque : les pages `/programme`, `/speakers`, `/partenaires`, `/exposants` afficheront leurs messages "pas encore disponible" tant que le contenu n'est pas saisi au dashboard.

## 6. Pré-rendu / SSG (S1.6 — décision produit, pas une simple config)

- [ ] Décider si on active un pré-rendu (vite-plugin-prerender ou équivalent) avant la mise en ligne. Sans ça, tout le travail SEO livré (title/meta par route, JSON-LD, OG) n'est visible **que** par les crawlers qui exécutent le JavaScript (Googlebot le fait ; beaucoup d'aperçus de partage sur réseaux sociaux ne le font pas) — impact direct sur les aperçus de lien partagés (WhatsApp, Slack, iMessage, Twitter/X) qui resteront sur le contenu générique de `index.html` sans pré-rendu.
- Impact build/déploiement à valider avec moi avant d'y toucher (pas un simple interrupteur).
