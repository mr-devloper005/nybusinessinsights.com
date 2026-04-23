import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Bookmark, Building2, ChevronDown, Clock, Compass, FileText, Globe2, Image as ImageIcon, LayoutGrid, MapPin, ShieldCheck, Tag, User } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchTaskPosts } from '@/lib/task-data'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind, type ProductKind } from '@/design/factory/get-product-kind'
import type { SitePost } from '@/lib/site-connector'
import { getHomeEditorialMockPosts, mergeEditorialPostsForHome } from '@/lib/home-editorial-mock'
import { HOME_PAGE_OVERRIDE_ENABLED, HomePageOverride } from '@/overrides/home-page'
import { cn } from '@/lib/utils'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: siteContent.home.metadata.title,
    description: siteContent.home.metadata.description,
    openGraphTitle: siteContent.home.metadata.openGraphTitle,
    openGraphDescription: siteContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...siteContent.home.metadata.keywords],
  })
}

type EnabledTask = (typeof SITE_CONFIG.tasks)[number]
type TaskFeedItem = { task: EnabledTask; posts: SitePost[] }

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: Bookmark,
  classified: Tag,
  image: ImageIcon,
  profile: User,
}

function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {
  if (
    value === 'listing' ||
    value === 'classified' ||
    value === 'article' ||
    value === 'image' ||
    value === 'profile' ||
    value === 'sbm' ||
    value === 'mediaDistribution'
  )
    return value
  return fallback
}

function getTaskHref(task: TaskKey, slug: string) {
  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
  return `${route}/${slug}`
}

function getPostMeta(post?: SitePost | null) {
  if (!post || typeof post.content !== 'object' || !post.content) return { location: '', category: '' }
  const content = post.content as Record<string, unknown>
  return {
    location: typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : '',
    category: typeof content.category === 'string' ? content.category : typeof post.tags?.[0] === 'string' ? post.tags[0] : '',
  }
}

function getDirectoryTone(brandPack: string) {
  if (brandPack === 'market-utility') {
    return {
      shell: 'bg-[#f5f7f1] text-[#1f2617]',
      hero: 'bg-[linear-gradient(180deg,#eef4e4_0%,#f8faf4_100%)]',
      panel: 'border border-[#d5ddc8] bg-white shadow-[0_24px_64px_rgba(64,76,34,0.08)]',
      soft: 'border border-[#d5ddc8] bg-[#eff3e7]',
      muted: 'text-[#5b664c]',
      title: 'text-[#1f2617]',
      badge: 'bg-[#1f2617] text-[#edf5dc]',
      action: 'bg-[#1f2617] text-[#edf5dc] hover:bg-[#2f3a24]',
      actionAlt: 'border border-[#d5ddc8] bg-white text-[#1f2617] hover:bg-[#eef3e7]',
    }
  }
  return {
    shell: 'bg-[#f8fbff] text-slate-950',
    hero: 'bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)]',
    panel: 'border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.08)]',
    soft: 'border border-slate-200 bg-slate-50',
    muted: 'text-slate-600',
    title: 'text-slate-950',
    badge: 'bg-slate-950 text-white',
    action: 'bg-slate-950 text-white hover:bg-slate-800',
    actionAlt: 'border border-slate-200 bg-white text-slate-950 hover:bg-slate-100',
  }
}

function getVisualTone() {
  return {
    shell: 'bg-[#07101f] text-white',
    panel: 'border border-white/10 bg-[rgba(11,18,31,0.78)] shadow-[0_28px_80px_rgba(0,0,0,0.35)]',
    soft: 'border border-white/10 bg-white/6',
    muted: 'text-slate-300',
    title: 'text-white',
    badge: 'bg-[#8df0c8] text-[#07111f]',
    action: 'bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
    actionAlt: 'border border-white/10 bg-white/6 text-white hover:bg-white/10',
  }
}

function getCurationTone() {
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4] shadow-[0_24px_60px_rgba(91,56,37,0.08)]',
    soft: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    title: 'text-[#261811]',
    badge: 'bg-[#5b2b3b] text-[#fff0f5]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    actionAlt: 'border border-[#ddcdbd] bg-transparent text-[#261811] hover:bg-[#efe3d6]',
  }
}

function DirectoryHome({ primaryTask, enabledTasks, listingPosts, classifiedPosts, profilePosts, brandPack }: {
  primaryTask?: EnabledTask
  enabledTasks: EnabledTask[]
  listingPosts: SitePost[]
  classifiedPosts: SitePost[]
  profilePosts: SitePost[]
  brandPack: string
}) {
  const tone = getDirectoryTone(brandPack)
  const featuredListings = (listingPosts.length ? listingPosts : classifiedPosts).slice(0, 3)
  const featuredTaskKey: TaskKey = listingPosts.length ? 'listing' : 'classified'
  const quickRoutes = enabledTasks.slice(0, 4)

  return (
    <main>
      <section className={tone.hero}>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
                <Compass className="h-3.5 w-3.5" />
                Local discovery product
              </span>
              <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
                Search businesses, compare options, and act fast without digging through generic feeds.
              </h1>
              <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>

              <div className={`mt-8 grid gap-3 rounded-[2rem] p-4 ${tone.panel} md:grid-cols-[1.25fr_0.8fr_auto]`}>
                <div className="rounded-full bg-black/5 px-4 py-3 text-sm">What do you need today?</div>
                <div className="rounded-full bg-black/5 px-4 py-3 text-sm">Choose area or city</div>
                <Link href={primaryTask?.route || '/listings'} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                  Browse now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Verified businesses', `${featuredListings.length || 3}+ highlighted surfaces`],
                  ['Fast scan rhythm', 'More utility, less filler'],
                  ['Action first', 'Call, visit, shortlist, compare'],
                ].map(([label, value]) => (
                  <div key={label} className={`rounded-[1.4rem] p-4 ${tone.soft}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">{label}</p>
                    <p className="mt-2 text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className={`rounded-[2rem] p-6 ${tone.panel}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">Primary lane</p>
                    <h2 className="mt-2 text-3xl font-semibold">{primaryTask?.label || 'Listings'}</h2>
                  </div>
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className={`mt-4 text-sm leading-7 ${tone.muted}`}>{primaryTask?.description || 'Structured discovery for services, offers, and business surfaces.'}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {quickRoutes.map((task) => {
                  const Icon = taskIcons[task.key as TaskKey] || LayoutGrid
                  return (
                    <Link key={task.key} href={task.route} className={`rounded-[1.6rem] p-5 ${tone.soft}`}>
                      <Icon className="h-5 w-5" />
                      <h3 className="mt-4 text-lg font-semibold">{task.label}</h3>
                      <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{task.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Featured businesses</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Strong listings with clearer trust cues.</h2>
          </div>
          <Link href="/listings" className="text-sm font-semibold text-primary hover:opacity-80">Open listings</Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredListings.map((post) => (
            <TaskPostCard key={post.id} post={post} href={getTaskHref(featuredTaskKey, post.slug)} taskKey={featuredTaskKey} />
          ))}
        </div>
      </section>

      <section className={`${tone.shell}`}>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">What makes this different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Built like a business directory, not a recolored content site.</h2>
            <ul className={`mt-6 space-y-3 text-sm leading-7 ${tone.muted}`}>
              <li>Search-first hero instead of a magazine headline.</li>
              <li>Action-oriented listing cards with trust metadata.</li>
              <li>Support lanes for offers, businesses, and profiles.</li>
            </ul>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(profilePosts.length ? profilePosts : classifiedPosts).slice(0, 4).map((post) => {
              const meta = getPostMeta(post)
              const taskKey = resolveTaskKey(post.task, profilePosts.length ? 'profile' : 'classified')
              return (
                <Link key={post.id} href={getTaskHref(taskKey, post.slug)} className={`overflow-hidden rounded-[1.8rem] ${tone.panel}`}>
                  <div className="h-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800" aria-hidden />
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">{meta.category || post.task || 'Profile'}</p>
                    <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                    <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Quick access to local information and related surfaces.'}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

function splitIntoTwoParagraphs(text: string) {
  const t = text.trim()
  if (!t) return ['', '']
  const splitAt = t.search(/\.\s+[A-Z]/)
  if (splitAt > 80) {
    return [t.slice(0, splitAt + 1).trim(), t.slice(splitAt + 1).trim()]
  }
  const half = Math.floor(t.length / 2)
  const space = t.lastIndexOf(' ', half + 40)
  if (space > 40) return [t.slice(0, space).trim(), t.slice(space).trim()]
  return [t, '']
}

function getPostCategoryLabel(post: SitePost): string {
  const content =
    post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const cat = content.category
  if (typeof cat === 'string' && cat.trim()) return cat.trim()
  const tag = post.tags?.find((t) => typeof t === 'string' && t !== 'mediaDistribution' && t !== 'article')
  if (typeof tag === 'string') return tag
  return 'Update'
}

function estimateReadMinutes(post: SitePost): number {
  const text = `${post.title} ${post.summary || ''}`
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.min(24, Math.round(words / 200) || 1))
}

const partnerPills = ['Syndication', 'Wire partners', 'Regional desks', 'Licensing', 'Analytics', 'Newsroom API']

const faqItems = [
  {
    q: 'What is media distribution on this site?',
    a: 'We publish and surface article-style updates so readers can follow filings, announcements, and coverage in one place—built for scan-friendly reading and clear attribution.',
  },
  {
    q: 'How often are new articles published?',
    a: 'The homepage pulls the latest posts from the connected feed. When the feed is quiet, editorial placeholders keep the layout populated until new items arrive.',
  },
  {
    q: 'Can I republish or syndicate a story?',
    a: 'Reach out through Contact with your outlet, territory, and intended use. Editorial and legal review apply before any republication terms are confirmed.',
  },
  {
    q: 'How do I submit a correction?',
    a: 'Email the desk with the article URL, the line in question, and supporting references. We prioritize accuracy updates and post an audit note when warranted.',
  },
]

function EditorialHome({
  primaryTask,
  posts,
  supportTasks,
}: {
  primaryTask?: EnabledTask
  posts: SitePost[]
  supportTasks: EnabledTask[]
}) {
  const defaultEditorialTask: TaskKey =
    primaryTask?.key === 'mediaDistribution' || primaryTask?.key === 'article'
      ? primaryTask.key
      : 'article'

  const postHref = (post: SitePost) =>
    getTaskHref(resolveTaskKey((post as { task?: unknown }).task, defaultEditorialTask), post.slug)

  const lead = posts[0]
  const trending = posts.slice(0, 12)
  const deskFeature = posts[1] || lead
  const promoPost = posts[2] || posts[1] || lead
  const deckPosts = posts.slice(3, 9)

  const headline = lead?.title || SITE_CONFIG.name
  const summarySource = lead?.summary || SITE_CONFIG.description
  const [, bodyB] = splitIntoTwoParagraphs(summarySource)
  const secondParagraph = bodyB || SITE_CONFIG.tagline
  const aboutCols = splitIntoTwoParagraphs(SITE_CONFIG.description)

  const publishedLabel = lead?.publishedAt
    ? new Date(lead.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const hoursAgo = (iso?: string | null) => {
    if (!iso) return null
    const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000)
    if (h < 1) return 'Published just now'
    if (h < 48) return `Published ${h}h ago`
    return null
  }

  const stats = [
    { label: 'Stories live', value: `${Math.max(posts.length, 1)}+` },
    { label: 'Read focus', value: lead ? `${estimateReadMinutes(lead)} min` : '5 min' },
    { label: 'Distribution', value: 'Archive' },
  ]

  return (
    <main className="text-zinc-100">
      {/* Hero */}
      <section className="relative min-h-[78vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-950 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-[#07080d]/75 to-black/40" />
        </div>

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-lime-300">Story of the week</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            {lead?.summary ? excerptShort(String(lead.summary)) : SITE_CONFIG.tagline}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/50 px-5 py-3 backdrop-blur-md">
                <Clock className="h-4 w-4 text-lime-300" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Time to read</p>
                  <p className="text-sm font-bold text-white">{lead ? `${estimateReadMinutes(lead)} min read` : '5 min read'}</p>
                </div>
              </div>
              {hoursAgo(lead?.publishedAt) ? (
                <div className="rounded-full border border-white/15 bg-black/40 px-5 py-3 text-sm text-zinc-200 backdrop-blur-md">
                  {hoursAgo(lead?.publishedAt)}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/50 px-5 py-3 backdrop-blur-md">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-zinc-950">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Desk &amp; date</p>
                <p className="text-sm font-semibold text-white">{publishedLabel}</p>
                <p className="text-xs text-zinc-400">{lead ? getPostCategoryLabel(lead) : 'Editorial'} · {SITE_CONFIG.name}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {lead ? (
              <Link
                href={postHref(lead)}
                className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-zinc-950 shadow-[0_0_28px_rgba(190,242,100,0.35)] hover:bg-lime-300"
              >
                Read now
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            <Link
              href={primaryTask?.route || '/archive'}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white/10"
            >
              Open archive
            </Link>
          </div>

          <p className="mt-14 text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-500">Scroll</p>
        </div>
      </section>

      {/* Trending strip */}
      <section className="border-y border-white/10 bg-[#0b0d14] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-lime-300">Trending</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">Top stories in the archive</h2>
            </div>
            <p className="max-w-sm text-sm text-zinc-400">Drag sideways to browse headlines, categories, and bylines—same feed, faster scan.</p>
          </div>

          <div className="relative mt-8">
            <div className="pointer-events-none absolute right-0 top-1/2 z-10 hidden h-16 w-16 -translate-y-1/2 rounded-full border border-sky-400/60 bg-sky-500/20 text-center text-[10px] font-bold uppercase leading-tight text-sky-200 sm:flex sm:items-center sm:justify-center">
              Drag
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {trending.length ? (
                trending.map((post) => (
                  <Link
                    key={post.id}
                    href={postHref(post)}
                    className="group relative w-[min(300px,85vw)] shrink-0 snap-start rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition hover:border-lime-400/40"
                  >
                    <span className="inline-flex rounded-full bg-lime-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-950">
                      {getPostCategoryLabel(post)}
                    </span>
                    <p className="mt-4 text-base font-bold leading-snug text-white">{post.title}</p>
                    <p className="mt-3 text-xs text-zinc-400">{post.authorName || 'Editorial desk'}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Connect the feed to populate trending cards.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-[#07080d] py-14">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">Powered by</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {partnerPills.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What we publish */}
      <section className="border-t border-white/10 bg-[#0b0d14] py-16 text-zinc-100">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.35fr)_1fr] lg:px-8 lg:gap-16">
          <h2 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">What we publish</h2>
          <div>
            <p className="text-2xl font-black uppercase leading-tight tracking-tight text-lime-300 sm:text-3xl">{SITE_CONFIG.tagline}</p>
            <div className="mt-8 grid gap-8 text-sm leading-relaxed text-zinc-400 sm:grid-cols-2">
              <p>{aboutCols[0]}</p>
              <p>{aboutCols[1] || secondParagraph}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured story + image (breaking / desk) */}
      {deskFeature ? (
        <section className="border-t border-white/10 bg-[#0c0e16] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-white/10 bg-[#11131d] p-6 lg:p-10">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">Featured story</h2>
              <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-zinc-950">
                <FileText className="h-5 w-5" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">
                {new Date(deskFeature.publishedAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="mt-2 text-sm text-zinc-400">{getPostCategoryLabel(deskFeature)} · {deskFeature.authorName || 'Desk'}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">{deskFeature.summary || SITE_CONFIG.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={postHref(deskFeature)}
                  className="inline-flex rounded-full border border-white/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-white/10"
                >
                  Open article
                </Link>
                <Link
                  href={primaryTask?.route || '/archive'}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:border-lime-400/50"
                  aria-label="Open archive"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Split promo */}
      {promoPost ? (
        <section className="bg-[#07080d] py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-center rounded-[2rem] border border-white/10 bg-[#0f111a] p-8 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-lime-300">Editor&apos;s choice</p>
              <h2 className="mt-4 text-2xl font-black uppercase leading-tight text-white sm:text-3xl">
                Want the sharpest angles on business media and filings?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {promoPost.summary || 'Follow the desk for signal-heavy briefs—short posts, clear labels, and fast links into the full story.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-zinc-950 hover:bg-zinc-200"
                >
                  Guest post
                </Link>
                <Link
                  href={postHref(promoPost)}
                  className="rounded-full border border-white/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-white/10"
                >
                  Read feature
                </Link>
                <Link
                  href="/search"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:border-lime-400/50"
                  aria-label="Search"
                >
                  <Globe2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Stats + stream CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-[#0b0d14] py-16">
        <div className="absolute inset-0 bg-[#07080d]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-stretch lg:justify-between lg:px-8">
          <div className="max-w-lg rounded-[2rem] border border-white/10 bg-black/50 p-8 backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-lime-300">Live stream</p>
            <h2 className="mt-3 text-2xl font-black uppercase text-white sm:text-3xl">Never miss a filing or desk note.</h2>
            <p className="mt-4 text-sm text-zinc-400">Open the article index—same routes, refreshed styling tuned for media distribution.</p>
            <Link
              href={primaryTask?.route || '/archive'}
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-zinc-950 hover:bg-lime-300"
            >
              Browse archive
            </Link>
          </div>
          <div className="flex w-full max-w-sm flex-col justify-center gap-0 rounded-[2rem] bg-lime-400 p-8 text-zinc-950 shadow-[0_0_40px_rgba(190,242,100,0.25)] lg:ml-auto">
            {stats.map((row) => (
              <div key={row.label} className="border-b border-zinc-900/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
                <p className="text-4xl font-black tabular-nums">{row.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-zinc-800">{row.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* From the desk grid */}
      {deckPosts.length ? (
        <section className="bg-[#07080d] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">From the desk</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Summaries stay on the homepage for quick scanning. Each card links through to the full article route.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {deckPosts.map((post) => (
                <Link
                  key={post.id}
                  href={postHref(post)}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0f111a] transition hover:border-lime-400/40"
                >
                  <div className="flex flex-1 flex-col p-5">
                    <span className="w-fit rounded-full bg-lime-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lime-300">
                      {getPostCategoryLabel(post)}
                    </span>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-white">{post.title}</h3>
                    {post.summary ? <p className="mt-3 grow text-sm leading-relaxed text-zinc-400">{post.summary}</p> : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="border-t border-white/10 bg-white py-16 text-zinc-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_1.4fr] lg:px-8">
          <div className="flex flex-col justify-between rounded-[2rem] bg-lime-400 p-8 text-zinc-950 sm:p-10">
            <p className="text-6xl font-black uppercase leading-none sm:text-7xl">FAQ</p>
            <div className="mt-10">
              <p className="text-sm font-semibold">Another question for the desk?</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex rounded-full bg-zinc-950 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-zinc-800"
              >
                Contact us
              </Link>
            </div>
          </div>
          <div className="divide-y divide-zinc-200">
            {faqItems.map((item) => (
              <details key={item.q} className="group py-4 first:pt-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-bold text-zinc-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-zinc-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {supportTasks.length ? (
        <section className="border-t border-white/10 bg-[#0b0d14] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">More surfaces</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {supportTasks.slice(0, 3).map((task) => (
                <Link
                  key={task.key}
                  href={task.route}
                  className="rounded-2xl border border-white/10 bg-[#11131d] px-5 py-4 text-sm text-zinc-300 transition hover:border-lime-400/30 hover:text-white"
                >
                  <span className="font-bold text-white">{task.label}</span>
                  <span className="mt-1 block text-zinc-500">{task.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

function excerptShort(text: string, max = 160) {
  const v = text.trim()
  if (!v) return ''
  return v.length > max ? `${v.slice(0, max - 1).trimEnd()}…` : v
}

function VisualHome({ primaryTask, imagePosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; imagePosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getVisualTone()
  const gallery = imagePosts.length ? imagePosts.slice(0, 5) : articlePosts.slice(0, 5)
  const creators = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <ImageIcon className="h-3.5 w-3.5" />
              Visual publishing system
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Image-led discovery with creator profiles and a more gallery-like browsing rhythm.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/images'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Meet creators
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.slice(0, 5).map((post, index) => (
              <Link
                key={post.id}
                href={getTaskHref(resolveTaskKey(post.task, 'image'), post.slug)}
                className={index === 0 ? `col-span-2 row-span-2 overflow-hidden rounded-[2.4rem] ${tone.panel}` : `overflow-hidden rounded-[1.8rem] ${tone.soft}`}
              >
                <div
                  className={
                    index === 0
                      ? 'h-[360px] bg-gradient-to-br from-slate-800 via-slate-900 to-black'
                      : 'h-[170px] bg-gradient-to-br from-slate-800 to-slate-950'
                  }
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Visual notes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Larger media surfaces, fewer boxes, stronger pacing.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>This product avoids business-directory density and publication framing. The homepage behaves more like a visual board, with profile surfaces and imagery leading the experience.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {creators.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="h-2 rounded-full bg-gradient-to-r from-emerald-900/60 to-slate-800" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Creator profile and visual identity surface.'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function CurationHome({ primaryTask, bookmarkPosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; bookmarkPosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getCurationTone()
  const collections = bookmarkPosts.length ? bookmarkPosts.slice(0, 4) : articlePosts.slice(0, 4)
  const people = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <Bookmark className="h-3.5 w-3.5" />
              Curated collections
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Save, organize, and revisit resources through shelves, boards, and curated collections.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/sbm'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open collections
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Explore curators
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {collections.map((post) => (
              <Link key={post.id} href={getTaskHref(resolveTaskKey(post.task, 'sbm'), post.slug)} className={`rounded-[1.8rem] p-6 ${tone.panel}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Collection</p>
                <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                <p className={`mt-3 text-sm leading-8 ${tone.muted}`}>{post.summary || 'A calmer bookmark surface with room for context and grouping.'}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Why this feels different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">More like saved boards and reading shelves than a generic post feed.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>The structure is calmer, the cards are less noisy, and the page encourages collecting and returning instead of forcing everything into a fast-scrolling list.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="h-2 rounded-full bg-gradient-to-r from-amber-900/50 to-stone-800" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>Curator profile, saved resources, and collection notes.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function HomePage() {
  if (HOME_PAGE_OVERRIDE_ENABLED) {
    return <HomePageOverride />
  }

  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const taskFeed: TaskFeedItem[] = (
    await Promise.all(
      enabledTasks.map(async (task) => ({
        task,
        posts: await fetchTaskPosts(task.key, 6, { allowMockFallback: false, fresh: false, revalidate: 120 }),
      }))
    )
  ).filter(({ posts }) => posts.length)

  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]
  const supportTasks = enabledTasks.filter((task) => task.key !== primaryTask?.key)
  const listingPosts = taskFeed.find(({ task }) => task.key === 'listing')?.posts || []
  const classifiedPosts = taskFeed.find(({ task }) => task.key === 'classified')?.posts || []
  const articlePosts = taskFeed.find(({ task }) => task.key === 'article')?.posts || []
  const mediaDistributionPosts =
    taskFeed.find(({ task }) => task.key === 'mediaDistribution')?.posts || []
  const editorialRaw = articlePosts.length ? articlePosts : mediaDistributionPosts
  const editorialPosts =
    editorialRaw.length > 0
      ? editorialRaw.slice(0, 16)
      : mergeEditorialPostsForHome(editorialRaw, getHomeEditorialMockPosts(), 16)
  const imagePosts = taskFeed.find(({ task }) => task.key === 'image')?.posts || []
  const profilePosts = taskFeed.find(({ task }) => task.key === 'profile')?.posts || []
  const bookmarkPosts = taskFeed.find(({ task }) => task.key === 'sbm')?.posts || []

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className={cn('min-h-screen', productKind === 'editorial' ? 'bg-[#07080d] text-zinc-100' : 'bg-background text-foreground')}>
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />
      {productKind === 'directory' ? (
        <DirectoryHome
          primaryTask={primaryTask}
          enabledTasks={enabledTasks}
          listingPosts={listingPosts}
          classifiedPosts={classifiedPosts}
          profilePosts={profilePosts}
          brandPack={recipe.brandPack}
        />
      ) : null}
      {productKind === 'editorial' ? (
        <EditorialHome primaryTask={primaryTask} posts={editorialPosts} supportTasks={supportTasks} />
      ) : null}
      {productKind === 'visual' ? (
        <VisualHome primaryTask={primaryTask} imagePosts={imagePosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      {productKind === 'curation' ? (
        <CurationHome primaryTask={primaryTask} bookmarkPosts={bookmarkPosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      <Footer />
    </div>
  )
}
