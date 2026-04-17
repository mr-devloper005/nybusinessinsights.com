'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Folder, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { BookmarkCollection } from '@/types'
import { formatDistanceToNow } from 'date-fns'

export function BookmarkCollectionCard({ collection }: { collection: BookmarkCollection }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/sbm/collections/${collection.id}`} className="block">
        <Card className="group h-full overflow-hidden border-border bg-card transition-all hover:border-muted-foreground/20">
        <div className="grid grid-cols-3 gap-1">
          {collection.coverImages.slice(0, 3).map((image, index) => (
            <div key={`${collection.id}-${index}`} className="relative aspect-square overflow-hidden">
              <Image
                src={image}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">{collection.name}</h3>
            </div>
            {collection.isPrivate && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {collection.description}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{collection.bookmarks.length} bookmarks</span>
            <span suppressHydrationWarning>
              Updated {mounted ? formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true }) : 'recently'}
            </span>
          </div>
        </CardContent>
      </Card>
      </Link>
    </motion.div>
  )
}



