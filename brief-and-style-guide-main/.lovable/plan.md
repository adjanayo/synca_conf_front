## Synca Conf 2027 — Site multi-pages

Restructurer le site actuel (one-page) en site multi-pages TanStack Router avec navigation partagée, et créer tous les formulaires demandés.

### Architecture des routes

```
src/routes/
  __root.tsx              → Layout global (Nav + Footer partagés)
  index.tsx               → Accueil : Hero, compteur, résumé, CTA, stats, aperçu programme, partenaires, tickets
  programme.tsx           → Planning 18/19/20 août avec filtre par jour (tabs)
  speakers.tsx            → Grille speakers (placeholder "Bientôt dévoilé" + cards)
  inscription.tsx         → Formulaire participant (gate "Ouverture le JJ/MM")
  partenaires.tsx         → Offres sponsoring détaillées + CTA formulaire
  candidature-speaker.tsx → Formulaire candidature speaker (gate "Ouvre Mars 2027")
  ambassadeur.tsx         → Programme + formulaire ambassadeur (gate Mars 2027)
  faq.tsx                 → FAQ par catégorie (Participants / Sponsors / Speakers)
  contact.tsx             → Formulaire contact + infos équipe
```

### Composants partagés

- `src/components/site/Nav.tsx` — header sticky avec liens vers toutes les pages, mobile drawer
- `src/components/site/Footer.tsx` — footer extrait de l'index actuel
- `src/components/site/PageHeader.tsx` — bandeau titre réutilisé sur les pages internes
- `src/components/site/DateGate.tsx` — wrapper affichant "Ouvre le ..." avant la date d'ouverture, sinon le formulaire enfant

### Formulaires (react-hook-form + zod)

Validation client + zod schemas dans `src/lib/forms/*.schemas.ts`. Pas de backend pour l'instant : soumission = toast de confirmation + console (placeholder). On pourra brancher Lovable Cloud plus tard.

**1. Inscription participant** (`/inscription`)
- Identité : nom*, prénom*, genre* (select), email*, téléphone WhatsApp* (avec indicatif)
- Localisation : pays* (select), ville*
- Profil pro : profil* (checkboxes multi : Étudiant, Pro, Freelance, Entrepreneur, Recruteur), secteur* (select : Dev, Data, Design, Cybersec, Product, IA, Autre), niveau* (Débutant/Junior/Senior/Expert)
- Pass : type* (Étudiant 5k / Pro 25k / Startup 35k / Diaspora / VIP 100k / Online)
- Marketing : source de connaissance (select + champ libre si "Autre"), code promo, LinkedIn/portfolio (URL)
- Divers : besoins spéciaux (textarea), RGPD* (checkbox obligatoire), opt-in communications (checkbox)

**2. Candidature speaker** (`/candidature-speaker`)
Sections visuelles séparées :
- Identité : nom*, titre/poste*, entreprise*, pays*, email pro*, WhatsApp*, LinkedIn* (URL), site/portfolio (URL), photo HD* (upload JPG/PNG min 1MB)
- Intervention : format* (Keynote/Panel/Workshop/Lightning Talk/Fireside), titre* (max 100c), thématique* (IA/EdTech/Entrepreneuriat/Carrières/Impact/Cybersec), résumé* (max 200 mots), niveau audience*, langue*, expériences passées (textarea), lien vidéo (URL)
- Logistique : dispo 18-20 août* (Oui/Sous réserve/Besoin aide), ville de départ, besoin hébergement (Oui/Non), motivation* (max 150 mots), accord diffusion vidéo*, RGPD*

**3. Candidature ambassadeur** (`/ambassadeur`)
- Identité, ville/pays, université ou organisation, motivation (textarea), réseaux sociaux, RGPD

**4. Formulaire partenaire** (`/partenaires`, en bas de page)
- Entreprise, contact, email, téléphone, niveau souhaité (select 6 tiers), message

**5. Contact** (`/contact`)
- Nom, email, sujet (select), message, RGPD

### Charte graphique

Reprend les tokens déjà en place (orange, dark, peach, cream, Syne/DM Sans). Aucun changement aux variables CSS.

### Détails techniques

- Routes générées par le plugin Vite TanStack — créer chaque fichier sous `src/routes/`, ne pas toucher `routeTree.gen.ts`.
- `__root.tsx` : envelopper `<Outlet />` dans `<Nav />` + `<Footer />`.
- `head()` par route avec title/description/og uniques (SEO).
- `index.tsx` : remplacer le bloc Nav/Footer locaux par les composants partagés, alléger sections déplacées.
- Formulaires : `react-hook-form` + `@hookform/resolvers` + `zod` (déjà installés via shadcn). UI avec composants shadcn (Input, Select, Checkbox, RadioGroup, Textarea, Form).
- `DateGate` : prop `opensAt: Date` ; si `now < opensAt`, affiche carte "Ouverture le …" avec compteur ; sinon `{children}`.
- Toast de confirmation via `sonner` après submit.

### Hors scope (à confirmer plus tard)

- Backend / persistance des soumissions (Lovable Cloud)
- Envoi email de confirmation
- Upload réel de la photo speaker (stocké côté client uniquement pour le moment)
- Authentification / espace participant
