import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";
import { cn } from "@/lib/utils";
import { htmlLang, isLocale, locales, type Locale } from "@/content/i18n";
import { seo } from "@/content/copy";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rtechindo.com";

/**
 * Archivo carries the display type. It has a real `wdth` axis (62–125), so the
 * headings get genuine width control rather than a synthetic squash.
 */
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

/** Body copy. Sober, engineering-adjacent, holds up at small sizes. */
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/** Labels, stat readouts, sector indices. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-plex",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const meta = seo[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: meta.title, template: "%s — RTECH INDO" },
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      // CLAUDE.md requires hreflang on a bilingual site. x-default points at
      // Indonesian: the audience, the clients, and the deck are all Indonesian.
      languages: {
        "id-ID": "/id",
        en: "/en",
        "x-default": "/id",
      },
    },
    openGraph: {
      type: "website",
      siteName: "RTECH INDO",
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
      locale: locale === "id" ? "id_ID" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark light",
};

/**
 * Runs synchronously while the browser parses <head>, so the theme class lands
 * on <html> before first paint instead of snapping over on hydration.
 */
const themeScript = `try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}`;

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={htmlLang[locale as Locale]}
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        display.variable,
        body.variable,
        mono.variable,
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
