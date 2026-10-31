/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          // Cache videos for repeat visits without changing their encoding or resolution.
          // Keep the lifetime limited because filenames may be reused when videos are updated.
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
