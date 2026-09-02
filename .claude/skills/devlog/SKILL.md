---
name: devlog
description: Use en fin de session de travail ou sur demande explicite pour mettre à jour le journal de dev — un fichier `DEVLOG.md` par repo (front et back) avec une section TODO (checklist) et une section Journal (entrées datées). Trigger sur "met à jour le journal", "note ça dans le devlog", "qu'est-ce qui reste à faire", "wrap up", ou en fin de tâche importante, même si l'utilisateur ne le demande pas explicitement à chaque fois.
---

# Devlog (synca_conf_front + synca_conf_back)

Suivi humain, committé, de l'avancement jour après jour sur les deux repos du projet. Distinct de `.claude/session-notes/` (note de passation ponctuelle et technique pour la continuité entre sessions, voir `session-limit-guard`) et de `.remember/` (log agent-interne, gitignored, écrit à chaque tour) — le devlog est un résumé haut niveau, orienté avancement produit, lisible par un humain qui n'a pas suivi la session.

## Fichiers

- `synca_conf_front/DEVLOG.md`
- `synca_conf_back/DEVLOG.md` (chemin absolu : `/Users/kodjododjango/Downloads/dev_projects/synca_conf_back/DEVLOG.md`)

Créer le fichier avec ce template s'il n'existe pas encore :

```markdown
# Journal de dev — <nom du repo>

## TODO
- [ ] item en cours

## Journal

### YYYY-MM-DD
- Fait : ...
- À suivre : ...
```

## Procédure

1. Déterminer quel(s) repo(s) sont concernés par le travail de la session (front seul, back seul, ou les deux) — ne toucher que les fichiers pertinents.
2. Pour chaque repo concerné, lire le `DEVLOG.md` existant (le créer avec le template ci-dessus s'il n'existe pas).
3. **Section TODO** : cocher les items terminés cette session, ajouter les nouveaux items ouverts identifiés (bugs restants, prochaines étapes). Ne jamais supprimer un item non fait sans le cocher ou noter explicitement qu'il est abandonné.
4. **Section Journal** : ajouter une entrée datée `### YYYY-MM-DD` (ou compléter l'entrée du jour si elle existe déjà) avec 2-4 puces factuelles — quoi a été fait, pas comment (le détail technique est dans git log/diff).
5. Append-only sur le Journal — ne jamais réécrire une entrée passée. Édition possible seulement sur la section TODO.

## Notes

- Ne pas dupliquer `.remember/now.md` mot pour mot : le devlog résume, il ne journalise pas chaque tour.
- Le repo back a aussi un `TODO.md` préexistant (placeholder vide) — ne pas l'utiliser, `DEVLOG.md` remplace cet usage pour le suivi actif.
