import type { SiteFactoryRecipe } from '@/design/factory/types'

export type ProductKind = 'directory' | 'editorial' | 'visual' | 'curation'

export function getProductKind(recipe: SiteFactoryRecipe): ProductKind {
  if (recipe.primaryTask === 'sbm') return 'curation'
  if (recipe.primaryTask === 'image') return 'visual'
  if (recipe.primaryTask === 'article') return 'editorial'
  if (recipe.primaryTask === 'mediaDistribution') return 'editorial'
  if (recipe.homeLayout === 'classified-home' || recipe.primaryTask === 'classified') return 'directory'
  if (recipe.homeLayout === 'listing-home' || recipe.primaryTask === 'listing') return 'directory'
  if (recipe.homeLayout === 'article-home') return 'editorial'
  if (recipe.homeLayout === 'image-profile-home') return recipe.primaryTask === 'profile' ? 'visual' : 'visual'
  return 'directory'
}
