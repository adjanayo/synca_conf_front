# ROADMAP Frontend — SYNCA CONF 2027 (Partie ADMIN uniquement)

> **Périmètre strict** : on construit **uniquement le backoffice admin** (parcours 10-13 de `USER_JOURNEYS.md`). Les agents ne doivent PAS toucher au site public, à l'espace participant ni aux paiements, sauf instruction explicite de l'utilisateur.

## Règles transverses (toujours applicables)

- **Portillon qualité** : aucune étape n'est terminée sans `rtk npm run build` + `rtk npm run lint` (skill `quality-engineer`). Push automatique sur `dev-boaz` après chaque unité cohérente (skill `git-push-workflow`).
- **API** : référence `FRONTEND_INTEGRATION.md` — erreurs `{"detail": "..."}`, `422` = tableau Pydantic, rate limits (admin 30/min, login 5/min), token `access_token` Bearer (15 min), `refresh_token` **non exposé** pour l'instant → sur `401` on déconnecte.
- **Sécurité** : skill `security-hardening` — token admin en mémoire (jamais localStorage/URL/logs), `403` vs `401` traités différemment, jamais de secret en dur, pas de PII en log.
- **SEO + discrétion du path admin** : le chemin du backoffice est **randomisé**, défini une seule fois côté build via variable d'env (cf. A3) — le **vrai** chemin ne doit pas traîner dans le code ni être devinable. Ne pas mettre de meta OG sur les pages admin ; le layout admin porte `<meta name="robots" content="noindex">` (on **ne met pas** le chemin secret dans `robots.txt` — ça le divulguerait publiquement).
- **Composants** : réutiliser `src/components/ui/` (shadcn : sidebar, table, dialog, tabs, form, sonner, pagination…). Backend CORS dev autorise `http://localhost:5173`.
- ⚠️ **Endpoints admin à confirmer** : `FRONTEND_INTEGRATION.md` documente le **public** ; les routes admin (`/api/admin/*`) ne sont pas détaillées (sauf login et PATCH roles/speakers/ambassadors). **Avant chaque étape C/D/E**, vérifier l'exact shape via Swagger (`make swagger`, backend `synca_conf_back`) et le reporter dans le suivi — ne jamais inventer un payload (skill `error-handling`).

---

## Phase A — Fondations (auth + routage + refonte du layout)

### A1. Client API central
- `src/lib/api/` : base URL via `import.meta.env.VITE_API_URL` (défaut `http://127.0.0.1:8010`), wrapper `fetch` avec timeout, injection du header `Authorization` (intercepteur TanStack Query).
- Parseur d'erreur partagé (`extractErrorMessage`) : `detail` string OU tableau 422 → message lisible (skill `error-handling`, §8).
- Types TS + schémas zod des entités admin (User/Role, Speaker, Ambassador, Partner, Exhibitor, CampaignWindow, ContactMessage).

### A2. Auth admin
- `POST /api/admin/login` → `{access_token, refresh_token}`. Token en mémoire (context/Zustand), pas de `localStorage`.
- Persistance : garder la session via `sessionStorage` uniquement si l'utilisateur demande une session prolongée (discutable avec utilisateur) — défaut : mémoire.
- Intercepteur `401` global → logout + redirection `/admin/login` ; gestion des erreurs de login (compte verrouillé après 5 échecs → message dédié).

### A3. Routage & layout admin — chemin randomisé, non devinable

- **Le chemin du backoffice n'est pas `/admin` en dur.** Il est porté par `import.meta.env.VITE_ADMIN_PATH` (ex. token aléatoire type `ct-8f3ka2z9`, choisi/roté par l'ops au déploiement). **Une seule occurrence** du token vit dans le code (le point de montage des routes), jamais répétée dans les composants, les liens, les logs ou les docs commitées.
- **Construction** : `base = "/" + VITE_ADMIN_PATH` ; routes `base/login` et `base/*` avec `<RequireAuth>` (une route admin connectée renvoie vers le dashboard). Si `VITE_ADMIN_PATH` est absent au build, les routes admin **ne sont pas montées** → `404` (pas de surface à scanner). Valeur dev commode possible (`.env.development`) mais jamais par défaut dans un build de prod.
- **Limite honnête et assumée (à noter pour l'utilisateur)** : dans une SPA 100% client, le token **existe forcément dans le bundle JS** pour router dedans. La randomisation + `noindex` + auth + RBAC = un contrôle de **défense en profondeur** (durcissement), **pas** une garantie d'invisibilité — la vraie sécurité d'accès reste l'auth/RBAC du backend. On le documente, on ne le vend pas comme une porte blindée.
- **Layout dédié** : sidebar (composants `ui/sidebar`), header, zone contenu — **séparé du layout public** (pas de Nav/Footer public dans l'admin).

### A4. Gating RBAC dans l'UI
- Lire rôle + permissions (réponse login et/ou `GET /api/admin/me` si dispo — à confirmer).
- Masquer les entrées de menu sans permission ; sur action refusée (`403`) → message métier différent du `401`.

---

## Phase B — Dashboard (superadmin/admin, permission `payments.view`)

### B1. Dashboard
- KPI : inscriptions, paiements, candidatures en attente (speakers/ambassadors/partners/exhibitors), messages non lus.
- Endpoint stats admin à **confirmer via Swagger** (ex. `GET /api/admin/stats`).
- Carte de charge : nombre total, en attente de revue par entité.

### B2. Listes récentes
- Dernières inscriptions + derniers paiements (mini-tableaux, lien vers détail).

---

## Phase C — Modération & approbations (cœur du métier)

Pour chaque entité : **liste filtrable + détail + action approuver/rejeter + transitions d'état**, avec son skill sécurité (PII visibles → pas de log, pas d'export complet côté client).

### C1. Speakers (`speakers.approve`)
- Liste `GET /api/admin/speakers` (filtres : statut, thème, format — shape à confirmer), statut badge `pending/accepted/rejected`.
- Détail : toutes les infos candidature (photo, bio, motivation, `video_consent`, `gdpr_consent`, contact).
- Action : `PATCH /api/admin/speakers/{id}` → `accepted` (passe `is_public=true`) / `rejected` — cf. `USER_JOURNEYS` §4.

### C2. Ambassadeurs (`ambassadors.approve`)
- Idem speakers : liste + détail (âge, reach, canaux, motivation).
- Action : `PATCH /api/admin/ambassadors/{id}` → `accepted` (le backend génère le **code promo** `AMB-<NOM>-<hex4>` à afficher au success) / `rejected` — cf. §5.

### C3. Partenaires (`partners.manage`)
- Workflow à 4 états : `pending → contacted → negotiating → confirmed/rejected` (§6).
- Liste + détail (organisation, contact, niveau, logo, budget) + actions de transition d'état.
- `confirmed` = `is_public=true` (apparaît sur le site public).

### C4. Exposants (`exhibitors.manage`)
- Même workflow multi-états que partenaires (§7).
- Détail : stand, équipements, activités, paiement.

---

## Phase D — Opérations (contenu & gestion)

### D1. Fenêtres de campagne (`campaign_windows.manage`)
- Tableau `GET /api/campaign-windows` (public, §4.9) + écran de gestion (start/end/`is_active`).
- Endpoint d'écriture admin à confirmer (PATCH/POST sur `/api/admin/campaign-windows`).
- Impact métier : une fenêtre fermée → le formulaire public renvoie `403` (message à prévoir dans l'UI admin pour décision).
- ⚠️ **Correction (2026-09-02)** : la clé `event` (dates de l'événement) est stockée dans `campaign_windows` comme les autres, mais son écran de gestion **ne vit pas ici** — voir I2 (page « Réglages événement », carte dédiée séparée). `AdminCampaignWindowsPage` filtre cette clé et n'affiche que les vraies fenêtres de campagne (speaker/ticketing/partner/ambassador/exhibitor).

### D2. Messages contact (`contacts.view`)
- Liste des messages `GET /api/admin/contacts` (home/lecture), détail, marquer lu/non-lu.
- Shape à confirmer (modèle §5.7 `is_read`).

### D3. Gestion des rôles (`roles.manage`)
- Matrice 4 rôles × 8 permissions (`USER_JOURNEYS` §Matrice) : `PATCH /api/admin/roles/{role_id}` (déjà documenté).
- UI : onglet par rôle, checkboxes pour accorder/retirer les permissions.
- Attention : permissions configurables par superadmin — le rôle logout/re-login doit refléter les changements.

---

## Phase E — Export, audit & durcissement

### E1. Exports CSV (`export.data`)
- Boutons d'export registrations + payments → endpoint admin CSV à confirmer (download blob, `pdf_url`/fichier en `visuals_url` **jamais** inclus).
- Chargement/feedback pendant le download.

### E2. Audit logs
- Écran « tentatives de connexion » (`USER_JOURNEYS` §10.7) : liste, pagination, filtres. Endpoint à confirmer.

### E3. Durcissement session
- `401` → déconnexion propre + `sessionStorage` nettoyé ; `429` (rate limit) → message + backoff ; verrouillage compte affiché.
- Vérifier qu'aucun appel admin ne fuit vers les routes publiques ni ne divulgue de PII en console.

---

## Phase F — Qualité & passation

- F1. `npm run build` + lint zéro erreur sur tout le backoffice.
- F2. Tests (vitest si ajouté) : parseur d'erreur, auth guard, transitions d'état.
- F3. `docs/` à jour (skill `project-docs`), note de passation si session longue (skill `session-limit-guard`).
- F4. Checklist manuelle : login → dashboard → chaque section C/D/E avec un seed backend (`make create-admin`, `make login`).

---

## Phase G — Fixes UI rapides (CSS uniquement)
- G1. Formulaire de connexion (espace participant) collé au menu — espacement top.
- G2. Menu espace participant trop collé au contenu — espacement.
- G3. Dashboard admin trop étroit — élargir le container.

## Phase H — Dashboard admin : menu Candidatures
- H1. Regrouper les 4 liens Speakers/Ambassadeurs/Exposants/Partenaires du header `AdminDashboardPage.tsx` en un dropdown "Candidatures" (`ui/dropdown-menu`).

## Phase L — Liste des pays (front uniquement) — FAIT
- L1. `<select>` déjà branché sur `COUNTRIES` (`inscription.tsx`, `candidature-speaker.tsx`) — liste passée de 24 pays curatés à liste ISO complète (~195 pays + "Autre"). `ambassadeur.tsx`/`partenaires.tsx` utilisent un champ combiné "Pays & Ville" en texte libre, non touché ici (hors scope, ces formulaires sont des stubs — voir Phase M).

## Phase I — Référentiels admin (backend + front)
- I1. CRUD admin `PassType` (aucun endpoint admin existant, seulement lecture publique + seed manuel).
- I2. Réglages événement : nom + lieu éditables (`AdminEventSettingsPage`) + carte séparée « Dates de l'événement » (même page, cadre distinct) qui édite `campaign_windows` clé `event` — pas dans D1/Fenêtres de campagne (cf. correction D1, 2026-09-02).
- I3. CRUD admin programme (`Session`/`Day` — modèles existants, aucune route/écran admin).

## Phase K — Dashboard : actions directes
- K1. Création directe speaker/ambassadeur/exposant/partenaire depuis le dashboard.
- K2. Actions sur les listes existantes (au-delà d'approuver/rejeter, si besoin).
- K3. Pagination sur inscrits et waiting list.

## Phase J — Waiting list + notifications (backend + front, le plus gros) — FAIT
- J1. Endpoint admin liste waitlist — FAIT (déjà présent avant cette phase : `GET /api/admin/waitlist`, `app/api/admin_waitlist.py`, permission `waitlist.view`).
- J2. Logique : fenêtre billetterie fermée/pas encore ouverte → proposer waiting list — FAIT. `inscription.tsx` affiche un formulaire d'inscription waitlist (`joinWaitlist`, `POST /api/waitlist`) dans les deux états : fermée (après la fin) et pas encore ouverte (sous le countdown `DateGate`).
- J3. Notification email automatique à l'ouverture d'une fenêtre — FAIT, scope réduit : déclenché sur l'action admin qui bascule la fenêtre `ticketing` en ouverte (transition détectée dans `PATCH /api/admin/campaign-windows/{key}`), pas sur un cron (aucun scheduler en place côté back). Envoie à toute entrée `Waitlist` non notifiée, marque `notified=True`. Un changement d'heure système atteignant `start_at` sans action admin ne déclenche rien — accepté comme limite connue.
- J4. Vue waiting list sur le dashboard — FAIT (déjà présent avant cette phase : `AdminWaitlistPage`, route `waitlist`, filtres notifié/inscrit, pagination).

Ordre retenu : G → H → L → I → K → J.

## Phase M — Formulaires de candidature non branchés (découvert en L, à traiter après J) — FAIT
- M1. `candidature-speaker.tsx`, `ambassadeur.tsx` (AmbassadeurForm), `partenaires.tsx` (PartnerForm) — FAIT. Les 3 formulaires appellent désormais les endpoints publics (`POST /api/speakers/apply`, `/api/ambassadors/apply`, `/api/partners/apply`) au lieu d'un simple `toast.success`. Découvertes en cours de câblage, corrigées dans la foulée (hors scope initial mais nécessaires pour que l'appel API réussisse) :
  - Champs "Nom & prénom" combinés → séparés en Prénom/Nom sur speaker et ambassadeur (le backend attend `first_name`/`last_name` distincts). Partenaire garde `contact_name` unique (le modèle `Partner` n'a pas de split).
  - Champ "Pays & Ville" combiné → séparé en deux champs (select pays + ville texte) sur ambassadeur et partenaire (cf. correction L1, `country`/`city` distincts côté backend).
  - `SPEAKER_DISPO`/`SPEAKER_DIFFUSION`/`PARTNER_BUDGET` (`lib/forms/constants.ts`) avaient un texte légèrement différent des enums backend (virgule, tiret) — alignés pour que la valeur envoyée passe la validation Pydantic.
  - `PARTNER_TIERS` (liste de noms statiques) remplacé par un vrai select alimenté par un nouvel endpoint public `GET /api/partner-levels` (n'existait pas — le formulaire avait besoin d'un `level_id` réel en FK, pas d'un nom de palier en dur).
  - `speakers/apply` et `partners/apply` sont multipart côté backend (upload photo/logo) — ajout de `apiFetchForm` (`lib/api/client.ts`, `FormData`, pas de header `Content-Type` explicite) à côté de l'`apiFetch` JSON existant. `ambassadors/apply` reste JSON classique.
- M2. Photo speaker — FAIT. Le champ upload existait déjà dans `candidature-speaker.tsx` (jamais branché) et le backend gérait déjà l'upload (`upload_file`/`MAX_PHOTO_BYTES`) — seul le branchement manquait. Affichage : `SpeakersView` interrogeait des données statiques (`data/speaker.ts`) ; branché sur `GET /api/speakers` (retourne `photo_url`), avec repli sur les données statiques tant qu'aucun speaker n'est public (`is_public=True`, jamais vrai avant la première approbation admin).

## Phase N — Codes promo : CRUD admin + usage inscription — FAIT
- N1. FAIT. `PromoCode` déjà existant côté modèle + `POST /api/promo/validate` déjà fonctionnel + génération auto ambassadeur déjà en place, mais aucun CRUD admin. Ajouté `GET/POST/PATCH /api/admin/promo-codes` (`app/api/admin_promo_codes.py`, pas de DELETE dur — `is_active` seul). Nouvelle permission `promo_codes.manage` (migration `c2d3e4f5a6b7`, seedée sur `superadmin`). Schémas `PromoCodeCreate`/`PromoCodeUpdate` ajoutés (`app/schemas/payments.py`).
- N2. FAIT. `AdminPromoCodesPage.tsx` (liste + création + édition inline, même patron que `AdminPassTypesPage`), route `promo-codes` sous `AdminRequireAuth permission="promo_codes.manage"`, lien ajouté au dropdown "Référentiels" du dashboard.
- N3. FAIT. `inscription.tsx` : champ "Code promo" était décoratif (transmis à `/api/register`, jamais validé côté UI). Ajouté bouton "Vérifier" appelant `POST /api/promo/validate` (`validatePromoCode`, `lib/api/registration.ts`) — affiche la remise (% ou montant fixe) si valide, message d'erreur sinon ; état réinitialisé à chaque frappe. Flow paiement (`/api/payments`) non touché, comme prévu.

## Hors périmètre (ne pas faire sans instruction)

- Site public (index, programme, speakers, partenaires, FAQ, contact) — déjà en place, ne pas modifier (skill `change-control`).
- Espace participant (`POST /api/register`, `/api/user/*`) — `USER_JOURNEYS` §3.
- Paiement/billetterie (`POST /api/payments`, `promo/validate`) — non consommables en prod (§10 du guide).
- Le backoffice SQLAdmin du backend (`/admin`) n'est pas à reproduire côté frontend.