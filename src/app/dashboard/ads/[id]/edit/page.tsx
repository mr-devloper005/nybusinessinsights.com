'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { mockClassifiedAds } from '@/data/mock-data'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import type { ClassifiedAd } from '@/types'
import { useAuth } from '@/lib/auth-context'

export default function DashboardAdEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [storedAds, setStoredAds] = useState<ClassifiedAd[]>([])
  const ad = useMemo(
    () => [...storedAds, ...mockClassifiedAds].find((item) => item.id === resolvedParams.id),
    [resolvedParams.id, storedAds]
  )
  const canEdit = ad ? (ad.id.startsWith('user-') || (user && ad.seller.id === user.id)) : false
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    setStoredAds(loadFromStorage<ClassifiedAd[]>(storageKeys.ads, []))
  }, [])

  useEffect(() => {
    if (!ad) return
    setTitle(ad.title)
    setPrice(ad.price.toString())
    setDescription(ad.description)
  }, [ad])

  return (
    <PageShell
      title={`Edit Ad #${resolvedParams.id}`}
      description="Update classified listing details."
      actions={
        <Button variant="outline" asChild>
          <Link href={`/dashboard/ads/${resolvedParams.id}`}>View Details</Link>
        </Button>
      }
    >
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input className="mt-2" placeholder="Ad title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Price</label>
            <Input className="mt-2" placeholder="$0" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              className="mt-2 min-h-[200px]"
              placeholder="Ad description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button
            disabled={!canEdit}
            onClick={() => {
              if (!ad) return
              if (!canEdit) {
                toast({ title: 'Read-only', description: 'Only your own ads can be edited.' })
                return
              }
              const updated: ClassifiedAd = {
                ...ad,
                title: title.trim() || ad.title,
                price: Number(price) || ad.price,
                description: description.trim() || ad.description,
              }
              const current = loadFromStorage<ClassifiedAd[]>(storageKeys.ads, [])
              const next = current.some((item) => item.id === ad.id)
                ? current.map((item) => (item.id === ad.id ? updated : item))
                : [updated, ...current]
              saveToStorage(storageKeys.ads, next)
              setStoredAds(next)
              setSaved(true)
              toast({ title: 'Ad updated', description: 'Your changes were saved.' })
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
