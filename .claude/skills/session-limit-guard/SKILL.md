---
name: session-limit-guard
description: Use proactively pendant toute longue session de travail sur ce projet — vérifier toutes les ~10-15 tours de travail réel, et toujours avant que l'utilisateur dise "on s'arrête là", "on continue plus tard", ou quand une session semble trop longue. Gère la longévité de la conversation en estimant le budget de contexte restant, écrit une note de passation avant que ce budget soit épuisé, et pointe la session suivante vers elle via CLAUDE.md. Trigger sur "wrap up", "sauver la progression", "nouvelle session", "handoff", ou "limite de session", même si l'utilisateur ne nomme pas ce skill.
---

# Session Limit Guard (synca_conf_front)

Filet de sécurité pour la continuité entre sessions — une note de passation qui survit sur disque vaut mieux que d'espérer que le résumé de session suivant ait tout capturé, surtout pour les décisions d'architecture et les boucles ouvertes qu'une compaction de contexte pourrait écraser. C'est additif à la compaction automatique du harness, pas un remplacement — ne jamais s'arrêter en plein milieu d'une tâche juste parce qu'un seuil de tours est dépassé ; finir l'étape, puis passer la main.

## 1. Suivre approximativement, sans sur-réfléchir

Tenir un compteur mental approximatif des tours de la session (un tour = un message utilisateur + une réponse). Pas d'outil nécessaire — la précision n'importe pas, les points de déclenchement ci-dessous sont délibérément conservateurs.

## 2. Checkpoint à ~12-15 tours ou quand le contexte se resserre

À ce moment, ou dès qu'on estime approcher ~70% du contexte disponible : faire une pause avant de démarrer la prochaine unité de travail non liée (pas en plein milieu d'une étape) et appliquer les étapes 3-5. Si l'utilisateur est en pleine conversation et n'a pas demandé d'arrêt, ne pas annoncer une halte dure — écrire silencieusement la note (étape 3) pour qu'elle soit là si la session se termine inopinément, et mentionner en une ligne qu'un checkpoint a été fait.

## 3. Écrire la note de passation

Créer un nouveau fichier sous `.claude/session-notes/`, nommé `YYYY-MM-DD-<slug-court-du-sujet>.md` (date + quelques mots décrivant le fil principal de la session — choisir le slug soi-même, ne pas le coder en dur). Contenu, compressé et factuel :

- **Stack / état** : pages/sections/composants touchés par cette session.
- **Décisions clés** : tout ce qui a été décidé et qui n'est pas évident en relisant le code (un compromis de design, un choix de périmètre, un élément différé).
- **Boucles en cours** : tout ce qui est resté en vol — une étape à moitié implémentée, une question sans réponse de l'utilisateur, un bug en cours de traque.
- **Prochaine étape exacte** : l'action concrète suivante, assez spécifique pour qu'une session neuve puisse agir sans re-dériver le contexte (pas "continuer le programme", mais "Section index : ajouter le graphe des speakers à IndexView.tsx, route /programme").

Rester court — c'est un pointeur pour qu'une session neuve se réoriente vite, pas une transcription complète.

## 4. Pointer la session suivante vers elle

Mettre à jour `AGENTS.md` à la racine du repo (`synca_conf_front/AGENTS.md`, pas `CLAUDE.md` qui est un fichier géré automatiquement par `rtk init` et risquerait d'être écrasé) : ajouter ou rafraîchir une section `## Session Continuity` (la créer une fois, puis ne mettre à jour que le pointeur aux checkpoints suivants — ne pas empiler d'anciennes entrées) :

```markdown
## Session Continuity
Avant de commencer le travail, lire la dernière note de session : `.claude/session-notes/<fichier>.md`
```

Cela rend la passation auto-déclenchante — toute future session lisant `AGENTS.md` (ce qu'elle fait toujours) atterrit sur le pointeur sans que l'utilisateur ait à le mentionner.

## 5. Se réaligner avec les TODOs à chaque checkpoint

Vérifier le fichier TODO/TODO.md du projet à chaque checkpoint pour ne jamais laisser les items en attente devenir obsolètes. Si la note de passation (étape 3) mentionne un travail restant, s'assurer qu'un TODO correspond existe ou est créé.