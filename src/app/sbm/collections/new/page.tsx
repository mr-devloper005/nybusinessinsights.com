'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import type { BookmarkCollection } from '@/types'

export default function NewCollectionPage() {
  const [isPrivate, setIsPrivate] = useState(false)
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { toast } = useToast()

  return (
    <PageShell
      title="New Collection"
      description="Organize your saved links into a curated folder."
      actions={
        <Button variant="outline" asChild>
          <Link href="/sbm/collections">Back to Collections</Link>
        </Button>
      }
    >
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Collection Name</label>
            <Input
              className="mt-2"
              placeholder="Design Systems"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              className="mt-2"
              placeholder="What belongs in this folder?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Private Collection</p>
              <p className="text-xs text-muted-foreground">Only visible to you.</p>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>
          <Button
            onClick={() => {
              if (!name.trim()) {
                toast({ title: 'Name required', description: 'Give your collection a name.' })
                return
              }
              const newCollection: BookmarkCollection = {
                id: `user-collection-${Date.now()}`,
                name: name.trim(),
                description: description.trim() || 'Personal collection',
                updatedAt: new Date().toISOString(),
                isPrivate,
                bookmarks: [],
                coverImages: ['/placeholder.svg?height=240&width=240'],
              }
              const stored = loadFromStorage<BookmarkCollection[]>(storageKeys.bookmarkCollections, [])
              saveToStorage(storageKeys.bookmarkCollections, [newCollection, ...stored])
              setSaved(true)
              toast({ title: 'Collection created', description: 'Your collection is ready.' })
            }}
          >
            Create Collection
          </Button>
          {saved && <p className="text-sm text-muted-foreground">Collection created.</p>}
        </CardContent>
      </Card>
    </PageShell>
  )
}
