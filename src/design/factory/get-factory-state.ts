import { BRAND_PACKS } from '@/design/factory/brand-packs'
import { SITE_FACTORY_RECIPE } from '@/config/site.factory'
import { SITE_RECIPE } from '@/config/site.recipe'
import { THEME_PACKS } from '@/design/factory/theme-pack-data'
import { getProductKind } from '@/design/factory/get-product-kind'

export function getFactoryState() {
  const themePack = THEME_PACKS[SITE_RECIPE.themePack]
  const recipe = {
    ...SITE_FACTORY_RECIPE,
    brandPack: themePack.brandPack,
    navbar: SITE_RECIPE.navbarTemplate || themePack.navbar,
    footer: SITE_RECIPE.footerTemplate || themePack.footer,
    homeLayout: SITE_RECIPE.homepageTemplate || themePack.homeLayout,
    motionPack: SITE_RECIPE.motionPack || themePack.motionPack,
    primaryTask: SITE_RECIPE.primaryTask,
    enabledTasks: SITE_RECIPE.enabledTasks,
    taskLayouts: {
      ...themePack.defaultTaskTemplates,
      ...SITE_RECIPE.taskTemplates,
    },
  }

  const brandPack = BRAND_PACKS[recipe.brandPack]
  const productKind = getProductKind(recipe)

  return {
    recipe,
    brandPack,
    productKind,
    siteRecipe: SITE_RECIPE,
    themePack,
  }
}
