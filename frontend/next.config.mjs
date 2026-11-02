const isDevelopment = process.env.NODE_ENV === "development";
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").origin;
// Static rendering needs Next's inline hydration scripts. Restrict their sources,
// disable inline event handlers, and block embedding/objects without opting every route into SSR.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${apiOrigin}${isDevelopment ? " ws://localhost:* ws://127.0.0.1:*" : ""}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  images: {
    formats: ["image/avif", "image/webp"],
    imageSizes: [32, 48, 64, 96, 128, 192, 256, 384, 512],
  },
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/software-development", destination: "/careers/software", permanent: true },
      { source: "/electronics", destination: "/careers/electronics", permanent: true },
      { source: "/mechanical", destination: "/careers/mechanical", permanent: true },
      { source: "/services", destination: "/expertise", permanent: true },
      { source: "/products.html", has: [{ type: "query", key: "product", value: "ofc-x" }], destination: "/work#ofc-x", permanent: true },
      { source: "/products.html", has: [{ type: "query", key: "product", value: "oesc" }], destination: "/work#oesc", permanent: true },
      { source: "/products.html", has: [{ type: "query", key: "product", value: "ogn-x" }], destination: "/work#ogn-x", permanent: true },
      { source: "/products.html", has: [{ type: "query", key: "product", value: "ocom-x" }], destination: "/work#ocom-x", permanent: true },
    ];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    }];
  },
};

export default nextConfig;
