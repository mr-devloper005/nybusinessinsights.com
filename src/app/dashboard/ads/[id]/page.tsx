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
import { mockClassifiedAds } from '@/data/mock-data'
import type { ClassifiedAd } from '@/types'
import { loadFromStorage, storageKeys } from '@/lib/local-storage'
import { useAuth } from '@/lib/auth-context'

export default function DashboardAdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const { user } = useAuth()
  const [storedAds, setStoredAds] = useState<ClassifiedAd[]>([])
  const allAds = useMemo(() => [...storedAds, ...mockClassifiedAds], [storedAds])
  const ad = allAds.find((item) => item.id === resolvedParams.id)
  const canEdit = ad ? (ad.id.startsWith('user-') || (user && ad.seller.id === user.id)) : false

  useEffect(() => {
    setStoredAds(loadFromStorage<ClassifiedAd[]>(storageKeys.ads, []))
  }, [])

  if (!ad) {
    notFound()
  }

  return (
    <PageShell
      title={ad.title}
      description="Ad details and engagement"
      actions={
        canEdit ? (
          <Button asChild>
            <Link href={`/dashboard/ads/${ad.id}/edit`}>Edit Ad</Link>
          </Button>
        ) : null
      }
    >
      {!canEdit && (
        <Card className="border-border bg-secondary/40">
          <CardContent className="p-4 text-sm text-muted-foreground">
            You can view this ad, but only the owner can edit it.
          </CardContent>
        </Card>
      )}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <Badge variant="secondary">{ad.category}</Badge>
          <p className="text-sm text-muted-foreground">{ad.location}</p>
          <p className="text-sm text-muted-foreground">${ad.price.toLocaleString()}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              defaultValue={ad.status}
              onValueChange={(value) =>
                toast({
                  title: 'Status updated',
                  description: `Ad status set to ${value}.`,
                })
              }
            >
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" asChild>
              <Link href={`/classifieds/${ad.slug}`}>View Live Ad</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
