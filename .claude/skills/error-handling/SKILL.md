---
name: error-handling
description: Use à chaque fois qu'on rend ou affiche une erreur dans ce frontend — une erreur d'API, un échec de validation de formulaire (zod/react-hook-form), le state d'un composant, ou comment l'erreur s'affiche à l'utilisateur. Trigger sur "quel message d'erreur", "l'erreur ne s'affiche pas", "ajoute de la validation", ou quand on construit tout nouveau formulaire/page qui peut échouer — même si l'utilisateur ne dit pas "gestion d'erreur" explicitement. Skill vivant — le mettre à jour quand de nouveaux patterns d'erreur apparaissent.
---

# Error Handling (synca_conf_front)

Une erreur qui se déclenche correctement mais que personne ne voit est aussi cassée que pas d'erreur du tout. Les deux moitiés comptent également : ce que le backend renvoie, et comment le frontend l'affiche.

## Appels API : le contrat d'erreur

Le backend (`synca_conf_back`, non présent dans ce repo — l'appeler via l'URL configurée) est supposé renvoyer une forme classique FastAPI/HTTP :

| Statut | Quand | Forme |
|---|---|---|
| `400` | Entrée malformée/sémantiquement invalide | `{ "detail": "message lisible" }` |
| `401` | Identifiants absents/invalides | `{ "detail": "..." }` |
| `403` | Authentifié mais non autorisé | `{ "detail": "..." }` |
| `404` | Ressource inexistante | `{ "detail": "..." }` |
| `409` | Conflit avec l'état existant (déjà inscrit, slug dupliqué…) | `{ "detail": "..." }` |
| `422` | Échec de validation (Pydantic côté backend) | `{ "detail": [{ "loc": [...], "msg": "...", "type": "..." }, ...] }` — **un tableau, pas une string** |
| `500` | Inattendu | Message générique uniquement — ne jamais afficher les internes |

**Règle centrale : tout code qui parse `detail` doit gérer les deux formes** — string (400/401/403/404/409) OU tableau (422). Assumer que `detail` est toujours une string est un vrai bug, pas une hypothèse. Un parser partagé (`extractErrorMessage`-style dans `src/lib/`) doit : si `detail` est une string, l'utiliser directement ; si c'est un tableau, joindre les champs `msg` en un message lisible (jamais afficher `[object Object]` ni tomber sur un message générique qui masque le vrai problème).

## Rendre une erreur

- **Toute erreur doit être visuellement distincte — couleur, bordure ou icône, jamais du texte brut non stylé.** Un `role="alert"` seul est nécessaire (lecteurs d'écran) mais pas suffisant (un utilisateur voyant doit la remarquer aussi).
- **État loading/pending** : désactiver le contrôle de soumission et changer son libellé pendant le traitement (`disabled={pending}`, style "Envoi…"), pattern établi dans les formulaires react-hook-form — le réutiliser systématiquement.
- **Dès qu'un second formulaire a besoin d'un affichage d'erreur**, extraire le style de boîte d'erreur dans un composant partagé plutôt que de re-copier-coller le bloc inline — un formulaire ne justifie pas encore l'abstraction, deux oui.
- **La validation zod s'affiche au champ** (message sous l'input), les erreurs serveur s'affichent globalement (en tête de formulaire) — les deux coexistants sans doublon confus.

## Pages d'erreur

- La route `*` redirige vers une page 404 propre (déjà en place dans `AppRoutes.tsx`) — un layout inconnu doit rendre la 404, pas une page blanche.
- Un rejet de la requête racine (réseau/API down) doit avoir un état visuel distinct plutôt qu'un crash silencieux du layout.

## Ce que ce skill ne couvre pas encore (mettre à jour quand ça arrive)

- Toast/notification d'erreur transitoire vs erreur inline de formulaire — seul l'inline existe pour l'instant.
- Tracking/observabilité des erreurs (type Sentry) — pas en place pour l'instant.

## Quand on relit une gestion d'erreur

Vérifier : (1) le parser gère-t-il `detail` string ET tableau ? (2) l'erreur est-elle visuellement distincte et accessible (`role="alert"`) ? (3) le contrôle de soumission est-il désactivé pendant l'envoi ? (4) un message générique ne masque-t-il pas le vrai problème ? Un "non" à l'une de ces questions bloque l'ajout.