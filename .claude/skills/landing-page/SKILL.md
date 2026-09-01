---
name: landing-page
description: Use à chaque fois qu'on touche la page d'accueil du site (src/pages/index/, IndexView) — ajouter une section de feature, mettre à jour le copy, ou relire ce qu'elle couvre. Trigger aussi à chaque fois qu'une nouvelle capacité visible arrive (nouveau programme, nouvelle section speakers, nouveau contenu) — c'est le signal pour vérifier si la page d'accueil a besoin d'une nouvelle section, même si personne n'a explicitement demandé de mettre à jour la page d'accueil. Trigger sur "page d'accueil", "landing", "homepage", "index", ou "qu'est-ce qu'on montre en accueil".
---

# Landing Page (synca_conf_front)

La page d'accueil (`src/pages/index/IndexView.tsx`) est le site vitrine de la conférence/événement. Son boulot : présenter le programme, les speakers, les partenaires, l'inscription et la candidature speaker à un visiteur qui n'a jamais entendu parler de l'événement — et le convertir en inscription. Elle ne doit pas être une liste de features figée écrite une fois et laissée à périmer alors que le site évolue. Ce skill est l'obligation continue de la garder à jour, pas juste la construction initiale.

## Toute capacité publique livrée appartient à la page

Au fur et à mesure que le site accueille du contenu réel (un programme rempli, une liste de speakers, des partenaires confirmés, une FAQ étoffée), mettre à jour ou compléter sa section sur l'index dans le même changement (ou un suivi immédiat) — ne pas la laisser figer à ce qu'elle était au départ. Concrètement, vérifier ce skill quand une section comme celles-ci devient réelle :

- **Programme** (`/programme`) — les sessions/journées agrégées sur l'index.
- **Speakers** (`/speakers`) — la bio/tête d'affiche mise en avant.
- **Partenaires** (`/partenaires`) — les logos/niveaux de partenariat.
- **Inscription / candidature speaker** — l'appel à l'action principal.

Tout n'est pas une section d'index (un détail interne d'appel API n'en est pas un) — le filtre est "un visiteur décidant de s'inscrire s'en soucierait-il", pas "une fonctionnalité a-t-elle été livrée".

## Ne promouvoir que ce qui est réel

**Ne jamais annoncer une fonctionnalité qui n'est pas réellement livrée et visible.** Une accroche promettant un contenu qui n'existe pas encore est de la publicité mensongère — pire, elle fixe les attentes d'un visiteur contre un site qui ne fait pas ce qui est promis. S'il y a un cas réel pour teaser quelque chose à venir, il doit être explicitement étiqueté comme tel ("à venir", "bientôt annoncé") et seulement ajouté avec l'accord de l'utilisateur — ne pas décrire la feuille de route comme si elle était publiée.

## Le SEO doit refléter la même complétude

Le skill `seo` gouverne comment les métadonnées sont construites techniquement ; ce skill assure que le *contenu* qui alimente ces métadonnées (titre, description, copy) reflète réellement l'ensemble complet et courant. Quand une nouvelle section est ajoutée ici, vérifier que le titre/description de la page reflètent encore fidèlement l'événement, et les mettre à jour si elles ont pris du retard.

## Langue du copy

Écrite en français par défaut, comme toutes les pages publiques du site.