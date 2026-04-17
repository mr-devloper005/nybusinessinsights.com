export type SitePost = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  content?: Record<string, unknown> | null;
  media?: Array<{ url: string; type?: string }>;
  tags?: string[];
  authorName?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type SiteBootstrap = {
  site: {
    id: string;
    code: string;
    name: string;
    config?: Record<string, unknown>;
  };
  blueprint?: Record<string, unknown>;
};

export type SiteFeed<TPost = SitePost> = {
  site: SiteBootstrap["site"];
  posts: TPost[];
};

const API_BASE =
  process.env.NEXT_PUBLIC_MASTER_PANEL_URL ||
  process.env.NEXT_PUBLIC_MASTER_API_URL;
const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE;
const FEED_REVALIDATE_SECONDS = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_FEED_REVALIDATE_SECONDS ?? 300);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 300;
})();
const REQUEST_TIMEOUT_MS = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_PUBLIC_API_TIMEOUT_MS ?? 8000);
  return Number.isFinite(parsed) && parsed >= 1000 ? parsed : 8000;
})();

const formatConnectorFailureMessage = (path: string, error: unknown) => {
  const reason =
    error instanceof Error
      ? error.name === "TimeoutError" || error.name === "AbortError"
        ? "timed out"
        : error.message
      : String(error);
  return `Public connector request failed (${reason}) for …${path}`;
};

const isPublicConnectorDisabled = () => {
  if (process.env.NEXT_PUBLIC_SKIP_PUBLIC_CONNECTOR === "true") return true;
  // Default: no slow outbound calls in `next dev` unless explicitly enabled (keeps navigation fast).
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_ENABLE_PUBLIC_CONNECTOR_IN_DEV !== "true"
  ) {
    return true;
  }
  return false;
};

const getPublicUrl = (path: string) => {
  if (isPublicConnectorDisabled()) return null;
  if (!API_BASE || !SITE_CODE) return null;
  return `${API_BASE.replace(/\/$/, "")}/api/v1/public/${SITE_CODE}${path}`;
};

async function fetchPublicJson<T>(
  path: string,
  options?: { fresh?: boolean; revalidate?: number }
): Promise<T | null> {
  const target = getPublicUrl(path);
  if (!target) return null;

  const revalidateSeconds =
    typeof options?.revalidate === "number" && Number.isFinite(options.revalidate) && options.revalidate > 0
      ? options.revalidate
      : FEED_REVALIDATE_SECONDS;

  try {
    const signal =
      typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
        ? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        : undefined;
    const response = await fetch(target, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal,
      ...(options?.fresh ? { cache: "no-store" } : { next: { revalidate: revalidateSeconds } }),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Public connector request failed (${response.status}) for ${target}`);
      }
      return null;
    }

    const json = (await response.json()) as { success: boolean; data?: T };
    return json.data || null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(formatConnectorFailureMessage(path, error));
    }
    return null;
  }
}

export async function fetchSiteBootstrap(options?: {
  fresh?: boolean;
  revalidate?: number;
}): Promise<SiteBootstrap | null> {
  return fetchPublicJson<SiteBootstrap>("/bootstrap", options);
}

export async function fetchSiteFeed<TPost = SitePost>(
  limit = 50,
  options?: { fresh?: boolean; revalidate?: number; category?: string; task?: string }
): Promise<SiteFeed<TPost> | null> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (typeof options?.category === "string" && options.category.trim()) {
    params.set("category", options.category.trim().toLowerCase());
  }
  if (typeof options?.task === "string" && options.task.trim()) {
    params.set("task", options.task.trim().toLowerCase());
  }
  return fetchPublicJson<SiteFeed<TPost>>(`/feed?${params.toString()}`, {
    fresh: options?.fresh,
    revalidate: options?.revalidate,
  });
}
