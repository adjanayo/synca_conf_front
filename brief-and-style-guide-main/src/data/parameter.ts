import { createElement, type SVGProps } from "react";
import { Briefcase, Code2, Facebook, Instagram, Linkedin, PartyPopper, Shield, Sparkles, Users } from "lucide-react";

const TikTokIcon = (props: SVGProps<SVGSVGElement>) =>
  createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
    },
    createElement("path", {
      d: "M16.6 5.82a4.27 4.27 0 0 1-1.06-2.82h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.5 2.54 2.54 0 0 1 1 .2v-3.23a5.72 5.72 0 0 0-.98-.09 5.83 5.83 0 1 0 5.83 5.83V8.69a7.35 7.35 0 0 0 4.29 1.31V6.9a4.29 4.29 0 0 1-3.39-1.08Z",
    })
  );

const LINKS = [
  {
    to: "https://www.linkedin.com/showcase/synca-conf/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    to: "https://www.tiktok.com/@synca.conf.dakar?_r=1&_t=ZS-98MnqDx90aK",
    label: "TikTok",
    icon: TikTokIcon,
  },
  {
    to: "https://www.instagram.com/synca_conf?igsh=MXhka21qcmZpc2E2cA==",
    label: "Instagram",
    icon: Instagram,
  },
  {
    to: "https://www.facebook.com/Syncaconf",
    label: "Facebook",
    icon: Facebook,
  },
];

const PARAMETER = {
  logo: "/parameter/Logoicone orange blanc_CMJN.svg",
  title: "Synca Cyber",
  slogan: "+2000 fondateurs, décideurs, professionnels et étudiants autour de l'économie numérique, des nouvelles technologies et de l'industrie de la formation Tech en Afrique.",
  date: "16–18 Mars 2027",
  lieu: "Dakar, Sénégal",
  participants: "+2 000 participants",
};

const FEATURES = [
  { i: Sparkles, t: "Conférence principale" },
  { i: Code2, t: "Keynotes" },
  { i: Code2, t: "Panels" },
  { i: Code2, t: "Village d'exposition" },
  { i: Code2, t: "Démonstrations" },
  { i: Code2, t: "Networking général" },
  { i: Code2, t: "Programme digital" },
  { i: Code2, t: "Job & Internship Board" },

  { i: Shield, t: "Hackathon interuniversitaire" },
  { i: Briefcase, t: "Expositions Tech" },
  { i: Users, t: "Job Fair & B2B" },
  { i: PartyPopper, t: "Side event" },
];


const TICKETS = [
  { name: "VIP", price: "40 000", target: "VIP", perks: ["Déjeuner 3 jours", "1 masterclass au choix", "Networking Lounge", "Accès prioritaire à certaines activités", "Kit participant", "Certificat de participation à la Masterclass"], badge: "" },
  { name: "PRO", price: "25 000", target: "PRO", perks: ["Conf + Expo", "Networking", "1 déjeuner inclus"], badge: "Populaire" },
  { name: "Executif", price: "35 000", target: "Executif", perks: ["Pitching B2B", "Networking VIP", "Accès complet"], badge: "" },
  { name: "Premium", price: "100 000", target: "Décideurs & partenaires", perks: ["Tout inclus 3 jours", "Dîner gala", "After party"], badge: "Premium" },
  { name: "En ligne", price: "10 000", target: "En ligne", perks: ["Diffusion en streaming des keynotes", "Panels et conférences (hors ateliers en présentiel, Executive Lounge, dîner, Enterprise Tours)", "Replay disponible pendant une durée à définir." ], badge: "" },
  { name: "Etudiant", price: "Gratuit(limité)", target: "En ligne", perks: ["Diffusion en streaming des keynotes", "Panels et conférences (hors ateliers en présentiel, Executive Lounge, dîner, Enterprise Tours)", "Replay disponible pendant une durée à définir." ], badge: "" },

];



export { LINKS, PARAMETER, FEATURES, TICKETS };