# TODO — synca_conf_front

Site 100 % statique (plus de backend depuis le 2026-09-29). Contenu dans `brief-and-style-guide-main/src/data/`. Détails dans `DEVLOG.md`.

## Mise en ligne (Hostinger)
- [ ] **Vérifier la page 404** : `.htaccess` présent directement dans `public_html` (fichiers cachés visibles dans le File Manager), puis purger le cache Hostinger et tester une URL inconnue en navigation privée.
- [ ] À chaque mise en ligne : `make prod-build` (dans `brief-and-style-guide-main/`) puis envoyer **tout le contenu de `dist/`** dans `public_html`, y compris le fichier caché `.htaccess`.
- [ ] **Renseigner le domaine** dans `brief-and-style-guide-main/.env.production` (`VITE_SITE_URL=https://…`, sans slash final) — ou me le donner, je fais le commit. Sans ça, canonical / Open Graph / sitemap pointent vers un placeholder cassé.
- [ ] SEO restant (image OG 1200×630, favicon iOS, Search Console) : voir `SEO_A_CONFIGURER.md`.

## Inscriptions / demandes
Participants → https://www.acybia.com/inscription ; partenaire, exposant, speaker, université (hackathon) → mail direct à astou.diakhate@sync-africa.com (cc contact@sync-africa.com).
- [ ] **Inscription payante aux masterclasses** (17 mars) — mode d'inscription et de paiement à définir
- [ ] Formulaire de contact (aujourd'hui : emails/téléphones cliquables seulement)

## Contenus à recevoir
- [ ] Lien vers le programme officiel ACYBIA Forum (15–16 mars) → `PARAMETER.acybiaProgrammeUrl` (`src/data/parameter.ts`, actuellement `#`)
- [ ] Intitulés, intervenants et horaires des 3 masterclasses du 17 mars → `src/data/programme.ts`
- [ ] Horaire de la remise des prix du Hackathon (17 mars)
- [ ] Autres speakers (photo + intitulé + bio) → `public/speakers/` + `src/data/speaker.ts` + `scripts/public-routes.mjs`
- [ ] Autres logos partenaires → `public/partenaires/` + `src/data/sponsor.ts`
- [ ] Vérifier la FAQ (`src/data/faq.ts`) : chiffres, budget, universités, sponsoring encore issus de l'ancienne édition
