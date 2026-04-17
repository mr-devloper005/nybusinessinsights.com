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
import { mockListings } from '@/data/mock-data'
import type { Listing } from '@/types'
import { loadFromStorage, storageKeys } from '@/lib/local-storage'
import { useAuth } from '@/lib/auth-context'

export default function DashboardListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const { user } = useAuth()
  const [storedListings, setStoredListings] = useState<Listing[]>([])
  const allListings = useMemo(() => [...storedListings, ...mockListings], [storedListings])
  const listing = allListings.find((item) => item.id === resolvedParams.id)
  const canEdit = listing ? (listing.id.startsWith('user-') || (user && listing.owner.id === user.id)) : false

  useEffect(() => {
    setStoredListings(loadFromStorage<Listing[]>(storageKeys.listings, []))
  }, [])

  if (!listing) {
    notFound()
  }

  return (
    <PageShell
      title={listing.title}
      description="Listing details and performance"
      actions={
        canEdit ? (
          <Button asChild>
            <Link href={`/dashboard/listings/${listing.id}/edit`}>Edit Listing</Link>
          </Button>
        ) : null
      }
    >
      {!canEdit && (
        <Card className="border-border bg-secondary/40">
          <CardContent className="p-4 text-sm text-muted-foreground">
            You can view this listing, but only the owner can edit it.
          </CardContent>
        </Card>
      )}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <Badge variant="secondary">{listing.category}</Badge>
          <p className="text-sm text-muted-foreground">{listing.location}</p>
          <p className="text-sm text-muted-foreground">{listing.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              defaultValue={listing.status}
              onValueChange={(value) =>
                toast({
                  title: 'Status updated',
                  description: `Listing status set to ${value}.`,
                })
              }
            >
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" asChild>
              <Link href={`/listings/${listing.slug}`}>View Live Listing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
