type Speaker = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  linkedin?: string;
};

const SPEAKERS: Speaker[] = [
  {
    id: "christian-kpolo",
    name: "Dr Christian Kpolo",
    role: "Docteur en droit, Avocat & Enseignant-chercheur, spécialiste de la propriété intellectuelle, du droit du numérique et de la protection des données personnelles",
    bio: "Dr Christian Kpolo est un juriste et chercheur dont le parcours se situe à la croisée du droit, du numérique et de l'innovation. Après une spécialisation en propriété intellectuelle, il développe une expertise autour du droit du numérique, des données personnelles et des nouvelles technologies, tout en exerçant comme avocat et enseignant-chercheur. Ses travaux et interventions portent notamment sur les enjeux juridiques liés aux transformations technologiques et à la souveraineté numérique en Afrique.",
    photo: "/speakers/christian-kpolo.jpg",
    linkedin: "https://www.linkedin.com/in/dr-christian-kpolo-87bb4668",
  },
  {
    id: "leonel-ngoya",
    name: "Leonel Ngoya",
    role: "Software Developer",
    bio: "Leonel Ngoya est un développeur logiciel spécialisé dans le développement web. Créateur de produits numériques et contributeur Open Source, il partage son expertise à travers ses projets, ses contenus et ses interventions dans la communauté tech, avec une ouverture forte sur l'écosystème international.",
    photo: "/speakers/leonel-ngoya.jpg",
    linkedin: "https://www.linkedin.com/in/lndev",
  },
  {
    id: "marylin-marchal",
    name: "Marylin Marchal",
    role: "Experte GRC et criminalité financière – Consultante et formatrice",
    bio: "Marylin Marchal accompagne depuis plus de vingt ans les institutions financières, les entreprises et les professionnels assujettis dans le renforcement de leurs dispositifs de gouvernance, de gestion des risques et de conformité. Spécialisée dans la lutte contre le blanchiment de capitaux et le financement du terrorisme, les sanctions internationales, la lutte contre la fraude et la corruption, elle intervient régulièrement en Europe et en Afrique lors de formations, conférences et missions de conseil.",
    photo: "/speakers/marylin-marchal.jpg",
    linkedin: "https://www.linkedin.com/in/marylin-marchal-07740137",
  },
];

export { SPEAKERS };
export type { Speaker };
