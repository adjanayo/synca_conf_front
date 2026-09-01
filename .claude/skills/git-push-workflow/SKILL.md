---
name: git-push-workflow
description: Use every time a git commit or git push is about to run in this repo, whether the user says "commit", "push", "rtk git commit", "rtk git push", or "push this up". Encode la règle que la branche par défaut des agents est `dev-boaz`, le Conventional Commits obligatoire, et l'avertissement Lovable (ne jamais réécrire l'historique publié). Trigger avant tout commit/push, même un simple "push".
---

# Git Push Workflow (synca_conf_front)

## Règle d'or : tout push va sur `dev-boaz`

- **La cible de push par défaut et unique pour les agents est `dev-boaz`.** Tout le travail de jour arrive sur `dev-boaz` — c'est la branche de travail officielle. L'utilisateur ne doit pas avoir à le demander.
- Ne pas pousser à chaque édition intermédiaire ni après un commit trivial — seulement quand une unité de travail cohérente est terminée.
- **`main` n'est poussée que sur instruction explicite** ("push to main", "deploy", "promouvoir") — jamais inféré. Pas de branche staging : `dev-boaz` → `main` uniquement.
- Les opérations git en lecture seule (`status`, `log`, `diff`, `fetch`, `pull`) ne déclenchent jamais un push.
- **Ne jamais commit directement sur `main`.**
- ⚠️ **Lovable** : ce projet est connecté à Lovable (voir AGENTS.md). Ne jamais réécrire l'historique publié — pas de force-push, rebase, amend ou squash de commits déjà poussés. Garder la branche en état de fonctionnement : les commits poussés sont synchronisés vers Lovable.

## Préfixes de messages de commit (Conventional Commits)

| Préfixe | Usage |
|---|---|
| `feat:` | Nouvelle fonctionnalité ou capacité (écran, section, contenu) |
| `fix:` | Correction d'un bug — comportement faux |
| `docs:` | Documentation uniquement (README, AGENTS.md, skills, commentaires) |
| `chore:` | Outillage, config, dépendances, scaffolding (CI, `.env.example`, fichiers de config) |
| `refactor:` | Restructuration sans changement de comportement |
| `test:` | Ajout/correction de tests uniquement |
| `ci:` | Changements spécifiques au pipeline CI (`.github/workflows/*`) |

Exemples :
```
feat: ajouter la section programmes sur l'index
fix: afficher l'erreur 409 sur le formulaire d'inscription
docs: pointer les agents vers dev-boaz dans AGENTS.md
chore: ajouter les filtres RTK projet .rtk/filters.toml
```

Deux intentions réelles dans un même changement → choisir le préfixe de l'intention principale. Deux parties assez grosses pour être relues indépendamment → deux commits au lieu d'un.

## Stratégie de branches : dev-boaz → main

| Branche | Ce qui y arrive | Quand |
|---|---|---|
| `dev-boaz` | Chaque commit du travail actif des agents | Poussée automatiquement à la fin de chaque unité de travail (et sur tout "push" explicite) — cible par défaut |
| `main` | Un instantané de `dev-boaz` | Uniquement sur instruction explicite de l'utilisateur ("push to main", "deploy") — jamais automatique |

**La cible par défaut est `dev-boaz`.** Tout "push" sans branche explicite signifie `dev-boaz`.

Promotion vers `main` (uniquement si demandé explicitement) :
```bash
git checkout main
git pull origin main
git merge dev-boaz --ff-only   # si ça échoue, les branches ont divergé — s'arrêter et demander, jamais de force-merge
git push origin main
git checkout dev-boaz
```

Un `--ff-only` qui échoue signifie que la discipline de branches a été rompue (quelqu'un a commité sur `main`) — le signaler à l'utilisateur, ne jamais basculer silencieusement sur un merge commit ou un force-push.

## Séquence (ordre obligatoire)

1. Stager et commiter normalement (`rtk git add`, `rtk git commit`).
2. Pousser : `rtk git push` — pousse la branche courante, c'est-à-dire `dev-boaz` pour tout travail normal.

## Quand ça ne s'applique pas

Les opérations git non-push (`status`, `log`, `diff`, `fetch`, `pull`) ne déclenchent rien — seul un vrai `push` est concerné.