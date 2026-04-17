'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { mockArticles } from '@/data/mock-data'
import type { Article } from '@/types'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import { useAuth } from '@/lib/auth-context'

const mergeArticles = (stored: Article[]) => {
  const map = new Map<string, Article>()
  stored.forEach((article) => map.set(article.id, article))
  mockArticles.forEach((article) => {
    if (!map.has(article.id)) {
      map.set(article.id, article)
    }
  })
  return Array.from(map.values())
}

export default function DashboardArticlesPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [articles, setArticles] = useState<Article[]>(() => [...mockArticles])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [statusMap, setStatusMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(mockArticles.map((article) => [article.id, 'published']))
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null)

  const isUserArticle = (article: Article) =>
    article.id.startsWith('user-') || (user && article.author.id === user.id)
  const userArticles = useMemo(() => articles.filter((article) => isUserArticle(article)), [articles, user])
  const allSelected = selectedIds.length === userArticles.length && userArticles.length > 0
  const selectedCount = selectedIds.length

  const activeArticle = useMemo(
    () => userArticles.find((article) => article.id === activeSheetId),
    [activeSheetId, userArticles]
  )

  useEffect(() => {
    const stored = loadFromStorage<Article[]>(storageKeys.articles, [])
    const merged = mergeArticles(stored)
    setArticles(merged)
    setStatusMap(Object.fromEntries(merged.map((article) => [article.id, article.status ?? 'published'])))
  }, [])

  const persistUserArticles = (nextArticles: Article[]) => {
    const userArticles = nextArticles.filter((article) => isUserArticle(article))
    saveToStorage(storageKeys.articles, userArticles)
  }

  const updateStatus = (id: string, status: Article['status']) => {
    setStatusMap((prev) => ({ ...prev, [id]: status ?? 'published' }))
    const nextArticles = articles.map((article) =>
      article.id === id ? { ...article, status: status ?? 'published' } : article
    )
    setArticles(nextArticles)
    persistUserArticles(nextArticles)
    toast({
      title: 'Status updated',
      description: `Article status set to ${status}.`,
    })
  }

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleBulkAction = (action: string) => {
    if (action === 'Deleted') {
      const nextArticles = articles.filter((article) => !selectedIds.includes(article.id))
      setArticles(nextArticles)
      persistUserArticles(nextArticles)
    }
    toast({
      title: `${action} applied`,
      description: `${selectedCount} articles updated.`,
    })
    setSelectedIds([])
  }

  return (
    <PageShell
      title="My Articles"
      description="Manage drafts and published stories."
      actions={
        <Button asChild>
          <Link href="/dashboard/articles/new">New Article</Link>
        </Button>
      }
    >
      {selectedCount > 0 && (
        <Card className="border-border bg-secondary/40 mb-4">
          <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedCount} selected
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Archived')}>
                Archive
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Exported')}>
                Export
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('Deleted')}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {userArticles.length > 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => setSelectedIds(checked ? userArticles.map((a) => a.id) : [])}
              />
              <span className="text-sm text-muted-foreground">Select all</span>
            </CardContent>
          </Card>
        )}

        {userArticles.map((article) => (
          <Card key={article.id} className="border-border bg-card transition-transform hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedIds.includes(article.id)}
                  onCheckedChange={() => toggleSelection(article.id)}
                />
                <div>
                  {editingId === article.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        className="h-9 w-64"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const nextArticles = articles.map((item) =>
                            item.id === article.id ? { ...item, title: draftTitle } : item
                          )
                          setArticles(nextArticles)
                          persistUserArticles(nextArticles)
                          toast({
                            title: 'Title updated',
                            description: `Saved "${draftTitle}"`,
                          })
                          setEditingId(null)
                        }}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold text-foreground">{article.title}</h2>
                      <p className="text-sm text-muted-foreground">{article.publishedAt} · {article.readTime} min read</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{article.category}</Badge>
                <Badge variant="outline">Owner Only</Badge>
                <Select
                  value={statusMap[article.id]}
                  onValueChange={(value) => updateStatus(article.id, value as Article['status'])}
                >
                  <SelectTrigger className="h-9 w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setActiveSheetId(article.id)}>
                  Preview
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/articles/${article.id}`}>View</Link>
                </Button>
                <Button
                  onClick={() => {
                    setEditingId(article.id)
                    setDraftTitle(article.title)
                  }}
                >
                  Edit Title
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteId(article.id)
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {userArticles.length === 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No articles yet. Create your first article to see it here.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this article?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove the article from your dashboard. You can republish later if needed.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                const nextArticles = articles.filter((article) => article.id !== deleteId)
                setArticles(nextArticles)
                persistUserArticles(nextArticles)
                toast({ title: 'Article removed', description: 'The article was deleted from your dashboard.' })
                setDeleteId(null)
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={Boolean(activeSheetId)} onOpenChange={() => setActiveSheetId(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Article Preview</SheetTitle>
            <SheetDescription>Quick glance before opening the full editor.</SheetDescription>
          </SheetHeader>
          {activeArticle && (
            <div className="mt-6 space-y-4">
              <Badge variant="secondary">{activeArticle.category}</Badge>
              <h3 className="text-xl font-semibold text-foreground">{activeArticle.title}</h3>
              <p className="text-sm text-muted-foreground">{activeArticle.excerpt}</p>
              <Button asChild>
                <Link href={`/articles/${activeArticle.slug}`}>View Live Article</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}
