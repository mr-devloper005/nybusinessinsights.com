'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { mockListings } from '@/data/mock-data'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import type { Listing } from '@/types'
import { useAuth } from '@/lib/auth-context'

export default function DashboardListingEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [storedListings, setStoredListings] = useState<Listing[]>([])
  const listing = useMemo(
    () => [...storedListings, ...mockListings].find((item) => item.id === resolvedParams.id),
    [resolvedParams.id, storedListings]
  )
  const canEdit = listing ? (listing.id.startsWith('user-') || (user && listing.owner.id === user.id)) : false
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    setStoredListings(loadFromStorage<Listing[]>(storageKeys.listings, []))
  }, [])

  useEffect(() => {
    if (!listing) return
    setTitle(listing.title)
    setLocation(listing.location)
    setDescription(listing.description)
  }, [listing])

  return (
    <PageShell
      title={`Edit Listing #${resolvedParams.id}`}
      description="Update listing details and visibility."
      actions={
        <Button variant="outline" asChild>
          <Link href={`/dashboard/listings/${resolvedParams.id}`}>View Details</Link>
        </Button>
      }
    >
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input className="mt-2" placeholder="Listing title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Location</label>
            <Input className="mt-2" placeholder="City, State" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              className="mt-2 min-h-[200px]"
              placeholder="Listing description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button
            disabled={!canEdit}
            onClick={() => {
              if (!listing) return
              if (!canEdit) {
                toast({ title: 'Read-only', description: 'Only your own listings can be edited.' })
                return
              }
              const updated: Listing = {
                ...listing,
                title: title.trim() || listing.title,
                location: location.trim() || listing.location,
                description: description.trim() || listing.description,
              }
              const current = loadFromStorage<Listing[]>(storageKeys.listings, [])
              const next = current.some((item) => item.id === listing.id)
                ? current.map((item) => (item.id === listing.id ? updated : item))
                : [updated, ...current]
              saveToStorage(storageKeys.listings, next)
              setStoredListings(next)
              setSaved(true)
              toast({ title: 'Listing updated', description: 'Your changes were saved.' })
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
