import type { IconType } from "react-icons";
import { IoLogoFirebase } from "react-icons/io5";
import {
  SiCss3,
  SiDocker,
  SiExpress,
  SiGit,
  SiJavascript,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbApi } from "react-icons/tb";

import type { Technology } from "@/lib/content/profile";

export const TECH_ICONS: Record<Technology, IconType> = {
  "Next.js": SiNextdotjs,
  React: SiReact,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  "Node.js": SiNodedotjs,
  NestJS: SiNestjs,
  Express: SiExpress,
  PostgreSQL: SiPostgresql,
  Docker: SiDocker,
  Tailwind: SiTailwindcss,
  Git: SiGit,
  Firebase: IoLogoFirebase,
  CSS3: SiCss3,
  RESTful: TbApi,
};
