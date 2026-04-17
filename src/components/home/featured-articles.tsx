'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockArticles } from '@/data/mock-data'
import { cn } from '@/lib/utils'

export function FeaturedArticles() {
  const featured = mockArticles.filter(a => a.isFeatured)
  const source = featured.length >= 5 ? featured : mockArticles
  const [hero, second, third, ...rest] = source.slice(0, 6)

  return (
    <section className="relative overflow-hidden border-b border-border py-16">
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,180,120,0.25),_transparent_65%)]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_rgba(120,170,255,0.2),_transparent_65%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              Editor’s Desk
            </div>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Featured Articles
            </h2>
            <p className="mt-2 text-muted-foreground">
              Curated narratives, high-signal insights, and standout community work.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/articles">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {hero && (
            <Link
              href={`/articles/${hero.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={hero.coverImage || '/placeholder.svg?height=720&width=1280'}
                  alt={hero.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <Badge className="absolute left-6 top-6 bg-background/90 text-foreground">
                  {hero.category}
                </Badge>
              </div>
              <div className="space-y-3 p-6">
                <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  {hero.title}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {hero.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {hero.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground" suppressHydrationWarning>
                  <span>{hero.author.name}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                  <span>
                    {new Date(hero.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                  <span>{hero.readTime} min read</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>{hero.views.toLocaleString()} views</span>
                  <span>{hero.likes.toLocaleString()} likes</span>
                  <span>{hero.commentsCount.toLocaleString()} comments</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-border">
                    <Image
                      src={hero.author.avatar}
                      alt={hero.author.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{hero.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{hero.category}</span>
                    <span className="mx-2">•</span>
                    <span>{hero.readTime} min read</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Key Takeaways
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-foreground">
                    <div>Design systems become living products, not static libraries.</div>
                    <div>AI assistants accelerate audits, docs, and component QA.</div>
                    <div>Metrics-driven governance keeps teams aligned at scale.</div>
                  </div>
                </div>
                <Button variant="secondary" className="w-fit">
                  Continue Reading
                </Button>
              </div>
            </Link>
          )}

          <div className="grid gap-6">
            {[second, third].filter(Boolean).map((article) => (
              <Link
                key={article!.id}
                href={`/articles/${article!.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={article!.coverImage || '/placeholder.svg?height=640&width=960'}
                    alt={article!.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="space-y-2 p-5">
                  <Badge variant="secondary" className="w-fit">
                    {article!.category}
                  </Badge>
                  <h4 className="text-lg font-semibold text-foreground">
                    {article!.title}
                  </h4>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {article!.excerpt}
                  </p>
                  <div className="text-xs text-muted-foreground" suppressHydrationWarning>
                    {new Date(article!.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className={cn(
                'group rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-1',
                'hover:border-muted-foreground/30'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="outline">{article.category}</Badge>
                <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h4 className="mt-3 text-base font-semibold text-foreground">
                {article.title}
              </h4>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
