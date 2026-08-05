import type { MetadataRoute } from "next";

import { absoluteUrl, SITE_URL } from "@/lib/site";

/**
 * Served at /robots.txt. Nothing here is private, so the whole site is
 * crawlable; the file exists mainly to point crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
