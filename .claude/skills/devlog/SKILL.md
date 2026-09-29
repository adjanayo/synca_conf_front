---
name: devlog
description: Use en fin de session de travail ou sur demande explicite pour mettre à jour le journal de dev — un fichier `DEVLOG.md` avec une section TODO (checklist) et une section Journal (entrées datées). Trigger sur "met à jour le journal", "note ça dans le devlog", "qu'est-ce qui reste à faire", "wrap up", ou en fin de tâche importante, même si l'utilisateur ne le demande pas explicitement à chaque fois.
---

# Devlog (synca_conf_front)

Suivi humain, committé, de l'avancement jour après jour. Distinct de `.claude/session-notes/` (note de passation ponctuelle et technique pour la continuité entre sessions, voir `session-limit-guard`) et de `.remember/` (log agent-interne, gitignored, écrit à chaque tour) — le devlog est un résumé haut niveau, orienté avancement produit, lisible par un humain qui n'a pas suivi la session.

## Fichier

- `DEVLOG.md` (racine du repo). Le reste à faire détaillé vit dans `TODO.md`.

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

1. Lire le `DEVLOG.md` existant (le créer avec le template ci-dessus s'il n'existe pas).
2. **Section TODO** : cocher les items terminés cette session, ajouter les nouveaux items ouverts identifiés (bugs restants, prochaines étapes). Ne jamais supprimer un item non fait sans le cocher ou noter explicitement qu'il est abandonné.
3. **Section Journal** : ajouter une entrée datée `### YYYY-MM-DD` (ou compléter l'entrée du jour si elle existe déjà) avec 2-4 puces factuelles — quoi a été fait, pas comment (le détail technique est dans git log/diff).
4. Append-only sur le Journal — ne jamais réécrire une entrée passée. Édition possible seulement sur la section TODO.

## Notes

- Ne pas dupliquer `.remember/now.md` mot pour mot : le devlog résume, il ne journalise pas chaque tour.
