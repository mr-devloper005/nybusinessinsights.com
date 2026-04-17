'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockBookmarks } from '@/data/mock-data'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import type { Bookmark as BookmarkType } from '@/types'

export default function SubmitBookmarkPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const categoryOptions = useMemo(
    () => Array.from(new Set(mockBookmarks.map((bookmark) => bookmark.category))),
    []
  )
  const [statusMessage, setStatusMessage] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to submit a bookmark.',
      })
      router.push('/login')
      return
    }

    if (!url || !title || !description) {
      setStatusMessage('Please complete the required fields before submitting.')
      return
    }

    let domain = 'link'
    try {
      const parsed = new URL(url)
      domain = parsed.hostname.replace('www.', '')
    } catch {
      setStatusMessage('Please enter a valid URL.')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const nextBookmark: BookmarkType = {
      id: `user-bookmark-${Date.now()}`,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 60),
      url,
      description,
      image: '/placeholder.svg?height=720&width=1280',
      domain,
      tags: tags.length > 0 ? tags : ['New'],
      category: category || 'General',
      createdAt: new Date().toISOString(),
      author: user,
      upvotes: 0,
      saves: 0,
      commentsCount: 0,
      isUpvoted: false,
      isSaved: false,
    }

    const stored = loadFromStorage<BookmarkType[]>(storageKeys.bookmarks, [])
    const next = [nextBookmark, ...stored]
    saveToStorage(storageKeys.bookmarks, next)

    setStatusMessage('Bookmark submitted! It will appear in your feed.')
    toast({
      title: 'Bookmark submitted',
      description: 'Your link has been added to the feed.',
    })
    setUrl('')
    setTitle('')
    setDescription('')
    setCategory('')
    setTagsInput('')
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />

      <main>
        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              Submit a Bookmark
            </div>
            <h1 className="mt-2 text-3xl font-bold text-foreground">Share a link with the community.</h1>
            <p className="mt-2 text-muted-foreground">
              Add a short description, pick a category, and tag it for easy discovery.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <form
                className="space-y-5"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="text-sm font-medium text-foreground">URL</label>
                  <Input
                    placeholder="https://"
                    className="mt-2"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input
                    placeholder="Give this link a clear title"
                    className="mt-2"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    placeholder="Why is this link useful?"
                    className="mt-2 min-h-[140px]"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((categoryOption) => (
                        <SelectItem key={categoryOption} value={categoryOption}>
                          {categoryOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Tags</label>
                  <Input
                    placeholder="Add tags separated by commas"
                    className="mt-2"
                    value={tagsInput}
                    onChange={(event) => setTagsInput(event.target.value)}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Design', 'Productivity', 'AI', 'Frontend', 'Research'].map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit">Submit Bookmark</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStatusMessage('Draft saved locally.')
                      toast({
                        title: 'Draft saved',
                        description: 'Your bookmark draft is saved on this device.',
                      })
                    }}
                  >
                    Save Draft
                  </Button>
                </div>
                {statusMessage && (
                  <p className="text-sm text-muted-foreground">{statusMessage}</p>
                )}
              </form>
            </motion.div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-secondary/30 p-5">
                <h3 className="text-base font-semibold text-foreground">Submission Tips</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Keep titles short and descriptive.</li>
                  <li>Explain the main takeaway in one sentence.</li>
                  <li>Add 3-5 tags to improve discoverability.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="text-sm font-semibold text-foreground">Preview Checklist</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Once submitted, your link will appear in Trending or Latest based on community votes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
