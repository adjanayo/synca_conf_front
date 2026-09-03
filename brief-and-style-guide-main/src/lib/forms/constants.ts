export const COUNTRIES = [
  "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre",
  "Angola", "Antigua-et-Barbuda", "Arabie saoudite", "Argentine", "Arménie",
  "Australie", "Autriche", "Azerbaïdjan", "Bahamas", "Bahreïn", "Bangladesh",
  "Barbade", "Belgique", "Belize", "Bénin", "Bhoutan", "Biélorussie", "Birmanie",
  "Bolivie", "Bosnie-Herzégovine", "Botswana", "Brésil", "Brunei", "Bulgarie",
  "Burkina Faso", "Burundi", "Cambodge", "Cameroun", "Canada", "Cap-Vert",
  "République centrafricaine", "Chili", "Chine", "Chypre", "Colombie", "Comores",
  "Congo-Brazzaville", "Congo-Kinshasa", "Corée du Nord", "Corée du Sud",
  "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba", "Danemark", "Djibouti",
  "Dominique", "Égypte", "Émirats arabes unis", "Équateur", "Érythrée", "Espagne",
  "Estonie", "Eswatini", "États-Unis", "Éthiopie", "Fidji", "Finlande", "France",
  "Gabon", "Gambie", "Géorgie", "Ghana", "Grèce", "Grenade", "Guatemala",
  "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Guyana", "Haïti", "Honduras",
  "Hongrie", "Îles Marshall", "Îles Salomon", "Inde", "Indonésie", "Irak", "Iran",
  "Irlande", "Islande", "Israël", "Italie", "Jamaïque", "Japon", "Jordanie",
  "Kazakhstan", "Kenya", "Kirghizistan", "Kiribati", "Kosovo", "Koweït", "Laos",
  "Lesotho", "Lettonie", "Liban", "Liberia", "Libye", "Liechtenstein",
  "Lituanie", "Luxembourg", "Macédoine du Nord", "Madagascar", "Malaisie",
  "Malawi", "Maldives", "Mali", "Malte", "Maroc", "Maurice", "Mauritanie",
  "Mexique", "Micronésie", "Moldavie", "Monaco", "Mongolie", "Monténégro",
  "Mozambique", "Namibie", "Nauru", "Népal", "Nicaragua", "Niger", "Nigeria",
  "Norvège", "Nouvelle-Zélande", "Oman", "Ouganda", "Ouzbékistan", "Pakistan",
  "Palaos", "Palestine", "Panama", "Papouasie-Nouvelle-Guinée", "Paraguay",
  "Pays-Bas", "Pérou", "Philippines", "Pologne", "Portugal", "Qatar",
  "République dominicaine", "République tchèque", "Roumanie", "Royaume-Uni",
  "Russie", "Rwanda", "Saint-Christophe-et-Niévès", "Saint-Marin",
  "Saint-Vincent-et-les-Grenadines", "Sainte-Lucie", "Salvador", "Samoa",
  "Sao Tomé-et-Principe", "Sénégal", "Serbie", "Seychelles", "Sierra Leone",
  "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Soudan du Sud",
  "Sri Lanka", "Suède", "Suisse", "Suriname", "Syrie", "Tadjikistan",
  "Tanzanie", "Tchad", "Thaïlande", "Timor oriental", "Togo", "Tonga",
  "Trinité-et-Tobago", "Tunisie", "Turkménistan", "Turquie", "Tuvalu",
  "Ukraine", "Uruguay", "Vanuatu", "Vatican", "Venezuela", "Vietnam", "Yémen",
  "Zambie", "Zimbabwe", "Autre",
] as const;

export const SECTEURS = ["Dev", "Data", "Design", "Cyber Sécurité", "Product", "IA", "Autre"] as const;
export const NIVEAUX = ["Débutant", "Junior", "Senior", "Expert"] as const;
export const PROFILS = ["Étudiant", "Professionnel", "Entrepreneur", "Recruteur", "Autre"] as const;
export const PASS = [
  "Étudiant (5 000 F)",
  "Professionnel (25 000 F)",
  "Startup (35 000 F)",
  "Diaspora (50 000 F)",
  "VIP (100 000 F)",
  "Online",
] as const;
export const GENRES = ["Homme", "Femme", "Autre"] as const;
export const SOURCES = [
  "Réseaux sociaux", "Bouche-à-oreille", "Ambassadeur Synca",
  "Partenaire / Sponsor", "Article / Presse", "Édition précédente", "Autre",
] as const;

export const SPEAKER_FORMATS = ["Keynote", "Panel", "Workshop", "Lightning Talk", "Fireside Chat"] as const;
export const SPEAKER_THEMES = ["IA", "EdTech", "Entrepreneuriat", "Carrières", "Impact", "Cyber Sécurité"] as const;
export const SPEAKER_AUDIENCE = ["Débutant", "Intermédiaire", "Avancé", "Tous"] as const;
export const SPEAKER_LANGUES = ["Français", "Anglais", "Bilingue", "Autre"] as const;
export const SPEAKER_DISPO = ["Oui confirmé", "Sous réserve", "Besoin aide déplacement"] as const;
export const SPEAKER_DIFFUSION = ["Oui sans restriction", "Oui avec validation", "Non"] as const;

export const PARTNER_TIERS = [
  "Title (10M F CFA)",
  "Platinum (7M F CFA)",
  "Gold (5M F CFA)",
  "Silver (3M F CFA)",
  "Bronze (1,5M F CFA)",
  "Partenaire média",
] as const;

export const CONTACT_SUBJECTS = [
  "Question générale", "Billetterie", "Partenariat", "Speakers", "Presse", "Autre",
] as const;

// Ambassadeur
export const AMBASSADEUR_PROFILS = ["Étudiant", "Professionnel", "Créateur de contenu", "Entrepreneur"] as const;
export const AMBASSADEUR_FOLLOWERS = ["<500", "500-2K", "2K-10K", "+10K"] as const;
export const AMBASSADEUR_REACH = ["5–10", "10–25", "25–50", "+50"] as const;
export const AMBASSADEUR_CANAUX = ["WhatsApp", "Instagram", "LinkedIn", "TikTok", "Email", "Campus"] as const;
export const AMBASSADEUR_DISPO = ["Oui", "Non", "Partielle"] as const;

// Partenaire
export const PARTNER_SECTEURS = ["Tech/ESN", "Fintech", "Télécoms", "Banque", "ONG", "Université", "Médias", "Autre"] as const;
export const PARTNER_BUDGET = ["Oui — budget précis", "Oui — à discuter", "Non — exploration"] as const;
export const PARTNER_OBJECTIFS = [
  "Visibilité / notoriété",
  "Recrutement / marque employeur",
  "Génération de leads B2B",
  "Lancement produit",
  "Impact / RSE",
  "Networking VIP",
] as const;

// Exposant — valeurs alignées à l'identique sur les enums backend (app/models/applications.py)
export const EXHIBITOR_STAND_TYPES = ["Standard", "Premium", "Mutualisé"] as const;
export const EXHIBITOR_PAYMENT_METHODS = [
  "Virement bancaire",
  "Mobile Money",
  "Chèque",
  "À définir avec l'équipe Synca",
] as const;
export const EXHIBITOR_EQUIPMENT = ["Table", "Chaises", "Électricité", "Wifi dédié", "Écran/TV", "Autre"] as const;
export const EXHIBITOR_ACTIVITIES = ["Démo produit", "Jeu concours", "Atelier", "Networking", "Autre"] as const;
