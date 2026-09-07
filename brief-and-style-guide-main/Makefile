.PHONY: help up down restart build logs shell lint format typecheck backup restore migrate-export migrate-import

DOCKER      := docker compose
WEB         := $(DOCKER) exec web
URL         := http://127.0.0.1:5173
BACKUP_DIR  := backups
STAMP       := $(shell date +%Y%m%d-%H%M%S)

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ── Lifecycle ──────────────────────────────────────────────

up: ## Lancer le frontend (hot-reload)
	$(DOCKER) up -d --build
	@echo "\n  ✅ App : $(URL)\n"

down: ## Arrêter le conteneur
	$(DOCKER) down

restart: ## Redémarrer le conteneur
	$(DOCKER) restart

logs: ## Afficher les logs en temps réel (Ctrl+C pour quitter)
	$(DOCKER) logs -f web

shell: ## Shell dans le conteneur web (sh)
	$(WEB) sh

# ── Dev ────────────────────────────────────────────────────

build: ## Rebuild l'image Docker sans cache
	$(DOCKER) build --no-cache

lint: ## Lancer ESLint
	$(WEB) npm run lint

format: ## Formatter avec Prettier
	$(WEB) npm run format

typecheck: ## Vérifier les types TypeScript
	$(WEB) npx tsc --noEmit

# ── Backup & migration ────────────────────────────────────
# Pas de base de données côté frontend : ce qui compte est .env
# (config non versionnée) et le build de production (dist/).

backup: ## Sauvegarder .env + build de prod dans backups/ (horodaté)
	@mkdir -p $(BACKUP_DIR)
	@npm run build --silent
	@tar -czf $(BACKUP_DIR)/front-$(STAMP).tar.gz .env dist
	@echo "\n  ✅ Backup : $(BACKUP_DIR)/front-$(STAMP).tar.gz\n"

restore: ## Restaurer .env + dist depuis une sauvegarde (usage: make restore FILE=backups/xxx.tar.gz)
	@test -n "$(FILE)" || (echo "Usage: make restore FILE=backups/xxx.tar.gz" && exit 1)
	tar -xzf $(FILE)
	@echo "\n  ✅ Restauré depuis $(FILE)\n"

migrate-export: backup ## Préparer une archive de migration (.env + dist + config Docker) vers backups/
	@tar -czf $(BACKUP_DIR)/migration-$(STAMP).tar.gz .env dist docker-compose.yml Dockerfile.dev package.json package-lock.json
	@echo "\n  ✅ Archive de migration : $(BACKUP_DIR)/migration-$(STAMP).tar.gz"
	@echo "     Copier ce fichier sur le nouveau serveur puis lancer 'make migrate-import ARCHIVE=...'\n"

migrate-import: ## Importer une archive de migration sur le nouveau serveur (usage: make migrate-import ARCHIVE=backups/migration-xxx.tar.gz)
	@test -n "$(ARCHIVE)" || (echo "Usage: make migrate-import ARCHIVE=backups/migration-xxx.tar.gz" && exit 1)
	tar -xzf $(ARCHIVE)
	$(MAKE) up
	@echo "\n  ✅ Import terminé depuis $(ARCHIVE)\n"
