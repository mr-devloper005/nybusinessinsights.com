import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG } from '@/lib/site-config'

export const HOME_PAGE_OVERRIDE_ENABLED = false

function excerpt(text?: string | null) {
  const value = (text || '').trim()
  if (!value) return 'Read the full post for the complete update.'
  return value.length > 220 ? value.slice(0, 217).trimEnd() + '...' : value
}

export async function HomePageOverride() {
  const posts = await fetchTaskPosts('mediaDistribution', 12, { fresh: true })
  const featured = posts[0]
  const recent = posts.slice(1, 6)
  const archive = posts.slice(1)

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <NavbarShell />
      <main className="mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {featured ? (
            <article className="border-b border-neutral-200 pb-12">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{String((featured.content as any)?.category || 'Latest')}</p>
              <h1 className="mx-auto mt-4 max-w-4xl text-center text-4xl font-black uppercase leading-tight tracking-[0.02em] sm:text-5xl">{featured.title}</h1>
              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-neutral-500">
                <span className="bg-neutral-800 px-3 py-1 text-white">{new Date(featured.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>by {featured.authorName || 'Editorial Desk'}</span>
              </div>
              <p className="mx-auto mt-10 max-w-3xl text-lg leading-9 text-neutral-700">{excerpt(featured.summary)}</p>
              <div className="mt-8 text-center">
                <Link href={`/updates/${featured.slug}`} className="inline-flex rounded-full bg-neutral-800 px-8 py-3 text-sm font-medium text-white hover:bg-black">Continue Reading</Link>
              </div>
            </article>
          ) : null}

          <div className="space-y-14 pt-14">
            {archive.map((post) => (
              <article key={post.id} className="border-b border-neutral-200 pb-12">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{String((post.content as any)?.category || 'Update')}</p>
                <h2 className="mx-auto mt-3 max-w-4xl text-center text-3xl font-black uppercase leading-tight tracking-[0.02em] sm:text-4xl">{post.title}</h2>
                <div className="mt-4 flex items-center justify-center gap-3 text-sm text-neutral-500">
                  <span className="bg-neutral-800 px-3 py-1 text-white">{new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>by {post.authorName || 'Editorial Desk'}</span>
                </div>
                <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-neutral-700">{excerpt(post.summary)}</p>
                <div className="mt-8 text-center">
                  <Link href={`/updates/${post.slug}`} className="inline-flex rounded-full bg-neutral-800 px-8 py-3 text-sm font-medium text-white hover:bg-black">Continue Reading</Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-neutral-200 p-6">
            <div className="flex items-center gap-0">
              <input className="h-12 flex-1 border border-neutral-200 px-4 text-sm outline-none" placeholder="Type here to search" />
              <button className="flex h-12 w-12 items-center justify-center bg-neutral-800 text-white">Q</button>
            </div>
          </div>
          <div className="border border-neutral-200 p-6">
            <div className="space-y-5">
              {recent.map((post) => (
                <Link key={post.id} href={`/updates/${post.slug}`} className="block border-b border-neutral-200 pb-5 last:border-b-0 last:pb-0">
                  <p className="text-base leading-7 text-neutral-700">{post.title}</p>
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
