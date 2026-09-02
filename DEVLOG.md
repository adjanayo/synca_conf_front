# Journal de dev — synca_conf_front

## TODO
- [ ] Vérifier flow inscription (`inscription.tsx`) — bloqué avec erreur "service indisponible"
- [ ] Push refactor auth (client.ts, participant.ts, AdminAuthContext) une fois typecheck/lint clean
- [ ] Tester login admin end-to-end sur chemin randomisé

## Journal

### 2026-09-02
- Fait : espace inscrit avec login OTP email (dashboard, garde d'auth) implémenté et testé e2e via curl.
- Fait : login admin sur chemin randomisé ajouté ; module admin complet (AdminAuthContext, AdminLayout, AdminLoginPage, AdminDashboard, AdminRequireAuth).
- Fait : correction reconnexion espace inscrit qui renvoyait au login (race OTP dans AuthContext.tsx).
- Fait : skill `backend-check` créé, docs mises à jour (FRONTEND_INTEGRATION.md, DEPLOYMENT.md, USER_JOURNEYS.md).
- Fait : skill `devlog` créé pour ce suivi.
- À suivre : diagnostiquer le flow inscription bloqué, finir refactor auth avant push.
