import { SITE_CONFIG, type TaskKey } from "./site-config";
import { fetchSiteFeed, type SiteFeed, type SitePost } from "./site-connector";
import { getMockPostsForTask } from "./mock-posts";
import { isValidCategory } from "./categories";
import { getHomeEditorialMockPosts } from "./home-editorial-mock";

const getTaskContentType = (task: TaskKey) =>
  SITE_CONFIG.tasks.find((item) => item.key === task)?.contentType || task;

const getFallbackMockPosts = (task: TaskKey) =>
  task === "mediaDistribution" ? getHomeEditorialMockPosts() : getMockPostsForTask(task);

const getPostType = (post: SitePost) => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  const explicit = typeof (content as any).type === "string" ? String((content as any).type) : "";
  if (explicit) return explicit;
  if (Array.isArray(post.tags)) {
    const tag = post.tags.find((item) => typeof item === "string");
    if (tag) return tag;
  }
  return "";
};

export const getPostTaskKey = (post: SitePost): TaskKey | null => {
  const postType = getPostType(post);
  const matched = SITE_CONFIG.tasks.find((task) => task.contentType === postType);
  if (matched) return matched.key;
  const direct = SITE_CONFIG.tasks.find((task) => task.key === (postType as TaskKey));
  return direct?.key || null;
};

export const fetchTaskPosts = async (
  task: TaskKey,
  limit = 8,
  options?: { allowMockFallback?: boolean; fresh?: boolean; revalidate?: number }
) => {
  const allowMockFallback =
    options?.allowMockFallback ??
    (task === "mediaDistribution" ||
      process.env.NEXT_PUBLIC_USE_MOCK_CONTENT === "true");
  const type = getTaskContentType(task);
  const effectiveRevalidate =
    options?.fresh === true ? undefined : (options?.revalidate ?? 120);
  const feedOpts = { fresh: options?.fresh, revalidate: effectiveRevalidate };
  const pickTaskPosts = (feed: SiteFeed<SitePost> | null) => {
    if (!feed) return [];
    return feed.posts
      .filter((post) => {
        const status =
          typeof (post as any).status === "string"
            ? String((post as any).status).toUpperCase()
            : "";
        if (status && status !== "PUBLISHED") return false;
        if (getPostType(post) !== type) return false;
        const content = post.content && typeof post.content === "object" ? post.content : {};
        const category = typeof (content as any).category === "string" ? (content as any).category : "";
        return !category || isValidCategory(category);
      })
      .slice(0, limit);
  };

  try {
    const cachedFeed = await fetchSiteFeed(limit * 6, feedOpts);
    const cachedPosts = pickTaskPosts(cachedFeed);
    if (cachedPosts.length) return cachedPosts;

    if (options?.fresh) {
      return allowMockFallback ? getFallbackMockPosts(task).slice(0, limit) : [];
    }

    if (!cachedFeed) {
      return allowMockFallback ? getFallbackMockPosts(task).slice(0, limit) : [];
    }

    const freshFeed = await fetchSiteFeed(limit * 6, { fresh: true });
    const filtered = pickTaskPosts(freshFeed);
    return filtered.length || !allowMockFallback
      ? filtered
      : getFallbackMockPosts(task).slice(0, limit);
  } catch {
    return allowMockFallback ? getFallbackMockPosts(task).slice(0, limit) : [];
  }
};

export const fetchTaskPostBySlug = async (task: TaskKey, slug: string) => {
  const allowMockFallback =
    task === "mediaDistribution" ||
    process.env.NEXT_PUBLIC_USE_MOCK_CONTENT === "true";
  const type = getTaskContentType(task);
  const resolveFromFeed = (feed: SiteFeed<SitePost> | null) =>
    feed?.posts.find((post) => post.slug === slug && getPostType(post) === type) || null;

  try {
    const cachedFeed = await fetchSiteFeed(200, { revalidate: 120 });
    const cachedMatch = resolveFromFeed(cachedFeed);
    if (cachedMatch) return cachedMatch;

    if (!cachedFeed) {
      return allowMockFallback
        ? getFallbackMockPosts(task).find((post) => post.slug === slug) || null
        : null;
    }

    const freshFeed = await fetchSiteFeed(200, { fresh: true });
    const freshMatch = resolveFromFeed(freshFeed);
    if (freshMatch) return freshMatch;
  } catch {
    // fall through to mock data
  }

  return allowMockFallback
    ? getFallbackMockPosts(task).find((post) => post.slug === slug) || null
    : null;
};

export const buildPostUrl = (task: TaskKey, slug: string) => {
  const view = SITE_CONFIG.taskViews[task] || "/posts";
  return `${view}/${slug}`;
};

const isValidImageUrl = (value?: string | null) =>
  typeof value === "string" && (value.startsWith("/") || /^https?:\/\//i.test(value));

export const getPostImages = (post: SitePost): string[] => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaUrls = media
    .map((item) => item?.url)
    .filter((url): url is string => isValidImageUrl(url));
  const content = post.content && typeof post.content === "object" ? post.content : {};
  const contentAny = content as Record<string, unknown>;
  const contentImage =
    typeof contentAny.image === "string" ? contentAny.image : null;
  const contentImages = Array.isArray(contentAny.images)
    ? contentAny.images.filter((url): url is string => isValidImageUrl(url))
    : [];
  const contentLogo =
    typeof contentAny.logo === "string" ? contentAny.logo : null;

  return [
    ...mediaUrls,
    ...contentImages,
    ...(isValidImageUrl(contentImage) ? [contentImage as string] : []),
    ...(isValidImageUrl(contentLogo) ? [contentLogo as string] : []),
  ];
};
