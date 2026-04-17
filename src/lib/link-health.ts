import type { SitePost } from "@/lib/site-connector";

const siteNameForBot = (process.env.NEXT_PUBLIC_SITE_NAME || "Site")
  .replace(/[^a-z0-9]+/gi, "")
  .trim() || "Site";

const LINK_OBJECT_FIELDS = [
  "website",
  "targetUrl",
  "fileUrl",
  "pdfUrl",
  "documentUrl",
  "sourceUrl",
  "canonicalUrl",
] as const;

const HTML_FIELDS = ["description", "body", "excerpt", "summary", "bio", "content"] as const;

const URL_PATTERN = /https?:\/\/[^\s<>"')]+/gi;
const HREF_PATTERN = /href\s*=\s*["']([^"']+)["']/gi;

export type OutboundLinkSource = {
  postId: string;
  postSlug: string;
  task: string;
  field: string;
};

export type OutboundLinkCandidate = {
  url: string;
  source: OutboundLinkSource;
};

export type LinkHealthResult = {
  url: string;
  ok: boolean;
  status: number | null;
  checkedAt: string;
  sources: OutboundLinkSource[];
  error?: string;
};

const normalizeUrl = (raw: string) => raw.trim().replace(/[),.;]+$/, "");

const parseHttpUrl = (raw: string, baseOrigin: string) => {
  const value = normalizeUrl(raw);
  if (!value || value.startsWith("#")) return null;
  if (/^(mailto:|tel:|javascript:)/i.test(value)) return null;

  try {
    if (value.startsWith("//")) {
      return new URL(`https:${value}`);
    }
    if (/^https?:\/\//i.test(value)) {
      return new URL(value);
    }
    if (value.startsWith("/")) {
      return new URL(value, baseOrigin);
    }
    return null;
  } catch {
    return null;
  }
};

const isInternalToBase = (target: URL, baseOrigin: string) => {
  try {
    const base = new URL(baseOrigin);
    return target.hostname === base.hostname;
  } catch {
    return false;
  }
};

const extractFromHtml = (html: string) => {
  const urls = new Set<string>();

  for (const match of html.matchAll(HREF_PATTERN)) {
    if (typeof match[1] === "string") {
      urls.add(match[1]);
    }
  }

  for (const match of html.matchAll(URL_PATTERN)) {
    if (typeof match[0] === "string") {
      urls.add(match[0]);
    }
  }

  return Array.from(urls);
};

export const extractOutboundLinksFromPost = (post: SitePost, baseOrigin: string): OutboundLinkCandidate[] => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  const contentObj = content as Record<string, unknown>;
  const candidates: OutboundLinkCandidate[] = [];

  const baseSource: Omit<OutboundLinkSource, "field"> = {
    postId: post.id,
    postSlug: post.slug,
    task:
      typeof contentObj.type === "string" && contentObj.type.trim()
        ? contentObj.type.trim().toLowerCase()
        : "unknown",
  };

  const pushUrl = (raw: string, field: string) => {
    const parsed = parseHttpUrl(raw, baseOrigin);
    if (!parsed) return;
    if (isInternalToBase(parsed, baseOrigin)) return;

    candidates.push({
      url: parsed.toString(),
      source: {
        ...baseSource,
        field,
      },
    });
  };

  for (const field of LINK_OBJECT_FIELDS) {
    const value = contentObj[field];
    if (typeof value === "string" && value.trim()) {
      pushUrl(value, field);
    }
  }

  for (const field of HTML_FIELDS) {
    const value = contentObj[field];
    if (typeof value !== "string" || !value.trim()) continue;
    const links = extractFromHtml(value);
    for (const link of links) {
      pushUrl(link, field);
    }
  }

  if (typeof post.summary === "string" && post.summary.trim()) {
    const links = extractFromHtml(post.summary);
    for (const link of links) {
      pushUrl(link, "summary");
    }
  }

  if (Array.isArray(post.media)) {
    for (const mediaItem of post.media) {
      if (typeof mediaItem?.url === "string") {
        pushUrl(mediaItem.url, "media");
      }
    }
  }

  const dedupe = new Map<string, OutboundLinkCandidate>();
  for (const item of candidates) {
    const key = `${item.source.postId}::${item.source.field}::${item.url}`;
    if (!dedupe.has(key)) dedupe.set(key, item);
  }

  return Array.from(dedupe.values());
};

const checkLink = async (url: string, timeoutMs: number) => {
  const checkedAt = new Date().toISOString();

  const run = async (method: "HEAD" | "GET") =>
    fetch(url, {
      method,
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "User-Agent": `${siteNameForBot}-LinkHealthBot/1.0`,
      },
    });

  try {
    let response = await run("HEAD");
    if ([405, 501].includes(response.status)) {
      response = await run("GET");
    }

    const tolerantOk = [401, 403, 405, 406, 429].includes(response.status);
    const ok = response.ok || tolerantOk;

    return {
      url,
      ok,
      status: response.status,
      checkedAt,
      error: ok ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: null,
      checkedAt,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
};

export async function runLinkHealthChecks(
  candidates: OutboundLinkCandidate[],
  options?: { maxLinks?: number; timeoutMs?: number; concurrency?: number }
): Promise<LinkHealthResult[]> {
  const maxLinks = Math.max(1, Math.min(options?.maxLinks ?? 120, 1000));
  const timeoutMs = Math.max(1000, Math.min(options?.timeoutMs ?? 8000, 30000));
  const concurrency = Math.max(1, Math.min(options?.concurrency ?? 6, 20));

  const sourceMap = new Map<string, OutboundLinkSource[]>();

  for (const candidate of candidates) {
    const list = sourceMap.get(candidate.url) || [];
    list.push(candidate.source);
    sourceMap.set(candidate.url, list);
  }

  const uniqueUrls = Array.from(sourceMap.keys()).slice(0, maxLinks);
  const queue = [...uniqueUrls];
  const results: LinkHealthResult[] = [];

  const worker = async () => {
    while (queue.length) {
      const url = queue.shift();
      if (!url) continue;
      const checked = await checkLink(url, timeoutMs);
      results.push({
        ...checked,
        sources: sourceMap.get(url) || [],
      });
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  return results.sort((a, b) => {
    if (a.ok !== b.ok) return a.ok ? 1 : -1;
    return a.url.localeCompare(b.url);
  });
}
