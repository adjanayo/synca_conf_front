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
- [x] Page d'accueil (`ProgrammePreview.tsx`) affiche un programme 100% statique — voir suite 15
- [ ] Génération du ticket (PDF+QR) — nom de l'événement en dur `"SYNCA CONF 2027"` dans `_render_ticket_pdf()` (`app/services/ticket_pdf.py`, **repo `synca_conf_back`**, hors périmètre de ce repo) au lieu de lire `EventSettings` (nom/année déjà en DB, déjà exposés via `GET /api/event-settings`) — à signaler/traiter côté back

## Partie 7 — Hackathon universitaire + Synca Community Certified

### Hackathon universitaire
- [x] Modèles back (`HackathonTeam`/`HackathonTeamMember`, repo `synca_conf_back`), CRUD admin (`hackathon.manage`, upload photo membre), `GET /api/hackathon-teams` public — voir suite 15
- [x] Admin dashboard (`AdminHackathonPage.tsx`, menu Référentiels) + page publique `/hackathon-universitaire` (`HackathonView.tsx`, équipes groupées par université) — voir suite 15
- Non fait : pas de lien dans le `Nav.tsx` principal (cohérent avec exposants/candidature-speaker, pages déjà atteignables sans y être dans le menu top) — à ajouter si l'utilisateur veut plus de visibilité.

### Synca Community Certified (rappel du gap déjà signalé)
- [x] Clé `CampaignWindow` dédiée ajoutée (`call_for_community_certified`, deadline 31 déc. 2026 en seed) — voir suite 15
- [ ] Reste ouvert : la FAQ (`answer` en base, table `faqs`) garde le texte de deadline en dur — rien ne consomme encore `call_for_community_certified` pour l'afficher dynamiquement. Éditable manuellement au dashboard FAQ existant en attendant.

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
