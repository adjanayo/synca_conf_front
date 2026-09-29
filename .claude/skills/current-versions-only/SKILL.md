---
name: current-versions-only
description: Use à chaque fois qu'on choisit, ajoute, upgrade ou défend la version de QUELQUE CHOSE dans ce projet — un package/dépendance npm, un runtime Node, un framework, une action CI, un outil Homebrew installé localement. Politique permanente, pas liée à une phase. Trigger sur "ajoute ce package", "quelle version", "est-ce dépassé", "pince la version", ou quand un paradigme annoncé (ex. une version majeure de framework) s'avère avoir des vulnérabilités connues non patchées, ex. "doit-on monter X" ou "est-ce que cette version est encore sûre".
---

# Current Versions Only (synca_conf_front)

**Règle permanente : ne jamais exploiter volontairement un logiciel dépassé avec des vulnérabilités connues et corrigeables.** Cela s'applique partout — dépendances npm, runtime Node, actions CI, outils locaux installés via Homebrew — pas seulement au code applicatif. Ce skill est la politique ; les mécaniques de vérification concrètes vivent dans les outils qu'il pointe ci-dessous.

## Pourquoi c'est une règle à part entière

Ce projet est un frontend React 19 + Vite + Tailwind (voir `brief-and-style-guide-main/package.json`). L'instinct permanent à entretenir est de **ne pas accepter un choix dépassé connu** simplement parce qu'une doc ou un brief le disait. La stack doit être tenue à jour vers le stable récent, pas gelée sur ce dont on se souvient.

## La règle, concrètement

- **Quand on ajoute une dépendance** : défaut sur la dernière version stable, pas "ce qu'il est conventionnel de piner" ou la première version qui vient en tête depuis les données d'entraînement. Vérifier avec `npm audit` / la résolution de `bun`/`npm` pour ce qui est réellement installé.
- **Quand un brief/une spec nomme une version précise** (ex. "React 18", "Vite 7") : c'est un point de départ, pas une permission d'ignorer des vulnérabilités découvertes plus tard. Si une vérification révèle que la version nommée est réellement dépassée/vulnérable, **le dire et proposer l'amendement** — ne pas s'y conformer silencieusement, et ne pas monter en silence non plus. Remonter l'information et laisser l'utilisateur décider.
- **Ne jamais corriger une vulnérabilité en descendant de version** — la direction est toujours vers l'avant (upgrade) ou un risque-accepté documenté (voir ci-dessous), jamais en arrière.
- **Une dépendance correcte à l'ajout peut devenir vulnérable plus tard.** Ce n'est pas une vérification ponctuelle à l'installation — relancer `npm audit` régulièrement (lors de chaque grosse session de travail) et toujours avant un déploiement de production.
- **Les versions runtime comptent aussi** : la version de Node pincée (package.json, `.node-version`, config CI), et même les outils installés localement (formules Homebrew) — "dépassé" n'est pas limité aux entrées de `package.json`.

## Quand une vérification est indisponible

Si l'outil de vérification lui-même est cassé ou non authentifié (ex. un casse du MCP de scan npm) — le dire explicitement, ne pas sauter silencieusement la vérification ni présumer la sécurité, et demander à l'utilisateur comment procéder. Le noter comme à re-vérifier une fois l'outil disponible.

## Les exceptions à risque-accepté sont documentées, pas silencieuses

Parfois, le seul moyen d'éteindre tous les advisories est un saut de version majeure cassant que l'utilisateur n'est pas prêt à faire. C'est un choix légitime — mais il va dans un fichier de suivi sécurité (ex. `SECURITY_NOTES.md` à la racine, ou section dédiée du README) en ligne de risque-accepté explicite avec une condition de révision, jamais accepté en silence et oublié. Un "on a décidé que c'était OK" non enregistré est indiscernable de "personne n'a vérifié" six mois plus tard.

## Quand on relit un choix de dépendance/version

Se demander : (1) est-ce la dernière version stable, ou une exception délibérément choisie et *documentée* ? (2) si un paradigme pince une version majeure plus ancienne, a-t-elle réellement été vérifiée pour vulnérabilités connues récemment, ou est-ce seulement supposé depuis quand le paradigme a été écrit ? (3) si une vulnérabilité résiduelle existe, est-elle documentée avec un déclencheur de révision, ou juste mémorisée/non enregistrée ? Un "non" à l'une de ces questions est une constatation à remonter.