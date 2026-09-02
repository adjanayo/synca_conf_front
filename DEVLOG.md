# Journal de dev — synca_conf_front

## TODO
- [ ] Vérifier flow inscription (`inscription.tsx`) — bloqué avec erreur "service indisponible"
- [ ] Push refactor auth (client.ts, participant.ts, AdminAuthContext) une fois typecheck/lint clean
- [x] Tester login admin end-to-end sur chemin randomisé
- [ ] Phase B2+ : intercepteur 401 global (E3), RBAC UI (A4, bloqué sans `/api/admin/me` côté back)
- [ ] Phase C : modération speakers/ambassadors/partners/exhibitors

## Journal

### 2026-09-02
- Fait : espace inscrit avec login OTP email (dashboard, garde d'auth) implémenté et testé e2e via curl.
- Fait : login admin sur chemin randomisé ajouté ; module admin complet (AdminAuthContext, AdminLayout, AdminLoginPage, AdminDashboard, AdminRequireAuth).
- Fait : correction reconnexion espace inscrit qui renvoyait au login (race OTP dans AuthContext.tsx).
- Fait : skill `backend-check` créé, docs mises à jour (FRONTEND_INTEGRATION.md, DEPLOYMENT.md, USER_JOURNEYS.md).
- Fait : skill `devlog` créé pour ce suivi.
- Fait : ROADMAP_ADMIN.md Phase B1/B2 — dashboard admin avec KPI (inscriptions, revenu, paiements, candidatures en attente par entité) et tableau des dernières inscriptions, branché sur `GET /api/admin/stats` et `GET /api/admin/registrations` (confirmés par lecture directe du backend, pas de Swagger dispo en session).
- À suivre : diagnostiquer le flow inscription bloqué, finir refactor auth avant push, `/api/admin/me` manquant côté back bloque le RBAC UI (A4).
