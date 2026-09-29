---
name: security-hardening
description: Use à chaque fois qu'on touche aux données personnelles (PII) affichées, aux liens externes, aux variables d'environnement/secrets, aux dépendances, ou à tout ce qui s'expose publiquement dans ce site statique React/Vite. Trigger sur tout changement touchant un email/téléphone affiché, un lien sortant, un .env, une clé, un script tiers ou un futur formulaire — même si l'utilisateur ne dit pas "sécurité", ex. "ajoute le numéro de l'organisateur", "d'où vient cette clé", "ajoute un formulaire Google".
---

# Security Hardening (synca_conf_front)

Site vitrine **100 % statique** (SPA React 19 + Vite + TypeScript, app dans `brief-and-style-guide-main/`) : aucun backend, aucune authentification, aucun appel d'API. Tout le contenu vit dans `src/data/` et part tel quel dans le bundle public. La sécurité porte donc sur ce qu'on publie et ce qu'on embarque.

## Secrets : rien dans le bundle, rien dans git

- **Le code ne doit jamais contenir de secret.** Tout ce qui est dans `src/` ou `public/` est lisible par n'importe quel visiteur.
- **Variables d'environnement uniquement via `import.meta.env`**, préfixées `VITE_`, et seulement pour des valeurs publiques (ex. `VITE_SITE_URL`). Une vraie clé secrète n'a rien à faire côté client.
- **`.env` n'est jamais committé** ; seul `.env.example` (placeholders) l'est. Vérifier `git status`/`git diff` avant un push.

## Données personnelles publiées

- **Publier le minimum.** Emails/téléphones affichés (page Contact, FAQ) : uniquement des coordonnées que la personne a accepté de rendre publiques. Pas de liste de participants, pas de données réelles dans les fixtures ou captures commitées.
- Photos et bios de speakers : uniquement celles fournies par l'organisation pour publication. Les sources brutes (`/Speakers/`, `/Logo Partenaire */`) restent hors git.

## Liens et contenus externes

- Liens sortants en `target="_blank"` : toujours `rel="noopener noreferrer"`.
- **Pas de script tiers** (analytics, widgets, pixels) sans accord explicite de l'utilisateur — c'est du code qui s'exécute chez chaque visiteur et collecte des données.
- Si un formulaire revient (voir `TODO.md`) via un service externe (Google Forms, Tally…), c'est un lien sortant ou un iframe de ce service : ne jamais collecter de PII dans ce site sans backend dédié et politique de confidentialité.

## Dépendances

- Audit régulier (`npm audit` dans le conteneur, voir `current-versions-only`) — une dépendance compromise s'exécute chez chaque visiteur.
- Garder le graphe minimal : toute dépendance non importée se retire.

## Quand on relit le changement d'un autre

(1) Un secret en dur (source, `.env` committé) ? (2) Une donnée personnelle publiée sans accord ? (3) Un script ou lien externe non maîtrisé ? (4) Une vulnérabilité de dépendance connue non traitée ? Un "oui" bloque le changement.
