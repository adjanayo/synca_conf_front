# Makefile — usage

Tout tourne dans Docker : **rien à installer sur la machine hôte** (pas de Node/npm local). Le `Makefile` pilote Docker Compose (conteneur `synca-dev-web`).

`make help` liste les cibles disponibles.

```bash
make up          # lancer le conteneur web (hot-reload) sur http://127.0.0.1:5173
make down        # arrêter le conteneur
make restart     # redémarrer
make logs        # logs en temps réel
make shell       # shell sh dans le conteneur
make build       # rebuild l'image Docker sans cache
make lint        # ESLint
make format      # Prettier
make typecheck   # tsc --noEmit
make prod-build  # build de production + pré-rendu SEO -> dist/
```

Nécessite `.env` (voir `.env.example`) avec `VITE_SITE_URL` (domaine de production, pour canonical/OG/sitemap).

Après un changement de dépendances (`package.json`) : `docker compose up -d --build --renew-anon-volumes` (le `node_modules` du conteneur vit dans un volume anonyme).

## Backup

```bash
make backup                               # .env + dist -> backups/front-<horodatage>.tar.gz
make restore FILE=backups/front-xxx.tar.gz
```

## Migration serveur

```bash
make migrate-export                               # archive .env + dist + config Docker
make migrate-import ARCHIVE=backups/migration-xxx.tar.gz
```
