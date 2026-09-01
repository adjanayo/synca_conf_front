---
name: change-control
description: Use avant de modifier TOUT fichier qui implémente une fonctionnalité déjà livrée, vérifiée et regardée par l'utilisateur — vérifier ce skill d'abord, avant d'écrire l'édition, pas après. Trigger sur toute touche au code déjà en place, pas seulement quand l'utilisateur dit explicitement "ne casse pas X". Couvre la règle permanente que les fonctionnalités validées/qui marchent ne sont pas à modifier sauf vrai bug ou demande explicite de l'utilisateur.
---

# Change Control (synca_conf_front)

Le code livré et vu par l'utilisateur vaut un engagement : **ce code est de confiance, exactement tel qu'il est.** Ce n'est pas une invitation à refactoriser, "améliorer", restyler ou reformer ce qui fonctionne pendant qu'on travaille à côté.

## La règle

Avant de modifier un fichier qui porte une fonctionnalité déjà en place (une page publiée, un composant validé), exactement une des deux choses suivantes doit être vraie :

1. **Un vrai bug a été trouvé** — quelque chose de réellement cassé, pas une préférence stylistique ou un "ça pourrait être plus propre". Énoncer ce qui est cassé et comment on le sait (une reproduction, un test qui échoue, un scénario d'échec concret) avant de toucher le code.
2. **L'utilisateur a explicitement demandé que cette fonctionnalité change** — une nouvelle exigence, une correction de comportement, un changement de design demandé. Pas quelque chose d'inféré de "tant qu'à faire".

Si ni l'un ni l'autre, ne pas faire l'édition — même si ça ressemble à une amélioration évidente. Modifier en silence un élément validé — même en mieux — casse la promesse que ce que l'utilisateur a vu est ce qui tourne encore.

## Comment vérifier avant d'éditer

1. Identifier à quelle fonctionnalité/page le fichier appartient (les routes dans `AppRoutes.tsx`, la structure `src/pages/`, le contexte de la conversation).
2. Si c'est une page ou un composant en cours de construction ou jamais montré à l'utilisateur, éditer librement — la règle ne s'applique pas encore.
3. Si c'est validé (l'utilisateur l'a vu marcher), confirmer qu'on a un bug ou une demande explicite de changement avant de continuer. Si non, s'arrêter et demander plutôt que deviner leur intention — c'est exactement le cas où une mauvaise supposition coûte cher.

## Ce que ça donne en pratique

- Corriger un vrai bug dans du code validé : continuer, mais dire clairement ce qui était cassé et pourquoi le correctif est juste.
- L'utilisateur dit "ajoute X au formulaire d'inscription" où le formulaire est en place : c'est une demande explicite de mise à jour — procéder, et noter que le comportement d'un élément déjà testé a changé (il peut nécessiter une re-vérification).
- Refactoriser pendant la construction d'un élément non lié, et un fichier validé se trouve être adjacent ou "pourrait être nettoyé" : ne pas. Borner le changement à ce qui a réellement été demandé.
- Le design d'un nouvel élément révèle que du code antérieur doit changer structurellement (pas un bug, une vraie correction de design) : s'arrêter, expliquer l'amendement à l'utilisateur, puis changer le code. Ne pas rapiécer en silence autour.

## Relation avec les autres skills

- `git-push-workflow` : ce skill est ce qui décide si une édition sur du code déjà suivi doit avoir lieu, vérifié avant que l'édition soit écrite ; `git-push-workflow` gère ensuite le commit/la cible de push (`dev-boaz`).
- `quality-engineer` : le portillon build/lint s'applique aux edits qu'on finit par faire — mais ça ne remplace pas la question préalable "doit-on éditer du coup".