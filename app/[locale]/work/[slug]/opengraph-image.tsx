import { ImageResponse } from "next/og";

import { copy } from "@/content/copy";
import { isLocale, locales } from "@/content/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RTECH INDO";

function findProduct(locale: (typeof locales)[number], slug: string) {
  return copy[locale].products.items.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    copy[locale].products.items.map((p) => ({ locale, slug: p.slug })),
  );
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
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolved = isLocale(locale) ? locale : "id";
  const t = copy[resolved];
  const product = findProduct(resolved, slug);
  const status = product
    ? product.status === "in-production"
      ? t.rails.inProduction
      : t.rails.delivered
    : "";
  const meta = [product?.client, product?.sector, status, product ? String(product.year) : ""]
    .filter(Boolean)
    .join(" · ");

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
          {product?.name ?? "RTECH INDO"}
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
          <div style={{ display: "flex" }}>{meta}</div>
        </div>
      </div>
    ),
    size,
  );
}
