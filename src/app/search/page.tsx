import Link from "next/link";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { fetchSiteFeed } from "@/lib/site-connector";
import { buildPostUrl, getPostTaskKey } from "@/lib/task-data";
import { getMockPostsForTask } from "@/lib/mock-posts";
import { SITE_CONFIG } from "@/lib/site-config";

export const revalidate = 3;

const matchText = (value: string, query: string) => value.toLowerCase().includes(query);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

const compactText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return stripHtml(value).replace(/\s+/g, " ").trim().toLowerCase();
};

function buildSearchHref(parts: { q?: string; category?: string; task?: string }) {
  const p = new URLSearchParams();
  p.set("master", "1");
  if (parts.q?.trim()) p.set("q", parts.q.trim());
  if (parts.category?.trim()) p.set("category", parts.category.trim());
  if (parts.task?.trim()) p.set("task", parts.task.trim());
  const qs = p.toString();
  return qs ? `/search?${qs}` : "/search?master=1";
}

function excerptFromPost(post: { summary?: string | null; content?: unknown }) {
  const raw = (post.summary || "").trim();
  if (raw) return raw.length > 200 ? `${raw.slice(0, 197)}…` : raw;
  const c = post.content && typeof post.content === "object" ? (post.content as Record<string, unknown>) : {};
  const body = typeof c.body === "string" ? stripHtml(c.body).replace(/\s+/g, " ").trim() : "";
  if (body) return body.length > 200 ? `${body.slice(0, 197)}…` : body;
  return "Open the post for the full story.";
}

function categoryFromPost(post: { content?: unknown; tags?: string[] }) {
  const c = post.content && typeof post.content === "object" ? (post.content as Record<string, unknown>) : {};
  if (typeof c.category === "string" && c.category.trim()) return c.category.trim();
  const t = post.tags?.find((x) => typeof x === "string" && x);
  return t || "Post";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>;
}) {
  const resolved = (await searchParams) || {};
  const query = (resolved.q || "").trim();
  const normalized = query.toLowerCase();
  const category = (resolved.category || "").trim().toLowerCase();
  const task = (resolved.task || "").trim().toLowerCase();
  const useMaster = resolved.master !== "0";
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined,
  );
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.flatMap((t) => getMockPostsForTask(t.key));

  const filtered = posts.filter((post) => {
    const c =
      post.content && typeof post.content === "object" ? (post.content as Record<string, unknown>) : {};
    const typeText = compactText(c.type);
    if (typeText === "comment") return false;
    const description = compactText(c.description);
    const body = compactText(c.body);
    const excerpt = compactText(c.excerpt);
    const categoryText = compactText(c.category);
    const tags = Array.isArray(post.tags) ? post.tags.join(" ") : "";
    const tagsText = compactText(tags);
    const derivedCategory = categoryText || tagsText;
    if (category && !derivedCategory.includes(category)) return false;
    if (task && typeText && typeText !== task) return false;
    if (!normalized.length) return true;
    return (
      matchText(compactText(post.title || ""), normalized) ||
      matchText(compactText(post.summary || ""), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    );
  });

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24);
  const hasActiveFilters = Boolean(category || task);

  return (
    <div className="min-h-screen bg-[#07080d] text-zinc-100">
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0c0e16] to-[#07080d] py-14 sm:py-16">
          <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-lime-400/10 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">Find on {SITE_CONFIG.name}</p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl">
              Search
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-zinc-400 sm:text-base">
              {query
                ? `Showing matches for “${query}” across titles, summaries, tags, and body text.`
                : "Browse the latest indexed posts. Add keywords to narrow results."}
            </p>

            <form action="/search" method="get" className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-stretch">
              <input type="hidden" name="master" value="1" />
              {category ? <input type="hidden" name="category" value={category} /> : null}
              {task ? <input type="hidden" name="task" value={task} /> : null}
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Search headlines, topics, authors…"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/25"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-lime-400 px-8 text-xs font-bold uppercase tracking-[0.12em] text-zinc-950 hover:bg-lime-300 sm:px-10"
              >
                Search
              </button>
            </form>

            {hasActiveFilters ? (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Filters</span>
                {category ? (
                  <Link
                    href={buildSearchHref({ q: query, task })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:border-lime-400/40"
                  >
                    category: {category}
                    <X className="h-3 w-3" aria-hidden />
                  </Link>
                ) : null}
                {task ? (
                  <Link
                    href={buildSearchHref({ q: query, category })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:border-lime-400/40"
                  >
                    type: {task}
                    <X className="h-3 w-3" aria-hidden />
                  </Link>
                ) : null}
                <Link href="/search?master=1" className="text-xs font-semibold text-lime-300 hover:text-lime-200">
                  Clear all
                </Link>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <Sparkles className="h-4 w-4 text-lime-400/80" />
              <span>
                <span className="font-semibold text-zinc-300">{results.length}</span>{" "}
                {results.length === 1 ? "result" : "results"}
                {query ? <span className="text-zinc-600"> · master index</span> : null}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          {results.length ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {results.map((post) => {
                const postTask = getPostTaskKey(post);
                const href = postTask ? buildPostUrl(postTask, post.slug) : `/archive/${post.slug}`;
                const cat = categoryFromPost(post);
                return (
                  <Link
                    key={post.id}
                    href={href}
                    className="group flex flex-col rounded-[1.35rem] border border-white/10 bg-[#11131d] p-6 transition hover:border-lime-400/35 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-lime-400/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-lime-300">
                        {cat}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-lime-300" />
                    </div>
                    <h2 className="mt-3 text-lg font-bold uppercase leading-snug tracking-tight text-white sm:text-xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{excerptFromPost(post)}</p>
                    <p className="mt-4 text-xs text-zinc-600">
                      {post.authorName || "Editorial"} ·{" "}
                      {new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-lg rounded-[1.5rem] border border-dashed border-white/15 bg-[#0f111a] px-8 py-14 text-center">
              <Search className="mx-auto h-10 w-10 text-zinc-600" />
              <p className="mt-4 text-base font-semibold text-zinc-200">No matching posts</p>
              <p className="mt-2 text-sm text-zinc-500">
                {query
                  ? "Try shorter keywords, check spelling, or clear filters."
                  : "Nothing in the index yet, or the feed is still warming up."}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/search?master=1"
                  className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-white/10"
                >
                  Reset search
                </Link>
                <Link
                  href={SITE_CONFIG.tasks[0]?.route || "/archive"}
                  className="rounded-full bg-lime-400 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-zinc-950 hover:bg-lime-300"
                >
                  Open archive
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
