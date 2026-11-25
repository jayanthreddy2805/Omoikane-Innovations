import { SITE_URL, isIndexable } from "@/lib/siteMetadata";
export default function robots() { return {rules: {userAgent: "*", ...(isIndexable ? {allow: "/", disallow: ["/admin", "/api/"]} : {disallow: "/"})}, sitemap: `${SITE_URL}/sitemap.xml`}; }
