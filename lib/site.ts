/**
 * The canonical origin for every absolute URL the site emits: `metadataBase`,
 * hreflang, `og:url`, the sitemap, robots, and JSON-LD.
 *
 * This value MUST be a hostname that actually resolves in DNS. If it points at
 * a host with no record, every page canonicalises to an unreachable URL —
 * Googlebot follows the canonical, fails to fetch it, and drops the page from
 * the index entirely. That is exactly what happened here: the deployment had
 * `NEXT_PUBLIC_SITE_URL` set to the bare apex `rtechindo.com`, which has no A
 * record, while the site is served from `www.rtechindo.com`.
 *
 * If the apex is ever pointed at Vercel and made primary, change this default
 * and the `NEXT_PUBLIC_SITE_URL` env var together — never one alone.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rtechindo.com"
).replace(/\/+$/, "");

/** Absolute URL for a site-root-relative path. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
