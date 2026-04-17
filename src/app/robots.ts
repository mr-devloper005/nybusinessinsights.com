import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/site-config";

const BASE_URL = SITE_CONFIG.baseUrl.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/settings", "/create", "/local", "/login", "/register"],
      },
    ],
    host: BASE_URL,
    sitemap: [`${BASE_URL}/sitemap.xml`, `${BASE_URL}/sitemap-images.xml`],
  };
}
