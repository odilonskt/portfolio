import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

// Robôs de IA (busca e assistentes) podem ler as páginas públicas, como qualquer buscador.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];
const PRIVATE = ["/api/", "/*/dashboard", "/*/login"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
