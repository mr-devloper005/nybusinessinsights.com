'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClassifiedAdCard } from '@/components/shared/cards'
import { mockClassifiedAds } from '@/data/mock-data'

export function FeaturedAds() {
  const featuredAds = mockClassifiedAds.filter(a => a.isFeatured).slice(0, 4)

  return (
    <section className="border-b border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Featured Classifieds
            </h2>
            <p className="mt-2 text-muted-foreground">
              Great deals from our community marketplace
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/classifieds">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredAds.map((ad) => (
            <ClassifiedAdCard key={ad.id} ad={ad} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/classifieds">
              View All Classifieds
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
