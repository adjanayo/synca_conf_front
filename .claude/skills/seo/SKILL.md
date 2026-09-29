---
name: seo
description: Use quand on construit ou relit tout ce qui affecte la façon dont ce site est découvert par les moteurs de recherche ou partagé sur les réseaux — titre/meta par page, robots, sitemap, Open Graph, données structurées JSON-LD. Trigger sur "SEO", "metadata", "sitemap", "robots.txt", "Open Graph", "données structurées", ou toute page publique (index, programme, speakers, partenaires, FAQ, contact) même si l'utilisateur ne dit pas "SEO" explicitement.
---

# SEO (synca_conf_front)

SPA React 19 + Vite + react-router (voir `AppRoutes.tsx`) — le SEO de ce projet est celui d'un **site vitrine multi-pages public, 100 % statique**. Ce skill est une combinaison de mécaniques et d'état entretenu : toutes les pages doivent être découvrables et à jour.

## Mécanique : comment c'est fait techniquement

- **SPA + Vite + pré-rendu** : `useBrandedPageMeta` (`src/hooks/usePageMeta.ts`) met à jour `<title>`/meta/OG par route ; `scripts/prerender.mjs` (après `npm run build`, dans Docker) fige le HTML de chaque route de `scripts/public-routes.mjs` ; `scripts/generate-seo-files.mjs` génère `robots.txt` et `sitemap.xml`.
- **Par page publique** (`/`, `/programme`, `/speakers`, `/speakers/:id`, `/partenaires`, `/exposants`, `/hackathon-universitaire`, `/faq`, `/contact` — liste de référence : `scripts/public-routes.mjs`) : un `<title>` unique et une `meta description` propre, en français. Pas de titre générique "Accueil" partagé partout.
- **Open Graph** (titre, description, image) sur les pages clés (index surtout) pour des partages réseau corrects — prévoir une `og:image` dans `public/`.
- **Canonical** si les routes ont des variantes de trailing slash/query.

## Données structurées (si pertinent)

La page index d'un événement est un bon candidat pour un bloc JSON-LD `Event` (nom, dates, lieu, admission) en `<script type="application/ld+json">` — c'est ce qui permet à Google d'afficher un rich result. Garder le JSON-LD **synchronisé avec ce qui est réellement rendu** sur la page ; des données structurées incohérentes (ex. annoncer une date qui n'apparaît pas) sont traitées comme du spam, pas comme une imprécision.

## robots.txt et sitemap

- `public/robots.txt` : tout le site est public (`Allow: /`), généré au build.
- `public/sitemap.xml` : énumérer les pages publiques réelles, **par rapport aux routes qui existent dans `AppRoutes.tsx`** (source : `scripts/public-routes.mjs`, à tenir synchronisé), et tenir à jour quand une route est ajoutée/renommée/retirée. Un sitemap qui référence une route supprimée est pire que pas de sitemap.

## Le SEO est un état entretenu, pas un livrable ponctuel

- Chaque fois qu'une nouvelle page/répartition de contenu arrive, re-vérifier que les masses `<title>`/description issus du SEO couvrent l'état courant.
- Traiter une description devenue périmée de la même façon que `current-versions-only` traite une version de dépendance périmée — la corriger quand on la trouve, pas juste la noter pour plus tard.