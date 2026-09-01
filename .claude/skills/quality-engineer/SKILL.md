---
name: quality-engineer
description: Use quand on écrit ou corrige du code, ou qu'on travaille sur la qualité/le niveau de relecture de ce frontend — Vite build, ESLint, Prettier, vérification de type. Trigger à la fin de chaque unité de travail : "avant de pousser", "vérifie que ça construit", "did I break anything", ou quand on ajoute des tests (vitest/playwright si un framework est mis en place). Pas de CI automatique — tout se vérifie en local. L'idée est que jamais une unité de travail n'est terminée si elle ne build pas et ne passe pas le lint.
---

# Quality Engineer (synca_conf_front)

Règle de regression : **aucune unité de travail n'est terminée tant que le build et le lint ne passent pas** en local. Les commandes sont dans `brief-and-style-guide-main/package.json`.

## Le portillon de vérification (ordre)

1. **Build de prod** : `cd brief-and-style-guide-main && rtk npm run build` — le `tsc` + le bundling Vite échouent sur les erreurs de type et les imports cassés. C'est la vérification la plus rapide qui attrape le plus de choses.
2. **Lint** : `rtk npm run lint` (ESLint 9 + prettier) — les violations de style/hooks sont groupées par fichier.
3. **Format** : `rtk npm run format` (prettier --write) pour aligner avant le push si le lint signale du formatage.

Pas de CI/GitHub Actions — à moins que l'utilisateur ne le demande explicitement. Tout est manuel.

## Tests (si/si un framework est mis en place)

- Pas de framework de test défini dans `package.json` actuellement. Si on ajoute des tests, privilégier **vitest** pour l'unité (léger, compatible Vite) et éventuellement **Playwright** pour un E2E critique (parcours d'inscription).
- Nommer les tests par le **comportement**, pas la fonction : `inscription affiche l'erreur 409 existant`, pas `test_form_1`.
- Pour tout ce qui touche à un formulaire public ou une donnée envoyée au serveur, tester le **cas d'échec** (erreur 409 déjà inscrit, validation invalide) au moins autant que le chemin heureux.

## "Vérifié" = relecture sécurité incluse

Avant de déclarer une unité de travail terminée, passer sa relecture au sens `security-hardening` — un code qui construit et lint mais qui fuit un secret ou affiche des PII n'est pas terminé, même vert.

## Amendement

Si une vérification révèle qu'une conception antérieure était fausse — pas juste un bug local — s'arrêter et le signaler. Le correctif n'est pas "faire passer le test", c'est "corriger la conception, puis vérifier contre la conception corrigée". Ne pas boucher silencieusement autour d'un défaut de design juste pour être vert.

## Commandes

- Build : `rtk npm run build`
- Lint : `rtk npm run lint`
- Format : `rtk npm run format`