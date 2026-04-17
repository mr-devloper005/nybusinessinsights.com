'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowUp, Bookmark, MessageSquare, Share2, Clock, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Bookmark as BookmarkType } from '@/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import { useToast } from '@/components/ui/use-toast'

import { defaultAuthorProfile } from '@/config/site.identity'


export function BookmarkCard({
  bookmark,
  compact = false,
  showActions = true,
}: {
  bookmark: BookmarkType
  compact?: boolean
  showActions?: boolean
}) {
  const [mounted, setMounted] = useState(false)
  const [isUpvoted, setIsUpvoted] = useState(bookmark.isUpvoted)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [isSaved, setIsSaved] = useState(bookmark.isSaved)
  const [upvotes, setUpvotes] = useState(bookmark.upvotes)
  const [saves, setSaves] = useState(bookmark.saves)
  const [shareLabel, setShareLabel] = useState('Share')
  const router = useRouter()
  const { toast } = useToast()
  const author = bookmark.author ?? defaultAuthorProfile

  useEffect(() => {
    setMounted(true)
    setSavedIds(loadFromStorage<string[]>(storageKeys.bookmarkSaves, []))
  }, [])

  useEffect(() => {
    setIsSaved(savedIds.includes(bookmark.id) || bookmark.isSaved)
  }, [bookmark.id, bookmark.isSaved, savedIds])

  const handleUpvote = () => {
    setIsUpvoted((prev) => !prev)
    setUpvotes((prev) => (isUpvoted ? prev - 1 : prev + 1))
    toast({
      title: isUpvoted ? 'Upvote removed' : 'Upvoted',
      description: isUpvoted ? 'Removed your vote.' : 'Thanks for voting!',
    })
  }

  const handleSave = () => {
    const next = !isSaved
    setIsSaved(next)
    const nextIds = next
      ? Array.from(new Set([...savedIds, bookmark.id]))
      : savedIds.filter((id) => id !== bookmark.id)
    setSavedIds(nextIds)
    saveToStorage(storageKeys.bookmarkSaves, nextIds)
    setSaves((current) => current + (next ? 1 : -1))
    toast({
      title: next ? 'Bookmark saved' : 'Bookmark removed',
      description: next ? 'Added to your saved bookmarks.' : 'Removed from saved bookmarks.',
    })
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url)
      setShareLabel('Copied')
      setTimeout(() => setShareLabel('Share'), 1500)
    } catch {
      setShareLabel('Copy failed')
      setTimeout(() => setShareLabel('Share'), 1500)
    }
  }

  const handleComments = () => {
    router.push(`/sbm/${bookmark.slug}#comments`)
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="group h-full overflow-hidden border-border bg-card transition-all hover:border-muted-foreground/20">
        <Link href={`/sbm/${bookmark.slug}`} className="block">
          <div className={cn('relative overflow-hidden', compact ? 'aspect-[4/3]' : 'aspect-[16/9]')}>
            <Image
              src={bookmark.image}
              alt={bookmark.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <Badge className="bg-background/90 text-foreground">
                {bookmark.category}
              </Badge>
              <Badge variant="secondary" className="bg-black/60 text-white">
                {bookmark.domain}
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white">
              <Clock className="h-3 w-3" />
              <span suppressHydrationWarning>
                {mounted ? formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true }) : 'Just now'}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-white">
              <ArrowUpRight className="h-4 w-4" />
              <span>Open</span>
            </div>
          </div>
        </Link>

        <CardContent className={cn('p-5', compact && 'p-4')}>
          <div className="mb-3 flex items-center gap-2">
            <Avatar className={cn('h-7 w-7', compact && 'h-6 w-6')}>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{author.name}</span>
              <span className="mx-2">•</span>
              <span>{bookmark.domain}</span>
            </div>
          </div>

          <Link href={`/sbm/${bookmark.slug}`}>
            <h3 className={cn('mb-2 font-semibold leading-tight text-foreground', compact ? 'text-base' : 'text-lg')}>
              {bookmark.title}
            </h3>
          </Link>
          <p className={cn('mb-4 text-sm text-muted-foreground', compact ? 'line-clamp-2' : 'line-clamp-3')}>
            {bookmark.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {bookmark.tags.slice(0, compact ? 2 : 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {showActions && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant={isUpvoted ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={handleUpvote}
              >
                <ArrowUp className="h-4 w-4" />
                {upvotes}
              </Button>
              <Button
                variant={isSaved ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={handleSave}
              >
                <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
                {saves}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleComments}>
                <MessageSquare className="h-4 w-4" />
                {bookmark.commentsCount}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
                {shareLabel === 'Copied' ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {shareLabel}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
