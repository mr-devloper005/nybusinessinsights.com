'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { mockArticles } from '@/data/mock-data'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import type { Article } from '@/types'
import { useAuth } from '@/lib/auth-context'

export default function DashboardArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [storedArticles, setStoredArticles] = useState<Article[]>([])
  const article = useMemo(
    () => [...storedArticles, ...mockArticles].find((item) => item.id === resolvedParams.id),
    [resolvedParams.id, storedArticles]
  )
  const canEdit = article ? (article.id.startsWith('user-') || (user && article.author.id === user.id)) : false
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    setStoredArticles(loadFromStorage<Article[]>(storageKeys.articles, []))
  }, [])

  useEffect(() => {
    if (!article) return
    setTitle(article.title)
    setExcerpt(article.excerpt)
    setContent(article.content.replace(/<[^>]+>/g, '').trim())
  }, [article])

  return (
    <PageShell
      title={`Edit Article #${resolvedParams.id}`}
      description="Update your article content and settings."
      actions={
        <Button variant="outline" asChild>
          <Link href={`/dashboard/articles/${resolvedParams.id}`}>View Details</Link>
        </Button>
      }
    >
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input className="mt-2" placeholder="Article title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Excerpt</label>
            <Textarea className="mt-2" placeholder="Short summary" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Content</label>
            <Textarea
              className="mt-2 min-h-[200px]"
              placeholder="Article content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button
            disabled={!canEdit}
            onClick={() => {
              if (!article) return
              if (!canEdit) {
                toast({ title: 'Read-only', description: 'Only your own articles can be edited.' })
                return
              }
              const updated: Article = {
                ...article,
                title: title.trim() || article.title,
                excerpt: excerpt.trim() || article.excerpt,
                content: content.trim() ? `<p>${content.trim()}</p>` : article.content,
              }
              const current = loadFromStorage<Article[]>(storageKeys.articles, [])
              const next = current.some((item) => item.id === article.id)
                ? current.map((item) => (item.id === article.id ? updated : item))
                : [updated, ...current]
              saveToStorage(storageKeys.articles, next)
              setStoredArticles(next)
              setSaved(true)
              toast({ title: 'Article updated', description: 'Your changes were saved.' })
            }}
          >
            Save Changes
          </Button>
          {saved && <p className="text-sm text-muted-foreground">Changes saved.</p>}
        </CardContent>
      </Card>
    </PageShell>
  )
}
