# ROADMAP Frontend — SYNCA CONF 2027 (SEO + reprise du site public & participant)

> **Périmètre** : tout ce qui n'est **pas** l'admin (admin = `ROADMAP_ADMIN.md`). Ce chantier n'est **pas à exécuter** sans instruction explicite de l'utilisateur — seul l'admin est en cours. Basé sur `FRONTEND_INTEGRATION.md` et `USER_JOURNEYS.md`.

> Règles transverses identiques à l'admin : portillon `rtk npm run build` + `rtk npm run lint`, push auto sur `dev-boaz`, skills `error-handling`, `security-hardening`, `landing-page`, `project-docs`, `session-limit-guard`.

---

## Partie 1 — SEO du site public (aujourd'hui **quasi absent**)

État constaté : `index.html` = `lang="fr"` + viewport + `<title>` uniquement. Pas de description, d'OG, de favicon liée (des logos existent pourtant dans `public/parameter/`), de robots, de sitemap, de JSON-LD. SPA 100% client → rendu CSR servi par Vite.

### S1. Fondations techniques
- **`index.html` complet** : meta description, Open Graph (`og:title/description/type/image/url`), Twitter cards, `canonical`, `favicon` + `apple-touch-icon` (SVG `public/parameter/`), `theme-color`.
- **Titre/meta par route** : hook `usePageMeta` (ou lib dédiée type react-helmet-async) — chaque route publique (`/`, `/programme`, `/speakers`, `/partenaires`, `/faq`, `/contact`, `/inscription`, `/candidature-speaker`) reçoit un `<title>` + `meta description` uniques en français, à jour de l'état réel (skill `seo`).
- **`public/robots.txt`** : autoriser le public. La base admin randomisée (cf. `ROADMAP_ADMIN.md` A3) n'apparaît **pas** dans `robots.txt` — la mentionner divulguerait le chemin secrètement ; la discrétion repose sur le token random + `<meta name="robots" content="noindex">` dans le layout admin + l'auth (401 sur les pages admin).
- **`public/sitemap.xml`** : lister les routes publiques réelles, aligné sur `AppRoutes.tsx`, maintenu à chaque ajout/renommage de route.
- **JSON-LD `Event` sur l'index** (nom, dates, lieu, image, admission) — synchronisé avec les vraies dates de la conférence, jamais incohérent (skill `seo` : du JSON-LD faux = spam).
- **Pré-rendu (recommandé pour un référencement rapide)** : livrer du HTML par route au build (ex. `vite-plugin-prerender` / SSG) au lieu du `#root` vide — c'est LE levier qui rend l'indexation fiable et rapide pour un site événement. À valider avec l'utilisateur avant (impact build/mise en ligne).

### S2. SEO au fil de l'eau
- Mettre à jour title/description/OG à chaque nouvelle section publique réelle (skills `landing-page` + `seo`) — une description périmée se corrige comme une dépendance périmée.
- Ne rien ajouter de générateur de trafic (analytics, tracking) sans accord explicite.

---

## Partie 2 — Reprise des données réelles (pages publiques)

Aujourd'hui les pages consomment des données **codées en dur dans `src/data/`**. Il reste à brancher les vrais endpoints publics (§4 de `FRONTEND_INTEGRATION`).

- **P1. Lectures** : `GET /api/days`, `/sessions` (filtres `day`, `category`), `/pass-types`, `/speakers` (`theme`, `format`), `/partners` (`level`), `/exhibitors`, `/faqs` (`category`), `/campaign-windows` → TanStack Query + types/zod + états loading/erreur/empty (skill `error-handling`).
- **P2. Pagination** : `limit`/`offset` (max 200) — « fin de liste » si < `limit` éléments (§9), pas de champ `total`.
- **P3. Fenêtres de campagne** : activer/griser les CTA (inscription, candidatures) selon `is_active`/dates (`/campaign-windows`, §4.9). Un formulaire ouvert côté UI mais fenêtre fermée renvoie `403` → message métier.

## Partie 3 — Formulaires publics (§5)

| Endpoint | Particularités (à respecter strictement) |
|---|---|
| `POST /api/waitlist` | toujours ouvert ; `409` « déjà inscrit » |
| `POST /api/newsletter` | toujours ouvert ; `409` |
| `POST /api/contact` | token reCAPTCHA v3 dans le body |
| `POST /api/register` | fenêtre `ticketing` ; **rend l'`access_token` une seule fois** → à afficher + stocker de façon sûre (skill `security-hardening`) |
| `POST /api/speakers/apply` | `multipart/form-data`, photo obligatoire (≤5 Mo), `gdpr_consent=true` |
| `POST /api/ambassadors/apply` | JSON ; âge ≥ 16 ; `preferred_channels` min 1 |
| `POST /api/partners/apply` | `multipart/form-data`, logo optionnel ; `objectives` = **JSON string** dans le multipart |
| `POST /api/exhibitors/apply` | JSON ; `rules_accepted=true` |

Chaque formulaire : validation zod côté UI + gestion des deux formes d'erreur (`detail` string / tableau 422) + `401` vs `403` différenciés + état « Envoi… » désactivé (skill `error-handling`).

## Partie 4 — Espace participant (§6, `USER_JOURNEYS` §3)

- Stockage du token one-time (mémoire/`sessionStorage`, jamais localStorage/URL/logs) ; envoi en `Authorization: Bearer` centralisé.
- `GET /api/user/me`, `GET /api/user/me/tickets` (bouton télécharger `pdf_url` — **jamais** construire l'URL à la main, `GET /api/tickets/:id` n'existe pas), `DELETE /api/user/me` (RGPD, irréversible, à usage unique → `401` ensuite).

## Partie 5 — Paiement / billetterie (§10)

`POST /api/payments` et `/api/promo/validate` existent mais **ne doivent pas être consommés** avant que le backend soit testé en conditions réelles. Workflow : inscription → paiement → webhook → ticket PDF+QR (= `USER_JOURNEYS` §3.2).

## Partie 6 — Divers du guide (§11-§12)

- Faire remonter les shape manquants / statuts inattendus / messages peu clairs (FRONTEND_INTEGRATION §12) — le guide et l'API sont amenés à changer.
- Réencoder la gestion du **refresh token** quand le backend l'expose (pour l'instant seul le login émet une paire access+refresh).
- Portillon build+lint et push sur `dev-boaz` à chaque unité.