import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export const TASK_POST_CARD_OVERRIDE_ENABLED = false

export function TaskPostCardOverride(_: {
  post: SitePost
  href: string
  taskKey?: TaskKey
  compact?: boolean
}) {
  return null
}
