import { ImageResponse } from "next/og";

import { PROFILE, PROFILE_TEXT } from "@/lib/content/profile";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";

export const alt = PROFILE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const text = PROFILE_TEXT[isLocale(lang) ? lang : DEFAULT_LOCALE];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, padding: 80, background: "#0b0b10", color: "#fafafa" }}>
        <div style={{ fontSize: 84, fontWeight: 700 }}>{PROFILE.name}</div>
        <div style={{ fontSize: 44, color: "#a1a1aa" }}>{text.role}</div>
      </div>
    ),
    size,
  );
}
