# TODO — synca_conf_front

Site 100 % statique (plus de backend depuis le 2026-09-29). Contenu dans `brief-and-style-guide-main/src/data/`. Détails dans `DEVLOG.md`.

## Mise en ligne sur Lovable — actions manuelles (toi)
- [ ] **Vérifier que Lovable peut builder ce repo** : l'app vit dans le sous-dossier `brief-and-style-guide-main/` (pas de `package.json` à la racine). Lovable attend normalement l'app à la racine du repo connecté — dans les réglages Lovable (GitHub), vérifier quel repo/branche est connecté. Si le build Lovable échoue, me demander de remonter l'app à la racine du repo.
- [ ] **Promouvoir `dev-boaz` → `main`** : Lovable synchronise la branche par défaut (`main`). Me dire « push to main » (ou merger la PR `dev-boaz` → `main` sur GitHub).
- [ ] **Choisir le domaine** : sous-domaine `*.lovable.app` ou domaine perso (Lovable → Project settings → Domains, puis enregistrements DNS chez ton registrar).
- [ ] **Renseigner le domaine** dans `brief-and-style-guide-main/.env.production` (`VITE_SITE_URL=https://…`, sans slash final) — ou me le donner, je fais le commit. Sans ça, canonical / Open Graph / sitemap pointent vers un placeholder cassé.
- [ ] **Publier** dans Lovable (bouton Publish) puis tester : accueil, `/speakers/leonel-ngoya`, `/hackathon-universitaire`, une URL inconnue (doit afficher la 404 du site).
- Note : Lovable n'a probablement pas Chromium → le pré-rendu SEO est sauté (le build ne casse pas, le site fonctionne ; seul le HTML figé pour les crawlers manque). Pour l'avoir quand même : `make prod-build` dans Docker et héberger `dist/` ailleurs.
- [ ] SEO restant (image OG 1200×630, favicon iOS, Search Console) : voir `SEO_A_CONFIGURER.md`.

## Formulaires — à définir avec le porteur de projet
Tous les formulaires ont été retirés avec le backend ; en attendant, les CTAs renvoient vers `/contact`.
- [ ] Inscription / billetterie (lien externe ? prix des pass ?)
- [ ] Candidature speaker
- [ ] Candidature partenaire
- [ ] Candidature exposant
- [ ] Formulaire de contact (actuellement : emails/téléphones cliquables seulement)
- [ ] Inscription des universités au Hackathon

## Contenus à recevoir
- [ ] Lien vers le programme officiel ACYBIA Forum (15–16 mars) → `PARAMETER.acybiaProgrammeUrl` (`src/data/parameter.ts`, actuellement `#`)
- [ ] Intitulés, intervenants et horaires des 3 masterclasses du 17 mars → `src/data/programme.ts`
- [ ] Horaire de la remise des prix du Hackathon (17 mars)
- [ ] Autres speakers (photo + intitulé + bio) → `public/speakers/` + `src/data/speaker.ts` + `scripts/public-routes.mjs`
- [ ] Autres logos partenaires → `public/partenaires/` + `src/data/sponsor.ts`
- [ ] Vérifier la FAQ (`src/data/faq.ts`) : chiffres, budget, universités, sponsoring encore issus de l'ancienne édition
