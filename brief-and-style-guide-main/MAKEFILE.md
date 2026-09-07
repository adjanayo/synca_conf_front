# Makefile — usage

Deux Makefile dans le projet synca-conf : un côté backend (`synca_conf_back/Makefile`), un côté frontend (ce dossier, `synca_conf_front/brief-and-style-guide-main/Makefile`). Tous deux pilotent Docker Compose et couvrent lifecycle, backup et migration serveur.

`make help` dans chaque dossier liste les cibles disponibles.

## Frontend (`brief-and-style-guide-main/`)

```bash
make up          # lancer le conteneur web (hot-reload) sur http://127.0.0.1:5173
make down        # arrêter le conteneur
make restart      # redémarrer
make logs         # logs en temps réel
make shell        # shell sh dans le conteneur
make build        # rebuild l'image Docker sans cache
make lint         # ESLint
make format       # Prettier
make typecheck    # tsc --noEmit
```

Nécessite `.env` (voir `.env.example`) avec `VITE_API_URL` pointant vers le backend.

## Backend (`synca_conf_back/`)

```bash
make up            # lancer app + db (hot-reload) sur http://127.0.0.1:8010
make down          # arrêter les conteneurs (données conservées)
make nuke          # arrêter ET supprimer le volume MySQL (reset total)
make migrate       # appliquer les migrations Alembic
make create-admin  # créer un compte superadmin
make db-shell      # shell MySQL sur syncaconf
make logs          # logs en temps réel
```

## Backup

### Backend — dump MySQL

```bash
make backup
# -> backups/syncaconf-<horodatage>.sql
```

Restaurer :

```bash
make restore FILE=backups/syncaconf-20260907-070500.sql
```

### Frontend — `.env` + build de prod

Le frontend n'a pas de base de données ; ce qu'il faut sauvegarder est la config non versionnée (`.env`) et, si besoin, le build de production (`dist/`).

```bash
make backup
# -> backups/front-<horodatage>.tar.gz (contient .env + dist/)
```

Restaurer :

```bash
make restore FILE=backups/front-20260907-070500.tar.gz
```

Les deux Makefile ignorent `backups/` dans `.gitignore` — les dumps et archives ne sont jamais commités.

## Migration serveur (backend → nouveau serveur, frontend → nouveau serveur)

Objectif : déplacer le déploiement d'une machine à une autre sans perdre de données ni de config.

### 1. Backend

Sur l'ancien serveur :

```bash
cd synca_conf_back
make migrate-export
# -> backups/migration-<horodatage>.tar.gz (dump SQL + .env)
```

Copier l'archive sur le nouveau serveur (`scp`, `rsync`, etc.), puis :

```bash
cd synca_conf_back
make migrate-import ARCHIVE=migration-20260907-070500.tar.gz
```

Cette cible restaure `.env`, démarre les conteneurs, applique les migrations Alembic, puis réimporte le dump SQL par-dessus (la source de vérité reste le dump, Alembic sert à s'assurer que le schéma cible existe avant l'import).

### 2. Frontend

Sur l'ancien serveur :

```bash
cd synca_conf_front/brief-and-style-guide-main
make migrate-export
# -> backups/migration-<horodatage>.tar.gz (.env + dist/ + config Docker)
```

Copier l'archive sur le nouveau serveur, puis :

```bash
cd synca_conf_front/brief-and-style-guide-main
make migrate-import ARCHIVE=migration-20260907-070500.tar.gz
```

### Ordre recommandé

1. Migrer le backend en premier (l'API doit répondre avant que le frontend ne pointe dessus).
2. Vérifier `make health` (backend) sur le nouveau serveur.
3. Mettre à jour `VITE_API_URL` dans le `.env` frontend si l'adresse du backend a changé, avant `make migrate-export` côté frontend (ou après restauration, avant `make up`).
4. Migrer le frontend.
