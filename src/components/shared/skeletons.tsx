import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ArticleCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <Card className={cn(
      'overflow-hidden border-border bg-card',
      featured && 'md:flex'
    )}>
      <div className={cn(
        'relative overflow-hidden',
        featured ? 'aspect-video md:aspect-auto md:w-1/2' : 'aspect-video'
      )}>
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className={cn('p-5', featured && 'md:w-1/2 md:p-8')}>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="mb-1 h-5 w-full" />
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ClassifiedAdCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mb-1 h-5 w-full" />
        <Skeleton className="mb-1 h-5 w-3/4" />
        <Skeleton className="mb-3 h-6 w-24" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfileCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className={cn('flex items-center gap-4', compact ? 'p-3' : 'p-5')}>
        <Skeleton className={cn('rounded-full', compact ? 'h-10 w-10' : 'h-14 w-14')} />
        <div className="flex-1">
          <Skeleton className="mb-2 h-5 w-32" />
          {!compact && <Skeleton className="mb-2 h-4 w-full" />}
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCardSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="mt-4">
          <Skeleton className="mb-2 h-8 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}
