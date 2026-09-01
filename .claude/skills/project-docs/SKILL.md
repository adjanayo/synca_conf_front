---
name: project-docs
description: Use pour générer ou mettre à jour la documentation du projet sous docs/ — au fur et à mesure que les pages/features sont construites et validées, pas comme un gros effort à la fin. Trigger quand l'utilisateur demande de "documenter ceci", "générer la doc", "écrire la doc pour la section X", après qu'une fonctionnalité est en production visible, ou quand on demande des docs de setup/architecture/API/déploiement. À terme, docs/ doit se lire comme une documentation de projet complète et autonome — quelqu'un sans aucun historique de conversation doit pouvoir embarquer à partir d'elle seule.
---

# Project Documentation (synca_conf_front)

Le code décrit ce qui existe réellement — vraies commandes, vraies pages, vraies routes, écrites à partir de ce qui a été réellement construit et vérifié, pas à partir de ce qui était prévu.

## Quand écrire de la doc

Le déclencheur naturel est juste après qu'une fonctionnalité/page soit livrée et visible — c'est le moment où une fonctionnalité est prouvée réelle, exactement quand il vaut la peine de la documenter. Ne pas documenter une fonctionnalité seulement implémentée mais jamais vue/testée ; une doc décrivant un comportement non testé peut décrire un bug comme si c'était une fonctionnalité. Si l'utilisateur demande une doc pour quelque chose de pas encore construit, le dire plutôt que d'écrire une doc d'anticipation qui se lira comme déjà vraie.

## Structure

```
docs/
├── README.md          — index ; une ligne de description + lien par page ci-dessous
├── getting-started.md — setup dev local : prérequis, install, lancement dev, pièges courants
├── architecture.md    — design système : stack React/Vite, routage, structure src/, flux de données
├── api.md             — référence des endpoints appelés (complément du code, URLs/config)
└── security.md        — court résumé + lien vers la politique de sécurité (ne pas dupliquer)
```

Ajouter une nouvelle page seulement quand aucune existante ne convient — la plupart des ajouts étendent une page existante plutôt que d'en créer une nouvelle.

## Style d'écriture

- **Écrire pour un lecteur sans aucun contexte de cette conversation.** Chaque commande doit être copiable-collable et correcte telle qu'écrite — la vérifier réellement avant de la noter (la discipline de `quality-engineer` s'applique aussi à la doc : ne pas documenter une commande qu'on n'a pas exécutée).
- **Croiser les référence** : pointer vers la page/composant qui implémente chaque élément ("voir `src/pages/index/IndexView.tsx`") pour qu'un lecteur trace la doc jusqu'au code — mais la page se lit comme une référence de l'état courant, pas comme un historique narré.
- **Pas de secrets, jamais.** Exemples `.env`, chaînes de connexion et identifiants dans la doc sont des placeholders (`change-me`, `<votre-valeur>`) — jamais une vraie valeur réelle, même de dev local.
- **Court plutôt qu'exhaustif.** Une page concise qu'un dev lit réellement bat une page complète qu'il saute. Si une section devient lourde, c'est un signal pour la découper, pas pour continuer à ajouter.

## Garder la doc honnête au fil de l'évolution

Si implémenter une fonctionnalité ultérieure révèle qu'une page de doc antérieure est devenue fausse (une route a changé, une étape de setup n'est plus nécessaire), corriger la page dans le même changement — même discipline d'amendement que le code. Une page de doc qui décrit encore le comportement du mois dernier est pire que pas de page, puisqu'elle induit en erreur au lieu de rester muette.

## Convention de commit

Les changements de doc se committent en `docs:` (voir `git-push-workflow`) et se poussent sur `dev-boaz` comme tout le reste.