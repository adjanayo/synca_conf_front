import { createElement, type SVGProps } from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";

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
};

export { LINKS, PARAMETER };