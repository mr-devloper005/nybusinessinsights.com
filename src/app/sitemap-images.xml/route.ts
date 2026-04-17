import { fetchSiteFeed, type SitePost } from "@/lib/site-connector";
import { SITE_CONFIG } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = SITE_CONFIG.baseUrl.replace(/\/$/, "");

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const isHttpUrl = (value?: string | null) =>
  typeof value === "string" && /^https?:\/\//i.test(value);

const getTaskFromPost = (post: SitePost) => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  const explicitType =
    typeof (content as { type?: unknown }).type === "string"
      ? String((content as { type?: string }).type)
      : "";

  if (explicitType.trim()) return explicitType.trim().toLowerCase();

  if (Array.isArray(post.tags)) {
    const fromTag = post.tags.find((tag) => typeof tag === "string" && tag.trim());
    if (fromTag) return String(fromTag).trim().toLowerCase();
  }

  return "";
};

const getFreshestDate = (post: SitePost) => {
  const candidates = [post.updatedAt, post.publishedAt, post.createdAt];
  for (const value of candidates) {
    if (typeof value !== "string" || !value.trim()) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return new Date().toISOString();
};

const collectPostImageUrls = (post: SitePost) => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  const contentObj = content as Record<string, unknown>;

  const mediaImages = Array.isArray(post.media)
    ? post.media
        .map((item) => item?.url)
        .filter((url): url is string => isHttpUrl(url))
    : [];

  const contentImages: string[] = [];
  const pushImage = (value: unknown) => {
    if (typeof value === "string" && isHttpUrl(value)) {
      contentImages.push(value);
    }
  };

  pushImage(contentObj.logo);
  pushImage(contentObj.image);
  pushImage(contentObj.featuredImage);
  pushImage(contentObj.coverImage);
  pushImage(contentObj.thumbnail);

  if (Array.isArray(contentObj.images)) {
    for (const item of contentObj.images) {
      pushImage(item);
    }
  }

  return [...new Set([...mediaImages, ...contentImages])];
};

export async function GET() {
  const feed = await fetchSiteFeed(1000, { fresh: true });
  const taskRouteMap = new Map<string, string>(
    Object.entries(SITE_CONFIG.taskViews).map(([task, route]) => [
      String(task).toLowerCase(),
      route || "/posts",
    ])
  );

  const entries = (feed?.posts || [])
    .map((post) => {
      const images = collectPostImageUrls(post);
      if (!images.length || !post.slug) return null;

      const task = getTaskFromPost(post);
      const route = taskRouteMap.get(task) || "/posts";
      return {
        loc: `${BASE_URL}${route}/${post.slug}`,
        lastmod: getFreshestDate(post),
        images,
      };
    })
    .filter((entry): entry is { loc: string; lastmod: string; images: string[] } => Boolean(entry));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    entries
      .map((entry) => {
        const imageXml = entry.images
          .map((image) => `    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`)
          .join("\n");

        return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n${imageXml}\n  </url>`;
      })
      .join("\n") +
    `\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
