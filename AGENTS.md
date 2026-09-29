# synca_conf_front — Instructions projet pour les agents

Site vitrine d'événement/conférence. SPA React 19 + Vite + TypeScript (React Router, Tailwind 4). **100 % statique depuis le 2026-09-29 : aucun backend** — tout le contenu vit dans `brief-and-style-guide-main/src/data/`. Le code applicatif vit dans `brief-and-style-guide-main/` mais les instructions de ce fichier s'appliquent à tout le repo.

## Branches : tout push va sur `dev-boaz`

- **La cible de push par défaut et unique des agents est `dev-boaz`.** Tout travail de développement arrive sur `dev-boaz` — la pousser automatiquement à la fin de chaque unité de travail cohérente. Ne pas demander la permission pour un push sur `dev-boaz` ; le push est le comportement normal.
- **`main` n'est poussée que sur instruction explicite** ("push to main", "deploy", "promouvoir"). Ne jamais commiter directement sur `main`.
- Promotion vers `main` (si demandé) : `git merge dev-boaz --ff-only` et si ça échoue, s'arrêter et demander — jamais de force-merge.
- ⚠️ **Lovable** : ce repo est connecté à Lovable. Ne jamais réécrire l'historique publié (force-push, rebase, amend, squash de commits déjà poussés). Garder la branche en état de fonctionnement.

## Commandes

**Tout tourne dans Docker, rien n'est installé sur la machine hôte** (pas de `npm install` local). Détail : `brief-and-style-guide-main/MAKEFILE.md`.

```bash
cd brief-and-style-guide-main
make up          # conteneur synca-dev-web, http://127.0.0.1:5173 (hot-reload)
make typecheck   # tsc
make lint        # ESLint
make prod-build  # build + pré-rendu
make format      # Prettier
```

Aucune unité de travail n'est terminée si build + lint ne passent pas (voir skill `quality-engineer`).

## Skills disponibles (`.claude/skills/`)

Toutes sont des adaptations du projet jenby pour ce repo. À appliquer automatiquement selon le contexte :

| Skill | Quand |
|---|---|
| `git-push-workflow` | Avant tout commit/push — cible `dev-boaz`, Conventional Commits |
| `session-limit-guard` | Réduction de tokens / continuité entre sessions (~12-15 tours, notes de passation) |
| `current-versions-only` | Choix/upgrade de dépendances, audits, versions à jour |
| `security-hardening` | Secrets, PII publiées, liens/scripts externes, `.env`, dépendances |
| `quality-engineer` | Portillon build/lint avant de livrer, tests |
| `change-control` | Ne pas modifier du code déjà validé sans bug ou demande explicite |
| `project-docs` | Documentation `docs/` au fil de l'eau |
| `landing-page` | Page d'accueil / index — garder les sections à jour, ne promouvoir que le réel |
| `seo` | Titres/meta/OG par page publique, robots, sitemap |

## Langue

Répondre en français (l'utilisateur et le site sont en français). Code, identifiants et chaînes insérées par l'utilisateur restent tels quels.

## Session Continuity

Avant de démarrer le travail dans une session déjà longue, vérifier s'il existe une note de passation récente sous `.claude/session-notes/` (skill `session-limit-guard`).

## Documentation

Voir `docs/` (skill `project-docs`) pour toute documentation à jour du projet.

- `TODO.md` — travail restant (formulaires à définir avec le porteur de projet, contenus à recevoir).
