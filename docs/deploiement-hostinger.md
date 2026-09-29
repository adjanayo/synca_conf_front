# Déploiement automatique vers Hostinger (GitHub Actions)

Le site est **100 % statique** (React 19 + Vite, tout le contenu dans
`brief-and-style-guide-main/src/data/`) : il n'y a **aucun serveur
applicatif** à faire tourner chez l'hébergeur. Déployer = construire le site
puis copier le dossier `dist/` dans `public_html`.

C'est fait par `.github/workflows/deploy-hostinger.yml` : un **push sur
`main`** déclenche build + mise en ligne. Push sur `dev-boaz` = rien ne part
en prod (c'est le comportement voulu : `dev-boaz` est la branche de travail).

---

## 1. Pourquoi GitHub Actions plutôt que le Git de hPanel

hPanel propose deux intégrations Git, aucune ne convient ici :

| Intégration hPanel | Pourquoi elle ne suffit pas |
|---|---|
| **Advanced → Git** | Ne lance **aucun build** : elle sert les fichiers du dépôt tels quels, donc le code source `src/`, pas le site. |
| **Node.js web app** | Fait bien le build, mais le pré-rendu (Chromium/Puppeteer) n'y est pas disponible, et `public_html` est réécrit intégralement à chaque déploiement — pas de contrôle sur le `.htaccess` ni sur ce qui est supprimé. |

GitHub Actions permet de construire avec **exactement la même image Docker que
le dev local** (`make prod-build`), donc le site en ligne est le site que le
projet produit chez lui, pré-rendu compris.

---

## 2. Configuration Hostinger (une fois)

### 2.1 Domaine et dossier web

1. hPanel → **Websites** → le domaine du site.
2. Vérifier que le domaine pointe bien vers Hostinger (DNS).
3. SSL → **Activer le SSL gratuit** (Let's Encrypt) et forcer HTTPS.

### 2.2 Accès SSH/SFTP (indispensable)

Le workflow se connecte en **SFTP**, pas en FTP.

> **Plan requis :** SFTP/SSH existe à partir de **Premium**. Sur un plan
> inférieur (Single / Web Start), il n'y a pas d'accès SSH : il faudra
> upgrader le plan, ou deploying manuellement en FTP (voir §7).

1. hPanel → **Advanced → SSH Access** → activer SSH Access.
2. **Ajouter une clé SSH** dédiée au déploiement (voir §2.3).
3. Noter trois valeurs, elles iront dans GitHub :
   - **SSH host** : l'IP FTP affichée (ex. `185.185.185.185`) — préférer l'IP
     au domaine, ça évite tout souci DNS/validation de certificat.
   - **SSH port** : `65002` (shared/Cloud ; `22` sur VPS).
   - **Dossier** : `public_html` pour le domaine principal. Pour un
     sous-domaine ou un multisite, ce sera typiquement
     `~/domains/<sous-domaine>/public_html`.

### 2.3 Créer la clé SSH du déploiement

Une clé **dédiée à la CI**, distincte de toute clé personnelle. Sur le poste :

```bash
ssh-keygen -t ed25519 -C "github-actions synca-conf" -f ~/.ssh/synca_hostinger -N ""
```

- `~/.ssh/synca_hostinger.pub` → à copier dans hPanel → SSH Access → **Add SSH key**.
- `~/.ssh/synca_hostinger` (la clé privée) → va dans les secrets GitHub (§3).
  **Ne jamais la committer, ni la mettre ailleurs que dans les secrets.**

---

## 3. Variables et secrets GitHub

Dans le dépôt GitHub → **Settings → Secrets and variables → Actions**.

### Variables (onglet *Variables*) — valeurs publiques, visibles

| Variable | Valeur | Exemple |
|---|---|---|
| `VITE_SITE_URL` | Domaine de prod, **sans slash final** | `https://syncaconf.com` |
| `HOSTINGER_HOST` | IP FTP | `185.185.185.185` |
| `HOSTINGER_SSH_PORT` | Port SSH | `65002` |
| `HOSTINGER_REMOTE_DIR` | Dossier cible | `public_html` |

`VITE_SITE_URL` alimente le `canonical`, l'Open Graph, `robots.txt` et le
sitemap **au moment du build**. C'est une valeur publique (elle finit dans le
HTML servi à tout visiteur) : une *variable* GitHub suffit, un secret serait
mal adapté.

> Le workflow **refuse de builder** si `VITE_SITE_URL` est absent ou encore
> égal au placeholder `TODO-DOMAINE-PRODUCTION-A-DEFINIR.example` — mettre le
> site en ligne avec un canonical cassé serait pire que de ne rien déployer.

### Secrets (onglet *Secrets*) — confidentiels, chiffrés

| Secret | Valeur |
|---|---|
| `HOSTINGER_SSH_KEY` | Contenu complet de la clé privée, **avec les lignes `BEGIN`/`END`** |
| `HOSTINGER_SSH_USER` | L'utilisateur SSH/FTP hPanel (ex. `u123456789`) |

Pour la clé privée, dans le champ de saisie du secret :

```bash
cat ~/.ssh/synca_hostinger
```

et coller **tout** le contenu (les 3 lignes `-----BEGIN OPENSSH PRIVATE KEY-----`,
le corps `base64`, et `-----END OPENSSH PRIVATE KEY-----`).

---

## 4. Lancer un déploiement

### Automatique

```bash
git checkout main
git merge dev-boaz --ff-only
git push origin main
```

Le push sur `main` déclenche le build et la mise en ligne.

### Manuel (test, reprise)

- **GitHub → onglet Actions → *Deploy Hostinger* → *Run workflow*** : relance
  le déploiement de la branche choisie, utile pour rejouer un build sans
  nouveau commit.
- Ou en local :

```bash
gh workflow run deploy-hostinger.yml
```

### Ce que fait le workflow

1. **Vérifie la configuration** (refuse le placeholder de domaine).
2. **Construit l'image Docker** du projet (`Dockerfile.dev`).
3. **Build + pré-rendu** : `npm run build` → SEO files puis 11 pages
   pré-rendues, dans le conteneur.
4. **Contrôle l'artefact** : vérifie la présence de `index.html`,
   `robots.txt`, `sitemap.xml`, `.htaccess`.
5. **Déploie en SFTP** : `rsync --delete` de `dist/` vers `public_html`.
6. **Vérifie le site en ligne** : 200 attendu sur 7 pages, **404 attendu** sur
   une URL inexistante. Le job échoue si ce n'est pas le cas.

### Rollback

Chaque déploiement est un commit Git. Pour revenir en arrière :

```bash
git revert <sha-du-commit-déploiement>   # sur dev-boaz
git checkout main && git merge dev-boaz --ff-only && git push origin main
```

---

## 5. Ce qui est déployé, et comment le serveur le sert

Le build produit des **fichiers `.html` plats** (`dist/programme.html`, et non
un dossier `dist/programme/index.html`). Ce n'est pas un détail : avec un
dossier, `mod_dir` (Apache/LiteSpeed) répond par un **301 vers `/programme/`**
avant que `mod_rewrite` ne puisse l'intercepter — donc une redirection par
page, et un `<link rel="canonical">` qui pointe vers une URL qui redirige.
En fichier plat, l'URL canonique est servie directement en 200.

Le routage est fait par `brief-and-style-guide-main/public/.htaccess`, versionné
dans le dépôt et copié dans `dist/` par Vite. **Il ne faut pas le créer à la
main dans hPanel** : le `rsync --delete` le remplacerait au prochain
déploiement. Toute modification se fait dans le fichier du dépôt.

> ⚠️ `public_html` ne doit contenir **que** ce site. Le `rsync --delete`
> supprime tout ce qui s'y trouve et qui ne fait pas partie du build.

### Testé sur un vrai serveur

Le `.htaccess` a été validé sur Apache 2.4 (moteur compatible LiteSpeed) avec
le build réel :

| URL | Réponse | Attendu |
|---|---|---|
| `/`, `/programme`, `/faq`, `/contact`, `/exposants`… | 200 | ✅ |
| `/programme/` (avec slash) | 200 | ✅ |
| `/speakers/christian-kpolo` | 200 | ✅ |
| `/robots.txt`, `/sitemap.xml` | 200 | ✅ |
| `/page-inexistante-xyz` | 404 | ✅ (pas de 200 sur du vide) |
| `/assets/<fichier>.js` présent | 200 | ✅ |
| `/assets/ABSENT.js` | 404 | ✅ (jamais du HTML à la place) |

**Limite connue :** `/speakers` et `/partenaires` répondent en **301** vers la
version avec slash. Ces deux chemins sont aussi de vrais dossiers (les photos
de speakers et les logos des partenaires y sont stockés dans `public/`), et le
serveur les traite comme tels avant toute règle de réécriture. Les pages
s'affichent correctement, seul le 301 subsiste. Le supprimer demanderait de
déplacer les images vers `public/media/` et de mettre à jour
`src/data/speaker.ts` et `src/data/sponsor.ts` — du contenu validé, à faire
valider avant.

---

## 6. Cache et en-têtes

Posés par le `.htaccess` :

- **`/assets/*`** (noms hashés par Vite) → `max-age=1 an, immutable`. Un
  redéploiement change le nom du fichier, donc le navigateur prend
  automatiquement la nouvelle version, sans purge.
- **Images de `public/`** (non hashées) → 7 jours, pour qu'un visuel
  remplacé apparaisse sans intervention.
- **HTML** → `max-age=0, must-revalidate` : le contenu est toujours à jour.
- En-têtes de sécurité : `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy`. Pas de CSP stricte — le site
  n'embarque aucun script tiers, et une règle trop stricte casserait le rendu
  sans qu'on le voie.

---

## 7. Déploiement manuel (si pas d'accès SSH)

Sans SSH (plan sans SFTP), le build se fait en local et l'envoi se fait en FTP
ou par le File Manager de hPanel :

```bash
cd brief-and-style-guide-main
make prod-build            # build + pré-rendu dans le conteneur
```

Puis envoyer le **contenu** de `dist/` (pas le dossier lui-même) dans
`public_html` via FileZilla (protocole FTP, port 21) ou le File Manager
hPanel. Le `.htaccess` est dans `dist/` : s'il est masqué dans le File
Manager, activer **"Show hidden files"** dans ses réglages.

> Cette voie ne met **pas** à jour `VITE_SITE_URL` : le placeholder
> `TODO-DOMAINE-PRODUCTION-A-DEFINIR.example` de `.env.production` serait
> compilé. Passer la vraie valeur avant de builder, ou définir la variable
> d'environnement `VITE_SITE_URL` dans le conteneur.

---

## 8. Variables d'environnement

`VITE_SITE_URL` est lue dans cet ordre par `scripts/generate-seo-files.mjs` :

1. la variable d'environnement du build (ce qu'injecte le workflow) ;
2. `.env.production` (committé, valeur publique) ;
3. `.env` local (non committé, surcharge le dev).

Pour que le build **local** (`make prod-build`) produise le bon site, il faut
que `.env` contienne le vrai domaine — ou passer la variable au conteneur.
