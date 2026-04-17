'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Clock,
  Eye,
  Heart,
  MessageCircle,
  MapPin,
  Star,
  Bookmark,
  BadgeCheck,
  Tag
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Article, Listing, ClassifiedAd, User } from '@/types'
import { cn } from '@/lib/utils'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import { useToast } from '@/components/ui/use-toast'

import { defaultAuthorProfile } from '@/config/site.identity'


// Article Card
export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const [likedIds, setLikedIds] = useState<string[]>([])
  const author = article.author ?? defaultAuthorProfile
  const displayLikes = useMemo(() => {
    return article.likes + (likedIds.includes(article.id) ? 1 : 0)
  }, [article.id, article.likes, likedIds])

  useEffect(() => {
    setLikedIds(loadFromStorage<string[]>(storageKeys.articleLikes, []))
  }, [])

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/articles/${article.slug}`}>
        <Card className={cn(
          'group overflow-hidden border-border bg-card transition-all hover:border-muted-foreground/20'
        )}>
          <div className={cn(
            'relative overflow-hidden bg-muted',
            featured ? 'aspect-[16/9] sm:aspect-[2/1]' : 'aspect-video'
          )}>
            <Image
              src={article.coverImage || '/placeholder.svg?height=720&width=1280'}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {article.isFeatured && (
              <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
          </div>
          <CardContent className={cn('p-5', featured && 'sm:p-7')}>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {article.category}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {article.readTime} min read
              </span>
            </div>
            <h3 className={cn(
              'mb-2 font-semibold leading-tight text-foreground',
              featured ? 'text-xl md:text-2xl' : 'text-lg'
            )}>
              {article.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{author.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {(article.views / 1000).toFixed(1)}k
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {displayLikes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {article.commentsCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

// Listing Card
export function ListingCard({ listing }: { listing: Listing }) {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [isSaved, setIsSaved] = useState(savedIds.includes(listing.id))
  const { toast } = useToast()

  useEffect(() => {
    setSavedIds(loadFromStorage<string[]>(storageKeys.listingSaves, []))
  }, [])

  useEffect(() => {
    setIsSaved(savedIds.includes(listing.id))
  }, [listing.id, savedIds])

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/listings/${listing.slug}`}>
        <Card className="group overflow-hidden border-border bg-card transition-all hover:border-muted-foreground/20">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {listing.isFeatured && (
              <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault()
                const next = !isSaved
                const nextIds = next
                  ? Array.from(new Set([...savedIds, listing.id]))
                  : savedIds.filter((id) => id !== listing.id)
                setSavedIds(nextIds)
                saveToStorage(storageKeys.listingSaves, nextIds)
                setIsSaved(next)
                toast({
                  title: next ? 'Listing saved' : 'Listing removed',
                  description: next ? 'Added to your saved listings.' : 'Removed from saved listings.',
                })
              }}
            >
              <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {listing.category}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium">{listing.rating}</span>
                <span className="text-xs text-muted-foreground">({listing.reviewsCount})</span>
              </div>
            </div>
            <h3 className="mb-1 font-semibold text-foreground">
              {listing.title}
            </h3>
            <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {listing.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {listing.isVerified && (
                  <BadgeCheck className="h-4 w-4 text-accent" />
                )}
                <span className="text-sm font-medium">
                  {listing.priceRange || (listing.price && `$${listing.price}/mo`)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

// Classified Ad Card
export function ClassifiedAdCard({ ad }: { ad: ClassifiedAd }) {
  const conditionColors = {
    'new': 'bg-green-500/10 text-green-500',
    'like-new': 'bg-blue-500/10 text-blue-500',
    'good': 'bg-yellow-500/10 text-yellow-500',
    'fair': 'bg-orange-500/10 text-orange-500',
    'poor': 'bg-red-500/10 text-red-500',
  }

  const [savedIds, setSavedIds] = useState<string[]>([])
  const displaySaves = useMemo(() => {
    return ad.saves + (savedIds.includes(ad.id) ? 1 : 0)
  }, [ad.id, ad.saves, savedIds])

  useEffect(() => {
    setSavedIds(loadFromStorage<string[]>(storageKeys.adSaves, []))
  }, [])

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/classifieds/${ad.slug}`}>
        <Card className="group overflow-hidden border-border bg-card transition-all hover:border-muted-foreground/20">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={ad.images[0]}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {ad.isFeatured && (
              <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
            <Badge className={cn('absolute right-3 top-3', conditionColors[ad.condition])}>
              {ad.condition.charAt(0).toUpperCase() + ad.condition.slice(1).replace('-', ' ')}
            </Badge>
          </div>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {ad.category}
              </Badge>
              {ad.isNegotiable && (
                <span className="text-xs text-muted-foreground">Negotiable</span>
              )}
            </div>
            <h3 className="mb-1 line-clamp-2 font-semibold text-foreground">
              {ad.title}
            </h3>
            <p className="mb-3 text-xl font-bold text-foreground">
              ${ad.price.toLocaleString()}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {ad.location}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {ad.views}
                </span>
                <span className="flex items-center gap-1">
                  <Bookmark className="h-3 w-3" />
                  {displaySaves}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

// Profile Card
export function ProfileCard({ user, compact = false }: { user: User; compact?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/profile/${user.id}`}>
        <Card className="group overflow-hidden border-border bg-card transition-all hover:border-muted-foreground/20">
          <CardContent className={cn('flex items-center gap-4', compact ? 'p-3' : 'p-5')}>
            <Avatar className={cn(compact ? 'h-10 w-10' : 'h-14 w-14')}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-foreground">{user.name}</h3>
                {user.isVerified && <BadgeCheck className="h-4 w-4 flex-shrink-0 text-accent" />}
              </div>
              {!compact && (
                <p className="line-clamp-2 text-sm text-muted-foreground">{user.bio}</p>
              )}
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{user.followers.toLocaleString()} followers</span>
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {user.location}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

// Stats Card
export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  trend = 'up'
}: { 
  title: string
  value: string | number
  change?: string
  icon: React.ElementType
  trend?: 'up' | 'down' | 'neutral'
}) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-muted-foreground'
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          {change && (
            <span className={cn('text-sm font-medium', trendColors[trend])}>
              {change}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}
