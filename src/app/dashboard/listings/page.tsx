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
import { mockListings } from '@/data/mock-data'
import type { Listing } from '@/types'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import { useAuth } from '@/lib/auth-context'

const mergeListings = (stored: Listing[]) => {
  const map = new Map<string, Listing>()
  stored.forEach((listing) => map.set(listing.id, listing))
  mockListings.forEach((listing) => {
    if (!map.has(listing.id)) {
      map.set(listing.id, listing)
    }
  })
  return Array.from(map.values())
}

export default function DashboardListingsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>(() => [...mockListings])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [statusMap, setStatusMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(mockListings.map((listing) => [listing.id, listing.status]))
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null)

  const isUserListing = (listing: Listing) =>
    listing.id.startsWith('user-') || (user && listing.owner.id === user.id)
  const userListings = useMemo(() => listings.filter((listing) => isUserListing(listing)), [listings, user])
  const allSelected = selectedIds.length === userListings.length && userListings.length > 0
  const selectedCount = selectedIds.length

  const activeListing = useMemo(
    () => userListings.find((listing) => listing.id === activeSheetId),
    [activeSheetId, userListings]
  )

  useEffect(() => {
    const stored = loadFromStorage<Listing[]>(storageKeys.listings, [])
    const merged = mergeListings(stored)
    setListings(merged)
    setStatusMap(Object.fromEntries(merged.map((listing) => [listing.id, listing.status])))
  }, [])

  const persistUserListings = (nextListings: Listing[]) => {
    const userListings = nextListings.filter((listing) => isUserListing(listing))
    saveToStorage(storageKeys.listings, userListings)
  }

  const updateStatus = (id: string, status: Listing['status']) => {
    setStatusMap((prev) => ({ ...prev, [id]: status }))
    const nextListings = listings.map((listing) =>
      listing.id === id ? { ...listing, status } : listing
    )
    setListings(nextListings)
    persistUserListings(nextListings)
    toast({
      title: 'Status updated',
      description: `Listing status set to ${status}.`,
    })
  }

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleBulkAction = (action: string) => {
    if (action === 'Deleted') {
      const nextListings = listings.filter((listing) => !selectedIds.includes(listing.id))
      setListings(nextListings)
      persistUserListings(nextListings)
    }
    toast({
      title: `${action} applied`,
      description: `${selectedCount} listings updated.`,
    })
    setSelectedIds([])
  }

  return (
    <PageShell
      title="My Listings"
      description="Manage business listings and visibility."
      actions={
        <Button asChild>
          <Link href="/dashboard/listings/new">New Listing</Link>
        </Button>
      }
    >
      {selectedCount > 0 && (
        <Card className="border-border bg-secondary/40 mb-4">
          <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">{selectedCount} selected</div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Closed')}>
                Close
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
        {userListings.length > 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => setSelectedIds(checked ? userListings.map((l) => l.id) : [])}
              />
              <span className="text-sm text-muted-foreground">Select all</span>
            </CardContent>
          </Card>
        )}

        {userListings.map((listing) => (
          <Card key={listing.id} className="border-border bg-card transition-transform hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedIds.includes(listing.id)}
                  onCheckedChange={() => toggleSelection(listing.id)}
                />
                <div>
                  {editingId === listing.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        className="h-9 w-64"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const nextListings = listings.map((item) =>
                            item.id === listing.id ? { ...item, title: draftTitle } : item
                          )
                          setListings(nextListings)
                          persistUserListings(nextListings)
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
                      <h2 className="text-lg font-semibold text-foreground">{listing.title}</h2>
                      <p className="text-sm text-muted-foreground">{listing.location}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{listing.category}</Badge>
                <Badge variant="outline">Owner Only</Badge>
                <Select
                  value={statusMap[listing.id]}
                  onValueChange={(value) => updateStatus(listing.id, value as Listing['status'])}
                >
                  <SelectTrigger className="h-9 w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setActiveSheetId(listing.id)}>
                  Preview
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/listings/${listing.id}`}>View</Link>
                </Button>
                <Button
                  onClick={() => {
                    setEditingId(listing.id)
                    setDraftTitle(listing.title)
                  }}
                >
                  Edit Title
                </Button>
                <Button variant="destructive" onClick={() => setDeleteId(listing.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {userListings.length === 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No listings yet. Create your first listing to see it here.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this listing?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will hide the listing from the marketplace. You can restore it later.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                const nextListings = listings.filter((listing) => listing.id !== deleteId)
                setListings(nextListings)
                persistUserListings(nextListings)
                toast({ title: 'Listing removed', description: 'The listing was deleted from your dashboard.' })
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
            <SheetTitle>Listing Preview</SheetTitle>
            <SheetDescription>Quick glance before opening the full listing.</SheetDescription>
          </SheetHeader>
          {activeListing && (
            <div className="mt-6 space-y-4">
              <Badge variant="secondary">{activeListing.category}</Badge>
              <h3 className="text-xl font-semibold text-foreground">{activeListing.title}</h3>
              <p className="text-sm text-muted-foreground">{activeListing.description}</p>
              <Button asChild>
                <Link href={`/listings/${activeListing.slug}`}>View Live Listing</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}
