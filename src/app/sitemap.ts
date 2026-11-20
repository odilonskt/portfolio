import type { MetadataRoute } from "next";

import { getPublishedPosts } from "@/lib/content/repository";
import { HTML_LANG, LOCALES, localePath } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

/** Uma entrada por idioma, cada uma apontando as outras versões (hreflang). */
function entry(route: string, lastModified?: string): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], absoluteUrl(localePath(l, route))]));
  return LOCALES.map((l) => ({
    url: absoluteUrl(localePath(l, route)),
    lastModified,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    posts = await getPublishedPosts();
  } catch {
    // Sem acesso ao banco, o sitemap ainda lista as páginas fixas
  }
  return [
    ...entry("/"),
    ...entry("/blog"),
    ...entry("/curriculo"),
    ...posts.flatMap((post) => entry(`/blog/${post.slug}`, post.updatedAt)),
  ];
}
