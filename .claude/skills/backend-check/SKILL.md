---
name: backend-check
description: Use avant de lancer ou tester le frontend en local (npm run dev, bun dev, "lance le front", "teste en local", "démarre le serveur de dev"). Vérifie que le backend synca_conf_back tourne sur http://127.0.0.1:8010 avant de démarrer Vite, pour éviter des appels API qui échouent silencieusement pendant le dev. Trigger aussi sur "le front n'arrive pas à parler au backend" ou toute erreur réseau/CORS pendant `npm run dev`.
---

# Backend check avant lancement du frontend

Le frontend (`brief-and-style-guide-main/`) appelle une API FastAPI (`synca_conf_back`, repo `/Users/kodjododjango/Downloads/dev_projects/synca_conf_back/`) qui tourne en local via Docker Compose sur `http://127.0.0.1:8010`. Si le backend n'est pas lancé, le dev voit des erreurs réseau confuses (`Failed to fetch`, CORS) au lieu d'un message clair. Ce skill fiabilise le workflow en vérifiant l'état du backend avant de lancer `npm run dev` / `bun dev` côté front.

## Procédure

1. **Poll le health check** :
   ```bash
   curl -sf http://127.0.0.1:8010/health
   ```
   Pas d'auth requise. Réponse attendue : `{"status":"ok"}`. Timeout court (2-3s) — ne pas bloquer longtemps si rien ne répond.

2. **Si le backend répond** : lancer directement la commande de dev frontend demandée (`npm run dev`, `bun dev`, etc.) sans action supplémentaire.

3. **Si le backend ne répond pas** :
   - Informer l'utilisateur que le backend n'est pas up.
   - Proposer de le démarrer avec `make up` dans `synca_conf_back/` (voir `Makefile` du repo — lance `docker compose up -d --build`, imprime l'URL de l'API). Confirmer une fois par session avant de lancer Docker (démarrage de conteneurs = action à faible risque mais visible, à confirmer plutôt qu'à supposer).
   - Après `make up`, ré-attendre que le conteneur soit prêt puis re-poll `/health` (quelques secondes, le hot-reload/healthcheck peut prendre un instant).
   - Si les migrations ne sont pas encore appliquées (erreurs 500 sur les endpoints qui touchent la DB), proposer `make migrate` dans le même repo.
   - Une fois `/health` OK, lancer la commande de dev frontend.

4. **Ne jamais lancer `make down` ou `make nuke`** dans ce flow — ce skill ne fait que démarrer/vérifier, jamais arrêter ou détruire des données backend.

## Notes

- Le port `8010` et l'endpoint `/health` sont spécifiques à ce projet (mapping Docker Compose `8010:8000`, route définie dans `app/main.py` du backend) — ne pas généraliser à un autre port sans vérifier `synca_conf_back/docker-compose.yml`.
- Si `synca_conf_back/.env` n'existe pas encore, `make up` peut échouer — dans ce cas, orienter l'utilisateur vers `cp .env.example .env` dans ce repo avant de réessayer, plutôt que de deviner des valeurs de secrets.
