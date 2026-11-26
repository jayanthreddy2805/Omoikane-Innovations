import { SITE_URL, isIndexable } from "@/lib/siteMetadata";

// Previews should neither be crawled nor advertise a sitemap of public pages.
export default function robots() {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
