# TODO — synca_conf_front

Travail restant, hors périmètre admin (`ROADMAP_ADMIN.md`, déjà terminé — voir tableau de statut dans `DEVLOG.md`). Rien ici ne s'exécute sans instruction explicite de l'utilisateur (voir skill `devlog` pour la procédure de suivi : cocher ici, détailler dans `DEVLOG.md`).

## Partie 1 — SEO du site public
- [ ] S2. SEO au fil de l'eau (title/description/OG à jour à chaque nouvelle section) — pas de tracking/analytics sans accord explicite
- Voir `SEO_A_CONFIGURER.md` (racine du repo) pour tout ce que l'utilisateur doit renseigner à la main (domaine, image OG, favicons, Search Console, données DB à vérifier avant mise en ligne) — pas du code, pas dans ce TODO.

## Partie 5 — Paiement / billetterie
- [ ] `POST /api/payments` + `/api/promo/validate` — **ne pas consommer avant que le backend soit testé en conditions réelles**
- [ ] Workflow inscription → paiement → webhook → ticket PDF+QR

## Partie 6 — Divers
- [ ] Faire remonter les shapes manquants/statuts inattendus au backend au fil de l'eau — continu, 1er passage fait (`DEVLOG.md` suite 14)

