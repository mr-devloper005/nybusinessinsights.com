'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { PageShell } from '@/components/shared/page-shell'
import { BookmarkCard } from '@/components/sbm/bookmark-card'
import { ArticleCard, ListingCard, ClassifiedAdCard } from '@/components/shared/cards'
import { mockBookmarks, mockArticles, mockBookmarkCollections, mockListings, mockClassifiedAds } from '@/data/mock-data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import type { Article, Bookmark as BookmarkType, Listing, ClassifiedAd } from '@/types'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'

export default function DashboardSavedPage() {
  const { toast } = useToast()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [selectedAdIds, setSelectedAdIds] = useState<string[]>([])
  const [activeAdSheetId, setActiveAdSheetId] = useState<string | null>(null)
  const [confirmClearAds, setConfirmClearAds] = useState(false)
  const defaultSavedBookmarkIds = useMemo(
    () => mockBookmarks.filter((bookmark) => bookmark.isSaved).map((bookmark) => bookmark.id),
    []
  )
  const [savedIds, setSavedIds] = useState<string[]>(defaultSavedBookmarkIds)
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([])
  const [savedListingIds, setSavedListingIds] = useState<string[]>([])
  const [savedAdIds, setSavedAdIds] = useState<string[]>([])
  const [storedBookmarks, setStoredBookmarks] = useState<BookmarkType[]>([])
  const [storedArticles, setStoredArticles] = useState<Article[]>([])
  const [storedListings, setStoredListings] = useState<Listing[]>([])
  const [storedAds, setStoredAds] = useState<ClassifiedAd[]>([])

  useEffect(() => {
    setSavedIds(loadFromStorage<string[]>(storageKeys.bookmarkSaves, defaultSavedBookmarkIds))
    setSavedArticleIds(loadFromStorage<string[]>(storageKeys.articleSaves, []))
    setSavedListingIds(loadFromStorage<string[]>(storageKeys.listingSaves, []))
    setSavedAdIds(loadFromStorage<string[]>(storageKeys.adSaves, []))
    setStoredBookmarks(loadFromStorage<BookmarkType[]>(storageKeys.bookmarks, []))
    setStoredArticles(loadFromStorage<Article[]>(storageKeys.articles, []))
    setStoredListings(loadFromStorage<Listing[]>(storageKeys.listings, []))
    setStoredAds(loadFromStorage<ClassifiedAd[]>(storageKeys.ads, []))
  }, [defaultSavedBookmarkIds])
  const allBookmarks = useMemo(() => {
    const map = new Map<string, BookmarkType>()
    storedBookmarks.forEach((bookmark) => map.set(bookmark.id, bookmark))
    mockBookmarks.forEach((bookmark) => {
      if (!map.has(bookmark.id)) {
        map.set(bookmark.id, bookmark)
      }
    })
    return Array.from(map.values())
  }, [storedBookmarks])

  const savedBookmarks = allBookmarks.filter((bookmark) => savedIds.includes(bookmark.id))
  const allSelected = selectedIds.length === savedBookmarks.length && savedBookmarks.length > 0

  const allArticles = useMemo(() => {
    const map = new Map<string, Article>()
    storedArticles.forEach((article) => map.set(article.id, article))
    mockArticles.forEach((article) => {
      if (!map.has(article.id)) {
        map.set(article.id, article)
      }
    })
    return Array.from(map.values())
  }, [storedArticles])
  const savedArticles = allArticles.filter((article) => savedArticleIds.includes(article.id))

  const allListings = useMemo(() => {
    const map = new Map<string, Listing>()
    storedListings.forEach((listing) => map.set(listing.id, listing))
    mockListings.forEach((listing) => {
      if (!map.has(listing.id)) {
        map.set(listing.id, listing)
      }
    })
    return Array.from(map.values())
  }, [storedListings])
  const savedListings = allListings.filter((listing) => savedListingIds.includes(listing.id))

  const allAds = useMemo(() => {
    const map = new Map<string, ClassifiedAd>()
    storedAds.forEach((ad) => map.set(ad.id, ad))
    mockClassifiedAds.forEach((ad) => {
      if (!map.has(ad.id)) {
        map.set(ad.id, ad)
      }
    })
    return Array.from(map.values())
  }, [storedAds])
  const savedAds = allAds.filter((ad) => savedAdIds.includes(ad.id))
  const allAdsSelected = selectedAdIds.length === savedAds.length && savedAds.length > 0
  const activeAd = useMemo(
    () => savedAds.find((ad) => ad.id === activeAdSheetId),
    [activeAdSheetId, savedAds]
  )

  const activeBookmark = useMemo(
    () => savedBookmarks.find((bookmark) => bookmark.id === activeSheetId),
    [activeSheetId, savedBookmarks]
  )

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleBulkAction = (action: string) => {
    toast({
      title: `${action} complete`,
      description: `${selectedIds.length} bookmarks updated.`,
    })
    setSelectedIds([])
  }

  const handleRemoveSaved = (id: string) => {
    const nextIds = savedIds.filter((savedId) => savedId !== id)
    setSavedIds(nextIds)
    saveToStorage(storageKeys.bookmarkSaves, nextIds)
  }

  const handleRemoveSavedArticle = (id: string) => {
    const nextIds = savedArticleIds.filter((savedId) => savedId !== id)
    setSavedArticleIds(nextIds)
    saveToStorage(storageKeys.articleSaves, nextIds)
  }

  const handleRemoveSavedListing = (id: string) => {
    const nextIds = savedListingIds.filter((savedId) => savedId !== id)
    setSavedListingIds(nextIds)
    saveToStorage(storageKeys.listingSaves, nextIds)
  }

  const handleRemoveSavedAd = (id: string) => {
    const nextIds = savedAdIds.filter((savedId) => savedId !== id)
    setSavedAdIds(nextIds)
    saveToStorage(storageKeys.adSaves, nextIds)
  }

  const handleBulkAdAction = (action: string) => {
    if (action === 'Removed') {
      const nextIds = savedAdIds.filter((id) => !selectedAdIds.includes(id))
      setSavedAdIds(nextIds)
      saveToStorage(storageKeys.adSaves, nextIds)
    }
    toast({
      title: `${action} complete`,
      description: `${selectedAdIds.length} ads updated.`,
    })
    setSelectedAdIds([])
  }

  return (
    <PageShell
      title="Saved Items"
      description="All the links and articles you have bookmarked."
    >
      <div className="space-y-10">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">Saved Bookmarks</h2>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setConfirmClear(true)}>
                Clear All
              </Button>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <Card className="border-border bg-secondary/40 mt-4">
              <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-muted-foreground">{selectedIds.length} selected</div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setMoveOpen(true)}>
                    Move to Collection
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Shared')}>
                    Share
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('Removed')}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 grid gap-4">
            {savedBookmarks.length > 0 && (
              <Card className="border-border bg-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => setSelectedIds(checked ? savedBookmarks.map((b) => b.id) : [])}
                  />
                  <span className="text-sm text-muted-foreground">Select all</span>
                </CardContent>
              </Card>
            )}

            {savedBookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="border-border bg-card">
                <CardContent className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedIds.includes(bookmark.id)}
                      onCheckedChange={() => toggleSelection(bookmark.id)}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{bookmark.title}</p>
                      <p className="text-xs text-muted-foreground">{bookmark.domain}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setActiveSheetId(bookmark.id)}>
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={bookmark.url} target="_blank" rel="noreferrer">Open</a>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRemoveSaved(bookmark.id)}>
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="grid gap-6 md:grid-cols-2">
              {savedBookmarks.map((bookmark) => (
                <BookmarkCard key={`card-${bookmark.id}`} bookmark={bookmark} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Saved Articles</h2>
          {savedArticles.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No saved articles yet.</p>
          ) : (
            <>
              <div className="mt-4 grid gap-4">
                {savedArticles.map((article) => (
                  <Card key={article.id} className="border-border bg-card">
                    <CardContent className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{article.title}</p>
                        <p className="text-xs text-muted-foreground">{article.category}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/articles/${article.slug}`}>Open</a>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveSavedArticle(article.id)}>
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedArticles.map((article) => (
                  <ArticleCard key={`card-${article.id}`} article={article} />
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Saved Listings</h2>
          {savedListings.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No saved listings yet.</p>
          ) : (
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedListings.map((listing) => (
                <div key={listing.id} className="space-y-3">
                  <ListingCard listing={listing} />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleRemoveSavedListing(listing.id)}
                  >
                    Remove from saved
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">Saved Ads</h2>
          {savedAds.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No saved ads yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              <Card className="border-border bg-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <Checkbox
                    checked={allAdsSelected}
                    onCheckedChange={(checked) => setSelectedAdIds(checked ? savedAds.map((ad) => ad.id) : [])}
                  />
                  <span className="text-sm text-muted-foreground">Select all</span>
                </CardContent>
              </Card>

              {selectedAdIds.length > 0 && (
                <Card className="border-border bg-secondary/40">
                  <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-muted-foreground">{selectedAdIds.length} selected</div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleBulkAdAction('Shared')}>
                        Share
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleBulkAdAction('Removed')}>
                        Remove
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmClearAds(true)}>
                        Clear All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {savedAds.map((ad) => (
                <Card key={ad.id} className="border-border bg-card">
                  <CardContent className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedAdIds.includes(ad.id)}
                        onCheckedChange={() =>
                          setSelectedAdIds((prev) =>
                            prev.includes(ad.id) ? prev.filter((id) => id !== ad.id) : [...prev, ad.id]
                          )
                        }
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{ad.title}</p>
                        <p className="text-xs text-muted-foreground">{ad.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setActiveAdSheetId(ad.id)}>
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/classifieds/${ad.slug}`}>Open</a>
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRemoveSavedAd(ad.id)}>
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedAds.map((ad) => (
                  <ClassifiedAdCard key={`card-${ad.id}`} ad={ad} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all saved bookmarks?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove all saved bookmarks from your profile.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmClear(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                saveToStorage(storageKeys.bookmarkSaves, [])
                setSavedIds([])
                toast({ title: 'Saved bookmarks cleared', description: 'All saved bookmarks were removed.' })
                setConfirmClear(false)
                setSelectedIds([])
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {mockBookmarkCollections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`w-full rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors ${
                  selectedCollection === collection.id ? 'bg-secondary' : 'bg-card'
                }`}
              >
                <div className="font-medium text-foreground">{collection.name}</div>
                <div className="text-xs text-muted-foreground">{collection.description}</div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                handleBulkAction('Moved')
                setMoveOpen(false)
              }}
              disabled={!selectedCollection}
            >
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmClearAds} onOpenChange={setConfirmClearAds}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all saved ads?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove all saved ads from your profile.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmClearAds(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                saveToStorage(storageKeys.adSaves, [])
                setSavedAdIds([])
                setSelectedAdIds([])
                toast({ title: 'Saved ads cleared', description: 'All saved ads were removed.' })
                setConfirmClearAds(false)
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={Boolean(activeSheetId)} onOpenChange={() => setActiveSheetId(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Bookmark Preview</SheetTitle>
            <SheetDescription>Quick glance before opening the link.</SheetDescription>
          </SheetHeader>
          {activeBookmark && (
            <div className="mt-6 space-y-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={activeBookmark.image}
                  alt={activeBookmark.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{activeBookmark.title}</h3>
              <p className="text-sm text-muted-foreground">{activeBookmark.description}</p>
              <div className="flex flex-wrap gap-2">
                {activeBookmark.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <Button asChild>
                <a href={activeBookmark.url} target="_blank" rel="noreferrer">Open Link</a>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={Boolean(activeAdSheetId)} onOpenChange={() => setActiveAdSheetId(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Ad Preview</SheetTitle>
            <SheetDescription>Quick glance before opening the ad.</SheetDescription>
          </SheetHeader>
          {activeAd && (
            <div className="mt-6 space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={activeAd.images[0]}
                  alt={activeAd.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{activeAd.title}</h3>
              <p className="text-sm text-muted-foreground">{activeAd.description}</p>
              <Button asChild>
                <a href={`/classifieds/${activeAd.slug}`}>Open Ad</a>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}
