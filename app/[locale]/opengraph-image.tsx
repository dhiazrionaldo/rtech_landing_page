import { ImageResponse } from "next/og";

import { isLocale, locales } from "@/content/i18n";
import { seo } from "@/content/copy";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RTECH INDO";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Satori (the renderer behind next/og) resolves styles at build time with no
 * DOM and no CSS custom properties, so it cannot read the OKLCH tokens in
 * globals.css. These are the documented sRGB equivalents of the dark-mode
 * tokens — the one place in the codebase where a colour is written literally.
 * If a token changes in globals.css, change it here too.
 */
const token = {
  background: "#000000", // --background (.dark) oklch(0 0 0)
  foreground: "#fafafa", // --foreground (.dark) oklch(0.985 0 0)
  muted: "#737373", // --muted-foreground     oklch(0.556 0 0)
  border: "#262626", // --border (.dark)
  primary: "#b45309", // --primary (light)    oklch(0.555 0.163 48.998)
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : "id";
  const meta = seo[resolved];
  // Sector names stay English in both locales — that is how the deck writes
  // them — but the founding line is prose and has to follow the locale.
  const since = resolved === "id" ? "Sejak 2018" : "Since 2018";
  // The title carries an em-dash separator; the card reads better split on it.
  const [, tagline = meta.description] = meta.title.split(" — ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: token.background,
          padding: 72,
          // Echoes the hero's teal machine-glow without importing the gradient.
          backgroundImage:
            "radial-gradient(62% 52% at 50% 100%, rgba(45,212,191,0.16) 0%, rgba(20,184,166,0.05) 45%, transparent 76%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              background: token.primary,
              borderRadius: 3,
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              color: token.foreground,
              fontWeight: 600,
            }}
          >
            RTECH INDO
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 62,
            lineHeight: 1.12,
            color: token.foreground,
            maxWidth: 940,
            letterSpacing: -1.5,
          }}
        >
          {tagline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${token.border}`,
            paddingTop: 28,
            fontSize: 22,
            color: token.muted,
            letterSpacing: 1,
          }}
        >
          <div style={{ display: "flex" }}>Oil &amp; Gas · Aviation · Manufacturing</div>
          <div style={{ display: "flex" }}>{since}</div>
        </div>
      </div>
    ),
    size,
  );
}
