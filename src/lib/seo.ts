import type { Metadata } from "next";
import { cache } from "react";

import { SITE_CONFIG, type TaskKey, getTaskConfig } from "./site-config";
import { fetchSiteBootstrap, type SitePost } from "./site-connector";

/** Remote SEO config — long revalidate + per-request dedupe so metadata does not block navigation. */
const RUNTIME_SEO_REVALIDATE_SECONDS = 900;

const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");

export const canonicalForPath = (path = "/") =>
  `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

const baseOrigin = new URL(baseUrl).origin;

const normalizeCanonicalUrl = (value: string | undefined, fallbackPath: string) => {
  if (!value) return canonicalForPath(fallbackPath);

  try {
    const url = new URL(value, baseOrigin);
    if (url.origin !== baseOrigin) {
      return canonicalForPath(fallbackPath);
    }

    return canonicalForPath(`${url.pathname}${url.search}`);
  } catch {
    return canonicalForPath(fallbackPath);
  }
};

type RuntimeSeoDefaults = {
  defaultTitle?: string;
  titleTemplate?: string;
  defaultDescription?: string;
  defaultOgImage?: string;
  keywords?: string[];
};

type RuntimeSeoPage = {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string[];
  robotsIndex?: boolean;
  robotsFollow?: boolean;
};

type RuntimeSeoConfig = {
  defaults: RuntimeSeoDefaults;
  pages: Record<string, RuntimeSeoPage>;
};

const stripHtml = (value: string) =>
  value
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeDescription = (value?: string | null, fallback = SITE_CONFIG.seo.description) => {
  const text = value ? stripHtml(value) : "";
  const source = text || fallback;
  if (source.length <= 160) return source;
  return `${source.slice(0, 157).trimEnd()}...`;
};

const normalizePath = (value?: string | null) => {
  const raw = String(value || "").trim();
  if (!raw) return "/";
  const noHash = raw.split("#")[0].split("?")[0] || "/";
  if (noHash === "/") return "/";
  return `/${noHash.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

const sanitizeKeywords = (input: unknown): string[] => {
  if (!Array.isArray(input)) return [];
  return Array.from(
    new Set(
      input
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    )
  );
};

const parseSeoConfig = (config: unknown): RuntimeSeoConfig | null => {
  if (!config || typeof config !== "object" || Array.isArray(config)) return null;

  const source = config as Record<string, unknown>;
  const rawDefaults =
    source.seoDefaults && typeof source.seoDefaults === "object" && !Array.isArray(source.seoDefaults)
      ? (source.seoDefaults as Record<string, unknown>)
      : {};

  const defaults: RuntimeSeoDefaults = {
    defaultTitle:
      typeof rawDefaults.defaultTitle === "string" && rawDefaults.defaultTitle.trim()
        ? rawDefaults.defaultTitle.trim()
        : undefined,
    titleTemplate:
      typeof rawDefaults.titleTemplate === "string" && rawDefaults.titleTemplate.trim()
        ? rawDefaults.titleTemplate.trim()
        : undefined,
    defaultDescription:
      typeof rawDefaults.defaultDescription === "string" && rawDefaults.defaultDescription.trim()
        ? rawDefaults.defaultDescription.trim()
        : undefined,
    defaultOgImage:
      typeof rawDefaults.defaultOgImage === "string" && rawDefaults.defaultOgImage.trim()
        ? rawDefaults.defaultOgImage.trim()
        : undefined,
    keywords: sanitizeKeywords(rawDefaults.keywords),
  };

  const rawPages =
    source.seoPages && typeof source.seoPages === "object" && !Array.isArray(source.seoPages)
      ? (source.seoPages as Record<string, unknown>)
      : {};

  const pages: Record<string, RuntimeSeoPage> = {};
  for (const [path, value] of Object.entries(rawPages)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const page = value as Record<string, unknown>;
    const normalized = normalizePath(path);
    pages[normalized] = {
      title: typeof page.title === "string" ? page.title.trim() : undefined,
      description: typeof page.description === "string" ? page.description.trim() : undefined,
      canonical: typeof page.canonical === "string" ? page.canonical.trim() : undefined,
      ogImage: typeof page.ogImage === "string" ? page.ogImage.trim() : undefined,
      keywords: sanitizeKeywords(page.keywords),
      robotsIndex: typeof page.robotsIndex === "boolean" ? page.robotsIndex : undefined,
      robotsFollow: typeof page.robotsFollow === "boolean" ? page.robotsFollow : undefined,
    };
  }

  return { defaults, pages };
};

const mergeKeywords = (...groups: Array<string[] | undefined>) =>
  Array.from(
    new Set(
      groups
        .flatMap((group) => group || [])
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    )
  );

const buildRobots = (index: boolean, follow: boolean): Metadata["robots"] => ({
  index,
  follow,
  googleBot: {
    index,
    follow,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
});

const fetchRuntimeSeoConfig = cache(async (): Promise<RuntimeSeoConfig | null> => {
  try {
    const bootstrap = await fetchSiteBootstrap({ revalidate: RUNTIME_SEO_REVALIDATE_SECONDS });
    return parseSeoConfig(bootstrap?.site?.config);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`Runtime SEO bootstrap failed: ${msg}`);
    }
    return null;
  }
});

const resolveSeoContext = (path: string, runtime: RuntimeSeoConfig | null) => {
  const normalizedPath = normalizePath(path);
  const segments = normalizedPath.split("/").filter(Boolean);
  const baseRoute = segments.length ? `/${segments[0]}` : "/";

  const exact = runtime?.pages[normalizedPath];
  const base = normalizedPath === "/" ? undefined : runtime?.pages[baseRoute];

  const defaultTitle = runtime?.defaults.defaultTitle || SITE_CONFIG.seo.title;
  const titleTemplate = runtime?.defaults.titleTemplate || SITE_CONFIG.seo.titleTemplate;
  const defaultDescription = runtime?.defaults.defaultDescription || SITE_CONFIG.seo.description;
  const defaultOgImage = runtime?.defaults.defaultOgImage || SITE_CONFIG.defaultOgImage;

  return {
    path: normalizedPath,
    baseRoute,
    exact,
    base,
    canonical: normalizeCanonicalUrl(exact?.canonical, normalizedPath),
    defaultTitle,
    titleTemplate,
    defaultDescription,
    defaultOgImage,
    keywords: mergeKeywords(
      SITE_CONFIG.seo.keywords,
      runtime?.defaults.keywords,
      base?.keywords,
      exact?.keywords
    ),
    robotsIndex: exact?.robotsIndex ?? base?.robotsIndex ?? true,
    robotsFollow: exact?.robotsFollow ?? base?.robotsFollow ?? true,
  };
};

type PageMetadataOptions = {
  path: string;
  title?: string;
  description?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  image?: string;
  keywords?: string[];
};

export async function buildSiteMetadata(): Promise<Metadata> {
  const runtime = await fetchRuntimeSeoConfig();
  const ctx = resolveSeoContext("/", runtime);

  const siteTitle = ctx.exact?.title || ctx.defaultTitle;
  const siteDescription = normalizeDescription(
    ctx.exact?.description || ctx.defaultDescription,
    ctx.defaultDescription
  );

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteTitle,
      template: ctx.titleTemplate,
    },
    description: siteDescription,
    keywords: ctx.keywords,
    robots: buildRobots(ctx.robotsIndex, ctx.robotsFollow),
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    alternates: {
      canonical: ctx.canonical,
      languages: {
        "en-IN": ctx.canonical,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_CONFIG.name,
      title: siteTitle,
      description: siteDescription,
      url: ctx.canonical,
      locale: "en_IN",
      images: [{ url: ctx.exact?.ogImage || ctx.defaultOgImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: [ctx.exact?.ogImage || ctx.defaultOgImage],
    },
  };
}

export async function buildPageMetadata(options: PageMetadataOptions): Promise<Metadata> {
  const runtime = await fetchRuntimeSeoConfig();
  const ctx = resolveSeoContext(options.path, runtime);

  const title = ctx.exact?.title || options.title || ctx.defaultTitle;
  const description = normalizeDescription(
    ctx.exact?.description || options.description || ctx.defaultDescription,
    ctx.defaultDescription
  );
  const canonical = ctx.canonical;
  const image = ctx.exact?.ogImage || options.image || ctx.defaultOgImage;
  const ogTitle = options.openGraphTitle || title;
  const ogDescription = normalizeDescription(options.openGraphDescription || description, description);

  return {
    title,
    description,
    keywords: mergeKeywords(ctx.keywords, options.keywords),
    robots: buildRobots(ctx.robotsIndex, ctx.robotsFollow),
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      locale: "en_IN",
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}

export const buildTaskMetadata = async (
  task: TaskKey,
  options?: Omit<PageMetadataOptions, "path">
): Promise<Metadata> => {
  const config = getTaskConfig(task);
  const title = config ? `${config.label} | ${SITE_CONFIG.name}` : SITE_CONFIG.seo.title;
  const description = normalizeDescription(config?.description || SITE_CONFIG.seo.description);
  const path = config?.route || "/";

  return buildPageMetadata({
    path,
    title,
    description,
    openGraphTitle: title,
    openGraphDescription: description,
    ...options,
  });
};

export const buildPostMetadata = async (task: TaskKey, post: SitePost): Promise<Metadata> => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  const rawTitle =
    (typeof post.metaTitle === "string" && post.metaTitle.trim()) ||
    post.title;
  const rawDescription =
    (typeof post.metaDescription === "string" && post.metaDescription.trim()) ||
    (typeof post.summary === "string" && post.summary) ||
    (typeof (content as Record<string, unknown>).excerpt === "string"
      ? ((content as Record<string, unknown>).excerpt as string)
      : "") ||
    (typeof (content as Record<string, unknown>).description === "string"
      ? ((content as Record<string, unknown>).description as string)
      : "") ||
    (typeof (content as Record<string, unknown>).body === "string"
      ? ((content as Record<string, unknown>).body as string)
      : "") ||
    SITE_CONFIG.seo.description;

  const route = SITE_CONFIG.taskViews[task] || "/posts";
  const path = `${route}/${post.slug}`;

  const runtime = await fetchRuntimeSeoConfig();
  const ctx = resolveSeoContext(path, runtime);

  const title = typeof rawTitle === "string" && rawTitle.trim() ? rawTitle.trim() : `${post.title} | ${SITE_CONFIG.name}`;
  const description = normalizeDescription(rawDescription, ctx.defaultDescription);
  const image =
    post.media?.find((item) => item?.url)?.url ||
    (typeof (content as Record<string, unknown>).image === "string"
      ? ((content as Record<string, unknown>).image as string)
      : null) ||
    (typeof (content as Record<string, unknown>).featuredImage === "string"
      ? ((content as Record<string, unknown>).featuredImage as string)
      : null) ||
    ctx.exact?.ogImage ||
    ctx.base?.ogImage ||
    ctx.defaultOgImage;

  const url = ctx.canonical || canonicalForPath(path);
  const author = post.authorName || SITE_CONFIG.name;
  const isArticleLike = task === "article" || task === "comment";

  return {
    title,
    description,
    keywords: mergeKeywords(ctx.keywords, post.tags || []),
    robots: buildRobots(ctx.robotsIndex, ctx.robotsFollow),
    authors: [{ name: author }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image }],
      locale: "en_IN",
      siteName: SITE_CONFIG.name,
      type: isArticleLike ? "article" : "website",
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      ...(author ? { authors: [author] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};
