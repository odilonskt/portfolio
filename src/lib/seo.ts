// lib/seo.ts
// URL pública do site e dados estruturados (JSON-LD) usados por buscadores e por IAs de busca.
import "server-only";

import { PROFILE, PROFILE_TEXT, SOCIAL_LINKS } from "@/lib/content/profile";
import { env } from "@/lib/env";
import { type Locale, localePath } from "@/lib/i18n/config";

/** SITE_URL > domínio de produção da Vercel > localhost (desenvolvimento). */
export function siteUrl(): URL {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(env.SITE_URL ?? (vercel ? `https://${vercel}` : "http://localhost:3000"));
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl()).toString();
}

/** Pessoa + site, em JSON-LD: o que Google e IAs de busca leem para saber quem é e o que o site é. */
export function homeJsonLd(locale: Locale) {
  const text = PROFILE_TEXT[locale];
  const url = absoluteUrl(localePath(locale));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${absoluteUrl("/")}#person`,
        name: PROFILE.name,
        jobTitle: text.role,
        description: text.bio,
        url,
        image: absoluteUrl(PROFILE.photos[1]),
        sameAs: SOCIAL_LINKS.map((link) => link.href),
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: PROFILE.name,
        url,
        inLanguage: locale,
        publisher: { "@id": `${absoluteUrl("/")}#person` },
      },
    ],
  };
}

