---
name: quality-engineer
description: Use quand on écrit ou corrige du code, ou qu'on travaille sur la qualité/le niveau de relecture de ce frontend — Vite build, ESLint, Prettier, vérification de type. Trigger à la fin de chaque unité de travail : "avant de pousser", "vérifie que ça construit", "did I break anything", ou quand on ajoute des tests (vitest/playwright si un framework est mis en place). Pas de CI automatique — tout se vérifie dans le conteneur Docker (make). L'idée est que jamais une unité de travail n'est terminée si elle ne build pas et ne passe pas le lint.
---

# Quality Engineer (synca_conf_front)

Règle de regression : **aucune unité de travail n'est terminée tant que le build et le lint ne passent pas**. Tout tourne **dans Docker** (rien d'installé sur la machine hôte) via le `Makefile` de `brief-and-style-guide-main/` — conteneur démarré avec `make up`.

## Le portillon de vérification (ordre)

1. **Types** : `make typecheck` (`tsc --noEmit`).
2. **Lint** : `make lint` (ESLint 9).
3. **Build de prod** : `make prod-build` — bundling Vite + pré-rendu de chaque route publique (Chromium dans le conteneur).
4. **Format** : `make format` (prettier --write) si le lint signale du formatage.

Pas de CI/GitHub Actions — à moins que l'utilisateur ne le demande explicitement. Tout est manuel.

## Tests (si/si un framework est mis en place)

- Pas de framework de test défini dans `package.json` actuellement. Si on ajoute des tests, privilégier **vitest** pour l'unité (léger, compatible Vite) et éventuellement **Playwright** pour un E2E critique — exécutés dans le conteneur.
- Nommer les tests par le **comportement**, pas la fonction : `la page speaker affiche la bio`, pas `test_form_1`.
- Tester aussi le **cas d'échec** (ex. slug de speaker inconnu → page "introuvable") au moins autant que le chemin heureux.

## "Vérifié" = relecture sécurité incluse

Avant de déclarer une unité de travail terminée, passer sa relecture au sens `security-hardening` — un code qui construit et lint mais qui fuit un secret ou affiche des PII n'est pas terminé, même vert.

## Amendement

Si une vérification révèle qu'une conception antérieure était fausse — pas juste un bug local — s'arrêter et le signaler. Le correctif n'est pas "faire passer le test", c'est "corriger la conception, puis vérifier contre la conception corrigée". Ne pas boucher silencieusement autour d'un défaut de design juste pour être vert.

## Commandes

Depuis `brief-and-style-guide-main/` :

- Types : `make typecheck`
- Lint : `make lint`
- Build + pré-rendu : `make prod-build`
- Format : `make format`