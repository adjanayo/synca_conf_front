# Guide d'intégration Frontend — SYNCA CONF 2027 API

> État au 26/08/2026 : Phases 0-8 du `ROADMAP.md` terminées. Tous les endpoints publics (lecture + formulaires d'écriture) et le backoffice admin sont opérationnels. Les seules choses pas encore live : paiement/billetterie Phase 5 (webhooks Stripe/Wave/Orange Money) et la doc Phase 9.

---

## 1. Lancer le backend avec Docker

Prérequis : Docker + Docker Compose + Make.

```bash
git clone <url-du-repo>
cd synca_conf_back
cp .env.example .env
make up        # lance les conteneurs + hot-reload
make migrate   # applique les migrations (tables + seed)
```

> Le repo inclut un **Makefile** avec toutes les commandes utiles. Tapez `make help` pour les voir toutes.

Commandes Make les plus courantes :

| Commande | Rôle |
|---|---|
| `make up` | Lancer `docker compose up -d --build` |
| `make down` | Arrêter les conteneurs (données conservées) |
| `make nuke` | Arrêter + supprimer le volume MySQL (reset total) |
| `make migrate` | Appliquer les migrations Alembic |
| `make create-admin` | Créer un compte superadmin |
| `make health` | Vérifier que l'API répond |
| `make swagger` | Ouvrir Swagger dans le navigateur |
| `make logs` | Logs en temps réel |
| `make build` | Rebuild l'image sans cache |
| `make shell` | Shell bash dans le conteneur app |
| `make db-shell` | Shell MySQL sur la base syncaconf |
| `make login` | Retourne un token admin (JSON) |

Ça démarre 2 conteneurs : `app` (FastAPI, hot-reload activé) et `db` (MySQL 8.4). Le port hôte de l'API dans `docker-compose.yml` est **8010** (changez `"8010:8000"` dans `docker-compose.yml` si besoin).

Vérifier que tout tourne :

```bash
make health
# { "status": "ok" }
```

Documentation interactive (Swagger) tant que `ENVIRONMENT=local` (valeur par défaut de `.env.example`) :

```bash
make swagger
# ou directement : http://127.0.0.1:8010/docs
```

Arrêter :

```bash
make down       # garde les données
make nuke       # supprime aussi le volume MySQL (repart de zéro)
```

---

## 2. CORS — connecter votre app frontend

Le backend autorise par défaut `http://localhost:3000` (Next.js) et `http://localhost:5173` (Vite). Si votre dev server tourne sur un autre port, ajoutez-le dans `.env` :

```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:4200
```

Puis redémarrez : `docker compose up -d --build`. Pas de wildcard `*` — seules les origines listées explicitement sont autorisées.

---

## 3. S'authentifier (espace admin)

Il n'y a pas encore de compte admin en base après un `alembic upgrade head` frais — seuls les rôles/permissions sont seedés, pas de compte utilisateur. Pour créer un premier compte `superadmin` en local :

```bash
make create-admin
```

Puis obtenir un token :

```bash
make login
```

Réponse :

```json
{"access_token": "...", "refresh_token": "...", "token_type": "bearer"}
```

Utiliser `access_token` en header `Authorization: Bearer <token>` sur les routes protégées (ex. `PATCH /api/admin/roles/:id`). Expire après 15 min (`ACCESS_TOKEN_EXPIRE_MINUTES` dans `.env`).

5 échecs de connexion consécutifs verrouillent le compte 15 min (doublement à chaque échec suivant, plafonné à 4h).

#### `POST /api/admin/refresh`

Échange le `refresh_token` (longue durée, `REFRESH_TOKEN_EXPIRE_DAYS` dans `.env`) contre une nouvelle paire — évite de renvoyer l'admin au login à chaque expiration de l'`access_token`.

```json
{ "refresh_token": "..." }
```

**Réponse `200`** : même forme que le login (`access_token`/`refresh_token`/`token_type`). **Rotation à chaque appel** — l'ancien `refresh_token` n'est plus valide une fois échangé, toujours stocker la nouvelle paire renvoyée. **`401`** si le jeton est invalide, expiré, du mauvais type (ex. un `access_token` envoyé par erreur), ou si le compte n'est plus actif.

---

## 4. Endpoints publics — lecture (GET, pas d'auth)

### 4.1 `GET /health`

Pas d'auth. Réponse :

```json
{"status": "ok"}
```

### 4.2 `GET /api/days`

Jours de la conférence, triés par date.

**Paramètres** : aucun.

**Réponse** `200` — tableau :

```json
[
  {
    "id": 1,
    "date": "2027-03-15",
    "label": "Jour 1 — Opening & Keynotes",
    "created_at": "2026-08-01T10:00:00"
  }
]
```

### 4.3 `GET /api/sessions`

Programme, filtrable. Ne renvoie jamais une session non publique (`is_public=false` filtré côté serveur).

**Paramètres query** (optionnels) :
| Param | Type | Description |
|---|---|---|
| `day` | `int` | ID du jour (`day_id`) |
| `category` | `string` | Catégorie de la session |
| `limit` | `int` | Défaut `50`, max `200` |
| `offset` | `int` | Défaut `0` |

**Réponse** `200` — tableau :

```json
[
  {
    "id": 1,
    "day_id": 1,
    "title": "Keynote ouverture : L'IA au service de l'éducation",
    "description": "Comment l'intelligence artificielle transforme...",
    "category": "IA",
    "start_time": "09:00:00",
    "end_time": "10:00:00",
    "room": "Hall principal",
    "speaker_id": 3,
    "is_public": true,
    "created_at": "2026-08-01T10:00:00"
  }
]
```

### 4.4 `GET /api/pass-types`

Types de billets actifs uniquement.

**Paramètres** : aucun.

**Réponse** `200` — tableau :

```json
[
  {
    "id": 1,
    "name": "Pass 1 jour",
    "price": 15000,
    "description": "Accès à une journée au choix",
    "max_days": 1,
    "is_active": true,
    "created_at": "2026-08-01T10:00:00",
    "contents": [
      { "id": 1, "label": "Badge nominatif", "created_at": "2026-08-01T10:00:00" },
      { "id": 2, "label": "Déjeuner inclus", "created_at": "2026-08-01T10:00:00" }
    ]
  }
]
```

> `price` est un `int` en **francs CFA (FCFA)**, sans décimales. Les inclusions (`contents`) sont un catalogue coché au dashboard (`PassContent`), pas du texte libre — un pass sans contenu coché renvoie `contents: []`.

### 4.5 `GET /api/speakers`

Speakers acceptés et publiés uniquement (`is_public=true` filtré côté serveur).

**Paramètres query** (optionnels) :
| Param | Type | Valeurs possibles |
|---|---|---|
| `theme` | `string` | `IA`, `EdTech`, `Entrepreneuriat`, `Carrières`, `Impact`, `Cybersec` |
| `format` | `string` | `Keynote`, `Panel`, `Workshop`, `Lightning Talk`, `Fireside Chat` |
| `limit` | `int` | Défaut `50`, max `200` |
| `offset` | `int` | Défaut `0` |

**Réponse** `200` — tableau :

```json
[
  {
    "id": 3,
    "first_name": "Aminata",
    "last_name": "Diallo",
    "title_role": "CTO",
    "company": "Synca Tech",
    "country": "Côte d'Ivoire",
    "linkedin_url": "https://linkedin.com/in/aminata-diallo",
    "website_url": null,
    "photo_url": "https://b2-cdn.example.com/speakers/abc123.jpg",
    "intervention_format": "Keynote",
    "intervention_title": "L'IA au service de l'éducation",
    "theme": "IA",
    "summary": "Aminata partage son expérience...",
    "audience_level": "Tous",
    "language": "Français"
  }
]
```

> Sous-ensemble sans PII (`SpeakerPublicRead` côté back) : ni `email`, `phone_whatsapp`, `motivation`, `gdpr_consent`, `status` ni les autres champs internes de candidature — uniquement ce qui précède.

### 4.6 `GET /api/partners`

Partenaires confirmés et publiés uniquement (`is_public=true` filtré côté serveur).

**Paramètres query** (optionnels) :
| Param | Type | Description |
|---|---|---|
| `level` | `int` | ID du palier de partenariat (`level_id`) |
| `limit` | `int` | Défaut `50`, max `200` |
| `offset` | `int` | Défaut `0` |

**Réponse** `200` — tableau :

```json
[
  {
    "id": 1,
    "organization_name": "Orange CI",
    "website_url": "https://orange.ci",
    "logo_url": "https://b2-cdn.example.com/logos/orange.png",
    "level_id": 1
  }
]
```

> Sous-ensemble sans PII (`PartnerPublicRead` côté back) : ni `sector`/`country`/`city`, ni les champs de contact (`contact_name`/`contact_email`/`contact_phone`/...), ni `status`/`gdpr_consent` — uniquement ce qui précède.

### 4.7 `GET /api/partner-levels`

Paliers de partenariat (les `level_id` référencés par `/api/partners` et le formulaire de candidature).

**Paramètres** : aucun.

**Réponse** `200` — tableau :

```json
[
  {
    "id": 1,
    "name": "Gold",
    "price": 500000,
    "sort_order": 1,
    "created_at": "2026-08-01T10:00:00",
    "benefits": [
      { "id": 1, "label": "Logo sur le site", "created_at": "2026-08-01T10:00:00" },
      { "id": 2, "label": "Stand exposition", "created_at": "2026-08-01T10:00:00" }
    ]
  }
]
```

> Les avantages (`benefits`) sont un catalogue coché au dashboard (`PartnerBenefit`), pas du texte libre.

### 4.8 `GET /api/faq-categories`

Catégories de FAQ, triées par `id`.

**Paramètres** : aucun.

**Réponse** `200` — tableau :

```json
[
  { "id": 1, "name": "Billetterie" }
]
```

### 4.9 `GET /api/exhibitors`

Exposants confirmés et publiés uniquement (`is_public=true` filtré côté serveur).

**Paramètres query** (optionnels) :
| Param | Type | Description |
|---|---|---|
| `limit` | `int` | Défaut `50`, max `200` |
| `offset` | `int` | Défaut `0` |

**Réponse** `200` — tableau :

```json
[
  {
    "id": 1,
    "organization_name": "TechCorp Africa",
    "website_url": "https://techcorp.africa",
    "stand_type": "Premium"
  }
]
```

> Sous-ensemble sans PII (`ExhibitorPublicRead` côté back) : ni `sector`/`country`/`city`, ni les champs de contact, ni `reps_count`/`status`/`gdpr_consent`/... — uniquement ce qui précède.

### 4.10 `GET /api/faqs`

FAQ, triée par `sort_order`.

**Paramètres query** (optionnels) :
| Param | Type | Description |
|---|---|---|
| `category` | `int` | ID de la catégorie FAQ |
| `limit` | `int` | Défaut `50`, max `200` |
| `offset` | `int` | Défaut `0` |

**Réponse** `200` — tableau :

```json
[
  {
    "id": 1,
    "category_id": 1,
    "question": "Comment s'inscrire ?",
    "answer": "Rendez-vous sur la page Billetterie...",
    "sort_order": 1,
    "created_at": "2026-08-01T10:00:00"
  }
]
```

### 4.11 `GET /api/campaign-windows`

Dates d'ouverture/fermeture de chaque étape (billetterie, call for speaker, etc.). Utile pour un **compte à rebours** frontend ou pour activer/désactiver des formulaires côté client.

**Paramètres** : aucun.

**Réponse** `200` — tableau :

```json
[
  {
    "id": 1,
    "key": "ticketing",
    "start_at": "2026-09-01T00:00:00",
    "end_at": "2027-03-14T23:59:59",
    "is_active": true,
    "created_at": "2026-08-01T10:00:00",
    "updated_at": "2026-08-01T10:00:00"
  },
  {
    "id": 2,
    "key": "call_for_speaker",
    "start_at": "2026-08-01T00:00:00",
    "end_at": "2026-11-30T23:59:59",
    "is_active": true,
    "created_at": "2026-08-01T10:00:00",
    "updated_at": "2026-08-01T10:00:00"
  }
]
```

> Les `key` possibles : `call_for_speaker`, `ticketing`, `call_for_partner`, `call_for_ambassador`, `call_for_exhibitor`, `event`, `hackathon_universitaire`, `call_for_community_certified`.

### 4.12 `GET /api/hackathon-teams`

Équipes du hackathon universitaire, avec leurs membres imbriqués. Ne renvoie que les équipes visibles publiquement (`is_public=true` filtré côté serveur — l'admin peut masquer une équipe sans la supprimer).

**Paramètres query** (optionnels) :
| Param | Type | Description |
|---|---|---|
| `limit` | `int` | Défaut `50`, max `200` |
| `offset` | `int` | Défaut `0` |

**Réponse** `200` — tableau :

```json
[
  {
    "id": 1,
    "university_name": "UCAD",
    "name": "Team Alpha",
    "project_name": "AgriSense",
    "project_description": "Capteurs IoT pour agriculture de précision.",
    "created_at": "2026-08-01T10:00:00",
    "members": [
      {
        "id": 1,
        "team_id": 1,
        "full_name": "Awa Diop",
        "study_level": "Licence 3",
        "specialty": "Informatique",
        "photo_url": "https://b2-cdn.example.com/hackathon/abc123.jpg",
        "created_at": "2026-08-01T10:00:00"
      }
    ]
  }
]
```

> Les membres sont saisis directement au dashboard admin (pas liés aux inscrits/billetterie — deux populations volontairement distinctes).

---

## 5. Endpoints publics — formulaires (POST, pas d'auth)

Tous les formulaires sont soumis en `Content-Type: application/json` sauf `speakers/apply` et `partners/apply` qui exigent `multipart/form-data` (upload de fichier).

### 5.1 `POST /api/waitlist`

Liste d'attente. Toujours ouvert (pas de fenêtre de campagne).

**Content-Type** : `application/json`

**Body** :
```json
{
  "email": "utilisateur@example.com"
}
```

| Champ | Type | Obligatoire | Contrainte |
|---|---|---|---|
| `email` | `string` | oui | email valide |

**Réponse** `201` :
```json
{
  "id": 1,
  "email": "utilisateur@example.com",
  "notified": false,
  "registered": false,
  "created_at": "2026-08-26T14:30:00"
}
```

**Erreurs** :
- `409` — email déjà inscrit : `{"detail": "Cet email est déjà inscrit à la liste d'attente."}`
- `429` — rate limit dépassé (3/min par IP)

### 5.2 `POST /api/register`

Inscription participant. Gardé par la fenêtre `ticketing` (403 si fenêtre fermée).

**Content-Type** : `application/json`

**Body** :
```json
{
  "first_name": "Jean",
  "last_name": "Koné",
  "gender": "Homme",
  "email": "jean.kone@example.com",
  "phone_whatsapp": "+2250707070707",
  "country": "Côte d'Ivoire",
  "city": "Abidjan",
  "profiles": ["Étudiant"],
  "sector": "Dev",
  "experience_level": "Junior",
  "pass_type_id": 1,
  "promo_code": "AMB-KONE-A1B2",
  "linkedin_url": "https://linkedin.com/in/jean-kone",
  "portfolio_url": null,
  "special_needs": null,
  "heard_from": "Instagram",
  "gdpr_consent": true,
  "newsletter_consent": false
}
```

| Champ | Type | Obligatoire | Contrainte |
|---|---|---|---|
| `first_name` | `string` | oui | 1-100 car. |
| `last_name` | `string` | oui | 1-100 car. |
| `gender` | `string` | non | `Homme`, `Femme`, `Autre` |
| `email` | `string` | oui | email valide |
| `phone_whatsapp` | `string` | oui | 1-20 car. |
| `country` | `string` | oui | 1-100 car. |
| `city` | `string` | oui | 1-100 car. |
| `profiles` | `string[]` | oui | **min 1 élément**. Valeurs : `Étudiant`, `Professionnel`, `Entrepreneur`, `Recruteur`, `Autre` |
| `sector` | `string` | non | `Dev`, `Data`, `Design`, `Cybersec`, `Product`, `IA`, `Autre` |
| `experience_level` | `string` | non | `Débutant`, `Junior`, `Senior`, `Expert` |
| `pass_type_id` | `int` | oui | ID d'un pass actif (voir `GET /api/pass-types`) |
| `promo_code` | `string` | non | Code promo valide |
| `linkedin_url` | `string` | non | URL |
| `portfolio_url` | `string` | non | URL |
| `special_needs` | `string` | non | |
| `heard_from` | `string` | non | max 100 car. |
| `gdpr_consent` | `bool` | oui | **doit être `true`** |
| `newsletter_consent` | `bool` | non | défaut `false` |

**Réponse** `201` :
```json
{
  "id": 1,
  "first_name": "Jean",
  "last_name": "Koné",
  "gender": "Homme",
  "email": "jean.kone@example.com",
  "email_verified": false,
  "phone_whatsapp": "+2250707070707",
  "country": "Côte d'Ivoire",
  "city": "Abidjan",
  "sector": "Dev",
  "experience_level": "Junior",
  "linkedin_url": "https://linkedin.com/in/jean-kone",
  "portfolio_url": null,
  "special_needs": null,
  "heard_from": "Instagram",
  "gdpr_consent": true,
  "newsletter_consent": false,
  "created_at": "2026-08-26T14:30:00",
  "updated_at": "2026-08-26T14:30:00",
  "access_token": "xK9mN2pL..."
}
```

> **Important** : `access_token` n'est retourné qu'**une seule fois**, à l'inscription. Il sert au participant pour gérer ses données RGPD (`GET/DELETE /api/user/me`). À vous de le stocker côté frontend et de l'afficher à l'utilisateur.

**Erreurs** :
- `400` — pass_type_id invalide : `{"detail": "Ce type de billet n'est pas valide."}`
- `400` — promo code invalide : `{"detail": "Ce code promo n'est pas valide."}`
- `400` — gdpr_consent=false : `{"detail": "Le consentement RGPD est obligatoire."}`
- `409` — email déjà inscrit : `{"detail": "Cet email est déjà inscrit."}`
- `403` — fenêtre ticketing fermée : `{"detail": "La fenêtre d'inscription n'est pas ouverte."}`
- `429` — rate limit dépassé (3/min par IP)

### 5.3 `POST /api/speakers/apply`

Candidature speaker. Gardé par la fenêtre `call_for_speaker`. **Upload photo obligatoire.**

**Content-Type** : `multipart/form-data` (pas JSON)

**Champs du formulaire** :

| Champ | Type | Obligatoire | Contrainte |
|---|---|---|---|
| `photo` | fichier | oui | Image réelle (MIME vérifié par Pillow), max 5 Mo |
| `first_name` | `string` | oui | 1-100 car. |
| `last_name` | `string` | oui | 1-100 car. |
| `title_role` | `string` | oui | 1-200 car. |
| `company` | `string` | non | max 200 car. |
| `country` | `string` | oui | 1-100 car. |
| `email` | `string` | oui | email valide |
| `phone_whatsapp` | `string` | oui | 1-20 car. |
| `linkedin_url` | `string` | non | URL |
| `website_url` | `string` | non | URL |
| `intervention_format` | `string` | oui | `Keynote`, `Panel`, `Workshop`, `Lightning Talk`, `Fireside Chat` |
| `intervention_title` | `string` | oui | 1-100 car. |
| `theme` | `string` | oui | `IA`, `EdTech`, `Entrepreneuriat`, `Carrières`, `Impact`, `Cybersec` |
| `summary` | `string` | oui | min 1 car. |
| `audience_level` | `string` | non | `Débutant`, `Intermédiaire`, `Avancé`, `Tous` |
| `language` | `string` | non | `Français`, `Anglais`, `Bilingue`, `Autre` |
| `past_experience` | `string` | non | |
| `video_link` | `string` | non | URL |
| `availability` | `string` | non | `Oui confirmé`, `Sous réserve`, `Besoin aide déplacement` |
| `departure_city` | `string` | non | max 100 car. |
| `needs_accommodation` | `bool` | non | défaut `false` |
| `motivation` | `string` | oui | min 1 car. |
| `video_consent` | `string` | non | `Oui sans restriction`, `Oui avec validation`, `Non` |
| `gdpr_consent` | `bool` | oui | **doit être `true`** |

**Exemple fetch (JavaScript)** :
```javascript
const form = new FormData();
form.append('photo', fileInput.files[0]);
form.append('first_name', 'Aminata');
form.append('last_name', 'Diallo');
// ... autres champs ...
form.append('gdpr_consent', 'true');

const res = await fetch('http://127.0.0.1:8010/api/speakers/apply', {
  method: 'POST',
  body: form,
  // Ne PAS设置 Content-Type — le navigateur le fait automatiquement avec le bon boundary
});
```

**Réponse** `201` : schéma `SpeakerRead` (même forme que `GET /api/speakers`, voir §4.5).

**Erreurs** :
- `400` — fichier non image ou trop lourd : `{"detail": "Le fichier n'est pas une image valide."}`
- `400` — gdpr_consent=false
- `403` — fenêtre call_for_speaker fermée
- `429` — rate limit dépassé (3/min par IP)

### 5.4 `POST /api/ambassadors/apply`

Candidature ambassadeur. Gardé par la fenêtre `call_for_ambassador`.

**Content-Type** : `application/json`

**Body** :
```json
{
  "first_name": "Fatou",
  "last_name": "Touré",
  "age": 24,
  "country": "Sénégal",
  "city": "Dakar",
  "email": "fatou@example.com",
  "phone_whatsapp": "+221771234567",
  "current_profile": "Étudiant",
  "institution_company": "Université Cheikh Anta Diop",
  "linkedin_url": "https://linkedin.com/in/fatou-toure",
  "social_handles": {"instagram": "@fatou_t", "twitter": "@fatou_t"},
  "followers_range": "2K-10K",
  "motivation": "Vulgariser la tech auprès des étudiants",
  "mobilization_plan": "Organiser 3 événements sur le campus",
  "estimated_reach": "10–25",
  "previous_synca": false,
  "preferred_channels": ["Instagram", "LinkedIn"],
  "availability_pre": "Oui",
  "gdpr_consent": true
}
```

| Champ | Type | Obligatoire | Contrainte |
|---|---|---|---|
| `first_name` | `string` | oui | 1-100 car. |
| `last_name` | `string` | oui | 1-100 car. |
| `age` | `int` | oui | ≥ 16 |
| `country` | `string` | oui | 1-100 car. |
| `city` | `string` | oui | 1-100 car. |
| `email` | `string` | oui | email valide |
| `phone_whatsapp` | `string` | oui | 1-20 car. |
| `current_profile` | `string` | non | `Étudiant`, `Professionnel`, `Créateur de contenu`, `Entrepreneur` |
| `institution_company` | `string` | non | max 200 car. |
| `linkedin_url` | `string` | non | URL |
| `social_handles` | `object` | non | `{ "instagram": "@...", "twitter": "@..." }` — clés/valeurs libres |
| `followers_range` | `string` | non | `<500`, `500-2K`, `2K-10K`, `+10K` |
| `motivation` | `string` | oui | min 1 car. |
| `mobilization_plan` | `string` | oui | min 1 car. |
| `estimated_reach` | `string` | non | `5–10`, `10–25`, `25–50`, `+50` |
| `previous_synca` | `bool` | non | défaut `false` |
| `preferred_channels` | `string[]` | oui | **min 1 élément** |
| `availability_pre` | `string` | non | `Oui`, `Non`, `Partielle` |
| `gdpr_consent` | `bool` | oui | **doit être `true`** |

**Réponse** `201` : schéma `AmbassadorRead` :
```json
{
  "id": 1,
  "first_name": "Fatou",
  "last_name": "Touré",
  "age": 24,
  "country": "Sénégal",
  "city": "Dakar",
  "email": "fatou@example.com",
  "phone_whatsapp": "+221771234567",
  "current_profile": "Étudiant",
  "institution_company": "Université Cheikh Anta Diop",
  "linkedin_url": "https://linkedin.com/in/fatou-toure",
  "social_handles": {"instagram": "@fatou_t", "twitter": "@fatou_t"},
  "followers_range": "2K-10K",
  "motivation": "Vulgariser la tech auprès des étudiants",
  "mobilization_plan": "Organiser 3 événements sur le campus",
  "estimated_reach": "10–25",
  "previous_synca": false,
  "preferred_channels": "Instagram, LinkedIn",
  "availability_pre": "Oui",
  "gdpr_consent": true,
  "promo_code_id": null,
  "status": "pending",
  "created_at": "2026-08-26T14:30:00"
}
```

**Erreurs** :
- `400` — gdpr_consent=false, age < 16, preferred_channels vide
- `403` — fenêtre call_for_ambassador fermée
- `429` — rate limit dépassé

### 5.5 `POST /api/partners/apply`

Candidature partenaire. Gardé par la fenêtre `call_for_partner`. **Upload logo optionnel.**

**Content-Type** : `multipart/form-data`

**Champs du formulaire** :

| Champ | Type | Obligatoire | Contrainte |
|---|---|---|---|
| `logo` | fichier | non | Image, max 10 Mo |
| `organization_name` | `string` | oui | 1-200 car. |
| `sector` | `string` | oui | `Tech/ESN`, `Fintech`, `Télécoms`, `Banque`, `ONG`, `Université`, `Médias`, `Autre` |
| `country` | `string` | oui | 1-100 car. |
| `city` | `string` | oui | 1-100 car. |
| `website_url` | `string` | non | URL |
| `contact_name` | `string` | oui | 1-200 car. |
| `contact_position` | `string` | oui | 1-200 car. |
| `contact_email` | `string` | oui | email valide |
| `contact_phone` | `string` | oui | 1-20 car. |
| `level_id` | `int` | oui | ID d'un palier partenaire |
| `has_budget` | `string` | non | `Oui — budget précis`, `Oui — à discuter`, `Non — exploration` |
| `objectives` | `string[]` | oui | **min 1 élément** |
| `previous_sponsor` | `bool` | non | défaut `false` |
| `message` | `string` | non | |
| `heard_from` | `string` | non | max 100 car. |
| `gdpr_consent` | `bool` | oui | **doit être `true`** |

**Exemple fetch (JavaScript)** :
```javascript
const form = new FormData();
form.append('logo', logoInput.files[0]);
form.append('organization_name', 'Orange CI');
form.append('sector', 'Télécoms');
// ... autres champs ...
form.append('objectives', '["Visibilité", "Recrutement"]'); // JSON array en string
form.append('gdpr_consent', 'true');

const res = await fetch('http://127.0.0.1:8010/api/partners/apply', {
  method: 'POST',
  body: form,
});
```

> **Note** : les champs `objectives` (tableau de strings) sont envoyés comme **JSON array sérialisé en string** dans le multipart. Idem pour `preferred_channels` dans l'endpoint ambassadeur.

**Réponse** `201` : schéma `PartnerRead` (même forme que `GET /api/partners`, voir §4.6).

**Erreurs** :
- `400` — level_id invalide : `{"detail": "Ce palier de partenariat n'est pas pas valide."}`
- `400` — gdpr_consent=false
- `403` — fenêtre call_for_partner fermée
- `429` — rate limit dépassé

### 5.6 `POST /api/exhibitors/apply`

Candidature exposant. Gardé par la fenêtre `call_for_exhibitor`.

**Content-Type** : `application/json`

**Body** :
```json
{
  "organization_name": "TechCorp Africa",
  "sector": "Fintech",
  "country": "Sénégal",
  "city": "Dakar",
  "website_url": "https://techcorp.africa",
  "contact_name": "Fatou Ndiaye",
  "contact_position": "CEO",
  "contact_email": "fatou@techcorp.africa",
  "contact_phone": "+221771234567",
  "stand_type": "Premium",
  "reps_count": 4,
  "linked_partner_level": null,
  "products_services": "Solutions de paiement mobile",
  "equipment_needs": ["Table", "Chaises", "Écran"],
  "side_activities": ["Démonstration produit"],
  "visuals_url": "https://drive.google.com/...",
  "payment_method": "Virement bancaire",
  "rules_accepted": true,
  "gdpr_consent": true
}
```

| Champ | Type | Obligatoire | Contrainte |
|---|---|---|---|
| `organization_name` | `string` | oui | 1-200 car. |
| `sector` | `string` | oui | 1-100 car. (texte libre, pas d'enum strict) |
| `country` | `string` | oui | 1-100 car. |
| `city` | `string` | oui | 1-100 car. |
| `website_url` | `string` | non | URL |
| `contact_name` | `string` | oui | 1-200 car. |
| `contact_position` | `string` | oui | 1-200 car. |
| `contact_email` | `string` | oui | email valide |
| `contact_phone` | `string` | oui | 1-20 car. |
| `stand_type` | `string` | oui | `Standard`, `Premium`, `Mutualisé` |
| `reps_count` | `int` | oui | ≥ 1 |
| `linked_partner_level` | `string` | non | max 50 car. |
| `products_services` | `string` | oui | min 1 car. |
| `equipment_needs` | `string[]` | non | tableau de strings |
| `side_activities` | `string[]` | non | tableau de strings |
| `visuals_url` | `string` | non | URL externe (Drive/WeTransfer) |
| `payment_method` | `string` | non | `Virement bancaire`, `Mobile Money`, `Chèque`, `À définir avec l'équipe Synca` |
| `rules_accepted` | `bool` | oui | **doit être `true`** |
| `gdpr_consent` | `bool` | oui | **doit être `true`** |

**Réponse** `201` : schéma `ExhibitorRead` (même forme que `GET /api/exhibitors`, voir §4.7).

**Erreurs** :
- `400` — rules_accepted=false : `{"detail": "Le règlement de l'espace exposition doit être accepté."}`
- `400` — gdpr_consent=false
- `403` — fenêtre call_for_exhibitor fermée
- `429` — rate limit dépassé

### 5.7 `POST /api/contact`

Formulaire de contact. Nécessite un token reCAPTCHA v3.

**Content-Type** : `application/json`

**Body** :
```json
{
  "name": "Jean Koné",
  "email": "jean.kone@example.com",
  "subject": "Question sur le billet",
  "message": "Bonjour, je souhaite savoir si...",
  "captcha": "reCAPTCHA_token_du_frontend"
}
```

| Champ | Type | Obligatoire | Contrainte |
|---|---|---|---|
| `name` | `string` | oui | 1-200 car. |
| `email` | `string` | oui | email valide |
| `subject` | `string` | non | max 255 car. |
| `message` | `string` | oui | min 1 car. |
| `captcha` | `string` | oui | token reCAPTCHA v3 (bypass en dev local sans clé configurée) |

**Réponse** `201` :
```json
{
  "id": 1,
  "name": "Jean Koné",
  "email": "jean.kone@example.com",
  "subject": "Question sur le billet",
  "message": "Bonjour, je souhaite savoir si...",
  "is_read": false,
  "created_at": "2026-08-26T14:30:00"
}
```

**Erreurs** :
- `400` — captcha invalide (seulement si une clé reCAPTCHA est configurée)
- `429` — rate limit dépassé (3/min par IP)

### 5.8 `POST /api/newsletter`

Inscription newsletter. Toujours ouvert.

**Content-Type** : `application/json`

**Body** :
```json
{
  "email": "utilisateur@example.com"
}
```

**Réponse** `201` :
```json
{
  "id": 1,
  "email": "utilisateur@example.com",
  "created_at": "2026-08-26T14:30:00"
}
```

**Erreurs** :
- `409` — email déjà inscrit : `{"detail": "Cet email est déjà inscrit à la newsletter."}`
- `429` — rate limit dépassé

---

## 6. Espace participant

Deux façons d'obtenir un `Authorization: Bearer <token>` valable sur les 3 routes de ce paragraphe :

1. **`access_token` one-time** — reçu une seule fois dans la réponse de `POST /api/register` (§5.2). Historique, toujours valide, jamais réémis.
2. **Login OTP (email + code)** — depuis le 2026-09-02, un participant déjà inscrit (`email_verified=true`) peut se reconnecter à tout moment sans redemander son `access_token` d'origine. Voir §6.0 ci-dessous.

Voir §7 pour les précautions de stockage du token, quel que soit son origine.

### 6.0 Login OTP (email + code à 6 chiffres)

#### `POST /api/auth/otp/request`

```json
{ "email": "participant@example.com" }
```

**Réponse `200`** (toujours la même, que l'email existe ou non — anti-énumération) :
```json
{ "detail": "Si un compte existe pour cet email, un code de connexion vient d'être envoyé." }
```

Si l'email correspond à un compte `email_verified=true`, un code à 6 chiffres est envoyé par email, valable **10 minutes**, invalidé après **5 tentatives** de vérification. Rate limit : **3 requêtes / 15 min** par IP (`429` au-delà).

#### `POST /api/auth/otp/verify`

```json
{ "email": "participant@example.com", "code": "123456" }
```

**Réponse `200`** :
```json
{ "access_token": "eyJhbGciOiJIUzI1NiIs...", "token_type": "bearer" }
```

**`401`** — code invalide, expiré, déjà utilisé, ou email inconnu (même message générique dans tous les cas). Rate limit : 10 requêtes / 15 min par IP.

Le token retourné est un **JWT distinct** de l'`access_token` d'inscription (claim `type: participant_access`, expire après 24h — configurable côté serveur via `PARTICIPANT_TOKEN_EXPIRE_HOURS`). `GET/DELETE /api/user/me` et `GET /api/user/me/tickets` acceptent indifféremment l'un ou l'autre en header `Authorization: Bearer <token>`.

### 6.1 `GET /api/user/me`

Relit les données du participant connecté.

**Réponse** `200` : schéma `UserRead` (mêmes champs que la réponse de `/register`, sans `access_token`).

### 6.2 `GET /api/user/me/tickets`

Liste les billets du participant connecté — **uniquement les siens** (filtré côté serveur sur le `user_id` associé au token, il n'y a pas de `GET /api/tickets/:id` par identifiant arbitraire).

**Réponse** `200` :
```json
[
  {
    "id": 12,
    "ticket_number": "SYNCA-000042",
    "pdf_url": "https://f000.backblazeb2.com/file/synca-uploads/20260826-....pdf",
    "is_scanned": false,
    "created_at": "2026-08-26T14:30:00"
  }
]
```

`pdf_url` est le lien direct de téléchargement (bouton "Télécharger mon billet" sur la page ou dans l'email de confirmation, §5.2/§8) — un simple `<a href>`, pas de proxy backend nécessaire.

### 6.3 `DELETE /api/user/me`

Droit à l'effacement RGPD : anonymise le compte (nom/email/téléphone remplacés, `access_token` révoqué). Les billets/paiements restent en base pour la compta, mais détachés de toute donnée personnelle identifiable. **Irréversible et à usage unique** — un second appel avec le même token renvoie `401`.

**Erreurs communes aux 3 routes** :
- `401` — token manquant, invalide ou révoqué (compte déjà supprimé)

---

## 7. Sécurité — ce que le frontend doit respecter

Points qui ne se voient pas dans le schéma JSON mais que le frontend doit gérer pour ne pas introduire de faille côté client :

- **Stockage du token** (`access_token` d'inscription ou JWT participant issu du login OTP §6.0) — ni cookie ni `localStorage` (XSS = vol du token) : préférer la mémoire JS (variable de state) ou, si la session doit survivre un refresh de page, `sessionStorage`. Jamais dans une URL, un log, ou un outil d'analytics.
- **Ne jamais construire une URL de billet à la main** — toujours passer par `GET /api/user/me/tickets` (§6.2) pour obtenir `pdf_url` ; ne pas essayer de deviner/reconstruire un lien à partir d'un `ticket_number` ou d'un id. Le backend ne route pas les billets par id — ce n'est pas juste "poli", `GET /api/tickets/:id` n'existe pas.
- **CORS strict** — l'API n'autorise que les origines listées dans `CORS_ORIGINS` côté serveur (pas de wildcard `*`). Un domaine de prod non enregistré doit être ajouté côté backend avant déploiement, le frontend ne peut pas contourner ça.
- **Uploads (logo partenaire §5.5, photo speaker §5.3)** — le backend revalide déjà le type MIME réel et la taille (5 Mo photo / 10 Mo logo, cf. `TO_TEST.md` 7.6) et rejette en `400` sinon ; valider aussi côté client pour l'UX, mais ne pas s'y fier comme seul garde-fou.
- **reCAPTCHA** — si activé en prod (`RECAPTCHA_SECRET_KEY` configuré côté backend), les formulaires publics (§5) attendent un jeton reCAPTCHA dans le body ; en son absence le backend accepte tout (mode dev), donc ce n'est pas testable en local sans clé réelle.
- **`403` vs `401`** — `401` = pas de token / token invalide (participant ou admin) ; `403` = token valide mais action non autorisée (permission RBAC manquante, ou fenêtre de campagne fermée pour un formulaire). Ne pas les traiter comme équivalents dans l'UI : `401` doit renvoyer vers "reconnectez-vous" (admin) ou "session expirée" (participant), `403` doit afficher un message métier (ex. "les candidatures partenaires sont closes").
- **Toujours HTTPS en prod** — le Bearer token circule en clair sur HTTP ; Caddy termine le TLS en prod (voir `Caddyfile`), mais un appel direct à l'IP du VPS en HTTP ne doit jamais être fait depuis le frontend de prod.

---

## 8. Formats d'erreur

Toutes les erreurs suivent le même format :

```json
{
  "detail": "Message lisible par l'utilisateur en français."
}
```

### Codes HTTP retournés

| Code | Quand |
|---|---|
| `200` | Succès (GET, PATCH) |
| `201` | Création réussie (POST) |
| `400` | Données invalides (champ manquant, format mauvais, enum invalide, gdpr_consent=false) |
| `403` | Accès refusé — permission RBAC manquante (admin) OU fenêtre de campagne fermée (formulaires) |
| `404` | Ressource introuvable |
| `409` | Conflit — email déjà existant (waitlist, register, newsletter) |
| `422` | Erreur de validation Pydantic (corps de requête mal formé) |
| `429` | Rate limit dépassé |

### Rate limits (par IP)

| Endpoint | Limite |
|---|---|
| Endpoints publics lecture (`GET /api/*`) | 60/min |
| Formulaires (`POST /api/waitlist`, `/register`, `/speakers/apply`, etc.) | 3/min |
| Login admin (`POST /api/admin/login`) | 5/min |
| Backoffice admin (autres routes) | 30/min |
| `POST /api/auth/otp/request` | 3/15min |
| `POST /api/auth/otp/verify` | 10/15min |

Quand la limite est dépassée, la réponse est :

```json
{
  "detail": "Rate limit exceeded: 3 per 1 minute"
}
```

---

## 9. Pagination

Les endpoints de liste (`sessions`, `speakers`, `partners`, `exhibitors`, `faqs`, `hackathon-teams`) supportent la pagination. La réponse est un **tableau brut** (pas un objet wrapper) :

```
GET /api/speakers?limit=10&offset=0   → 10 premiers speakers
GET /api/speakers?limit=10&offset=10  → 10 suivants
```

| Param | Défaut | Max |
|---|---|---|
| `limit` | `50` | `200` |
| `offset` | `0` | — |

> Il n'y a pas de champ `total` dans la réponse. Pour savoir s'il y a d'autres résultats : si la réponse contient `limit` éléments, il peut y en avoir davantage ; si elle contient moins, c'est la fin.

---

## 10. Ce qui n'est pas encore disponible

- **Paiement/billetterie** — Phase 5 terminée côté backend (webhooks Stripe/Wave/Orange Money, génération billet PDF + QR code) mais pas encore testée en conditions réelles. Les endpoints `POST /api/payments` et `POST /api/promo/validate` existent mais ne doivent pas encore être consommés par le frontend en production.
Le suivi d'avancement précis est dans `ROADMAP.md` à la racine du repo.

---

## 11. Inspecter la base de données directement

```bash
make db-shell
```

---

## 12. Retours attendus

Ce guide et l'API sont amenés à changer. Remontez en particulier :
- Un champ manquant ou mal typé dans une réponse (`GET /api/...`) par rapport à ce dont l'UI a besoin.
- Un filtre de liste manquant (ex. tri, recherche texte) qui bloquerait un écran.
- Un cas d'erreur mal géré (statut HTTP inattendu, message peu clair).
- Toute question sur le format d'un endpoint pas encore construit avant qu'on le fige côté backend — plus facile à changer maintenant qu'une fois consommé par l'UI.
