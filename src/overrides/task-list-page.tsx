import Link from 'next/link'
import { ArrowRight, FileText, Search } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { fetchTaskPosts } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'

export const TASK_LIST_PAGE_OVERRIDE_ENABLED = true

function excerpt(text?: string | null) {
  const value = (text || '').trim()
  if (!value) return 'Read the full post for the complete update.'
  return value.length > 220 ? `${value.slice(0, 217).trimEnd()}…` : value
}

function categoryLabel(post: { content?: unknown }) {
  const c = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return String(c.category || 'Update')
}

export async function TaskListPageOverride(_: { task: TaskKey; category?: string }) {
  const posts = await fetchTaskPosts('mediaDistribution', 24, { fresh: true })
  const recent = posts.slice(0, 6)

  return (
    <div className="min-h-screen bg-[#07080d] text-zinc-100">
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0c0e16] to-[#07080d] py-14 sm:py-18">
          <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-lime-400/8 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">{SITE_CONFIG.name}</p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Archive
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Every published guest post and desk story in one scan-friendly list. Open any row for the full article.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">
                {posts.length} {posts.length === 1 ? 'story' : 'stories'}
              </span>
              <Link
                href="/search?master=1"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-lime-300 hover:text-lime-200"
              >
                Search archive
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 lg:px-8 lg:py-14">
          <div className="space-y-8">
            {posts.length ? (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-[1.5rem] border border-white/10 bg-[#11131d] p-6 transition hover:border-lime-400/35 sm:p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-lime-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lime-300">
                      {categoryLabel(post)}
                    </span>
                    <time className="text-xs tabular-nums text-zinc-500">
                      {new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <h2 className="mt-4 text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl">
                    <Link href={`/archive/${post.slug}`} className="transition hover:text-lime-200">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500">by {post.authorName || 'Editorial desk'}</p>
                  <p className="mt-5 text-base leading-relaxed text-zinc-400">{excerpt(post.summary)}</p>
                  <div className="mt-6">
                    <Link
                      href={`/archive/${post.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:border-lime-400/50 hover:bg-white/5"
                    >
                      Continue reading
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-white/20 bg-[#0f111a] px-8 py-16 text-center">
                <FileText className="mx-auto h-10 w-10 text-zinc-600" />
                <p className="mt-4 text-sm text-zinc-400">No stories in the archive yet. Connect your feed to populate this page.</p>
                <Link href="/contact" className="mt-6 inline-block text-sm font-semibold text-lime-300 hover:text-lime-200">
                  Contact the desk
                </Link>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:pt-2">
            <div className="rounded-[1.35rem] border border-white/10 bg-[#11131d] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Search</p>
              <form action="/search" method="get" className="mt-4 flex flex-col gap-3">
                <input type="hidden" name="master" value="1" />
                <label className="sr-only" htmlFor="archive-search-q">
                  Search posts
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="archive-search-q"
                    name="q"
                    placeholder="Keywords, author, topic…"
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/30"
                  />
                </div>
                <button
                  type="submit"
                  className="flex h-11 items-center justify-center rounded-xl bg-lime-400 text-xs font-bold uppercase tracking-[0.12em] text-zinc-950 hover:bg-lime-300"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="rounded-[1.35rem] border border-white/10 bg-[#11131d] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Recently updated</p>
              <ul className="mt-4 space-y-3">
                {recent.map((post) => (
                  <li key={post.id}>
                    <Link href={`/archive/${post.slug}`} className="group block text-sm leading-snug text-zinc-300 transition hover:text-lime-200">
                      <span className="line-clamp-2 font-medium text-zinc-200 group-hover:text-white">{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
