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

