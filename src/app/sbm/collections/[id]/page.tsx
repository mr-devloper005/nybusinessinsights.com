'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Folder, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { BookmarkCard } from '@/components/sbm/bookmark-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { mockBookmarkCollections } from '@/data/mock-data'
import type { BookmarkCollection } from '@/types'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

export default function BookmarkCollectionDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [storedCollections, setStoredCollections] = useState<BookmarkCollection[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { toast } = useToast()
  const collection = useMemo(() => {
    const map = new Map<string, BookmarkCollection>()
    storedCollections.forEach((item) => map.set(item.id, item))
    mockBookmarkCollections.forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item)
    })
    return map.get(id)
  }, [id, storedCollections])

  useEffect(() => {
    setStoredCollections(loadFromStorage<BookmarkCollection[]>(storageKeys.bookmarkCollections, []))
  }, [])

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <NavbarShell />
        <main className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <Card className="border-border bg-card">
            <CardContent className="p-10 text-center">
              <h1 className="text-2xl font-semibold text-foreground">Collection not found</h1>
              <p className="mt-2 text-muted-foreground">Try exploring other bookmark collections.</p>
              <Button className="mt-6" asChild>
                <Link href="/sbm/collections">Back to collections</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />

      <main>
        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
              href="/sbm/collections"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to collections
            </Link>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Folder className="h-4 w-4 text-accent" />
                  Bookmark Collection
                </div>
                <h1 className="mt-2 text-3xl font-bold text-foreground">{collection.name}</h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">{collection.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {collection.isPrivate && (
                  <Badge variant="secondary">Private</Badge>
                )}
                <Badge variant="outline">{collection.bookmarks.length} bookmarks</Badge>
                {collection.id.startsWith('user-') && (
                  <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>
                    Delete Collection
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {collection.bookmarks.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="p-8 text-center">
                <h2 className="text-lg font-semibold text-foreground">No bookmarks yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start saving links to populate this collection.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/sbm">Explore bookmarks</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {collection.bookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this collection?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove the collection from your saved folders.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                const next = storedCollections.filter((item) => item.id !== collection.id)
                saveToStorage(storageKeys.bookmarkCollections, next)
                setStoredCollections(next)
                setConfirmDelete(false)
                toast({ title: 'Collection deleted', description: 'The collection was removed.' })
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
