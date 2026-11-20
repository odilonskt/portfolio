// /llms.txt: resumo do site em texto simples para IAs (convenção llmstxt.org).
import { getPublishedPosts } from "@/lib/content/repository";
import { PROFILE, PROFILE_TEXT, SOCIAL_LINKS } from "@/lib/content/profile";
import { localePath } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPosts().catch(() => []);
  const text = PROFILE_TEXT.en;
  const lines = [
    `# ${PROFILE.name}`,
    "",
    `> ${text.role}. ${text.bio}`,
    "",
    "## Pages",
    `- [Home](${absoluteUrl(localePath("en"))}): projects, career journey, technologies and contact`,
    `- [Blog](${absoluteUrl(localePath("en", "/blog"))}): articles`,
    `- [Resume](${absoluteUrl(localePath("en", "/curriculo"))}): public resume`,
    "",
    "## Languages",
    "The site is available in Portuguese (/pt), English (/en) and Spanish (/es).",
    ...(posts.length
      ? ["", "## Articles", ...posts.map((p) => `- [${p.title}](${absoluteUrl(localePath("en", `/blog/${p.slug}`))}): ${p.excerpt}`)]
      : []),
    "",
    "## Links",
    ...SOCIAL_LINKS.map((link) => `- [${link.name}](${link.href})`),
  ];
  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
