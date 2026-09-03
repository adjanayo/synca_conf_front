# TODO — synca_conf_front

Travail restant, hors périmètre admin (`ROADMAP_ADMIN.md`, déjà terminé — voir tableau de statut dans `DEVLOG.md`). Rien ici ne s'exécute sans instruction explicite de l'utilisateur (voir skill `devlog` pour la procédure de suivi : cocher ici, détailler dans `DEVLOG.md`).

## Partie 1 — SEO du site public
- [ ] S1.1. `index.html` complet (meta description, Open Graph, Twitter cards, canonical, favicon/apple-touch-icon, theme-color)
- [ ] S1.2. Titre/meta par route (`usePageMeta` ou react-helmet-async), une par route publique
- [ ] S1.3. `public/robots.txt` (public autorisé, admin jamais mentionné — discrétion via token random + noindex + auth)
- [ ] S1.4. `public/sitemap.xml` (routes publiques réelles, maintenu à jour)
- [ ] S1.5. JSON-LD `Event` sur l'index (nom, dates, lieu, image, admission), synchronisé avec les vraies dates
- [ ] S1.6. Pré-rendu (vite-plugin-prerender / SSG) — à valider avec l'utilisateur avant (impact build/mise en ligne)
- [ ] S2. SEO au fil de l'eau (title/description/OG à jour à chaque nouvelle section) — pas de tracking/analytics sans accord explicite

## Partie 5 — Paiement / billetterie
- [ ] `POST /api/payments` + `/api/promo/validate` — **ne pas consommer avant que le backend soit testé en conditions réelles**
- [ ] Workflow inscription → paiement → webhook → ticket PDF+QR

## Partie 6 — Divers
- [ ] Faire remonter les shapes manquants/statuts inattendus au backend au fil de l'eau — continu, 1er passage fait (`DEVLOG.md` suite 14)
- [ ] Gestion du refresh token quand le backend l'exposera — bloqué, `POST /api/admin/login` émet déjà `refresh_token` mais aucun endpoint `/refresh` n'existe côté back pour le consommer
- [ ] Page d'accueil (`ProgrammePreview.tsx`) affiche un programme 100% statique (`data/programme.ts::DAYS`), jamais branché sur `GET /api/days`+`/sessions` — contrairement à `/programme` (`ProgrammeView.tsx`, déjà branché depuis suite 11)
- [ ] Génération du ticket (PDF+QR) — nom de l'événement en dur `"SYNCA CONF 2027"` dans `_render_ticket_pdf()` (`app/services/ticket_pdf.py`, **repo `synca_conf_back`**, hors périmètre de ce repo) au lieu de lire `EventSettings` (nom/année déjà en DB, déjà exposés via `GET /api/event-settings`) — à signaler/traiter côté back

## Partie 7 — Hackathon universitaire + Synca Community Certified
Demande utilisateur — nouveau chantier prévu **après** les parties 1 à 6 (pas encore implémenté, planifié comme référence). Deux volets liés :

### Hackathon universitaire
- S'appuie sur le modèle "Synca Community Certified" + un hackathon étudiant.
- **Formation des équipes** : chaque université propose 1 à 2 équipes, choisies parmi 3 à 4 personnes max par équipe.
- **Finale** : se joue entre 10 et 15 équipes, selon le nombre d'universités participantes.
- **Contenu géré par les administrateurs** : ils mettent en ligne la liste des équipes par université, ainsi que les informations de dates du hackathon.
- **Membre d'équipe** (par personne) : photo, nom complet, niveau d'étude, spécialité.
- **Équipe** : un nom, un nom de projet, une description du projet.
- Tout configurable au dashboard admin et affichable sur le site public.

### Synca Community Certified (rappel du gap déjà signalé)
- La deadline de candidature (31 décembre 2026 / mi-janvier 2027) et le programme lui-même restent **en dur dans la FAQ** (`data/faq.ts`) — **aucun champ DB correspondant** (gap déjà signalé en suite 9). Ce chantier devra soit ajouter une clé `CampaignWindow` dédiée (ex. `call_for_community_certified`, comme les autres fenêtres), soit créer un modèle dédié pour piloter deadline/annonce au dashboard.

## Partie 8 — Contenu des pass pilotable + offres partenaires au dashboard
Demande utilisateur — planifié, **pas de code pour le moment** :

### Contenu des pass pilotable au dashboard
- **CRUD sur les pass** (créer/lire/modifier/supprimer).
- **CRUD sur les contenus de pass** (les bénéfices/inclusions) — à la **création d'un pass**, on fait uniquement le check des contenus de ces pass (sélection des bénéfices/inclusions).
- Le **site web** ne lit que ces contenus (checkés) pour **afficher sur la page d'accueil**.
- Sur le **formulaire d'inscription**, **seul le nom des pass** est affiché (pas le détail des contenus).

### Offres partenaires pilotables au dashboard
- **CRUD sur les offres souhaitées** (les paliers/offres de partenariat) depuis le dashboard.
- Les candidats font **leur choix parmi ces offres lors du remplissage du formulaire** de partenaires.
