# TODO — synca_conf_front

Site 100 % statique (plus de backend depuis le 2026-09-29). Contenu dans `brief-and-style-guide-main/src/data/`. Détails dans `DEVLOG.md`.

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

## SEO
- [ ] Voir `SEO_A_CONFIGURER.md` (domaine, image OG, favicons, Search Console)
