# Parcours Utilisateurs — SYNCA CONF 2027

## Vue d'ensemble

La plateforme SYNCA CONF 2027 gère une conférence tech panafricaine (Dakar, 18-20 août 2027). Elle distingue deux univers d'authentification :

- **Backoffice Admin** : JWT + RBAC (4 rôles, 8 permissions)
- **Participants** : Pas de login — token one-time pour auto-service RGPD

---

## 1. Visiteur / Non-inscrit

**État** : Aucun compte, navigation libre

**Parcours** :
1. Consulte le site public (jours, sessions, speakers, partenaires, exposants, FAQ)
2. Rejoint la **liste d'attente** (`POST /api/waitlist`) — toujours ouvert
3. S'inscrit à la **newsletter** (`POST /api/newsletter`)
4. Envoie un **message contact** (`POST /api/contact`) — reCAPTCHA v3

**Accès** :
- `GET /api/days` — jours de conférence
- `GET /api/sessions?day=&category=` — sessions publiques
- `GET /api/pass-types` — types de passes actifs
- `GET /api/speakers?theme=&format=` — speakers publics
- `GET /api/partners?level=` — partenaires publics
- `GET /api/exhibitors` — exposants publics
- `GET /api/faqs?category=` — FAQ
- `GET /api/campaign-windows` — dates/statuts des fenêtres

---

## 2. Waitlist (Liste d'attente)

**État** : `notified=false, registered=false`

**Parcours** :
1. Rejoint la liste d'attente via `POST /api/waitlist`
2. Attend l'ouverture de la billetterie (fenêtre `ticketing`)
3. Reçoit une notification quand la billetterie ouvre
4. Passe à l'état "inscrit" en complétant `POST /api/register`

**Transitions** :
- `notified=false` → `notified=true` (notification envoyée)
- `registered=false` → `registered=true` (inscription complétée)

---

## 3. Participant Inscrit (Attendee)

**État** : Compte créé, `email_verified=true`, token one-time

**Parcours** :
1. **Inscription** (`POST /api/register`) — pendant fenêtre `ticketing`
   - Champs obligatoires : nom, prénom, email, phone_whatsapp, pass_type_id, gdpr_consent=true
   - Optionnel : promo_code (ex: code ambassadeur), newsletter_consent, special_needs
   - Retourne un `access_token` (one-time, `secrets.token_urlsafe(32)`)
2. **Paiement** (`POST /api/payments`)
   - Crée un paiement `status=pending`
   - Redirige vers le provider (Stripe/Wave/Orange Money)
   - Webhook confirme → génère un `Ticket` (PDF + QR code sur B2)
   - Email de confirmation envoyé
3. **Accès aux billets** (`GET /api/user/me/tickets`)
4. **Auto-service RGPD** :
   - `GET /api/user/me` — consulte ses données
   - `DELETE /api/user/me` — anonymise le compte, révoque le token

**API disponibles** :
- `POST /api/promo/validate` — valider un code promo
- `GET /api/user/me` — données personnelles
- `GET /api/user/me/tickets` — billets
- `DELETE /api/user/me` — droit à l'effacement (RGPD)

**Sécurité** :
- Token porteur unique (pas de login/mot de passe)
- Suppression = anonymisation (tickets/paiements conservés pour audit)

---

## 4. Speaker Applicant (Candidat orateur)

**État** : `status=pending`, `is_public=false`

**Parcours** :
1. **Candidature** (`POST /api/speakers/apply`) — pendant fenêtre `call_for_speaker`
   - Champs : nom, bio, thème, format, photo (upload obligatoire)
   - Statut initial : `pending`
2. **Examen par l'admin**
   - Admin avec permission `speakers.approve` consulte la candidature
   - `PATCH /api/admin/speakers/{id}` avec décision :
     - **Accepté** : `status=accepted`, `is_public=true` → apparaît sur `GET /api/speakers`
     - **Rejeté** : `status=rejected`, reste privé

**Transitions** :
```
pending → accepted (is_public=true)
pending → rejected (is_public=false)
```

**Fenêtre de campagne** : `call_for_speaker` — si fermée, retourne 403

---

## 5. Ambassador Applicant (Candidat ambassadeur)

**État** : `status=pending`, détient un `promo_code_id` (une fois accepté)

**Parcours** :
1. **Candidature** (`POST /api/ambassadors/apply`) — pendant fenêtre `call_for_ambassador`
   - Condition : âge ≥ 16 ans
   - Statut initial : `pending`
2. **Examen par l'admin**
   - Admin avec permission `ambassadors.approve`
   - `PATCH /api/admin/ambassadors/{id}` avec décision :
     - **Accepté** :
       - `status=accepted`
       - Génération automatique d'un **code promo unique** : `AMB-<NOM>-<hex4>`
       - Code : remise 10%, usage illimité, idempotent
       - Le code promo est lié à l'ambassadeur
     - **Rejeté** : `status=rejected`

**Transitions** :
```
pending → accepted (+ promo_code généré)
pending → rejected
```

**Impact** :
- Le code promo peut être utilisé par des participants lors de l'inscription
- L'ambassadeur peut partager son code pour parrainer des inscriptions

---

## 6. Partner Applicant (Candidat partenaire)

**État** : `status` multi-étapes, `is_public=false`

**Parcours** :
1. **Candidature** (`POST /api/partners/apply`) — pendant fenêtre `call_for_partner`
   - Champs : nom entreprise, contact, niveau souhaité, logo (upload optionnel)
   - Statut initial : `pending`
2. **Workflow de négociation** :
   ```
   pending → contacted → negotiating → confirmed/rejected
   ```
3. **Confirmation** :
   - `status=confirmed`, `is_public=true` → apparaît sur `GET /api/partners`
   - Niveau de partenaire (`PartnerLevel`) détermine la visibilité

**Fenêtre de campagne** : `call_for_partner`

---

## 7. Exhibitor Applicant (Candidat exposant)

**État** : `status` multi-étapes, `is_public=false`

**Parcours** :
1. **Candidature** (`POST /api/exhibitors/apply`) — pendant fenêtre `call_for_exhibitor`
   - Champs : nom entreprise, contact, description stand
   - Statut initial : `pending`
2. **Workflow de négociation** (identique aux partenaires) :
   ```
   pending → contacted → negotiating → confirmed/rejected
   ```
3. **Confirmation** :
   - `status=confirmed`, `is_public=true` → apparaît sur `GET /api/exhibitors`

**Fenêtre de campagne** : `call_for_exhibitor`

---

## 8. Subscriber Newsletter

**État** : Inscription newsletter simple

**Parcours** :
1. **Inscription** (`POST /api/newsletter`) — toujours ouvert, rate-limité
2. Reçoit les communications de la conférence

**Pas d'authentification** requise, pas de parcours interactif

---

## 9. Contact (Message formulaire)

**État** : Message envoyé, `is_read=false`

**Parcours** :
1. **Envoi** (`POST /api/contact`) — reCAPTCHA v3, toujours ouvert
2. Message visible dans le backoffice pour les admins

---

## 10. Admin — Superadmin

**État** : Connecté, rôle `superadmin`, toutes les permissions

**Parcours** :
1. **Connexion** (`POST /api/admin/login`) — JWT
2. **Dashboard** : stats, inscriptions, paiements
3. **Gestion RBAC** (`PATCH /api/admin/roles/{role_id}`) — `roles.manage`
4. **Approbation demandes** :
   - Speakers (`speakers.approve`)
   - Ambassadeurs (`ambassadors.approve`)
   - Partenaires (`partners.manage`)
   - Exposants (`exhibitors.manage`)
5. **Gestion fenêtres de campagne** (`campaign_windows.manage`)
6. **Export CSV** (`export.data`) — registrations, payments
7. **Audit logs** — consultation des tentatives de connexion
8. **Backoffice SQLAdmin** (`/admin`) — CRUD sur toutes les entités

**Permissions** : TOUTES (8/8)

---

## 11. Admin — Admin

**État** : Connecté, rôle `admin`, permissions configurables

**Parcours** :
1. Même base que superadmin
2. Permissions **vides par défaut** — doivent être accordées par un superadmin
3. Exemple de configuration possible :
   - `payments.view` — voir stats et inscriptions
   - `speakers.approve` — approuver les speakers
   - `contacts.view` — lire les messages contact

**Permissions** : 0 par défaut (à configurer)

---

## 12. Admin — Editor

**État** : Connecté, rôle `editor`, permissions configurables

**Parcours** :
1. Rôle destiné à la gestion de contenu
2. Permissions **vodies par défaut**
3. Usage prévu : modération, édition de contenu public

**Permissions** : 0 par défaut (à configurer)

---

## 13. Admin — Support

**État** : Connecté, rôle `support`, permissions configurables

**Parcours** :
1. Rôle destiné au support utilisateur
2. Permissions **vides par défaut**
3. Usage prévu : consultation des messages contact, assistance participants

**Permissions** : 0 par défaut (à configurer)

---

## Matrice des permissions RBAC

| Permission | Superadmin | Admin | Editor | Support |
|---|---|---|---|---|
| `speakers.approve` | ✅ | ⚙️ | ⚙️ | ⚙️ |
| `ambassadors.approve` | ✅ | ⚙️ | ⚙️ | ⚙️ |
| `partners.manage` | ✅ | ⚙️ | ⚙️ | ⚙️ |
| `exhibitors.manage` | ✅ | ⚙️ | ⚙️ | ⚙️ |
| `payments.view` | ✅ | ⚙️ | ⚙️ | ⚙️ |
| `campaign_windows.manage` | ✅ | ⚙️ | ⚙️ | ⚙️ |
| `export.data` | ✅ | ⚙️ | ⚙️ | ⚙️ |
| `roles.manage` | ✅ | ⚙️ | ⚙️ | ⚙️ |

✅ = accordé par défaut | ⚙️ = à configurer par un superadmin

---

## Fenêtres de campagne (CampaignWindows)

Les fenêtres contrôlent l'ouverture des formulaires. Si une fenêtre est fermée, les soumissions retournent **403**.

| Fenêtre | Contrôle | Toujours ouvert ? |
|---|---|---|
| `call_for_speaker` | Soumissions speakers | Non |
| `ticketing` | Inscriptions + paiements | Non |
| `call_for_partner` | Soumissions partenaires | Non |
| `call_for_ambassador` | Soumissions ambassadeurs | Non |
| `call_for_exhibitor` | Soumissions exposants | Non |
| — | Waitlist | ✅ Oui |
| — | Newsletter | ✅ Oui |
| — | Contact | ✅ Oui |

---

## Flux de transition global

```
Visiteur
  │
  ├──→ Waitlist (liste d'attente)
  │       │
  │       └──→ Participant Inscrit (billetterie ouverte)
  │               │
  │               └──→ Paiement → Ticket (PDF + QR)
  │
  ├──→ Speaker Applicant (call_for_speaker)
  │       │
  │       ├──→ Accepté → Speaker Public
  │       └──→ Rejeté → Privé
  │
  ├──→ Ambassador Applicant (call_for_ambassador)
  │       │
  │       ├──→ Accepté → Code promo généré (AMB-xxx)
  │       └──→ Rejeté → Privé
  │
  ├──→ Partner Applicant (call_for_partner)
  │       │
  │       └──→ pending → contacted → negotiating → confirmed/rejected
  │
  ├──→ Exhibitor Applicant (call_for_exhibitor)
  │       │
  │       └──→ pending → contacted → negotiating → confirmed/rejected
  │
  └──→ Admin (backoffice)
          │
          ├──→ Superadmin (toutes permissions)
          ├──→ Admin (permissions configurables)
          ├──→ Editor (permissions configurables)
          └──→ Support (permissions configurables)
```

---

*Document généré le 2026-09-01 — Basé sur l'analyse du codeback `synca_conf_back`*
