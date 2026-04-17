'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { mockArticles } from '@/data/mock-data'
import type { Article } from '@/types'
import { loadFromStorage, storageKeys } from '@/lib/local-storage'
import { useAuth } from '@/lib/auth-context'

export default function DashboardArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const { user } = useAuth()
  const [storedArticles, setStoredArticles] = useState<Article[]>([])
  const allArticles = useMemo(() => [...storedArticles, ...mockArticles], [storedArticles])
  const article = allArticles.find((item) => item.id === resolvedParams.id)
  const canEdit = article ? (article.id.startsWith('user-') || (user && article.author.id === user.id)) : false

  useEffect(() => {
    setStoredArticles(loadFromStorage<Article[]>(storageKeys.articles, []))
  }, [])

  if (!article) {
    notFound()
  }

  return (
    <PageShell
      title={article.title}
      description="Article details and performance"
      actions={
        canEdit ? (
          <Button asChild>
            <Link href={`/dashboard/articles/${article.id}/edit`}>Edit Article</Link>
          </Button>
        ) : null
      }
    >
      {!canEdit && (
        <Card className="border-border bg-secondary/40">
          <CardContent className="p-4 text-sm text-muted-foreground">
            You can view this article, but only the owner can edit it.
          </CardContent>
        </Card>
      )}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <Badge variant="secondary">{article.category}</Badge>
          <p className="text-sm text-muted-foreground">Published {article.publishedAt}</p>
          <p className="text-sm text-muted-foreground">{article.excerpt}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              defaultValue="published"
              onValueChange={(value) =>
                toast({
                  title: 'Status updated',
                  description: `Article status set to ${value}.`,
                })
              }
            >
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" asChild>
              <Link href={`/articles/${article.slug}`}>View Live Article</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
