# Journal de dev — synca_conf_front

Site vitrine 100 % statique (plus de backend depuis le 2026-09-29). L'historique de la période avec backend reste consultable dans git. Reste à faire : `TODO.md`.

## Journal

### 2026-09-29
- Fait : **passage au 100 % statique, suppression de toute intégration backend** — client API, auth, back-office admin, espace participant, pages ambassadeurs, tous les formulaires (inscription, candidatures speaker/partenaire/exposant, contact), composants UI et dépendances devenus inutiles, docs backend (`FRONTEND_INTEGRATION.md`, `ROADMAP_ADMIN.md`, `ROADMAP_PUBLIC_SEO.md`, `USER_JOURNEYS.md`), skills `backend-check` et `error-handling`.
- Fait : nouvelles infos en dur (`src/data/`) — *Synca Conf & ACYBIA Forum*, 15–17 mars 2027, Noom Hôtel Sea Plaza, Dakar ; programme (15–16 ACYBIA + hackathon, 17 = 3 masterclasses + remise des prix) ; 3 speakers avec photos/bios ; partenaires ACYBIA et Palmarès Tech ; page Hackathon (thème PME africaines & cybermenaces, 48h) ; FAQ statique. CTAs → `/contact`.
- Fait : tout passe par Docker, rien sur l'hôte — Chromium dans l'image pour le pré-rendu, cible `make prod-build`, `bun.lock`/`bunfig.toml` supprimés (npm seul gestionnaire), sources brutes `Speakers/` et `Logo Partenaire /` ignorées par git.
- Vérifié : `make typecheck`, `make lint`, `make prod-build` (11 routes pré-rendues) OK dans le conteneur ; aucune requête réseau vers un backend.
- Fait : préparation mise en ligne Lovable — `.env.production` committé (VITE_SITE_URL public, lu par Vite et `generate-seo-files.mjs` sans `.env` local), pré-rendu non bloquant si l'hébergeur n'a pas Chromium, fix canonical/og:url/JSON-LD qui figeaient `localhost:4666` dans les pages pré-rendues. Étapes manuelles listées dans `TODO.md`.
