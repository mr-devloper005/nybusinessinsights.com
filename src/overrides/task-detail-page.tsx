import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { formatRichHtml, RichContent } from '@/components/shared/rich-content'

export const TASK_DETAIL_PAGE_OVERRIDE_ENABLED = true

export async function TaskDetailPageOverride({ slug }: { task: TaskKey; slug: string }) {
  const post = await fetchTaskPostBySlug('mediaDistribution', slug)
  if (!post) notFound()
  const recent = (await fetchTaskPosts('mediaDistribution', 8, { fresh: true })).filter((item) => item.slug !== slug).slice(0, 5)
  const content = (post.content || {}) as Record<string, unknown>
  const html = formatRichHtml((content.body as string) || post.summary || '', 'Post body will appear here.')

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <NavbarShell />
      <section className="bg-neutral-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="mx-auto max-w-5xl text-4xl font-black uppercase leading-tight tracking-[0.02em] sm:text-5xl">{post.title}</h1>
          <div className="mt-5 flex items-center justify-center gap-3 text-sm text-neutral-300">
            <Link href="/">Home</Link>
            <span>›</span>
            <span className="truncate">{post.title}</span>
          </div>
        </div>
      </section>
      <main className="mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article>
          <div className="border border-[#f0dfd7] bg-[#faece7] px-6 py-5 text-sm text-neutral-600">
            <span className="mr-3 inline-block bg-neutral-800 px-3 py-1 text-white">{new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>by {post.authorName || 'Editorial Desk'}</span>
          </div>
          <div className="prose prose-lg mt-10 max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-[0.01em]">
            <RichContent html={html} />
          </div>
          <div className="mt-12 grid gap-0 border border-neutral-200 md:grid-cols-2">
            {recent.slice(0,2).map((item, index) => (
              <Link key={item.id} href={`/updates/${item.slug}`} className="border-neutral-200 p-6 first:border-b md:first:border-b-0 md:first:border-r">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{index === 0 ? 'Previous Post' : 'Next Post'}</p>
                <p className="mt-3 text-lg leading-8 text-neutral-700">{item.title}</p>
              </Link>
            ))}
          </div>
        </article>
        <aside className="space-y-6">
          <div className="border border-neutral-200 p-6">
            <div className="flex items-center gap-0">
              <input className="h-12 flex-1 border border-neutral-200 px-4 text-sm outline-none" placeholder="Type here to search" />
              <button className="flex h-12 w-12 items-center justify-center bg-neutral-800 text-white">Q</button>
            </div>
          </div>
          <div className="border border-neutral-200 p-6">
            <div className="space-y-5">
              {recent.map((item) => (
                <Link key={item.id} href={`/updates/${item.slug}`} className="block border-b border-neutral-200 pb-5 last:border-b-0 last:pb-0">
                  <p className="text-base leading-7 text-neutral-700">{item.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  )
}
