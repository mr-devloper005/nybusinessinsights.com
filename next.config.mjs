import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value:
              [
                "default-src 'self'",
                "img-src 'self' data: blob: https: http:",
                `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com${isProd ? "" : " https://vercel.live"}`,
                "style-src 'self' 'unsafe-inline'",
                "connect-src 'self' https: http: wss:",
                "frame-src 'self' https://www.google.com https://www.google.com/maps https://maps.google.com https://api.seoparadox.com https://www.openstreetmap.org https://openstreetmap.org",
                "frame-ancestors 'self'",
                "base-uri 'self'",
                "form-action 'self'",
              ].join("; "),
          },
        ],
      },
    ];
  },
}

export default nextConfig
