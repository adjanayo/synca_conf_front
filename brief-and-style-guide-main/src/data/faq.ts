
{/*type Item = { q: string; a: string };
type Cat = { id: string; label: string; items: Item[] };

const CATS: Cat[] = [
  {
    id: "participants", label: "Participants",
    items: [
      { q: "Quand et où se tient la Synca Conf 2027 ?", a: "Du 18 au 20 août 2027 à Dakar, Sénégal. Le lieu exact est communiqué aux participants confirmés." },
      { q: "Quels moyens de paiement sont acceptés ?", a: "Carte bancaire, Wave, Orange Money, MTN Mobile Money, virement bancaire." },
      { q: "Y a-t-il un tarif Early Bird ?", a: "Oui — jusqu'à -30% via les codes Early Bird et codes ambassadeurs jusqu'à une date limite annoncée." },
      { q: "Puis-je participer en ligne ?", a: "Oui, un pass Online permet de suivre les keynotes et panels principaux à distance." },
      { q: "Les pass sont-ils remboursables ?", a: "Annulations remboursées à 100% jusqu'à 60 jours avant l'événement, 50% jusqu'à 30 jours, non remboursables ensuite." },
    ],
  },
  {
    id: "sponsors", label: "Sponsors",
    items: [
      { q: "Quels niveaux de partenariat proposez-vous ?", a: "Six niveaux : Title, Platinum, Gold, Silver, Bronze, et Partenaire média." },
      { q: "Puis-je avoir un pack sur-mesure ?", a: "Oui, écris à partenariats@sync-africa.com pour un dossier personnalisé." },
      { q: "Recevons-nous un rapport post-event ?", a: "Oui, à partir du niveau Gold — données d'engagement, audience, retombées presse." },
    ],
  },
  {
    id: "speakers", label: "Speakers",
    items: [
      { q: "Comment candidater ?", a: "Via le formulaire dédié, ouvert dès mars 2027." },
      { q: "Quels formats d'intervention sont possibles ?", a: "Keynote (30 min), Panel (45 min), Workshop (90 min), Lightning Talk (10 min), Fireside Chat (30 min)." },
      { q: "Les frais de déplacement sont-ils pris en charge ?", a: "Pour les keynote speakers internationaux : vol + hébergement. Pour les autres formats, étudié au cas par cas." },
      { q: "Quand recevrai-je une réponse ?", a: "Sous 4 semaines après la clôture des candidatures." },
    ],
  },
];


export { CATS }*/}
export const CATS = [
  {
    id: "general",
    label: "Général",
    items: [
      {
        q: "Qu'est-ce que Synca Conf Dakar 2027 ?",
        a: "Synca Conf 2027 est l'une des principales conférences technologiques d'Afrique, organisée par Synca. Elle réunit décideurs institutionnels, dirigeants d'entreprises, investisseurs, chercheurs, formateurs et jeunes talents autour de la Cybersécurité, du Cloud, de la Fintech et de l'Edtech.",
      },
      {
        q: "Quel est le thème de cette édition ?",
        a: "« Former pour l'économie réelle : combler le fossé entre éducation, compétences et emploi dans la Tech en Afrique ».",
      },
      {
        q: "Quand et où se déroule l'événement ?",
        a: "Du 16 au 18 mars 2027, au Grand Théâtre de Dakar, au Sénégal.",
      },
      {
        q: "Qui organise Synca Conf ?",
        a: "Synca Conf est organisée par Synca, un écosystème panafricain dédié à la technologie, aux compétences numériques et à l'innovation, mis en place par des jeunes convaincus que l'Afrique doit construire elle-même les solutions à ses propres défis. L'édition 2027 est co-organisée avec Women In Tech Sénégal.",
      },
      {
        q: "Quels sont les objectifs chiffrés de cette édition ?",
        a: "+ 1 800 participants, + 5 pays représentés, + 300 entreprises présentes, + 3 accords de partenariat signés, et + 100 offres d'emploi générées.",
      },
      {
        q: "Quel est le budget prévisionnel de l'événement ?",
        a: "Le budget prévisionnel est estimé entre 55 et 60 millions de FCFA en coût totalement financier.",
      },
      {
        q: "Qui peut participer à Synca Conf ?",
        a: "L'événement s'adresse aux décideurs institutionnels, dirigeants d'entreprises, investisseurs, chercheurs, formateurs, startups, étudiants et jeunes talents tech — sénégalais et panafricains.",
      },
    ],
  },

  {
    id: "programme",
    label: "Programme",
    items: [
      {
        q: "Quels sont les 4 Summits thématiques ?",
        a: "Cybersécurité, Data & IA (Summit prioritaire de l'édition) · Cloud, Infrastructures de souveraineté numérique · Fintech, Innovation & Digital Leadership · Edtech, Learning & RH Technologies.",
      },
      {
        q: "Quels formats sont proposés pendant les 3 jours ?",
        a: "Keynotes, panels & tables rondes, conférences, masterclasses, stands d'exposition, visites d'entreprises, Executive Roundtable, Synca Conf Entreprises Tours, et le Hackathon Interuniversitaire.",
      },
      {
        q: "Qu'est-ce que l'Executive Roundtable ?",
        a: "Une table ronde restreinte réunissant dirigeants et décideurs autour d'enjeux stratégiques, dans un format confidentiel — réservée aux détenteurs du Pass Executive.",
      },
      {
        q: "Qu'est-ce que le Synca Conf Entreprises Tours ?",
        a: "Un programme de visites de terrain (datacenters, entreprises technologiques partenaires) réservé à une délégation restreinte de dirigeants et d'experts internationaux.",
      },
      {
        q: "Comment sont sélectionnés les intervenants et speakers ?",
        a: "L'équipe Synca invite des profils reconnus dans chaque domaine (cybersécurité, cloud, fintech, edtech, marketing digital…), en cohérence avec les thématiques des Summits. Toute personne intéressée peut aussi se manifester auprès de l'équipe organisatrice.",
      },
      {
        q: "Les masterclasses donnent-elles lieu à un contenu à emporter ?",
        a: "Oui. Chaque masterclass Synca Conf a pour finalité de produire un livrable concret pour les participants (document, plan d'action, prototype…), et non un simple contenu passif.",
      },
    ],
  },

  {
    id: "billetterie",
    label: "Billetterie",
    items: [
      {
        q: "Quels types de billets sont disponibles ?",
        a: "Un billet gratuit (réservé aux étudiants et invités), le Pass Pro, le Pass Premium, le Pass Executive, ainsi qu'un billet en ligne pour suivre l'événement à distance.",
      },
      {
        q: "Quels sont les avantages de chaque billet ?",
        a: "Le Pro donne accès aux 3 jours, conférences, panels et à l'espace exposition. Le Premium ajoute le déjeuner, une masterclass au choix et le Networking Lounge. L'Executive ajoute l'Executive Lounge, le dîner de clôture, le Synca Conf Entreprises Tours et une session de négociation de partenariats.",
      },
      {
        q: "Existe-t-il des billets gratuits ?",
        a: "Oui, un quota de billets gratuits est réservé aux étudiants ainsi qu'aux speakers, bénévoles, partenaires institutionnels, invités, communautés Tech, médias et partenaires universitaires.",
      },
      {
        q: "Comment fonctionne le tarif Early Bird ?",
        a: "Un nombre limité de billets Pro, Premium et Executive est proposé à tarif réduit. Le tarif Early Bird s'applique jusqu'à épuisement du quota dédié ou jusqu'à une date limite, selon la première des deux conditions atteintes.",
      },
      {
        q: "Existe-t-il un billet en ligne pour suivre l'événement à distance ?",
        a: "Oui, un billet en ligne donne accès à la diffusion en streaming des keynotes, panels et conférences, avec replay disponible, pour les personnes ne pouvant se déplacer à Dakar.",
      },
      {
        q: "Comment fonctionne le quota ambassadeurs ?",
        a: "Les ambassadeurs Synca disposent d'un quota de billets à distribuer via un code dédié, prélevé sur les quotas existants (Pro, Premium, Executive) et non ajouté en supplément.",
      },
      {
        q: "Le billet inclut-il l'hébergement ou le transport ?",
        a: "Non, sauf dispositif spécifique — comme pour les leads de communautés Tech sélectionnés au programme Synca Community Certified, ou les équipes universitaires du Hackathon, qui bénéficient d'une prise en charge logistique partielle.",
      },
    ],
  },

  {
    id: "hackathon",
    label: "Hackathon",
    items: [
      {
        q: "En quoi consiste le Hackathon ?",
        a: "Le Synca Cyber Challenge réunit des équipes d'étudiants autour de la conception de solutions de cybersécurité accessibles aux TPE, PME et MPME africaines, lors d'une compétition de 48h en présentiel pendant la conférence.",
      },
      {
        q: "Qui peut y participer ?",
        a: "Des équipes d'étudiants inscrites par leur université, dans le cadre d'un partenariat universitaire officiellement signé avec Synca.",
      },
      {
        q: "Comment une université peut-elle inscrire ses équipes ?",
        a: "En signant un partenariat universitaire avec Synca, puis en constituant ses équipes une fois les thématiques transmises par l'équipe Synca.",
      },
      {
        q: "Combien d'équipes une université peut-elle inscrire ?",
        a: "Deux équipes de 3 étudiants chacune, soit 6 candidats au total, chaque équipe travaillant sur un projet distinct.",
      },
      {
        q: "Comment se déroule la préparation avant le Hackathon ?",
        a: "Les équipes bénéficient d'un mois de préparation encadrée avant le début du Hackathon, qui se tient ensuite sur 48h pendant les 3 jours de la conférence.",
      },
      {
        q: "Quelles sont les récompenses ?",
        a: "Un Grand Prix pour la 1ère équipe (dotation cloud & cybersécurité, incubation, visibilité), des dotations pour les 2e et 3e équipes, ainsi que des prix spéciaux (Impact PME, Innovation, Coup de Cœur du Jury).",
      },
      {
        q: "Qu'est-ce que le Synca Pedagogy Award ?",
        a: "Un prix attribué directement à l'université de l'équipe gagnante, récompensant la meilleure méthodologie pédagogique, l'innovation pédagogique et la disposition de ressources opérationnelles adéquates pour la formation Tech.",
      },
    ],
  },

  {
    id: "universites",
    label: "Universités",
    items: [
      {
        q: "Comment une université devient-elle partenaire de Synca Conf ?",
        a: "En signant un partenariat universitaire officiel avec Synca, incluant la lettre d'engagement de sa direction.",
      },
      {
        q: "Qu'est-ce que Synca Community Certified ?",
        a: "Un programme de structuration et de gouvernance des communautés Tech africaines, intégré au programme officiel de Synca Conf, à travers un atelier co-organisé avec des experts, ouvert à toutes les communautés Tech africaines.",
      },
      {
        q: "Quelles sont les conditions de participation à Synca Community Certified ?",
        a: "Être fondateur ou co-fondateur d'une communauté Tech, disposer d'une activité documentée sur les 12 derniers mois, être disponible sur les 3 jours de la conférence, et s'engager à restituer les apprentissages à sa communauté.",
      },
      {
        q: "Quels dispositifs facilitent la participation des leads de communautés et des universités ?",
        a: "Une prise en charge logistique partielle (hébergement et mobilité sur Dakar — le billet d'avion restant à la charge du lead), un billet d'accès aux 3 jours de conférence, et la participation aux visites d'entreprises de l'écosystème sénégalais.",
      },
      {
        q: "Quelle est la date limite pour candidater ?",
        a: "La date limite de candidature est fixée au 31 décembre 2026, pour une annonce des candidats retenus à la mi-janvier 2027.",
      },
      {
        q: "Les universités doivent-elles contribuer financièrement au Hackathon ?",
        a: "Oui, chaque université met à disposition un fonds destiné à la prise en charge logistique de ses candidats (restauration, sécurité), avec un versement de 40 % des frais attendus une fois le partenariat confirmé.",
      },
    ],
  },

  {
    id: "sponsoring",
    label: "Sponsoring",
    items: [
      {
        q: "Quels sont les paliers de sponsoring disponibles ?",
        a: "Quatre paliers, du Bronze au Titre, chacun avec des avantages progressifs : visibilité, prise de parole, stand d'exposition, accès à l'Executive Roundtable et au Synca Conf Entreprises Tours.",
      },
      {
        q: "Existe-t-il des options de partenariat au-delà des paliers fixes ?",
        a: "Oui — naming d'un Summit, masterclass dédiée, side event, partenariat Hackathon, partenariat Job Dating, prix Synca Conf Awards, stand additionnel, ou slot de présentation de recherche.",
      },
      {
        q: "Comment devenir partenaire média ou communautaire ?",
        a: "Via un partenariat d'échange de visibilité (couverture de l'événement, interviews, visibilité croisée) plutôt qu'un sponsoring financier classique — à discuter directement avec l'équipe Partenariats.",
      },
      {
        q: "Une entreprise peut-elle intégrer sa solution technique à l'événement ?",
        a: "Oui, notamment pour des solutions de paiement ou d'infrastructure (ex. billetterie), sur la base d'un partenariat technique dédié, en complément ou non d'un palier de sponsoring.",
      },
      {
        q: "Qui contacter pour un partenariat ?",
        a: "Astou Diakhate, Responsable Sponsoring & Partenariats — astou.diakhate@sync-africa.com — +221 77 150 07 43.",
      },
    ],
  },

  {
    id: "exposition",
    label: "Exposition",
    items: [
      {
        q: "Comment inscrire mon entreprise à l'espace exposition ?",
        a: "Via le formulaire d'inscription exposants, qui couvre l'entreprise, le contact référent, le type de stand souhaité et les besoins logistiques.",
      },
      {
        q: "Quels types de stands sont proposés ?",
        a: "Standard, Premium ou mutualisé, selon le niveau de visibilité souhaité.",
      },
      {
        q: "L'exposition est-elle réservée aux sponsors ?",
        a: "Non — un stand peut être associé à un palier de sponsoring ou souscrit indépendamment, selon les disponibilités.",
      },
    ],
  },

  {
    id: "ambassadeurs",
    label: "Ambassadeurs",
    items: [
      {
        q: "Qu'est-ce que le programme Ambassadeurs Synca Conf ?",
        a: "Un programme bénévole permettant à des passionnés de tech de relayer l'événement, mobiliser leur réseau et représenter Synca Conf localement.",
      },
      {
        q: "Qui peut devenir ambassadeur ?",
        a: "Toute personne passionnée de technologie ou d'innovation, active sur les réseaux sociaux ou dans une communauté, basée en Afrique ou dans la diaspora.",
      },
      {
        q: "Quels sont les avantages du statut d'ambassadeur ?",
        a: "Badge d'accès à l'événement, certificat officiel, accès privilégié au réseau des partenaires, kit ambassadeur, et opportunité de devenir référent local pour les prochaines éditions.",
      },
      {
        q: "Comment candidater ?",
        a: "Via le formulaire de candidature Ambassadeurs, disponible sur les canaux officiels de Synca Conf.",
      },
    ],
  },

  {
    id: "builders",
    label: "Synca Builders",
    items: [
      {
        q: "Qu'est-ce que Synca Builders ?",
        a: "Un programme réunissant les acteurs de l'écosystème (devs, marketeurs, designers…) qui contribuent directement aux projets de Synca, sur la base d'un engagement annuel.",
      },
      {
        q: "Qui peut rejoindre le programme ?",
        a: "Toute personne active dans l'écosystème tech ou digital africain, disposant d'un portfolio ou de réalisations vérifiables, sur l'un des 5 tracks : Tech & Dev, Design & UX, Marketing & Growth, Contenu & Communauté, Partenariats & Ops.",
      },
      {
        q: "Quel est le niveau d'engagement demandé ?",
        a: "5 à 10 heures par mois, la participation à au moins un projet majeur de l'année, et la présence aux points de suivi mensuels et au Synca Builders Summit.",
      },
      {
        q: "Qu'est-ce que le Synca Builders Summit ?",
        a: "Une rencontre annuelle, en décembre, dédiée au bilan des contributions de l'année et à l'annonce des nouveaux projets de l'écosystème Synca.",
      },
    ],
  },

  {
    id: "pratique",
    label: "Infos pratiques",
    items: [
      {
        q: "Ai-je besoin d'un visa pour me rendre à Dakar ?",
        a: "Cela dépend de votre nationalité. Nous recommandons de vous renseigner directement auprès de l'ambassade ou du consulat du Sénégal de votre pays de résidence, ainsi que sur le site officiel des autorités sénégalaises.",
      },
      {
        q: "L'hébergement est-il inclus dans mon billet ?",
        a: "Non, sauf pour les participants bénéficiant d'un dispositif spécifique (leads de communautés retenus, équipes universitaires du Hackathon).",
      },
      {
        q: "Comment contacter l'équipe organisatrice ?",
        a: "Astou Diakhate — Sponsoring & Partenariats — astou.diakhate@sync-africa.com — +221 77 150 07 43. Rolle TINDJIETE — Fondateur, Synca — rolle.tindjiete@sync-africa.com — +228 70 48 41 64.",
      },
    ],
  },
];