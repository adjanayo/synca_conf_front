# TODO — synca_conf_front

Travail restant, hors périmètre admin (`ROADMAP_ADMIN.md`, déjà terminé — voir tableau de statut dans `DEVLOG.md`). Rien ici ne s'exécute sans instruction explicite de l'utilisateur (voir skill `devlog` pour la procédure de suivi : cocher ici, détailler dans `DEVLOG.md`).

## Partie 1 — SEO du site public
- [ ] S1.6. Pré-rendu (vite-plugin-prerender / SSG) — à valider avec l'utilisateur avant (impact build/mise en ligne) ; sans ça, tout ce qui a été fait en S1.1-S1.5 (title/meta/JSON-LD) reste invisible aux crawlers qui n'exécutent pas le JS
- [ ] S2. SEO au fil de l'eau (title/description/OG à jour à chaque nouvelle section) — pas de tracking/analytics sans accord explicite
- Voir `SEO_A_CONFIGURER.md` (racine du repo) pour tout ce que l'utilisateur doit renseigner à la main (domaine, image OG, favicons, Search Console, données DB à vérifier avant mise en ligne) — pas du code, pas dans ce TODO.

## Partie 5 — Paiement / billetterie
- [ ] `POST /api/payments` + `/api/promo/validate` — **ne pas consommer avant que le backend soit testé en conditions réelles**
- [ ] Workflow inscription → paiement → webhook → ticket PDF+QR

## Partie 6 — Divers
- [ ] Faire remonter les shapes manquants/statuts inattendus au backend au fil de l'eau — continu, 1er passage fait (`DEVLOG.md` suite 14)
- [ ] Gestion du refresh token quand le backend l'exposera — bloqué, `POST /api/admin/login` émet déjà `refresh_token` mais aucun endpoint `/refresh` n'existe côté back pour le consommer

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
