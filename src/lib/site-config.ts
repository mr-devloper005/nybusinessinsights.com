import { siteIdentity } from '@/config/site.identity'
import { siteTaskDefinitions, siteTaskViews } from '@/config/site.tasks'

export type TaskKey =
  | 'listing'
  | 'classified'
  | 'article'
  | 'image'
  | 'profile'
  | 'social'
  | 'pdf'
  | 'org'
  | 'sbm'
  | 'comment'
  | 'mediaDistribution'

export type TaskConfig = {
  key: TaskKey
  label: string
  route: string
  description: string
  contentType: string
  enabled: boolean
}

export type SiteConfig = {
  name: string
  tagline: string
  description: string
  domain: string
  baseUrl: string
  defaultOgImage: string
  tasks: TaskConfig[]
  taskViews: Partial<Record<TaskKey, string>>
  seo: {
    title: string
    titleTemplate: string
    description: string
    keywords: string[]
  }
}

export const SITE_CONFIG: SiteConfig = {
  name: siteIdentity.name,
  tagline: siteIdentity.tagline,
  description: siteIdentity.description,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  defaultOgImage: siteIdentity.ogImage,
  tasks: siteTaskDefinitions.map((task) => ({ ...task })),
  taskViews: { ...siteTaskViews },
  seo: {
    title: `${siteIdentity.name} - ${siteIdentity.tagline}`,
    titleTemplate: `%s | ${siteIdentity.name}`,
    description: siteIdentity.description,
    keywords: [
      'articles',
      'business listings',
      'classifieds',
      'profiles',
      'images',
      'social bookmarking',
      'pdf library',
      'content discovery',
      'visual stories',
      'news updates',
      siteIdentity.name,
    ],
  },
}

export const getTaskConfig = (key: TaskKey) =>
  SITE_CONFIG.tasks.find((task) => task.key === key) || null
