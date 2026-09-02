# Journal de dev — synca_conf_front

## Statut des phases (ROADMAP_ADMIN.md)

| Phase | Contenu | Statut |
|---|---|---|
| A1 | Client API central (`apiFetch`, parseur d'erreur) | ✅ fait |
| A2 | Auth admin (login, token mémoire, 401→logout) | ✅ fait |
| A3 | Routage chemin admin randomisé + layout dédié | ✅ fait (testé e2e) |
| A4 | Gating RBAC UI (rôle/permissions) | ✅ fait |
| B1 | Dashboard KPI (inscriptions, revenu, paiements, candidatures) | ✅ fait |
| B2 | Listes récentes (inscriptions/paiements) | ✅ fait |
| C1 | Modération speakers | ⬜ pas commencé |
| C2 | Modération ambassadeurs | ⬜ pas commencé |
| C3 | Modération partenaires | ⬜ pas commencé |
| C4 | Modération exposants | ⬜ pas commencé |
| D1 | Gestion fenêtres de campagne (écriture admin) | ⬜ pas commencé |
| D2 | Messages contact | ⬜ pas commencé |
| D3 | Gestion des rôles (matrice permissions) | ⬜ pas commencé |
| E1 | Exports CSV | ⬜ pas commencé |
| E2 | Audit logs (tentatives connexion) | ⬜ pas commencé |
| E3 | Durcissement session (401 global, 429, verrouillage) | ✅ fait |
| F | Qualité & passation (build/lint zéro erreur, tests, docs) | ⬜ pas commencé (build/lint OK en continu, pas de tests ajoutés) |
| Hors roadmap | Espace inscrit (OTP) + inscription publique branchée API | ✅ fait (hors périmètre admin, fait sur demande explicite) |

## TODO
- [x] Vérifier flow inscription (`inscription.tsx`) — bloqué avec erreur "service indisponible"
- [x] Push refactor auth (client.ts, participant.ts, AdminAuthContext) — fait via l'intercepteur 401 (21f2d8d)
- [x] Tester login admin end-to-end sur chemin randomisé
- [x] Phase B2+ : intercepteur 401 global (E3)
- [x] RBAC UI (A4)
- [ ] Phase C1 : modération speakers (prochaine étape logique — cœur du métier, aucun blocage connu)
- [ ] Phase C2 : modération ambassadeurs
- [ ] Phase C3 : modération partenaires
- [ ] Phase C4 : modération exposants
- [ ] Phase D1 : gestion fenêtres de campagne (écriture admin)
- [ ] Phase D2 : messages contact
- [ ] Phase D3 : gestion des rôles

## Journal

### 2026-09-02
- Fait : espace inscrit avec login OTP email (dashboard, garde d'auth) implémenté et testé e2e via curl.
- Fait : login admin sur chemin randomisé ajouté ; module admin complet (AdminAuthContext, AdminLayout, AdminLoginPage, AdminDashboard, AdminRequireAuth).
- Fait : correction reconnexion espace inscrit qui renvoyait au login (race OTP dans AuthContext.tsx).
- Fait : skill `backend-check` créé, docs mises à jour (FRONTEND_INTEGRATION.md, DEPLOYMENT.md, USER_JOURNEYS.md).
- Fait : skill `devlog` créé pour ce suivi.
- Fait : ROADMAP_ADMIN.md Phase B1/B2 — dashboard admin avec KPI (inscriptions, revenu, paiements, candidatures en attente par entité) et tableau des dernières inscriptions, branché sur `GET /api/admin/stats` et `GET /api/admin/registrations` (confirmés par lecture directe du backend, pas de Swagger dispo en session).
- Fait : intercepteur 401 global (registre de handlers dans client.ts, branché sur AuthContext et AdminAuthContext) — remplace le check 401 ad hoc du dashboard admin.
- Fait : diagnostic + fix flow inscription — c'était un stub statique (bannière "indisponible" en dur, submit désactivé, aucun appel API), pas un bug serveur. Branché sur `POST /api/register`, `GET /api/pass-types`, `GET /api/campaign-windows` (fenêtre `ticketing` réelle au lieu d'une date en dur déjà périmée) ; corrigé `PROFILS` (valeur "Freelance" invalide côté back, "Autre" manquant).
- Fait : ajout tableau statut des phases (ROADMAP_ADMIN.md) dans ce journal pour suivi planning.
- Fait : Phase A4 (RBAC UI) — `GET /api/admin/me` ajouté côté back, `AdminAuthContext` charge rôle+permissions après login, `AdminRequireAuth` distingue 401 (redirection login) et 403/permission manquante (message métier) ; dashboard gardé derrière `payments.view`.
- À suivre : Phase C (modération speakers/ambassadors/partners/exhibitors) prochaine étape, aucun blocage connu.
