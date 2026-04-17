'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProfileCard } from '@/components/shared/cards'
import { mockUsers } from '@/data/mock-data'

export function ContributorsSection() {
  const topContributors = mockUsers.filter(u => u.isVerified).slice(0, 4)

  return (
    <section className="border-b border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Top Contributors
            </h2>
            <p className="mt-2 text-muted-foreground">
              Meet the voices shaping our community
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/community">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topContributors.map((user) => (
            <ProfileCard key={user.id} user={user} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/community">
              View All Contributors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
