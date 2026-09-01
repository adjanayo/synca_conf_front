---
name: security-hardening
description: Use à chaque fois qu'on touche à l'authentification, aux identifiants/codes d'accès, aux formulaires publics, aux données personnelles (PII), aux appels API, aux variables d'environnement/secrets, ou à tout ce qui s'expose publiquement dans ce frontend React/Vite. Trigger sur tout changement touchant un formulaire, un champ téléphone/email, une inscription, une CTA publique, un .env, une clé d'API, un endpoint appelé depuis le navigateur — même si l'utilisateur ne dit pas "sécurité", ex. "ajoute un champ téléphone au formulaire de contact", "d'où vient cette clé", "appelle l'API d'inscription".
---

# Security Hardening (synca_conf_front)

Frontend pur (SPA React 19 + Vite + TypeScript, app dans `brief-and-style-guide-main/`). Toute la sécurité de ce projet est du côté **client/public** : on ne peut pas cacher de secret dans un bundle, on ne peut pas se fier à une validation UI seule, et tout ce qui est envoyé au serveur doit être considéré comme potentiellement hostile. La couche de défense finale est le backend (`synca_conf_back`) ; ce skill verrouille ce qui dépend de nous côté frontend.

## Secrets : rien dans le bundle, rien dans git

- **Le code frontend ne doit jamais contenir de secret.** Une clé d'API, un token, un mot de passe, une chaîne de connexion interpolés dans un composant ou un fichier source sont récupérables par quiconque lit le JS livré. Si le navigateur doit envoyer un secret, il passe par le backend, pas par le bundle.
- **Variables d'environnement uniquement via `import.meta.env`** (Vite) et préfixées `VITE_` — et seulement pour des valeurs qui sont *censées* être publiques (URLs d'API publiques, identifiants d'outils publics type Google Analytics). Une vraie clé secrète n'a pas de `VITE_` ; elle ne doit pas exister côté client.
- **`.env` n'est jamais committé** (il est déjà dans `.gitignore` si les conventions sont suivies) ; seul `.env.example` avec des valeurs placeholder se commit. Toujours vérifier avec `git status`/`git diff` avant un push qu'un `.env` réel n'est pas parti par erreur.
- **Ne jamais logguer de valeurs sensibles** (pas de `console.log` de champs de formulaire, de tokens, de réponses d'API contenant des PII) même en dev. Les logs finissent en contexte LLM et peuvent fuiter.

## Formulaires et données personnelles (PII)

- **La validation frontend est une UX, pas une sécurité.** `zod` + `react-hook-form` valident et guident l'utilisateur, mais le backend doit refuser lui-même toute entrée invalide — un champ "optionnel" côté UI n'est pas une permission d'envoyer n'importe quoi. Ne jamais compter sur une contrainte UI pour protéger une donnée.
- **Collecter le minimum.** Pour une inscription au programme / candidature speaker / contact : récupérer uniquement ce dont le backend a besoin. Ne pas ajouter un champ téléphone "pour plus tard".
- **Ne pas exposer de données d'autres personnes.** Pas de logging de réponses API contenant des listes d'inscrits, pas de copier-coller de dataset dans le code, pas de capture d'écran avec données réelles dans un commit (`sample data` dans les fixtures, jamais de données réelles de dev/prod).
- **Les données saisies restent de la PII utilisateur** — les traiter comme telles dans les logs, les messages d'erreur (ne pas echo le mot de passe, ne pas afficher un message qui distingue "email inconnu" vs "mot de passe faux" si l'API le permet ailleurs).

## Appels API / endpoints

- **Ne jamais dupliquer de secret en dur dans les requêtes** : token d'auth mis dans un header par un gestionnaire central (intercepteur/react-query), jamais colle dans chaque appel.
- **Traiter le backend comme hostile en erreur** : parser les erreurs sans supposer leur forme (voir `error-handling`), ne jamais afficher une `detail` brute qui pourrait fuiter des internes du serveur — l'afficher telle quelle seulement si le backend garantit des messages propres.
- **URLs uniquement par config** (variables d'environnement ou fichier de conf), jamais de URL de prod encodée en dur dans plusieurs fichiers — pouvoir viser dev vs prod sans ré-écrire le code.

## Tokens d'accès (participant, pas de login)

Le backend (`synca_conf_back`, décrit dans `FRONTEND_INTEGRATION.md`) n'a pas de login participant : l'`access_token` est délivré **une seule fois** dans la réponse de `POST /api/register` (§5.2). Il sert à `GET/DELETE /api/user/me` et `GET /api/user/me/tickets`. C'est un secret comme un autre :

- **Stockage** : ni cookie, ni `localStorage` (XSS = vol du token). Mémoire JS pour la session courante, ou `sessionStorage` si la session doit survivre à un refresh. Jamais dans une URL, un log, ou un outil d'analytics.
- **Envoi** : header `Authorization: Bearer <token>` via un gestionnaire central (intercepteur/react-query), jamais collé dans chaque appel.
- **Ne jamais construire une URL de billet à la main** — seul `GET /api/user/me/tickets` fournit `pdf_url` (`GET /api/tickets/:id` n'existe pas). Ne pas deviner/reconstruire un lien depuis un `ticket_number` ou un id.
- **`401` vs `403`** : `401` = token manquant/invalide/révoqué → UI "session expirée"/"reconnectez-vous" ; `403` = token valide mais non autorisé OU **fenêtre de campagne fermée** → message métier ("les candidatures partenaires sont closes"). Ne jamais les traiter comme équivalents.
- **Paiement** : les endpoints `POST /api/payments` et `POST /api/promo/validate` existent côté backend mais **ne doivent pas encore être consommés** en production (non testés en conditions réelles, §10 du guide).

## Versions et dépendances

- Audit régulier des dépendances (`npm audit`, voir `current-versions-only`) — une dépendance frontend compromise (ex. package malveillant dans le graph de deps) est un vecteur d'exfiltration réel : scripts malveillants, fuites de tokens via le navigateur.
- Ne pas pousser de dépendance affichant une vulnérabilité connu corrigeable sans la traiter ou la documenter.

## Quand on relit le changement d'un autre

Se demander, dans l'ordre : (1) y a-t-il un secret en dur quelque part (source, `.env` committé, log) ? (2) ce formulaire envoie-t-il plus de données que nécessaire, ou valide-t-il seulement côté client ? (3) une donnée d'un autre utilisateur peut-elle fuiter (log, message d'erreur, réponse API affichée brute) ? (4) une vulnérabilité de dépendance connue a-t-elle été traitée documentée ? Un "oui" à (1)/(3) ou un "non" spéculatif sur (2)/(4) bloque le changement, quelle que soit sa taille apparente.