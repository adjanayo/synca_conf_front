# TODO — synca_conf_front

Site 100 % statique (plus de backend depuis le 2026-09-29). Contenu dans `brief-and-style-guide-main/src/data/`. Détails dans `DEVLOG.md`.

## Mise en ligne — hébergement Hostinger (le site n'est plus hébergé par Lovable)

Le déploiement est **automatisé** : un push sur `main` construit le site et le met en ligne sur Hostinger. Procédure complète dans `docs/deploiement-hostinger.md`.

- [ ] **Choisir le domaine** et le faire pointer chez Hostinger (DNS).
- [ ] **Renseigner le domaine** dans `brief-and-style-guide-main/.env.production` (`VITE_SITE_URL=https://…`, sans slash final) — ou me le donner, je fais le commit. Le workflow refuse de builder tant que le placeholder est là.
- [ ] **Vérifier le plan d'hébergement** : le déploiement utilise SFTP/rsync, disponible à partir de **Premium**. En dessous, il faut upgrader ou passer par un déploiement FTP manuel.
- [ ] Activer SSH Access dans hPanel, créer une clé SSH dédiée, ajouter la clé publique dans hPanel.
- [ ] Créer dans GitHub → Settings → Secrets and variables → Actions :
  - **Variables** : `VITE_SITE_URL`, `HOSTINGER_HOST`, `HOSTINGER_SSH_PORT` (`65002`), `HOSTINGER_REMOTE_DIR` (`public_html`)
  - **Secrets** : `HOSTINGER_SSH_KEY` (clé privée complète), `HOSTINGER_SSH_USER`
- [ ] Vérifier que `public_html` ne contient rien d'autre que ce site (le déploiement supprime ce qui n'est pas dans le build).
- [ ] Tester : `gh workflow run deploy-hostinger.yml` (premier déploiement manuel, sans attendre un push sur `main`).
- [ ] SEO restant (image OG 1200×630, favicon iOS, Search Console) : voir `SEO_A_CONFIGURER.md`.

## Ancienne mise en ligne via Lovable — sans objet
L'hébergement cible est Hostinger, plus Lovable. Conservé pour trace : le pré-rendu SEO n'aurait pas fonctionné sur Lovable (pas de Chromium), alors qu'il fonctionne ici puisque le build tourne dans le conteneur Docker du projet.

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
