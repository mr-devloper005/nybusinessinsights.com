export const siteTaskDefinitions = [
  {
    key: 'mediaDistribution',
    label: 'Archive',
    route: '/archive',
    description: 'Browse every published guest post and desk story.',
    contentType: 'mediaDistribution',
    enabled: true,
  },
] as const

export const siteTaskViews = {
  mediaDistribution: '/archive',
} as const
