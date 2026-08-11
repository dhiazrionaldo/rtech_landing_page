import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { StructuredData } from "@/components/seo/structured-data";
import { htmlLang, isLocale, locales, type Locale } from "@/content/i18n";
import { seo } from "@/content/copy";
import { SITE_URL } from "@/lib/site";

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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        // Lets Google use the full OG image in results rather than a thumbnail,
        // and stops it truncating the Indonesian description.
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    // Set GOOGLE_SITE_VERIFICATION in Vercel to verify Search Console by meta
    // tag. Omitted entirely when unset so we never ship an empty token.
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export const viewport: Viewport = {
  colorScheme: "dark light",
};

/**
 * Runs synchronously while the browser parses <head>, so both classes land on
 * <html> before first paint instead of snapping over on hydration.
 *
 * `js` is what gates the scroll-reveal start states in globals.css. It has to
 * be set here, in a blocking head script, rather than from an effect: set any
 * later and the page paints its content visible and then blinks it away. Set
 * here and a visitor without JavaScript never matches those rules at all, so
 * every revealed section is simply visible for them.
 *
 * The `classList.add` call is outside the try/catch that guards localStorage —
 * a browser with storage blocked still runs JavaScript, and swallowing the
 * class along with the storage error would leave that visitor looking at
 * permanently invisible sections.
 */
const bootScript = `document.documentElement.classList.add("js");try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}`;

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
      {/* A raw <script> in <head>, deliberately — NOT next/script.
​
          `<Script strategy="beforeInteractive">` was tried here and is wrong
          for this job: Next does not inline it, it queues the source into
          `self.__next_s` and runs it from its own runtime, which lands *after*
          <body> in the document and therefore after first paint. That is the
          one thing this script cannot tolerate. It sets the theme class and the
          `js` class that gates the scroll-reveal start states, so running it
          late means a flash of the wrong theme and a flash of content that then
          blinks out. Inline in <head> it executes during parse, before anything
          paints. Verify with:
            curl -s localhost:3000/id | grep -bo 'classList\|<body'
          — the classList offset must be smaller than the <body> offset. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <StructuredData locale={locale as Locale} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
